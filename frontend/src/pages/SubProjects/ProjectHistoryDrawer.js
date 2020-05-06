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
  storeSubHistorySearchName,
  resetHistory
} from "./actions";

function ProjectHistoryDrawer({
  projectId,
  doShow,
  events,
  resetHistory,
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
  // React.useEffect(() => {
  //   setEventItems(getEvents(events, getUserDisplayname));
  // }, []);

  // React.useEffect(() => {
  //   setEventItems(getEvents(events, getUserDisplayname));
  // }, []);

  return (
    <HistoryDrawer
      doShow={doShow}
      onClose={hideHistory}
      events={events}
      resetHistory={resetHistory}
      nEventsTotal={nEventsTotal}
      fetchNext={() =>
        fetchNextProjectHistoryPage(projectId, {
          startAt: searchHistoryStartDate,
          endAt: searchHistoryEndDate,
          publisher: searchHistoryName
        })
      }
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
    // filter: state.getIn(["detailview", "filter"]),
    isLoading: state.getIn(["detailview", "isHistoryLoading"]),
    currentHistoryPage: state.getIn(["detailview", "currentHistoryPage"]),
    lastHistoryPage: state.getIn(["detailview", "lastHistoryPage"]),
    getUserDisplayname: uid => state.getIn(["login", "userDisplayNameMap", uid]) || "Somebody"
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideHistory: () => dispatch(hideHistory()),
    resetHistory: () => dispatch(resetHistory()),
    fetchNextProjectHistoryPage: (projectId, filter) => dispatch(fetchNextProjectHistoryPage(projectId, filter)),
    storeSubPermissionSelected: selectedPermission => dispatch(storeSubPermissionSelected(selectedPermission)),
    storeSubSearchHistoryStartDate: searchHistoryStartDate =>
      dispatch(storeSubSearchHistoryStartDate(searchHistoryStartDate)),
    storeSubSearchHistoryEndDate: searchHistoryEndDate => dispatch(storeSubSearchHistoryEndDate(searchHistoryEndDate)),
    storeSubHistorySearchName: searchHistoryName => dispatch(storeSubHistorySearchName(searchHistoryName))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(toJS(ProjectHistoryDrawer));
