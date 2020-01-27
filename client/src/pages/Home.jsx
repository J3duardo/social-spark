import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import {withStyles} from "@material-ui/styles";
import Post from "../components/Post";
import Profile from "../components/Profile";

import {connect} from "react-redux";
import {getPosts} from "../redux/actions/dataActions";

const styles = (theme) => ({
  gridContainer: {
    flexDirection: "row",
    padding: "0 24px",
    [theme.breakpoints.down(750)]: {
      flexDirection: "column",
      width: "100%"
    }
  },
  posts: {
    flexBasis: "66.7%",
    [theme.breakpoints.down(750)]: {
      flexGrow: 1
    }
  },
  profile: {
    flexBasis: "33.3%",
    [theme.breakpoints.down(750)]: {
      flexGrow: 1
    }
  },
  loaderWrapper: {
    minHeight: "60vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  }
})

class Home extends Component {
  
  componentDidMount() {
    document.title = "Social Spark | Home";
    this.props.getPosts()
  }

  render() {
    const renderPosts = () => {
      if(this.props.data.posts.length === 0 && this.props.data.loading) {
        return (
          <Paper className={this.props.classes.loaderWrapper}>
            <CircularProgress />
          </Paper>
        )
      } else if(this.props.data.posts.length === 0 && !this.props.data.loading) {
        return <Typography variant="h5">No posts found.</Typography>
      }
      return this.props.data.posts.map((post) => {
        return <Post key={post.id} post={post} />
      })
    }

    return (
      <div className={this.props.classes.wrapper}>
        <Grid container spacing={2} className={this.props.classes.gridContainer}>
          <Grid item className={this.props.classes.posts}>
            {renderPosts()}
          </Grid>
          <Grid item className={this.props.classes.profile}>
            <Profile />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.data,
    loading: state.data.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getPosts: () => {
      dispatch(getPosts())
    }
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(Home));
