import React, { Component } from "react";
import Post from "../components/Post";
import StaticProfile from "../components/StaticProfile";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import {connect} from "react-redux";
import {getSpecificUser} from "../redux/actions/dataActions";
import { CLEAR_SELECTED_USER } from "../redux/types";

const styles = {
  gridContainer: {
    padding: "0 24px"
  },
  loaderWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
    padding: "2rem"
  }
}

export class User extends Component {
  async componentDidMount() {
    // Cargar el perfil
    this.props.getSelectedUser(this.props.match.params.handle);
  }

  componentDidUpdate(prevProps) {
    // Cargar el perfil al cambiar la ruta desde la misma página
    if(prevProps.match.params.handle !== this.props.match.params.handle) {
      this.props.getSelectedUser(this.props.match.params.handle)
    }
  }

  componentWillUnmount() {
    // Limpiar el usuario al salir de la página
    this.props.clearSelectedUser()
  }

  render() {
    const {selectedUser, loading} = this.props;

    const renderPosts = () => {
      if(!selectedUser && loading) {
        return (
          <Paper className={this.props.classes.loaderWrapper}>
            <CircularProgress />
          </Paper>
        )
      } else if(selectedUser && selectedUser.userPosts.length === 0 && !loading) {
        return <Typography variant="h5">No posts found.</Typography>
      }
      return selectedUser && selectedUser.userPosts.map((post) => {
        return <Post key={post.id} post={post} />
      })
    }

    return (
      <div className={this.props.classes.wrapper}>
        <Grid container spacing={2} className={this.props.classes.gridContainer}>
          <Grid item sm={8} xs={12}>
            {renderPosts()}
          </Grid>
          <Grid item sm={4} xs={12}>
            {selectedUser && <StaticProfile profile={selectedUser.user} />}
            {loading &&
              <Paper className={this.props.classes.loaderWrapper}>
                <CircularProgress />
              </Paper>
            }
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    selectedUser: state.data.selectedUser,
    loading: state.data.loadingSelectedUser
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getSelectedUser: (handle) => {
      dispatch(getSpecificUser(handle))
    },
    clearSelectedUser: () => {
      dispatch({type: CLEAR_SELECTED_USER})
    }
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(User));
