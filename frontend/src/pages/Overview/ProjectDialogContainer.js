import React, { Component } from "react";
import { connect } from "react-redux";

import { toJS } from "../../helper";
import withInitialLoading from "../Loading/withInitialLoading";
import { storeSnackbarMessage } from "../Notifications/actions";
import {
  addProjectedBudget,
  createProject,
  editProject,
  hideProjectDialog,
  setCurrentStep,
  storeProjectComment,
  storeProjectName,
  storeProjectThumbnail,
  storeProjectOrganization
} from "./actions";
import ProjectDialog from "./ProjectDialog";

class ProjectDialogContainer extends Component {
  render() {
    return <ProjectDialog {...this.props} />;
  }
}

const mapStateToProps = state => {
  return {
    projects: state.getIn(["overview", "projects"]),
    creationDialogShown: state.getIn(["overview", "creationDialogShown"]),
    editDialogShown: state.getIn(["overview", "editDialogShown"]),
    currentStep: state.getIn(["overview", "currentStep"]),
    projectToAdd: state.getIn(["overview", "projectToAdd"]),
    dialogTitle: state.getIn(["overview", "dialogTitle"]),
    allowedIntents: state.getIn(["login", "allowedIntents"])
  };
};

const mapDispatchToProps = dispatch => {
  return {
    createProject: (name, comment, thumbnail, projectedBudgets) =>
      dispatch(createProject(name, comment, thumbnail, projectedBudgets)),
    editProject: (id, changes) => dispatch(editProject(id, changes)),
    hideProjectDialog: () => dispatch(hideProjectDialog()),
    storeProjectName: name => dispatch(storeProjectName(name)),
    storeProjectComment: comment => dispatch(storeProjectComment(comment)),
    setCurrentStep: step => dispatch(setCurrentStep(step)),
    storeProjectThumbnail: thumbnail => dispatch(storeProjectThumbnail(thumbnail)),
    addProjectedBudget: projectedBudget => dispatch(addProjectedBudget(projectedBudget)),
    storeProjectOrganization: organization => dispatch(storeProjectOrganization(organization)),

    storeSnackbarMessage: message => dispatch(storeSnackbarMessage(message))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(withInitialLoading(toJS(ProjectDialogContainer)));
