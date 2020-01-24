import { LOADING_UI, SET_USER, SET_ERRORS, CLEAR_ERRORS, SET_UNAUTH, UPDATE_NOTIFICATIONS, MARK_NOTIFICATIONS_READ } from "../types";
import axios from "axios"

// Action para procesar login
export const loginUser = (userData, history) => {
  return async (dispatch) => {
    dispatch({type: LOADING_UI, payload: true});

    try {
      // Procesar el login en el servidor
      const response = await axios({
        method: "POST",
        url: "/login",
        data: {
          email: userData.email,
          password: userData.password
        }
      });
      
      // Guardar el token en el localStorage
      localStorage.setItem("token", `Bearer ${response.data.data.token}`);

      // Asignar el token de autorización en los headers de los requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.data.token}`;

      // Tomar la data del perfil del usuario
      return dispatch(getUserData(history));
      
    } catch (error) {
      let apiError = null;

      // Errores de campos requeridos
      // En axios el objeto error.response.data es el error arrojado por la API
      if(error.response) {
        apiError = error.response.data;

        // Errores de validación
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
      } else {
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
}

// Action para procesar signup
export const signupUser = (userData, history) => {
  return async (dispatch) => {
    try {
      dispatch({type: LOADING_UI, payload: true});

      // Procesar el signup en el servidor
      const response = await axios({
        method: "POST",
        url: "/signup",
        data: {
          email: userData.email,
          password: userData.password,
          confirmPassword: userData.confirmPassword,
          handle: userData.handle,
          bio: userData.bio,
          website: userData.website,
          location: userData.location
        }
      });
      
      // Guardar el token en el localStorage
      localStorage.setItem("token", `Bearer ${response.data.data.token}`);

      // Asignar el token de autorización en los headers de los requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${response.data.data.token}`;

      //Tomar la data del perfil del usuario
      dispatch(getUserData(history));

    } catch (error) {
      let apiError = null;

      if(error.response) {
        apiError = error.response.data;

        // Errores de validación de email, contraseña y handle
        if(apiError && apiError.message.toLowerCase().includes("validation")) {
          dispatch({
            type: SET_ERRORS,
            payload: {
              errors: {
                ...apiError.data.errors
              }
            }
          });
  
          return dispatch({type: LOADING_UI, payload: false});
  
        } else if (apiError && apiError.message.toLowerCase().includes("handle")) {
          dispatch({
            type: SET_ERRORS,
            payload: {
              errors: {
                handle: "Handle already in use"
              }
            }
          });
  
          return dispatch({type: LOADING_UI, payload: false});
  
          // Errores de credenciales
        } else if (apiError && apiError.message.includes("credentials")) {            
          // Error de email inválido
          if(apiError.data.includes("email-already-in-use")) {
            dispatch({
              type: SET_ERRORS,
              payload: {
                errors: {
                  email: "Email already in use"
                }
              }
            });
    
            return dispatch({type: LOADING_UI, payload: false});
          }
  
          // Error de contraseña débil
          if(apiError.data.includes("weak-password")) {
            dispatch({
              type: SET_ERRORS,
              payload: {
                errors: {
                  password: "Password must be at least 6 characters long"
                }
              }
            });
    
            return dispatch({type: LOADING_UI, payload: false});
          }
        }
      } else {
        // Errores generados en el servidor
        dispatch({
          type: SET_ERRORS,
          payload: {
            errors: {
              general: "Internal server error"
            }
          }
        });
  
        return dispatch({type: LOADING_UI, payload: false}); 
      }
    }
  }
}

// Action para procesar logout
export const logoutUser = () => {
  return (dispatch) => {
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    dispatch({type: SET_UNAUTH})
  }
}

// Action para obtener la data del perfil del usuario autenticado
export const getUserData = (history) => {
  return async (dispatch) => {
    dispatch({type: LOADING_UI, payload: true})

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

// Action para cambiar el avatar del usuario
export const uploadImage = (formData) => {
  return async (dispatch) => {
    dispatch({type: LOADING_UI, payload: true});

    try {
      await axios({
        method: "POST",
        url: "/users/image",
        data: formData
      });
  
      dispatch(getUserData())
      
    } catch (error) {
      console.log(error)
    }
  }
}

// Action para actualizar el perfil del usuario
export const updateProfile = (data) => {
  return async (dispatch) => {
    dispatch({type: LOADING_UI, payload: true});

    try {
      await axios({
        method: "POST",
        url: "/user",
        data: data
      })
  
      dispatch(getUserData())
      
    } catch (error) {
      console.log(error);
      dispatch({type: LOADING_UI, payload: false});
    }
  }
}

// Action para actualizar las notificaciones del usuario
export const updateNotifications = (notification) => {
  return {
    type: UPDATE_NOTIFICATIONS,
    payload: notification
  }
}

// Action para marcar las notificationes como leídas
export const markNotificationsRead = (data) => {
  return async (dispatch) => {
    try {
      await axios({
        method: "POST",
        url: "/notifications",
        data: {
          notifications: data
        }
      });
      dispatch({type: MARK_NOTIFICATIONS_READ})
    } catch (error) {
      console.log(error, {...error})
    }
  }
}