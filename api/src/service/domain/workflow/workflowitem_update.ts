import isEqual = require("lodash.isequal");
import { VError } from "verror";

import { Ctx } from "../../../lib/ctx";
import * as Result from "../../../result";
import { BusinessEvent } from "../business_event";
import { InvalidCommand } from "../errors/invalid_command";
import { NotAuthorized } from "../errors/not_authorized";
import { NotFound } from "../errors/not_found";
import { Identity } from "../organization/identity";
import { ServiceUser } from "../organization/service_user";
import * as UserRecord from "../organization/user_record";
import * as NotificationCreated from "./notification_created";
import * as Project from "./project";
import * as Subproject from "./subproject";
import * as Workflowitem from "./workflowitem";
import * as WorkflowitemEventSourcing from "./workflowitem_eventsourcing";
import * as WorkflowitemUpdated from "./workflowitem_updated";
import * as WorkflowitemDocumentUploaded from "./workflowitem_document_uploaded";
import { UploadedDocument, hashDocument } from "./document";
import logger from "../../../lib/logger";

export interface RequestData {
  displayName?: string;
  description?: string;
  amount?: string;
  currency?: string;
  amountType?: "N/A" | "disbursed" | "allocated";
  exchangeRate?: string;
  billingDate?: string;
  dueDate?: string;
  documents?: UploadedDocument[];
  additionalData?: object;
}

export type EventData = WorkflowitemUpdated.Modification;
export const requestDataSchema = WorkflowitemUpdated.modificationSchema;

interface Repository {
  getWorkflowitem(workflowitemId: Workflowitem.Id): Promise<Result.Type<Workflowitem.Workflowitem>>;
  getUsersForIdentity(identity: Identity): Promise<UserRecord.Id[]>;
}

export async function updateWorkflowitem(
  ctx: Ctx,
  issuer: ServiceUser,
  projectId: Project.Id,
  subprojectId: Subproject.Id,
  workflowitemId: Workflowitem.Id,
  modification: RequestData,
  repository: Repository,
): Promise<Result.Type<{ newEvents: BusinessEvent[]; workflowitem: Workflowitem.Workflowitem }>> {
  const workflowitem = await repository.getWorkflowitem(workflowitemId);
  if (Result.isErr(workflowitem)) {
    return new NotFound(ctx, "workflowitem", workflowitemId);
  }

  const modificationWithDocumentHashes: EventData = {
    ...modification,
    documents:
      modification.documents === undefined
        ? undefined
        : await Promise.all(modification.documents.map(hashDocument)),
  };

  const newEvent = WorkflowitemUpdated.createEvent(
    ctx.source,
    issuer.id,
    projectId,
    subprojectId,
    workflowitemId,
    modificationWithDocumentHashes,
  );
  if (Result.isErr(newEvent)) {
    return new VError(newEvent, "cannot update workflowitem");
  }

  // Check authorization (if not root):
  if (issuer.id !== "root") {
    const intent = "workflowitem.update";
    if (!Workflowitem.permits(workflowitem, issuer, [intent])) {
      return new NotAuthorized({ ctx, userId: issuer.id, intent, target: workflowitem });
    }
  }

  // Check that the new event is indeed valid:
  const result = WorkflowitemEventSourcing.newWorkflowitemFromEvent(ctx, workflowitem, newEvent);
  if (Result.isErr(result)) {
    return new InvalidCommand(ctx, newEvent, [result]);
  }

  // Only emit the event if it causes any changes:
  if (isEqualIgnoringLog(workflowitem, result)) {
    return { newEvents: [], workflowitem };
  }

  // Create notification events:
  const recipients = workflowitem.assignee
    ? await repository.getUsersForIdentity(workflowitem.assignee)
    : [];
  const notifications = recipients
    // The issuer doesn't receive a notification:
    .filter((userId) => userId !== issuer.id)
    .map((recipient) =>
      NotificationCreated.createEvent(
        ctx.source,
        issuer.id,
        recipient,
        newEvent,
        projectId,
        subprojectId,
        workflowitemId,
      ),
    );

  // handle new documents
  let newDocumentUploadedEvents: BusinessEvent[] = [];
  if (newEvent.update.documents && newEvent.update.documents.length > 0) {
    const { documents } = newEvent.update;
    // TODO: Validate documents

    newDocumentUploadedEvents = documents.map((d, i) => {
      const docToUpload: UploadedDocument = {
        base64: modification.documents ? modification.documents[i].base64 : "",
        fileName:
          modification.documents && modification.documents[i].fileName
            ? modification.documents[i].fileName
            : "unknown-file.pdf",
        id: d.documentId,
      };

      return WorkflowitemDocumentUploaded.createEvent(
        ctx.source,
        issuer.id,
        projectId,
        subprojectId,
        workflowitemId,
        docToUpload,
      );
    });
  }

  return {
    newEvents: [newEvent, ...newDocumentUploadedEvents, ...notifications],
    workflowitem: result,
  };
}

function isEqualIgnoringLog(
  workflowitemA: Workflowitem.Workflowitem,
  workflowitemB: Workflowitem.Workflowitem,
): boolean {
  const { log: logA, ...a } = workflowitemA;
  const { log: logB, ...b } = workflowitemB;
  return isEqual(a, b);
}
