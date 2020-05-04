import React from "react";
import { connect } from "react-redux";

import { toJS } from "../../helper";
import HistoryDrawer from "../Common/History/HistoryDrawer";
import { hideHistory } from "../Notifications/actions";
import {
  fetchNextSubprojectHistoryPage,
  storeWorkflowsPermissionSelected,
  storeWorkflowSearchHistoryStartDate,
  storeWorkflowSearchHistoryEndDate,
  storeWorkflowSearchHistoryName
} from "../Workflows/actions";

function SubprojectHistoryDrawer({
  projectId,
  subprojectId,
  doShow,
  events,
  nEventsTotal,
  isLoading,
  getUserDisplayname,
  hideHistory,
  fetchNextSubprojectHistoryPage,
  currentHistoryPage,
  lastHistoryPage,
  storeWorkflowsPermissionSelected,
  storeWorkflowSearchHistoryStartDate,
  storeWorkflowSearchHistoryEndDate,
  storeWorkflowSearchHistoryName,
  selectedPermission,
  searchHistoryStartDate,
  searchHistoryEndDate,
  searchHistoryName
}) {
  return (
    <HistoryDrawer
      doShow={doShow}
      onClose={hideHistory}
      events={events}
      nEventsTotal={nEventsTotal}
      fetchNext={() => fetchNextSubprojectHistoryPage(projectId, subprojectId)}
      hasMore={currentHistoryPage < lastHistoryPage}
      isLoading={isLoading}
      getUserDisplayname={getUserDisplayname}
      permissionLevel={"subproject"}
      storePermissionSelected={storeWorkflowsPermissionSelected}
      selectedPermission={selectedPermission}
      storeHistoryStartDate={storeWorkflowSearchHistoryStartDate}
      searchHistoryStartDate={searchHistoryStartDate}
      storeHistoryEndDate={storeWorkflowSearchHistoryEndDate}
      searchHistoryEndDate={searchHistoryEndDate}
      storeHistorySearchName={storeWorkflowSearchHistoryName}
      searchHistoryName={searchHistoryName}
    />
  );
}

function mapStateToProps(state) {
  return {
    doShow: state.getIn(["workflow", "showHistory"]),
    events: state.getIn(["workflow", "historyItems"]),
    searchHistoryStartDate: state.getIn(["workflow", "searchHistoryStartDate"]),
    searchHistoryEndDate: state.getIn(["workflow", "searchHistoryEndDate"]),
    searchHistoryName: state.getIn(["workflow", "searchHistoryName"]),
    nEventsTotal: state.getIn(["workflow", "historyItemsCount"]),
    isLoading: state.getIn(["workflow", "isHistoryLoading"]),
    currentHistoryPage: state.getIn(["workflow", "currentHistoryPage"]),
    lastHistoryPage: state.getIn(["workflow", "lastHistoryPage"]),
    getUserDisplayname: uid => state.getIn(["login", "userDisplayNameMap", uid]) || "Somebody"
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideHistory: () => dispatch(hideHistory()),
    fetchNextSubprojectHistoryPage: (projectId, subprojectId) =>
      dispatch(fetchNextSubprojectHistoryPage(projectId, subprojectId)),
    storeWorkflowsPermissionSelected: selectedPermission =>
      dispatch(storeWorkflowsPermissionSelected(selectedPermission)),
    storeWorkflowSearchHistoryStartDate: searchHistoryStartDate =>
      dispatch(storeWorkflowSearchHistoryStartDate(searchHistoryStartDate)),
    storeWorkflowSearchHistoryEndDate: searchHistoryEndDate =>
      dispatch(storeWorkflowSearchHistoryEndDate(searchHistoryEndDate)),
    storeWorkflowSearchHistoryName: searchHistoryName => dispatch(storeWorkflowSearchHistoryName(searchHistoryName))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(toJS(SubprojectHistoryDrawer));
