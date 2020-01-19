import React, { Component } from "react";
import axios from "axios";
import Grid from "@material-ui/core/Grid";
import Post from "../components/Post";

class Home extends Component {
  state = {
    posts: []
  };

  async componentDidMount() {
    const response = await axios({
      method: "GET",
      url: "/posts"
    });

    this.setState({
      posts: response.data.data
    })
  };

  render() {
    console.log(this.state.posts)

    const renderPosts = () => {
      if(this.state.posts.length === 0) {
        return <p>Loading..</p>
      }
      return this.state.posts.map((post) => {
        return <Post key={post.id} post={post} />
      })
    }

    return (
      <Grid container>
        <Grid item sm={8} xs={12}>
          {renderPosts()}
        </Grid>
        <Grid item sm={4} xs={12}>
          <p>Profile</p>
        </Grid>
      </Grid>
    );
  }
}

export default Home;
