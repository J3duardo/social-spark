import React, {useEffect} from "react";
import "./App.scss";
import {firestore} from "./firebase-client";
import {MuiThemeProvider} from "@material-ui/core/styles";
import createMuiTheme from "@material-ui/core/styles/createMuiTheme";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ResetPassword from "./pages/ResetPassword";
import NavBar from "./components/NavBar";
import User from "./pages/User";
import Profile from "./pages/Profile";
import PostPage from "./pages/PostPage";
import NotFound from "./pages/NotFound";

import jwtDecode from "jwt-decode";
import AuthRoute from "./components/AuthRoute";

import {Provider} from "react-redux";
import store from "./redux/store";
import {logoutUser, getUserData} from "./redux/actions/userActions";
import axios from "axios";

import {ADD_COMMENT, DELETE_COMMENT} from "./redux/types";
import {getPosts} from "./redux/actions/dataActions";

axios.defaults.baseURL = "https://us-central1-social-spark.cloudfunctions.net/api"

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
  },
  formContainer: {
    width: "90%",
    maxWidth: "500px",
    margin: "0 auto"
  },
  form: {
    justifyContent: "center",
    textAlign: "center"
  },
  socialIconContainer: {
    width: "70px",
    margin: "0 auto 10px auto"
  },
  socialIcon: {
    display: "block",
    width: "100%"
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

    // Cargar los posts
    store.dispatch(getPosts());

    // Escuchar cuando se agregan o eliminan comentarios y actualizar la interfaz en tiempo real
    const unsubscribeFromComments = firestore.collection("comments").onSnapshot((snapshot) => {
      snapshot.docChanges().forEach(change => {
        if(change.type === "added") {
          store.dispatch({type: ADD_COMMENT, payload: {id: change.doc.id, ...change.doc.data()}})
        }

        if(change.type === "removed") {
          store.dispatch({type: DELETE_COMMENT, payload: {id: change.doc.id, ...change.doc.data()}})
        }
      })
    });

    return () => {
      unsubscribeFromComments();
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
                <Route exact path="/profile" component={Profile} />
                <Route exact path="/user/:handle" component={User}/>
                <Route exact path="/user/:handle/post/:postId" component={PostPage}/>
                <Route path="/*" component={NotFound}/>
              </Switch>
            </div>
          </BrowserRouter>
        </div>
      </MuiThemeProvider>
    </Provider>
  );
}

export default (App);
