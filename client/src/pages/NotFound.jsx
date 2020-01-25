import React from "react";
import {Link} from "react-router-dom";
import withStyles from "@material-ui/core/styles/withStyles";
import Container from "@material-ui/core/Container";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import WarningIcon from '@material-ui/icons/WarningRounded';

const styles = {
  paper: {
    padding: "4rem",
    textAlign: "center"
  },
  text: {
    textAlign: "center"
  },
  icon: {
    textAlign: "center",
    fontSize: "9rem"
  }
}

const NotFound = (props) => {
  return (
    <Container maxWidth="sm">
      <Paper className={props.classes.paper}>
        <Typography className={props.classes.text} style={{marginBottom: "1rem"}} variant="h2">
          Oops!
        </Typography>
        <WarningIcon className={props.classes.icon} color="secondary" style={{marginBottom: "1rem"}} />
        <Typography className={props.classes.text} variant="h5" style={{marginBottom: "2rem"}}>
          That page doesn't exist.
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary">Go back</Button>
      </Paper>
    </Container>
  );
}

export default withStyles(styles)(NotFound);
