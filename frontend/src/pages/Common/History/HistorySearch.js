import { withStyles, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React from "react";
import strings from "../../../localizeStrings";
import DatePicker from "../../Common/DatePicker";
import useHistoryState from "./historyHook";

const styles = {
  searchActions: {
    marginTop: "24px"
  },

  formControl: {
    marginTop: "24px",
    width: "-webkit-fill-available"
  },

  datepicker: {
    padding: "5px",
    marginLeft: "19px",
    minWidth: 200,
    display: "flex",
    flexDirection: "row"
  }
};

const HistorySearch = ({ classes, fetchFirstHistoryEvents, users }) => {
  const project_eventType = [
    { id: "project_created", displayName: "Project created" },
    { id: "project_updated", displayName: "Project updated" },
    { id: "project_assigned", displayName: "Project assigned" },
    { id: "project_closed", displayName: "Project closed" },
    { id: "project_permission_granted", displayName: "Project permisision granted" },
    { id: "project_permission_revoked", displayName: "Project permission revoked" },
    { id: "project_projected_budget_updated", displayName: "Project budget updated" },
    { id: "project_projected_budget_deleted", displayName: "Project budget closed" }
  ];

  const [{ startAt, endAt, publisher, eventType }, mergeState, clearState] = useHistoryState();

  const onChange = e => {
    const { name, value } = e.target;
    mergeState({ [name]: value });
  };

  const onReset = () => {
    clearState();
    fetchFirstHistoryEvents({});
  };

  return (
    <div>
      <DatePicker className={classes.datepicker} label={"start"} name="startAt" value={startAt} onChange={onChange} />
      <DatePicker className={classes.datepicker} label={"end"} name="endAt" value={endAt} onChange={onChange} />
      {/* {renderPublisherSelection({ classes, publisher, onChange, users })}
      {renderEventTypeSelection({ classes, eventType, onChange, project_eventType })} */}

      {renderSelection({
        classes,
        value: publisher,
        name: "publisher",
        label: "Publisher",
        onChange,
        selectionList: users
      })}
      {renderSelection({
        classes,
        value: eventType,
        name: "eventType",
        label: "Permission type",
        onChange,
        selectionList: project_eventType
      })}
      {/* // TODO: render permission selection since there are only certain types of events */}
      {/* permission search (User picker) */}
      <div className={classes.searchActions}>
        <Button aria-label="reset" data-test="reset" color="secondary" onClick={onReset}>
          {strings.common.reset}
        </Button>
        <Button
          aria-label="search"
          data-test="reset"
          color="secondary"
          onClick={() => {
            console.log(publisher);
            console.log(eventType);
            fetchFirstHistoryEvents({ startAt, endAt, publisher, eventType });
          }}
        >
          {strings.common.search}
        </Button>
      </div>
    </div>
  );
};

const renderMenuItems = items => {
  let menuItems = [];
  items.forEach(item => {
    if (!item.isGroup) {
      menuItems.push(
        <MenuItem key={`menu-item-${item.id}`} value={item.id}>
          {item.displayName}
        </MenuItem>
      );
    }
  });
  return menuItems;
};

// const renderPublisherSelection = ({ classes, publisher, onChange, users }) => {
//   const userList = renderMenuItems(users);

//   return (
//     <FormControl className={classes.formControl}>
//       <InputLabel>Publisher</InputLabel>
//       <Select value={publisher} name="publisher" onChange={onChange}>
//         {userList}
//       </Select>
//     </FormControl>
//   );
// };

// const renderEventTypeSelection = ({ classes, eventType, onChange, project_eventType }) => {
//   const eventTypeList = renderMenuItems(project_eventType);

//   return (
//     <FormControl className={classes.formControl}>
//       <InputLabel>Permission type</InputLabel>
//       <Select value={eventType} name="eventType" onChange={onChange}>
//         {eventTypeList}
//       </Select>
//     </FormControl>
//   );
// };

const renderSelection = ({ classes, value, name, label, onChange, selectionList }) => {
  const menuItemsList = renderMenuItems(selectionList);

  return (
    <FormControl className={classes.formControl}>
      <InputLabel>{label}</InputLabel>
      <Select value={value} name={name} onChange={onChange}>
        {menuItemsList}
      </Select>
    </FormControl>
  );
};

export default withStyles(styles)(HistorySearch);
