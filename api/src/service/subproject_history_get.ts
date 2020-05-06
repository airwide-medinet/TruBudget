import { Ctx } from "../lib/ctx";
import * as Result from "../result";
import { ConnToken } from "./conn";
import { ServiceUser } from "./domain/organization/service_user";
import { SubprojectTraceEvent } from "./domain/workflow/subproject_trace_event";

import * as Project from "./domain/workflow/project";
import * as Subproject from "./domain/workflow/subproject";
import * as Cache from "./cache2";
import VError = require("verror");
import * as SubprojectHistory from "./domain/workflow/subproject_history_get";

export async function getSubprojectHistory(
  conn: ConnToken,
  ctx: Ctx,
  serviceUser: ServiceUser,
  projectId: Project.Id,
  subprojectId: Subproject.Id,
  filter: SubprojectHistory.Filter,
): Promise<Result.Type<SubprojectTraceEvent[]>> {
  const subprojectHistoryResult = await Cache.withCache(conn, ctx, async (cache) =>
    SubprojectHistory.getHistory(ctx, serviceUser, projectId, subprojectId, filter, {
      getSubproject: async (projectId, subprojectId) => {
        return cache.getSubproject(projectId, subprojectId);
      },
    }),
  );
  return Result.mapErr(
    subprojectHistoryResult,
    (err) => new VError(err, `could not get history of subproject with id ${subprojectId}`),
  );
}
