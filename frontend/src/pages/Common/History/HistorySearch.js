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
  const [{ startAt, endAt, publisher, eventType }, mergeState, clearState] = useHistoryState();

  const onChange = e => {
    const { name, value } = e.target;
    mergeState({ [name]: value });
  };

  return (
    <div>
      <DatePicker className={classes.datepicker} label={"start"} name="startAt" value={startAt} onChange={onChange} />
      <DatePicker className={classes.datepicker} label={"end"} name="endAt" value={endAt} onChange={onChange} />
      {renderPublisherSelection({ classes, publisher, onChange, users })}
      {/* // TODO: render permission selection since there are only certain types of events */}
      {/* permission search (User picker) */}
      <div className={classes.searchActions}>
        <Button aria-label="reset" data-test="reset" color="secondary" onClick={clearState}>
          {strings.common.reset}
        </Button>
        <Button
          aria-label="search"
          data-test="reset"
          color="secondary"
          onClick={() => fetchFirstHistoryEvents({ startAt, endAt, publisher, eventType })}
        >
          {strings.common.search}
        </Button>
      </div>
    </div>
  );
};

const renderMenuItems = users => {
  let menuItems = [];
  users.forEach(user => {
    if (!user.isGroup) {
      menuItems.push(
        <MenuItem key={`menu-item-${user.id}`} value={user.id}>
          {user.displayName}
        </MenuItem>
      );
    }
  });
  return menuItems;
};

const renderPublisherSelection = ({ classes, publisher, onChange, users }) => {
  const userList = renderMenuItems(users);

  return (
    <FormControl className={classes.formControl}>
      <InputLabel>Publisher</InputLabel>
      <Select value={publisher} name="publisher" onChange={onChange}>
        {userList}
      </Select>
    </FormControl>
  );
};

export default withStyles(styles)(HistorySearch);
