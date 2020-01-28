import React, { Component } from "react";
import Post from "../components/Post";
import StaticProfile from "../components/StaticProfile";
import withStyles from "@material-ui/core/styles/withStyles";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import PostAddOutlined from "@material-ui/icons/PostAddOutlined";

import {connect} from "react-redux";
import {getSpecificUser} from "../redux/actions/dataActions";
import { CLEAR_SELECTED_USER } from "../redux/types";

const styles = (theme) => ({
  gridContainer: {
    flexDirection: "row",
    padding: "0 24px",
    [theme.breakpoints.down(1050)]: {
      flexDirection: "column",
      width: "100%"
    }
  },
  userPostsTitle: {
    display: "flex",
    alignItems: "center",
    marginBottom: "1rem",

    [theme.breakpoints.down(1050)]: {
      textAlign: "center"
    }
  },
  posts: {
    flexBasis: "66.7%",
    order: 1,
    [theme.breakpoints.down(1050)]: {
      flexGrow: 1,
      order: 2
    }
  },
  profile: {
    flexBasis: "33.3%",
    order: 2,
    [theme.breakpoints.down(1050)]: {
      flexGrow: 1,
      order: 1,
      marginBottom: "1rem"
    }
  },
  loaderWrapper: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "60vh",
    padding: "2rem"
  }
})

class User extends Component {
  componentDidMount() {    
    // Cargar el perfil
    this.props.getSelectedUser(this.props.match.params.handle);
  }
  
  componentDidUpdate(prevProps) {
    // Cargar el perfil al cambiar la ruta desde la misma página
    if(prevProps.match.params.handle !== this.props.match.params.handle) {
      this.props.getSelectedUser(this.props.match.params.handle);
    }
    
    // Actualizar el title de la página con el handle del usuario
    if(prevProps.selectedUser !== this.props.selectedUser) {
      document.title = `Social Spark | ${this.props.selectedUser.user.handle}`;
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
          <Grid item className={this.props.classes.posts}>
            <Typography variant="h6" className={this.props.classes.userPostsTitle}>
              <PostAddOutlined fontSize="large" color="primary" style={{marginRight: "10px"}}/>
              <span>Posts from {this.props.match.params.handle.split(" ")[0]}</span>
            </Typography>
            {renderPosts()}
          </Grid>
          <Grid className={this.props.classes.profile}>
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
