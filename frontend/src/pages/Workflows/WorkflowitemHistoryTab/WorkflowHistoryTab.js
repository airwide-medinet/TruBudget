import React from "react";
import { connect } from "react-redux";

import { toJS } from "../../../helper";
import ScrollingHistory from "../../Common/History/ScrollingHistory";
import {
  fetchNextWorkflowitemHistoryPage,
  resetWorkflowitemHistory,
  storeWorkflowitemHistorySearchStartDate,
  storeWorkflowitemHistorySearchEndDate,
  storeWorkflowitemHistorySearchName
} from "./actions";

class WorkflowitemHistoryTab extends React.Component {
  componentWillUnmount() {
    this.props.resetWorkflowitemHistory();
  }

  render() {
    const {
      nEventsTotal,
      historyItems,
      fetchNextWorkflowitemHistoryPage,
      currentHistoryPage,
      lastHistoryPage,
      projectId,
      subprojectId,
      workflowitemId,
      isLoading,
      getUserDisplayname,
      storeWorkflowitemHistorySearchStartDate,
      storeWorkflowitemHistorySearchEndDate,
      storeWorkflowitemHistorySearchName,
      searchHistoryStartDate,
      searchHistoryEndDate,
      searchHistoryName
    } = this.props;
    console.log(storeWorkflowitemHistorySearchStartDate);
    return (
      <ScrollingHistory
        events={historyItems}
        nEventsTotal={nEventsTotal}
        hasMore={currentHistoryPage < lastHistoryPage}
        isLoading={isLoading}
        getUserDisplayname={getUserDisplayname}
        fetchNext={() => fetchNextWorkflowitemHistoryPage(projectId, subprojectId, workflowitemId)}
        initialLoad={true}
        storeHistoryStartDate={storeWorkflowitemHistorySearchStartDate}
        searchHistoryStartDate={searchHistoryStartDate}
        storeHistoryEndDate={storeWorkflowitemHistorySearchEndDate}
        searchHistoryEndDate={searchHistoryEndDate}
        storeHistorySearchName={storeWorkflowitemHistorySearchName}
        searchHistoryName={searchHistoryName}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    historyItems: state.getIn(["workflowitemDetails", "historyItems"]),
    nEventsTotal: state.getIn(["workflowitemDetails", "totalHistoryItemCount"]),
    searchHistoryStartDate: state.getIn(["workflowitemDetails", "searchHistoryStartDate"]),
    searchHistoryEndDate: state.getIn(["workflowitemDetails", "searchHistoryEndDate"]),
    searchHistoryName: state.getIn(["workflowitemDetails", "searchHistoryName"]),
    isLoading: state.getIn(["workflowitemDetails", "isHistoryLoading"]),
    currentHistoryPage: state.getIn(["workflowitemDetails", "currentHistoryPage"]),
    lastHistoryPage: state.getIn(["workflowitemDetails", "lastHistoryPage"]),
    getUserDisplayname: uid => state.getIn(["login", "userDisplayNameMap", uid]) || "Somebody"
  };
}

function mapDispatchToProps(dispatch) {
  return {
    resetWorkflowitemHistory: () => dispatch(resetWorkflowitemHistory()),
    fetchNextWorkflowitemHistoryPage: (projectId, subprojectId, workflowitemId) =>
      dispatch(fetchNextWorkflowitemHistoryPage(projectId, subprojectId, workflowitemId)),
    storeWorkflowitemHistorySearchStartDate: searchHistoryStartDate =>
      dispatch(storeWorkflowitemHistorySearchStartDate(searchHistoryStartDate)),
    storeWorkflowitemHistorySearchEndDate: searchHistoryEndDate =>
      dispatch(storeWorkflowitemHistorySearchEndDate(searchHistoryEndDate)),
    storeWorkflowitemHistorySearchName: searchHistoryName =>
      dispatch(storeWorkflowitemHistorySearchName(searchHistoryName))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(toJS(WorkflowitemHistoryTab));
