import { withStyles, MenuItem } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React from "react";
import strings from "../../../localizeStrings";
import DatePicker from "../../Common/DatePicker";
import Dropdown from "../../Common/NewDropdown";
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
  },
  dropdown: { minWidth: 200, marginRight: "16px" }
};

const HistorySearch = ({ classes, fetchFirstHistoryEvents, users, eventTypes }) => {
  const [{ startAt, endAt, publisher, eventType }, mergeState, clearState] = useHistoryState();

  const onChange = e => {
    const { name, value } = e.target;
    mergeState({ [name]: value });
  };

  const onReset = () => {
    clearState();
    fetchFirstHistoryEvents({});
  };

  const getMenuItems = items => {
    return items.map(item => {
      return (
        <MenuItem key={item.displayName} value={item.id}>
          {item.displayName}
        </MenuItem>
      );
    });
  };

  return (
    <div>
      <DatePicker className={classes.datepicker} label={"start"} name="startAt" value={startAt} onChange={onChange} />
      <DatePicker className={classes.datepicker} label={"end"} name="endAt" value={endAt} onChange={onChange} />

      <Dropdown
        style={styles.dropdown}
        value={publisher}
        floatingLabel="Publisher"
        onChange={value => mergeState({ publisher: value })}
        id="publisher"
        disabled={false}
      >
        {getMenuItems(users)}
      </Dropdown>

      <Dropdown
        style={styles.dropdown}
        value={eventType}
        floatingLabel="Event type"
        onChange={value => mergeState({ eventType: value })}
        id="eventType"
        disabled={false}
      >
        {getMenuItems(eventTypes)}
      </Dropdown>

      <div className={classes.searchActions}>
        <Button aria-label="reset" data-test="reset" color="secondary" onClick={onReset}>
          {strings.common.reset}
        </Button>
        <Button
          aria-label="search"
          data-test="search"
          color="secondary"
          onClick={() => {
            fetchFirstHistoryEvents({ startAt, endAt, publisher, eventType });
          }}
        >
          {strings.common.search}
        </Button>
      </div>
    </div>
  );
};

export default withStyles(styles)(HistorySearch);
