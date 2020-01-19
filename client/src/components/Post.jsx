import React, { Component } from "react";
import moment from "moment";
import Link from "react-router-dom/Link";
import {withStyles} from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const styles = {
  card: {
    display: "flex",
    margin: "0 20px 20px 0"
  },
  image: {
    minWidth: "200px"
  },
  content: {
    padding: "15px"
  }
}

class Post extends Component {
  render() {
    const {classes, post} = this.props;

    return (
      <Card className={classes.card}>
        <CardMedia
          title="Profile image"
          className={classes.image}
          image={post.userImage}
        />
        <CardContent className={classes.content}>
          <Typography
            variant="h5"
            color="primary"
            component={Link}
            to={`/user/${post.userHandle}`}
          >
            {post.userHandle}
          </Typography>
          <Typography
            variant="body2"
            color="textSecondary"
          >
            <span>{moment(post.createdAt).calendar()}</span>
          </Typography>
          <Typography variant="body1">{post.body}</Typography>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles)(Post);
