import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import LinearProgress from "@material-ui/core/LinearProgress";
import {withStyles} from "@material-ui/styles";
import Post from "../components/Post";
import Profile from "../components/Profile";

const styles = {
  gridContainer: {
    padding: "0 24px"
  }
}

class Home extends Component {
  state = {
    posts: [],
    loading: false
  };

  async componentDidMount() {
    this.setState({
      loading: true
    });

    const response = await axios({
      method: "GET",
      url: "/posts"
    });

    this.setState({
      posts: response.data.data,
      loading: false
    })
  };

  render() {
    const renderPosts = () => {
      if(this.state.posts.length === 0 && this.state.loading) {
        return <Typography variant="h5">Loading...</Typography>
      } else if(this.state.posts.length === 0 && !this.state.loading) {
        return <Typography variant="h5">No posts found.</Typography>
      }
      return this.state.posts.map((post) => {
        return <Post key={post.id} post={post} />
      })
    }

    return (
      <div className={this.props.classes.wrapper}>
        {this.state.loading &&
          <LinearProgress/>
        }
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

export default withStyles(styles)(Home);
