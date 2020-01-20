import React, {useState, useEffect} from "react";
import "./App.scss";
import {MuiThemeProvider} from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NavBar from "./components/NavBar";
import jwtDecode from "jwt-decode";
import AuthRoute from "./components/AuthRoute";

import {Provider} from "react-redux";
import store from "./redux/store";

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

const App = (props) => {
  const [token, setToken] = useState(null);
  const [auth, setAuth] = useState(false);

  useEffect(() => {
    if(localStorage.getItem("token")) {
      const decodedToken = jwtDecode(localStorage.getItem("token"))
      setToken(decodedToken)
      if(decodedToken.exp * 1000 > Date.now()) {
        setAuth(true)
      }
    } else setAuth(false)
  }, []);

  return (
    <Provider store={store}>
      <MuiThemeProvider theme={theme}>
        <div>
          <BrowserRouter>
            <NavBar />
            <div className="container">
              <Switch>
                <Route exact path="/" component={Home} />
                <AuthRoute exact isAuth={auth} path="/login" component={Login} />
                <AuthRoute exact isAuth={auth} path="/signup" component={Signup} />
              </Switch>
            </div>
          </BrowserRouter>
        </div>
      </MuiThemeProvider>
    </Provider>
  );
}

export default App;
