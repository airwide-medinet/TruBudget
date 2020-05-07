import { withStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React from "react";
import strings from "../../../localizeStrings";
import DatePicker from "../../Common/DatePicker";
import useHistoryState from "./historyHook";

const styles = {
  searchActions: {
    marginTop: "24px"
  },

  datepicker: {
    padding: "5px",
    marginLeft: "19px",
    minWidth: 200,
    display: "flex",
    flexDirection: "row"
  }
};

const HistorySearch = ({ classes, fetchFirstHistoryEvents }) => {
  const [{ startAt, endAt, publisher, eventType }, mergeState, clearState] = useHistoryState();

  const onChange = e => {
    const { name, value } = e.target;
    mergeState({ [name]: value });
  };

  return (
    <div>
      <DatePicker className={classes.datepicker} label={"start"} name="startAt" value={startAt} onChange={onChange} />
      <DatePicker className={classes.datepicker} label={"end"} name="endAt" value={endAt} onChange={onChange} />

      {/* publisher search (User picker) */}
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

export default withStyles(styles)(HistorySearch);
