import React, {useState} from "react";
import {Link} from "react-router-dom";
import {withStyles} from "@material-ui/core/styles";
import GenericIconButton from "./GenericIconButton";
import CreatePost from "./CreatePost";
import Notifications from "./Notifications";
import ListItemText from "@material-ui/core/ListItemText";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import MenuIcon from "@material-ui/icons/Menu";
import LoginIcon from "@material-ui/icons/ExitToApp";
import LogoutIcon from "@material-ui/icons/SettingsPower";
import HomeIcon from "@material-ui/icons/Home";

import {connect} from "react-redux";
import {logoutUser} from "../redux/actions/userActions";

const styles = (theme) => ({
  menuWrapper: {
    display: "none",
    [theme.breakpoints.down(550)]: {
      display: "block"
    },
  },
  menuIcon: {
    color: "#fff"
  },
  menuItem: {
    display: "flex",
    justifyContent: "flexStart",
    alignItems: "center"
  }
});

const MobileNav = (props) => {
  const [showMenu, setOpenMenu] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [openMobileNotifications, setOpenMobileNotifications] = useState(null);

  // Abrir el menú de navegación móvil
  const onClickHandler = (e) => {
    setOpenMenu(e.target)
  }
  
  // Cerrar el menú de navegación móvil
  const onCloseHandler = () => {
    setOpenMenu(false);
  }

  // Cerrar el modal de creación de posts en móvil
  const closeMobileModal = () => {
    setTimeout(() => {
      setOpenModal(false)
    }, 0)
  }

  // Abrir el modal de creación de posts en móvil
  const openMobileModal = () => {
    setOpenModal(true)
  }

  // Mostrar el menú de notificaciones en móvil
  const showNotificationsMobile = (e) => {
    setOpenMobileNotifications(e.target);
  }
  
  // Cerror el menú de notificaciones en móvil
  const closeNotificationsMobile = () => {
    setTimeout(() => {
      setOpenMobileNotifications(null)
    }, 0)
  }

  return (
    <div className={props.classes.menuWrapper}>
      <GenericIconButton tipTitle="Menu" onClick={onClickHandler}>
        <MenuIcon className={props.classes.menuIcon}/>
      </GenericIconButton>
      <Menu
        id="customized-menu"
        keepMounted
        open={Boolean(showMenu)}
        onClose={onCloseHandler}

        elevation={2}
        anchorEl={showMenu}
        getContentAnchorEl={null}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      > 
        {/* Botones en no auth del menú de navegación móvil */}
        {!props.auth &&
          <div>
            <Link style={{color: "rgb(125, 125, 125)"}} to="/login">
              <MenuItem onClick={onCloseHandler}>
                <ListItemIcon className={props.classes.menuItem}>
                  <LoginIcon style={{marginRight: "10px"}} fontSize="small" />
                  <ListItemText primary="Login" />
                </ListItemIcon>
              </MenuItem>
            </Link>
            <Link style={{color: "rgb(125, 125, 125)"}} to="/signup">
              <MenuItem onClick={onCloseHandler}>
                <ListItemIcon className={props.classes.menuItem}>
                  <LogoutIcon style={{marginRight: "10px"}} fontSize="small" />
                  <ListItemText primary="Signup" />
                </ListItemIcon>
              </MenuItem>
            </Link>
          </div>
        }
        
        {/* Botones en auth del menú de navegación móvil */}
        {props.auth &&
          <div>
            <MenuItem onClick={() => {onCloseHandler(); openMobileModal()}}>
              <ListItemIcon className={props.classes.menuItem}>
                <CreatePost showOnMobile={openModal} closeModal={closeMobileModal}/>
                <ListItemText primary="Create Post" />
              </ListItemIcon>
            </MenuItem>
              <MenuItem onClick={onCloseHandler}>
                <Link to="/">
                  <ListItemIcon className={props.classes.menuItem}>
                    <GenericIconButton tipTitle="Home">
                      <HomeIcon />
                    </GenericIconButton>
                    <ListItemText primary="Home" />
                  </ListItemIcon>
                </Link>
              </MenuItem>
            <MenuItem onClick={showNotificationsMobile}>
              <ListItemIcon className={props.classes.menuItem}>
                <Notifications showNotificationsMobile={openMobileNotifications} closeNotificationsMobile={closeNotificationsMobile} />
                <ListItemText primary="Notifications" />
              </ListItemIcon>
            </MenuItem>
            <MenuItem onClick={() => {onCloseHandler(); props.logout()}}>
              <ListItemIcon className={props.classes.menuItem}>
                <GenericIconButton tipTitle="Signout" >
                  <LogoutIcon />
                </GenericIconButton>
                <ListItemText primary="Logout" />
              </ListItemIcon>
            </MenuItem>
          </div>
        }
      </Menu>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.user.auth
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => {
      dispatch(logoutUser())
    }
  }
}

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(MobileNav));
