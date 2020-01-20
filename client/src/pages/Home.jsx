import React, { Component } from "react";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import {withStyles} from "@material-ui/styles";
import Post from "../components/Post";
import Profile from "../components/Profile";

import {connect} from "react-redux";
import {getPosts} from "../redux/actions/dataActions";

const styles = {
  gridContainer: {
    padding: "0 24px"
  }
}


class Home extends Component {
  componentDidMount() {
    this.props.getPosts()
  }

  render() {
    const renderPosts = () => {
      if(this.props.data.posts.length === 0 && this.props.data.loading) {
        return <Typography variant="h5">Loading...</Typography>
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
          <Grid item sm={8} xs={12}>
            {renderPosts()}
          </Grid>
          <Grid item sm={4} xs={12}>
            <Profile />
          </Grid>
        </Grid>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.data
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
