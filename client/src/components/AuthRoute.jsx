import React from "react";
import {Route, Redirect} from "react-router-dom";
import {connect} from "react-redux";

const AuthRoute = ({component: Component, auth, ...rest}) => {
  return (
    <Route {...rest} render={(props) => auth ? <Redirect to="/" /> : <Component {...props} />} />
  );
}

const mapStateToProps = (state) => {
  return {
    auth: state.user.auth
  }
}

export default connect(mapStateToProps)(AuthRoute);
