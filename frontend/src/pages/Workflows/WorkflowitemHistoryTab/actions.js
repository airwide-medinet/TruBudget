export const SET_TOTAL_WORKFLOWITEM_HISTORY_ITEM_COUNT = "SET_TOTAL_WORKFLOWITEM_HISTORY_ITEM_COUNT";

export const FETCH_NEXT_WORKFLOWITEM_HISTORY_PAGE = "FETCH_NEXT_WORKFLOWITEM_HISTORY_PAGE";
export const FETCH_NEXT_WORKFLOWITEM_HISTORY_PAGE_SUCCESS = "FETCH_NEXT_WORKFLOWITEM_HISTORY_PAGE_SUCCESS";
export const FETCH_FIRST_WORKFLOWITEM_HISTORY_PAGE = "FETCH_FIRST_WORKFLOWITEM_HISTORY_PAGE";
export const FETCH_FIRST_WORKFLOWITEM_HISTORY_PAGE_SUCCESS = "FETCH_FIRST_WORKFLOWITEM_HISTORY_PAGE_SUCCESS";

export const RESET_WORKFLOWITEM_HISTORY = "RESET_WORKFLOWITEM_HISTORY";

export function setTotalHistoryItemCount(count) {
  return {
    type: SET_TOTAL_WORKFLOWITEM_HISTORY_ITEM_COUNT,
    count
  };
}

export function fetchNextWorkflowitemHistoryPage(
  projectId,
  subprojectId,
  workflowitemId,
  filter = {},
  showLoading = false
) {
  return {
    type: FETCH_NEXT_WORKFLOWITEM_HISTORY_PAGE,
    projectId,
    subprojectId,
    workflowitemId,
    filter,
    showLoading
  };
}
export function fetchFirstWorkflowitemHistoryPage(
  projectId,
  subprojectId,
  workflowitemId,
  filter = {},
  showLoading = false
) {
  return {
    type: FETCH_FIRST_WORKFLOWITEM_HISTORY_PAGE,
    projectId,
    subprojectId,
    workflowitemId,
    filter,
    showLoading
  };
}

export function resetWorkflowitemHistory() {
  return {
    type: RESET_WORKFLOWITEM_HISTORY
  };
}
