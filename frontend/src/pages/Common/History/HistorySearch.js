import React from "react";
import { withStyles } from "@material-ui/core";
import DatePicker from "../../Common/DatePicker";
import DropDown from "../../Common/NewDropdown";
import Searchbar from "../../Common/Searchbar";
import MenuItem from "@material-ui/core/MenuItem";
import TableCell from "@material-ui/core/TableCell";
import strings from "../../../localizeStrings";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

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

const HistorySearch = ({
  permissionLevel,
  storePermissionSelected,
  storeHistoryStartDate,
  storeHistoryEndDate,
  searchHistoryStartDate,
  searchHistoryEndDate,
  storeHistorySearchName,
  searchHistoryName
}) => {
  const [permissionSelect, setPermissionSelect] = React.useState("");
  const handlePermissionSelect = value => {
    setPermissionSelect(value);
    storePermissionSelected(value);
  };
  const permissionList = keyMatch(strings.permissions, permissionLevel + "_");

  // const [searchHistoryStartDate, setStartDate] = React.useState("");
  // const handleStartDate = value => {
  //   setStartDate(value);
  //   storeHistoryStartDate(value);
  // };
  console.log(searchHistoryStartDate);

  const resetSearchValues = () => {
    setPermissionSelect("");
    storePermissionSelected("");
    storeHistorySearchName("");
    storeHistoryStartDate("2019-01-01");
    storeHistoryEndDate("2019-01-01");
    console.log(searchHistoryStartDate);
  };

  return (
    <div>
      <DatePicker
        styles={styles.datepicker}
        label={"start"}
        value={searchHistoryStartDate}
        onChange={value => storeHistoryStartDate(value)}
      />
      <DatePicker
        styles={styles.datepicker}
        label={"end"}
        value={searchHistoryEndDate}
        onChange={value => storeHistoryEndDate(value)}
      />
      {/* <TextField
        styles={styles.datepicker}
        label="Search by name"
        value={searchHistoryName}
        onChange={value => storeHistorySearchName(value)}
      /> */}
      <Searchbar
        previewText={"Search for name"}
        storeSearchTerm={storeHistorySearchName}
        searchTerm={searchHistoryName}
        autoSearch={true}
        isSearchBarDisplayedByDefault={true}
      />

      <TableCell>
        <DropDown
          style={styles.dropdown}
          value={permissionSelect}
          floatingLabel="Filter by Permissions"
          onChange={value => handlePermissionSelect(value)}
          id="permissionSelect"
          disabled={false}
        >
          {getSubprojectMenuItems(permissionList)}
        </DropDown>
      </TableCell>

      <Button aria-label="cancel" data-test="reset" color="secondary" onClick={() => resetSearchValues()}>
        Reset
      </Button>
    </div>
  );
};

export default withStyles(styles)(HistorySearch);
