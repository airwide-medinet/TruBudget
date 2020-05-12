import strings from "../../../localizeStrings";

export const getPrrojectEventTypes = () => [
  { id: "project_created", displayName: "Project created" },
  { id: "project_updated", displayName: "Project updated" },
  { id: "project_assigned", displayName: "Project assigned" },
  { id: "project_closed", displayName: "Project closed" },
  { id: "project_permission_granted", displayName: "Project permisision granted" },
  { id: "project_permission_revoked", displayName: "Project permission revoked" },
  { id: "project_projected_budget_updated", displayName: "Project budget updated" },
  { id: "project_projected_budget_deleted", displayName: "Project budget closed" }
];

export const getSubprojectEventTypes = () => [
  { id: "subproject_created", displayName: "Subproject created" },
  { id: "subproject_updated", displayName: "Subproject updated" },
  { id: "subproject_assigned", displayName: "Subproject assigned" },
  { id: "subproject_closed", displayName: "Subproject closed" },
  { id: "subproject_permission_granted", displayName: "Subproject permisision granted" },
  { id: "subproject_permission_revoked", displayName: "Subproject permission revoked" },
  { id: "subproject_projected_budget_updated", displayName: "Subproject budget updated" },
  { id: "subproject_projected_budget_deleted", displayName: "Subproject budget closed" }
];

export const getWorkflowitemsEventTypes = () => [
  { id: "workflowitem_created", displayName: "Workflowitem  created" },
  { id: "workflowitem_updated", displayName: "Workflowitem  updated" },
  { id: "workflowitem_assigned", displayName: "Workflowitem  assigned" },
  { id: "workflowitem_closed", displayName: "Workflowitem  closed" },
  { id: "workflowitem_permission_granted", displayName: "Workflowitem  permisision granted" },
  { id: "workflowitem_permission_revoked", displayName: "Workflowitem  permission revoked" },
  { id: "workflowitems_reordered", displayName: "Workflowitems reordered" }
];
