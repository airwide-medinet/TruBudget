import Intent from "../../../authz/intents";
import { Ctx } from "../../../lib/ctx";
import * as Result from "../../../result";
import { NotAuthorized } from "../errors/not_authorized";
import { NotFound } from "../errors/not_found";
import { canAssumeIdentity } from "../organization/auth_token";
import { ServiceUser } from "../organization/service_user";
import * as Workflowitem from "./workflowitem";
import * as WorkflowitemDocument from "./document";
import * as WorkflowitemDocumentUploaded from "./workflowitem_document_uploaded";
import { WorkflowitemTraceEvent } from "./workflowitem_trace_event";
import VError = require("verror");

interface Repository {
  getWorkflowitem(): Promise<Result.Type<Workflowitem.Workflowitem>>;
  getDocuments(): Promise<Result.Type<WorkflowitemDocumentUploaded.Event[]>>;
}

export async function getDocuments(
  ctx: Ctx,
  user: ServiceUser,
  projectId: string,
  subprojectId: string,
  workflowitemId: string,
  documentId: string,
  repository: Repository,
): Promise<Result.Type<WorkflowitemDocument.UploadedDocument[]>> {
  // check for permissions etc
  const workflowitem = await repository.getWorkflowitem();
  if (Result.isErr(workflowitem)) {
    return workflowitem;
  }

  const documents = await repository.getDocuments();
  if (Result.isErr(documents)) {
    return new NotFound(ctx, "document", documentId);
  }

  // only return if documents has relation to the workflowitem
  // TODO: throw an error
  return documents.filter((d) => d.workflowitemId === workflowitem.id).map((d) => d.document);
}
