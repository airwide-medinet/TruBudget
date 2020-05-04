import React from "react";
import { connect } from "react-redux";

import { toJS } from "../../helper";
import HistoryDrawer from "../Common/History/HistoryDrawer";
import { hideHistory } from "../Notifications/actions";
import { fetchNextSubprojectHistoryPage } from "../Workflows/actions";

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
  storePermissionSelected,
  selectedPermission,
  storeHistoryStartDate,
  storeHistoryEndDate,
  storeHistorySearchName,
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
      storePermissionSelected={storePermissionSelected}
      selectedPermission={selectedPermission}
      storeHistoryStartDate={storeHistoryStartDate}
      storeHistoryEndDate={storeHistoryEndDate}
      storeHistorySearchName={storeHistorySearchName}
      searchHistoryName={searchHistoryName}
    />
  );
}

function mapStateToProps(state) {
  return {
    doShow: state.getIn(["workflow", "showHistory"]),
    events: state.getIn(["workflow", "historyItems"]),
    searchHistoryStartDate: state.getIn(["detailview", "searchHistoryStartDate"]),
    searchHistoryEndDate: state.getIn(["detailview", "searchHistoryEndDate"]),
    searchHistoryName: state.getIn(["detailview", "searchHistoryName"]),
    nEventsTotal: state.getIn(["workflow", "historyItemsCount"]),
    isLoading: state.getIn(["workflow", "isHistoryLoading"]),
    currentHistoryPage: state.getIn(["workflow", "currentHistoryPage"]),
    lastHistoryPage: state.getIn(["workflow", "lastHistoryPage"]),
    getUserDisplayname: uid => state.getIn(["login", "userDisplayNameMap", uid]) || "Somebody"
  };
}

const mapDispatchToProps = {
  hideHistory,
  fetchNextSubprojectHistoryPage
};

export default connect(mapStateToProps, mapDispatchToProps)(toJS(SubprojectHistoryDrawer));
