export const FETCH_PROJECTS = "FETCH_PROJECTS";
export const FETCH_PROJECTS_SUCCESS = "FETCH_PROJECTS_SUCCESS";

export const CREATE_PROJECT = "CREATE_PROJECT";
export const CREATE_PROJECT_SUCCESS = "CREATE_PROJECT_SUCCESS";

export const FETCH_ALL_PROJECTS = "FETCH_ALL_PROJECTS";
export const FETCH_ALL_PROJECTS_SUCCESS = "FETCH_ALL_PROJECTS_SUCCESS";

export const SHOW_CREATION_DIALOG = "SHOW_CREATION_DIALOG";
export const HIDE_PROJECT_DIALOG = "HIDE_CREATION_DIALOG";

export const SHOW_EDIT_DIALOG = "SHOW_EDIT_DIALOG";
export const HIDE_EDIT_DIALOG = "HIDE_EDIT_DIALOG";

export const PROJECT_NAME = "PROJECT_NAME";
export const ADD_PROJECT_BUDGET = "ADD_PROJECT_BUDGET";
export const PROJECT_COMMENT = "PROJECT_COMMENT";
export const PROJECT_ORGANIZATION = "PROJECT_ORGANIZATION";
export const PROJECT_THUMBNAIL = "PROJECT_THUMBNAIL";
export const PROJECT_CREATION_STEP = "PROJECT_CREATION_STEP";

export const SHOW_PROJECT_PERMISSIONS = "SHOW_PROJECT_PERMISSIONS";
export const HIDE_PROJECT_PERMISSIONS = "HIDE_PROJECT_PERMISSIONS";

export const EDIT_PROJECT = "EDIT_PROJECT";
export const EDIT_PROJECT_SUCCESS = "EDIT_PROJECT_SUCCESS";
export const FETCH_PROJECT_PERMISSIONS = "FETCH_PROJECT_PERMISSIONS";
export const FETCH_PROJECT_PERMISSIONS_SUCCESS = "FETCH_PROJECT_PERMISSIONS_SUCCESS";

export const GRANT_PERMISSION = "GRANT_PERMISSION";
export const GRANT_PERMISSION_SUCCESS = "GRANT_PERMISSION_SUCCESS";

export const REVOKE_PERMISSION = "REVOKE_PERMISSION";
export const REVOKE_PERMISSION_SUCCESS = "REVOKE_PERMISSION_SUCCESS";

export function fetchAllProjects(showLoading = false) {
  return {
    type: FETCH_ALL_PROJECTS,
    showLoading
  };
}

export function createProject(name, comment, thumbnail, projectedBudgets) {
  return {
    type: CREATE_PROJECT,
    name,
    comment,
    thumbnail,
    projectedBudgets
  };
}

export function editProject(projectId, changes) {
  return {
    type: EDIT_PROJECT,
    projectId,
    changes
  };
}

export function fetchProjectPermissions(projectId, showLoading = false) {
  return {
    type: FETCH_PROJECT_PERMISSIONS,
    projectId,
    showLoading
  };
}

export function showProjectPermissions(id) {
  return {
    type: SHOW_PROJECT_PERMISSIONS,
    id
  };
}

export function hideProjectPermissions() {
  return {
    type: HIDE_PROJECT_PERMISSIONS
  };
}

export function showCreationDialog() {
  return {
    type: SHOW_CREATION_DIALOG
  };
}
export function hideProjectDialog() {
  return {
    type: HIDE_PROJECT_DIALOG
  };
}

export function showEditDialog(id, displayName, description, thumbnail, projectedBudgets) {
  return {
    type: SHOW_EDIT_DIALOG,
    id,
    displayName,
    description,
    thumbnail,
    projectedBudgets
  };
}

export function storeProjectName(name) {
  return {
    type: PROJECT_NAME,
    name: name
  };
}

export function addProjectedBudget(projectedBudget) {
  return {
    type: ADD_PROJECT_BUDGET,
    projectedBudget: projectedBudget
  };
}

export function storeProjectOrganization(organization) {
  return {
    type: PROJECT_ORGANIZATION,
    organization: organization
  };
}

export function storeProjectComment(comment) {
  return {
    type: PROJECT_COMMENT,
    comment: comment
  };
}

export function storeProjectThumbnail(thumbnail) {
  return {
    type: PROJECT_THUMBNAIL,
    thumbnail: thumbnail
  };
}

export function setCurrentStep(step) {
  return {
    type: PROJECT_CREATION_STEP,
    step
  };
}

export function grantPermission(projectId, intent, identity, showLoading = false) {
  return {
    type: GRANT_PERMISSION,
    projectId,
    intent,
    identity,
    showLoading
  };
}

export function revokePermission(projectId, intent, identity, showLoading = false) {
  return {
    type: REVOKE_PERMISSION,
    projectId,
    intent,
    identity,
    showLoading
  };
}
