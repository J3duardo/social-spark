import { LOADING_UI, SET_USER, SET_ERRORS, CLEAR_ERRORS } from "../types";
import axios from "axios";

export const loginUser = (userData, history) => {
  return async (dispatch) => {
    dispatch({type: LOADING_UI, payload: true});

    try {
      const response = await axios({
        method: "POST",
        url: "/login",
        data: {
          email: userData.email,
          password: userData.password
        }
      });
      
      localStorage.setItem("token", `Bearer ${response.data.data.token}`);

      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.data.token}`;

      dispatch(getUserData(history));
      
    } catch (error) {
      let apiError = null;

      // Errores de campos requeridos
      // En axios el objeto error.response.data es el error arrojado por la API
      if(error.response) {
        apiError = error.response.data
      }

      if(apiError && apiError.message.toLowerCase().includes("validation")) {
        dispatch({
          type: SET_ERRORS,
          payload: {
            errors: {...apiError.data.errors}
          }
        })

        return dispatch({type: LOADING_UI, payload: false})

        // Errores de credenciales
      } else if (apiError && apiError.message.includes("credentials")) {
        // Error de intentos de login excedidos
        if(apiError.data.includes("too-many-requests")) {
          dispatch({
            type: SET_ERRORS,
            payload: {
              errors: {
                general: "Too many login attempts. Try again later"
              }
            }
          });

          return dispatch({type: LOADING_UI, payload: false})
        }
        
        // Error de email inválido
        if(apiError.data.includes("not-found")) {
          dispatch({
            type: SET_ERRORS,
            payload: {
              errors: {
                email: "User doesn't exist"
              }
            }
          });

          return dispatch({type: LOADING_UI, payload: false})
        }

        // Error de contraseña equivocada
        if(apiError.data.includes("password")) {
          dispatch({
            type: SET_ERRORS,
            payload: {
              errors: {
                password: "Wrong password"
              }
            }
          });

          return dispatch({type: LOADING_UI, payload: false});
        }
      }

      // Errores generados en el servidor
      dispatch({
        type: SET_ERRORS,
        payload: {
          general: "Internal server error"
        }
      });

      return dispatch({type: LOADING_UI, payload: false});
    }
  }
}

export const getUserData = (history) => {
  return async (dispatch) => {
    try {
      const response = await axios({
        method: "GET",
        url: "/user"
      });
  
      dispatch({
        type: SET_USER,
        payload: response.data.data
      });

      dispatch({type: LOADING_UI, payload: false})
      dispatch({type: CLEAR_ERRORS})
      history.push("/");
      
    } catch (error) {
      if(error.response) {
        dispatch({type: LOADING_UI, payload: false})
        return dispatch({
          type: SET_ERRORS,
          payload: error.response.data
        });
      }

      dispatch({
        type: SET_ERRORS,
        payload: error
      });
    }
  }
}