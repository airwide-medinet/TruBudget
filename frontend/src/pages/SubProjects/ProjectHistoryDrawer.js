import React from "react";
import { connect } from "react-redux";

import { toJS } from "../../helper";
import HistoryDrawer from "../Common/History/HistoryDrawer";
import { hideHistory } from "../Notifications/actions";
import {
  fetchNextProjectHistoryPage,
  storeSubPermissionSelected,
  storeSubSearchHistoryStartDate,
  storeSubSearchHistoryEndDate,
  storeSubHistorySearchName
} from "./actions";

function ProjectHistoryDrawer({
  projectId,
  doShow,
  events,
  nEventsTotal,
  currentHistoryPage,
  lastHistoryPage,
  isLoading,
  getUserDisplayname,
  hideHistory,
  fetchNextProjectHistoryPage,
  storeSubPermissionSelected,
  selectedPermission,
  storeSubSearchHistoryStartDate,
  searchHistoryStartDate,
  storeSubSearchHistoryEndDate,
  searchHistoryEndDate,
  storeSubHistorySearchName,
  searchHistoryName
}) {
  return (
    <HistoryDrawer
      doShow={doShow}
      onClose={hideHistory}
      events={events}
      nEventsTotal={nEventsTotal}
      fetchNext={() => fetchNextProjectHistoryPage(projectId)}
      hasMore={currentHistoryPage < lastHistoryPage}
      isLoading={isLoading}
      getUserDisplayname={getUserDisplayname}
      permissionLevel={"project"}
      storePermissionSelected={storeSubPermissionSelected}
      selectedPermission={selectedPermission}
      storeHistoryStartDate={storeSubSearchHistoryStartDate}
      searchHistoryStartDate={searchHistoryStartDate}
      storeHistoryEndDate={storeSubSearchHistoryEndDate}
      searchHistoryEndDate={searchHistoryEndDate}
      storeHistorySearchName={storeSubHistorySearchName}
      searchHistoryName={searchHistoryName}
    />
  );
}

function mapStateToProps(state) {
  return {
    doShow: state.getIn(["detailview", "showHistory"]),
    events: state.getIn(["detailview", "historyItems"]),
    selectedPermission: state.getIn(["detailview", "selectedPermission"]),
    searchHistoryStartDate: state.getIn(["detailview", "searchHistoryStartDate"]),
    searchHistoryEndDate: state.getIn(["detailview", "searchHistoryEndDate"]),
    searchHistoryName: state.getIn(["detailview", "searchHistoryName"]),
    nEventsTotal: state.getIn(["detailview", "totalHistoryItemCount"]),
    isLoading: state.getIn(["detailview", "isHistoryLoading"]),
    currentHistoryPage: state.getIn(["detailview", "currentHistoryPage"]),
    lastHistoryPage: state.getIn(["detailview", "lastHistoryPage"]),
    getUserDisplayname: uid => state.getIn(["login", "userDisplayNameMap", uid]) || "Somebody"
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideHistory: () => dispatch(hideHistory()),
    fetchNextProjectHistoryPage: projectId => dispatch(fetchNextProjectHistoryPage(projectId)),
    storeSubPermissionSelected: selectedPermission => dispatch(storeSubPermissionSelected(selectedPermission)),
    storeSubSearchHistoryStartDate: searchHistoryStartDate =>
      dispatch(storeSubSearchHistoryStartDate(searchHistoryStartDate)),
    storeSubSearchHistoryEndDate: searchHistoryEndDate => dispatch(storeSubSearchHistoryEndDate(searchHistoryEndDate)),
    storeSubHistorySearchName: searchHistoryName => dispatch(storeSubHistorySearchName(searchHistoryName))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(toJS(ProjectHistoryDrawer));
