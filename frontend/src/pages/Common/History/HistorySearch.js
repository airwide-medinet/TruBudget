import React from "react";
import { withStyles } from "@material-ui/core";
import DatePicker from "../../Common/DatePicker";
import DropDown from "../../Common/NewDropdown";
import MenuItem from "@material-ui/core/MenuItem";
import TableCell from "@material-ui/core/TableCell";
import strings from "../../../localizeStrings";

const styles = {
  searchField: {
    padding: "2px",
    margin: "5px",
    width: "270px",
    display: "flex",
    flexDirection: "row",
    opacity: "0.8",
    boxShadow: "none"
  },
  dropdown: { minWidth: 200, marginRight: "16px" },

  datepicker: {
    padding: "5px",
    marginLeft: "19px",
    minWidth: 200,
    display: "flex",
    flexDirection: "row"
  }
};

const keyMatch = (object, search) => {
  let result = {};
  // filter keys
  for (var key in object) {
    if (key.includes(search)) {
      result[key] = object[key];
    }
  }
  // cast to array of objects
  let resultArray = [];
  for (key in result) {
    resultArray.push(Object.assign({ value: key }, { label: result[key] }));
  }
  console.log(resultArray);
  return resultArray;
};
const getSubprojectMenuItems = projectedBudgets => {
  return projectedBudgets.map(currency => {
    return (
      <MenuItem key={currency.label} value={currency.value}>
        {currency.label}
      </MenuItem>
    );
  });
};

const HistorySearch = ({ permissionLevel, storePermissionSelected }) => {
  const [permissionSelect, setPermissionSelect] = React.useState("");
  const handelchange = value => {
    setPermissionSelect(value);
    storePermissionSelected(value);
  };
  console.log(permissionLevel);
  const permissionList = keyMatch(strings.permissions, permissionLevel + "_");
  console.log(permissionList);

  return (
    <>
      <DatePicker styles={styles.datepicker} />

      <TableCell>
        <DropDown
          style={styles.dropdown}
          value={permissionSelect}
          floatingLabel="Filter by Permissions"
          onChange={value => handelchange(value)}
          id="permissionSelect"
          disabled={false}
        >
          {getSubprojectMenuItems(permissionList)}
        </DropDown>
      </TableCell>
    </>
  );
};

export default withStyles(styles)(HistorySearch);
