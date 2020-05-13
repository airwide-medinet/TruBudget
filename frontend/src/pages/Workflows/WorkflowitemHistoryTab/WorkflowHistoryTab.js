import React from "react";
import { connect } from "react-redux";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import SearchIcon from "@material-ui/icons/Search";
import { toJS } from "../../../helper";
import ScrollingHistory from "../../Common/History/ScrollingHistory";
import HistorySearch from "../../Common/History/HistorySearch";
import useHistoryState from "../../Common/History/historyHook";
import strings from "../../../localizeStrings";
import { getWorkflowitemEventTypes } from "../../Common/History/eventTypes";
import {
  fetchNextWorkflowitemHistoryPage,
  fetchFirstWorkflowitemHistoryPage,
  resetWorkflowitemHistory
} from "./actions";

const WorkflowitemHistoryTab = ({
  users,
  nEventsTotal,
  events,
  fetchNextWorkflowitemHistoryPage,
  currentHistoryPage,
  lastHistoryPage,
  projectId,
  subprojectId,
  workflowitemId,
  isLoading,
  getUserDisplayname
}) => {
  const workflowitemEventTypes = getWorkflowitemEventTypes();
  console.log(users);
  console.log(workflowitemEventTypes);
  const [{ startAt, endAt, publisher, eventType }] = useHistoryState();
  return (
    <>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
          <SearchIcon />
          <Typography>{strings.common.search}</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <HistorySearch
            fetchFirstHistoryEvents={filter =>
              fetchFirstWorkflowitemHistoryPage(projectId, subprojectId, workflowitemId, filter)
            }
            users={users}
            eventTypes={workflowitemEventTypes}
          />
        </ExpansionPanelDetails>
      </ExpansionPanel>
      <ScrollingHistory
        events={events}
        nEventsTotal={nEventsTotal}
        hasMore={currentHistoryPage < lastHistoryPage}
        isLoading={isLoading}
        getUserDisplayname={getUserDisplayname}
        fetchNext={() =>
          fetchNextWorkflowitemHistoryPage(projectId, subprojectId, workflowitemId, {
            startAt,
            endAt,
            publisher,
            eventType
          })
        }
      />
    </>
  );
};

function mapStateToProps(state) {
  return {
    users: state.getIn(["login", "user"]),
    events: state.getIn(["workflowitemDetails", "historyItems"]),
    nEventsTotal: state.getIn(["workflowitemDetails", "totalHistoryItemCount"]),
    isLoading: state.getIn(["workflowitemDetails", "isHistoryLoading"]),
    currentHistoryPage: state.getIn(["workflowitemDetails", "currentHistoryPage"]),
    lastHistoryPage: state.getIn(["workflowitemDetails", "lastHistoryPage"]),
    getUserDisplayname: uid => state.getIn(["login", "userDisplayNameMap", uid]) || "Somebody"
  };
}

function mapDispatchToProps(dispatch) {
  return {
    resetWorkflowitemHistory: () => dispatch(resetWorkflowitemHistory()),
    fetchNextWorkflowitemHistoryPage: (projectId, subprojectId, workflowitemId, filter) =>
      dispatch(fetchNextWorkflowitemHistoryPage(projectId, subprojectId, workflowitemId, filter)),
    fetchFirstWorkflowitemHistoryPage: (projectId, subprojectId, workflowitemId, filter) =>
      dispatch(fetchFirstWorkflowitemHistoryPage(projectId, subprojectId, workflowitemId, filter))
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(toJS(WorkflowitemHistoryTab));
