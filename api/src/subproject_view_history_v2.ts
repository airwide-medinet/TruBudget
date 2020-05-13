import { FastifyInstance } from "fastify";
import { toHttpError } from "./http_errors";
import * as NotAuthenticated from "./http_errors/not_authenticated";
import { AuthenticatedRequest } from "./httpd/lib";
import { Ctx } from "./lib/ctx";
import { isNonemptyString } from "./lib/validation";
import * as Result from "./result";
import { ServiceUser } from "./service/domain/organization/service_user";
import * as Project from "./service/domain/workflow/project";
import * as Subproject from "./service/domain/workflow/subproject";
import * as SubprojectHistory from "./service/domain/workflow/subproject_history_get";
import { SubprojectTraceEvent } from "./service/domain/workflow/subproject_trace_event";
import VError = require("verror");

function mkSwaggerSchema(server: FastifyInstance) {
  return {
    beforeHandler: [(server as any).authenticate],
    schema: {
      description:
        "View the history of a given subproject (filtered by what the user is allowed to see).",
      tags: ["subproject"],
      summary: "View subproject history",
      querystring: {
        type: "object",
        properties: {
          projectId: {
            type: "string",
          },
          subprojectId: {
            type: "string",
          },
          limit: {
            type: "string",
            description: "Limit to the number of events to return.",
          },
          offset: {
            type: "string",
            description:
              "The index of the first event; any events that follow" +
              "have happened after that first event. The `offset` may also " +
              "be negative. For example, an `offset` of `-10` with limit `10` requests " +
              "the 10 most recent events.",
          },
        },
      },
      security: [{ bearerToken: [] }],
      response: {
        200: {
          description: "changes related to the given subproject in chronological order",
          type: "object",
          properties: {
            apiVersion: { type: "string", example: "1.0" },
            data: {
              type: "object",
              properties: {
                historyItemsCount: {
                  type: "number",
                  description:
                    "Total number of history items (greater or equal to the number of returned items)",
                  example: 10,
                },
                events: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      entityId: { type: "string", example: "d0e8c69eg298c87e3899119e025eff1f" },
                      entityType: { type: "string", example: "subproject" },
                      businessEvent: {
                        type: "object",
                        additionalProperties: true,
                        properties: {
                          type: { type: "string" },
                          source: { type: "string" },
                          time: { type: "string" },
                          publisher: { type: "string" },
                        },
                        example: {
                          type: "subproject_closed",
                          source: "http",
                          time: "2018-09-05T13:37:25.775Z",
                          publisher: "jdoe",
                        },
                      },
                      snapshot: {
                        type: "object",
                        additionalProperties: true,
                        properties: {
                          displayName: { type: "string", example: "Build a town" },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        401: NotAuthenticated.schema,
      },
    },
  };
}

interface Service {
  getSubprojectHistory(
    ctx: Ctx,
    user: ServiceUser,
    projectId: Project.Id,
    subprojectId: Subproject.Id,
    filter: SubprojectHistory.Filter,
  ): Promise<Result.Type<SubprojectTraceEvent[]>>;
}

export function addHttpHandler(server: FastifyInstance, urlPrefix: string, service: Service) {
  server.get(
    `${urlPrefix}/subproject.viewHistory.v2`,
    mkSwaggerSchema(server),
    async (request, reply) => {
      const ctx: Ctx = { requestId: request.id, source: "http" };

      const user: ServiceUser = {
        id: (request as AuthenticatedRequest).user.userId,
        groups: (request as AuthenticatedRequest).user.groups,
      };

      const projectId = request.query.projectId;
      if (!isNonemptyString(projectId)) {
        reply.status(404).send({
          apiVersion: "1.0",
          error: {
            code: 404,
            message: "required query parameter `projectId` not present (must be non-empty string)",
          },
        });
        return;
      }

      const subprojectId = request.query.subprojectId;
      if (!isNonemptyString(subprojectId)) {
        reply.status(404).send({
          apiVersion: "1.0",
          error: {
            code: 404,
            message:
              "required query parameter `subprojectId` not present (must be non-empty string)",
          },
        });
        return;
      }

      const offset = parseInt(request.query.offset || 0, 10);
      if (isNaN(offset)) {
        reply.status(400).send({
          apiVersion: "1.0",
          error: {
            code: 400,
            message: "if present, the query parameter `offset` must be an integer",
          },
        });
        return;
      }

      let limit: number | undefined = parseInt(request.query.limit, 10);
      if (isNaN(limit)) {
        limit = undefined;
      } else if (limit <= 0) {
        reply.status(400).send({
          apiVersion: "1.0",
          error: {
            code: 400,
            message: "if present, the query parameter `limit` must be a positive integer",
          },
        });
        return;
      }

      // ISO Timestamp example: 01.01.2020 or 2019-12-31T23:00:00.000Z
      if (request.query.startAt !== undefined) {
        let startAt: Date = new Date(request.query.startAt);
        if (isNaN(startAt.getTime())) {
          reply.status(400).send({
            apiVersion: "1.0",
            error: {
              code: 400,
              message: "if present, the query parameter `startAt` must be a valid ISO timestamp",
            },
          });
          return;
        }
      }

      if (request.query.endAt !== undefined) {
        let endAt: Date = new Date(request.query.endAt);
        console.log(endAt);
        if (isNaN(endAt.getTime())) {
          console.log(endAt);
          reply.status(400).send({
            apiVersion: "1.0",
            error: {
              code: 400,
              message: "if present, the query parameter `endAt` must be a valid ISO timestamp",
            },
          });
          return;
        }
      }

      const filter: SubprojectHistory.Filter = {
        publisher: request.query.publisher,
        startAt: request.query.startAt,
        endAt: request.query.endAt,
        eventType: request.query.eventType,
      };

      try {
        // Get all Events in subproject stream
        const eventsResult = await service.getSubprojectHistory(
          ctx,
          user,
          projectId,
          subprojectId,
          filter,
        );
        if (Result.isErr(eventsResult)) {
          throw new VError(eventsResult, "subproject.viewHistory failed");
        }
        const events: SubprojectTraceEvent[] = eventsResult;

        const offsetIndex = offset < 0 ? Math.max(0, events.length + offset) : offset;
        const slice = events.slice(
          offsetIndex,
          limit === undefined ? undefined : offsetIndex + limit,
        );

        const code = 200;
        const body = {
          apiVersion: "1.0",
          data: {
            historyItemsCount: events.length,
            events: slice,
          },
        };
        reply.status(code).send(body);
      } catch (err) {
        const { code, body } = toHttpError(err);
        reply.status(code).send(body);
      }
    },
  );
}
