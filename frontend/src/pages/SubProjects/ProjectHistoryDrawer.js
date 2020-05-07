import React from "react";
import { connect } from "react-redux";

import { toJS } from "../../helper";
import HistoryDrawer from "../Common/History/HistoryDrawer";
import { hideHistory } from "../Notifications/actions";
// TODO: cleanup not needed actions
import { fetchNextProjectHistoryPage, fetchFirstProjectHistoryPage } from "./actions";

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
  fetchNextProjectHistoryPage
}) {
  return (
    <HistoryDrawer
      doShow={doShow}
      onClose={hideHistory}
      events={events}
      nEventsTotal={nEventsTotal}
      fetchNextHistoryEvents={filter => fetchNextProjectHistoryPage(projectId, filter)}
      fetchFirstHistoryEvents={filter => fetchFirstProjectHistoryPage(projectId, filter)}
      hasMore={currentHistoryPage < lastHistoryPage}
      isLoading={isLoading}
      getUserDisplayname={getUserDisplayname}
    />
  );
}

function mapStateToProps(state) {
  return {
    doShow: state.getIn(["detailview", "showHistory"]),
    events: state.getIn(["detailview", "historyItems"]),
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
    fetchNextProjectHistoryPage: (projectId, filter) => dispatch(fetchNextProjectHistoryPage(projectId, filter)),
    fetchFirstProjectHistoryPage: (projectId, filter) => dispatch(fetchFirstProjectHistoryPage(projectId, filter))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(toJS(ProjectHistoryDrawer));
