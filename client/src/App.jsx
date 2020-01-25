import React, {useEffect} from "react";
import "./App.scss";
import {MuiThemeProvider} from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import NavBar from "./components/NavBar";
import User from "./pages/User";

import jwtDecode from "jwt-decode";
import AuthRoute from "./components/AuthRoute";

import {Provider} from "react-redux";
import store from "./redux/store";
import {logoutUser, getUserData} from "./redux/actions/userActions";
import axios from "axios";

const theme = createMuiTheme({
  palette: {
    primary: {
      light: "#33c9dc",
      main: "#00bcd4",
      dark: "#008394",
      contrastText: "#fff"
    },
    secondary: {
      light: "#ff6333",
      main: "#ff3d00",
      dark: "#b22a00",
      contrastText: "#fff"
    }
  }
})

const App = () => {
  useEffect(() => {
    // Chequear si hay token en el storage
    if(localStorage.getItem("token")) {
      // Decodificar el token
      const decodedToken = jwtDecode(localStorage.getItem("token"))
      
      // Chequear si el token ha expirado
      if(decodedToken.exp * 1000 > Date.now()) {
        axios.defaults.headers.common["Authorization"] = localStorage.getItem("token");
        store.dispatch(getUserData());
      } else {
        store.dispatch(logoutUser());
      }
      
    } else {
      store.dispatch(logoutUser());
    }
  }, []);

  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <div className="global-wrapper">
          <BrowserRouter>
            <NavBar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={Home} />
                <AuthRoute exact path="/login" component={Login} />
                <AuthRoute exact path="/signup" component={Signup} />
                <AuthRoute exact path="/reset-password" component={ResetPassword} />
                <Route exact path="/user/:handle" component={User}/>
              </Switch>
            </div>
          </BrowserRouter>
        </div>
      </MuiThemeProvider>
    </Provider>
  );
}

export default App;
