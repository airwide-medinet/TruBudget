import { FastifyInstance } from "fastify";

import { getAllowedIntents } from "./authz";
import Intent from "./authz/intents";
import { toHttpError } from "./http_errors";
import * as NotAuthenticated from "./http_errors/not_authenticated";
import { AuthenticatedRequest } from "./httpd/lib";
import { Ctx } from "./lib/ctx";
import { toUnixTimestampStr } from "./lib/datetime";
import { isNonemptyString } from "./lib/validation";
import { ServiceUser } from "./service/domain/organization/service_user";
import * as WorkflowitemDocumentUploaded from "./service/domain/workflow/workflowitem_document_uploaded";
import * as WorkflowitemDocument from "./service/domain/workflow/document";
import { NotFound } from "./service/domain/errors/not_found";

function mkSwaggerSchema(server: FastifyInstance) {
  return {
    beforeHandler: [(server as any).authenticate],
    schema: {
      description: "Download documents attached to workflowitems",
      tags: ["workflowitem"],
      summary: "Download document attached to workflowitem",
      querystring: {
        type: "object",
        properties: {
          projectId: {
            type: "string",
          },
          subprojectId: {
            type: "string",
          },
          workflowitemId: {
            type: "string",
          },
          documentId: {
            type: "string",
          },
        },
      },
      security: [
        {
          bearerToken: [],
        },
      ],
      response: {
        200: {
          description: "successful response",
          type: "string",
        },
        401: NotAuthenticated.schema,
      },
    },
  };
}

interface Document {
  data: string;
  fileName: string;
}

interface Service {
  getDocument(
    ctx: Ctx,
    user: ServiceUser,
    projectId: string,
    subprojectId: string,
    workflowitemId: string,
    documentId: string,
  ): Promise<WorkflowitemDocument.UploadedDocument[]>;
}

function sendErrorIfEmpty(reply, resourceId) {
  if (!isNonemptyString(resourceId)) {
    reply.status(400).send({
      apiVersion: "1.0",
      error: {
        code: 400,
        message: `required query parameter ${resourceId} not present (must be non-empty string)`,
      },
    });
    return true;
  }
  return false;
}

export function addHttpHandler(server: FastifyInstance, urlPrefix: string, service: Service) {
  server.get(
    `${urlPrefix}/workflowitem.downloadDocument`,
    mkSwaggerSchema(server),
    (request, reply) => {
      const ctx: Ctx = { requestId: request.id, source: "http" };

      const user: ServiceUser = {
        id: (request as AuthenticatedRequest).user.userId,
        groups: (request as AuthenticatedRequest).user.groups,
      };

      const { projectId, subprojectId, workflowitemId, documentId } = request.query;

      if (
        sendErrorIfEmpty(reply, projectId) ||
        sendErrorIfEmpty(reply, subprojectId) ||
        sendErrorIfEmpty(reply, workflowitemId) ||
        sendErrorIfEmpty(reply, documentId)
      ) {
        return;
      }

      service
        .getDocument(ctx, user, projectId, subprojectId, workflowitemId, documentId)
        .then((documents: WorkflowitemDocument.UploadedDocument[]) => {
          if (documents.length < 1) {
            // if no document was returned, something went wrong
            throw new NotFound(ctx, "document", documentId);
          }

          // TODO: check permissions
          const item: WorkflowitemDocument.UploadedDocument = documents[0];
          const code = 200;
          reply.headers({
            "Content-Type": "application/octet-stream",
            "Content-Disposition": `attachment; filename="${item.fileName}"`,
          });

          reply.status(code).send(new Buffer(item.base64, "base64"));
        })

        .catch((err) => {
          const { code, body } = toHttpError(err);
          reply.status(code).send(body);
        });
    },
  );
}
