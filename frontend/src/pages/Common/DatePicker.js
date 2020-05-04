import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";

// const useStyles = makeStyles(theme => ({
//   container: {
//     display: "flex",
//     flexWrap: "wrap"
//   },
//   textField: {
//     marginLeft: theme.spacing(1),
//     marginRight: theme.spacing(1),
//     width: 200
//   }
// }));
// const styles = {
//   field: {
//     padding: "5px",
//     marginLeft: "16px",
//     width: "200px",
//     display: "flex",
//     flexDirection: "row"
//   }
// };

export default function DatePicker({ label, value = "", styles, formStyle, onChange }) {
  const classes = {};

  return (
    <form className={formStyle} noValidate>
      <TextField
        style={styles}
        id="date"
        label={label}
        type="date"
        value={value}
        className={classes.textField}
        InputLabelProps={{
          shrink: true
        }}
        onChange={event => onChange(event.target.value)}
      />
    </form>
  );
}
