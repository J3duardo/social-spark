import React, { Component } from "react";
import {Link} from "react-router-dom";
import withStyle from "@material-ui/core/styles/withStyles";
import moment from "moment";

import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";

import NotificationsIcon from "@material-ui/icons/Notifications";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ChatIcon from "@material-ui/icons/Chat";

import {connect} from "react-redux";
import {markNotificationsRead} from "../redux/actions/userActions";

const styles = {
  "navIcon": {
    color: "#fff"
  }
}

class Notifications extends Component {
  state = {
    anchorEl: null,
    newNotification: false
  }

  unsubscribeFromNotifications = null;

  onMenuOpened = () => {
    // let unreadNotificationsIds = this.props.notifications.filter(notif => notif.read === false).map(notif => notif.id);

    // this.props.markNotificationsRead(unreadNotificationsIds)
    return 
  }

  openNotificationsHandler = (e) => {
    this.setState({
      anchorEl: e.target
    })
  }

  closeNotificationsHandler = () => {
    this.setState({
      anchorEl: null,
      newNotification: false
    })

    let unreadNotificationsIds = this.props.notifications.filter(notif => notif.read === false).map(notif => notif.id);
    this.props.markNotificationsRead(unreadNotificationsIds);
  }

  notificationsContent = () => {
    const unreadNotifications = this.props.notifications.filter(notif => notif.read === false)
    if(unreadNotifications.length > 0) {
      return (
        unreadNotifications.map(notif => {
          const type = notif.type === "like" ? "liked" : "commented on";
          const time = moment(notif.createdAt).calendar();
          const iconColor = notif.read ? "primary" : "secondary";
          const icon = notif.type === "like" ? <FavoriteIcon color={iconColor} style={{marginRight: "10px"}}/> : <ChatIcon color={iconColor} style={{marginRight: "10px"}}/>

          return (
            <MenuItem key={notif.id} onClick={this.closeNotificationsHandler}>
              {icon}
              <Typography
                component={Link}
                color="textSecondary"
                variant="body1"
                to={`user/${notif.recipient}/post/${notif.postId}`}>
                  {notif.sender} {type} your post | {time}
                </Typography>
            </MenuItem>
          )
        })
      )
    } else {
      return (
        <MenuItem onClick={this.closeNotificationsHandler}>
          <Typography variant="body1" color="textSecondary">
            You don't have new notifications
          </Typography>
        </MenuItem>
      )
    }
  }

  render() {
    const {notifications} = this.props;
    const {anchorEl} = this.state;

    const renderNotifications = () => {
      let unReadNotifications = []

      if(notifications.length > 0) {
        unReadNotifications = notifications.filter(notif => notif.read === false)
      }

      return (
        <Badge
          badgeContent={unReadNotifications.length}
          overlap="circle"
          color="secondary"
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
        >
          <NotificationsIcon className={this.props.classes.navIcon} />
        </Badge>
      )
    }

    return (
      <React.Fragment>
        <Tooltip title="Notifications">
          <IconButton
            aria-owns={anchorEl ? "simple-menu" : undefined}
            aria-haspopup="true"
            onClick={this.openNotificationsHandler}
          >
            {renderNotifications()}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={this.closeNotificationsHandler}
          onEntered={this.onMenuOpened}
        >
          {this.notificationsContent()}
        </Menu>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    notifications: state.user.notifications
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    markNotificationsRead: (data) => {
      dispatch(markNotificationsRead(data))
    }
  }
}

export default withStyle(styles)(connect(mapStateToProps, mapDispatchToProps)(Notifications));
