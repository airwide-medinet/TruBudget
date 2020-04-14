import { Ctx } from "../lib/ctx";
import * as Result from "../result";
import * as Cache from "./cache2";
import { ConnToken } from "./conn";
import { ServiceUser } from "./domain/organization/service_user";
import * as Project from "./domain/workflow/project";
import * as Subproject from "./domain/workflow/subproject";
import * as Workflowitem from "./domain/workflow/workflowitem";
import * as WorkflowitemDocument from "./domain/workflow/document";
import * as WorkflowitemDocumentDownload from "./domain/workflow/workflowitem_document_download";
import * as WorkflowitemDocumentUploaded from "./domain/workflow/workflowitem_document_uploaded";
import * as Liststreamkeyitems from "./liststreamkeyitems";

export async function getDocuments(
  conn: ConnToken,
  ctx: Ctx,
  serviceUser: ServiceUser,
  projectId: Project.Id,
  subprojectId: Subproject.Id,
  workflowitemId: Workflowitem.Id,
  documentId: string,
): Promise<WorkflowitemDocument.UploadedDocument[]> {
  const result = await Cache.withCache(conn, ctx, async (cache) =>
    WorkflowitemDocumentDownload.getDocuments(
      ctx,
      serviceUser,
      projectId,
      subprojectId,
      workflowitemId,
      documentId,
      {
        getWorkflowitem: async () => {
          return cache.getWorkflowitem(projectId, subprojectId, workflowitemId);
        },
        getDocuments: async () => {
          const items: Liststreamkeyitems.Item[] = await conn.multichainClient.v2_readStreamItems(
            "offchain_documents",
            documentId,
            1,
          );

          const documents: WorkflowitemDocumentUploaded.Event[] = items.map((i) => i.data.json);
          return documents;
        },
      },
    ),
  );

  if (Result.isErr(result)) throw result;

  return result;
}
