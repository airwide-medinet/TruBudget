/**
 * DEPRECATED - see index.ts
 */
import { throwIfUnauthorized } from "../../authz";
import Intent from "../../authz/intents";
import { HttpResponse } from "../../httpd/lib";
import { isNonemptyString, value } from "../../lib/validation";
import { MultichainClient } from "../../multichain/Client.h";
import * as Subproject from "../../subproject/model/Subproject";
import * as Project from "../model/Project";

interface SubprojectDTO {
  allowedIntents: Intent[];
  data: Subproject.Data;
}

function removeEventLog(subproject: Subproject.SubprojectResource): SubprojectDTO {
  delete subproject.log;
  return subproject;
}

export async function getProjectDetails(multichain: MultichainClient, req): Promise<HttpResponse> {
  const input = req.query;

  const projectId: string = value("projectId", input.projectId, isNonemptyString);

  const userIntent: Intent = "project.viewDetails";

  // Is the user allowed to view project details?
  await throwIfUnauthorized(
    req.user,
    userIntent,
    await Project.getPermissions(multichain, projectId),
  );

  const project = await Project.get(multichain, req.user, projectId).then(result => result[0]);

  const subprojects = await Subproject.get(multichain, req.user, projectId).then(items =>
    items.map(removeEventLog),
  );

  return [
    200,
    {
      apiVersion: "1.0",
      data: {
        project,
        subprojects,
      },
    },
  ];
}
