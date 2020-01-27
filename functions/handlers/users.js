const admin = require("../utilities/admin").admin;
const firestore = require("../utilities/admin").firestore;
const firebase = require("firebase");
const {firebaseConfig} = require("../utilities/firebaseConfig");

firebase.initializeApp(firebaseConfig);

// Utilidades para validación de datos del usuario
const isEmpty = (string) => {
  if(string.trim() === "") {
    return true
  }
  return false;
}

const isEmail = (email) => {
  const regExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if(email.match(regExp)) {
    return true
  }

  return false
}

// Handler para registrar nuevo usuario
exports.userSignup = async (req, res) => {
  const newUser = {
    email: req.body.email.toLowerCase(),
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle,
    bio: req.body.bio,
    website: req.body.website,
    location: req.body.location
  }

  // Validar datos del usuario
  const errors = {}
  if(isEmpty(newUser.email)) {
    errors.email = "Email is required"
  }
  if(!isEmail(newUser.email)) {
    errors.email = "Invalid email"
  }
  if(isEmpty(newUser.password)) {
    errors.password = "Password is required"
  }
  if(newUser.password !== newUser.confirmPassword) {
    errors.confirmPassword = "Passwords don't match"
  }
  if(isEmpty(newUser.handle)) {
    errors.handle = "Handle is required"
  }

  // Chequear si hay errores de validación y retornar o continuar
  if(Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: "Error",
      message: "Validation error",
      data: {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
      }
    })
  }

  // Crear el nuevo nuevo usuario
  try {
    const userDoc = await firestore.doc(`/users/${newUser.handle}`).get();
    if(userDoc.exists) {
      return res.status(400).json({
        status: "failed",
        message: "Handle already taken"
      })
    } else {
      // Crear usuario
      const createdUser = await firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);

      // Tomar el token de autorización del usuario
      const token = await createdUser.user.getIdToken();

      const userCredentials = {
        userId: createdUser.user.uid,
        handle: newUser.handle,
        email: newUser.email,
        imageURL: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/default-user.png?alt=media`,
        bio: newUser.bio,
        location: newUser.location,
        website: newUser.website,
        createdAt: Date.now()
      }

      // Crear el documento del usuario
      await firestore.collection("users").doc(newUser.handle).set(userCredentials);

      return res.status(201).json({
        status: "OK",
        message: "User created successfully",
        data: {
          newUser: createdUser.user.uid,
          token: token
        }
      })
    }
  } catch (error) {
    if(error.code && error.code.includes("auth")) {
      return res.status(400).json({
        status: "failed",
        message: "Wrong credentials",
        data: error.code
      })
    }

    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      data: error
    })
  }
}

// Handler para iniciar sesión
exports.userLogin = async (req, res) => {
  const user = {
    email: req.body.email.toLowerCase(),
    password: req.body.password
  }

  // Validar datos del usuario
  const errors = {}
  if(isEmpty(user.email)) {
    errors.email = "Email is required"
  }
  if(!isEmail(user.email)) {
    errors.email = "Invalid email"
  }
  if(isEmpty(user.password)) {
    errors.password = "Password is required"
  }

  // Chequear si hay errores de validación y retornar o continuar
  if(Object.keys(errors).length > 0) {
    return res.status(400).json({
      status: "Error",
      message: "Validation error",
      data: {
        errors,
        valid: Object.keys(errors).length === 0 ? true : false
      }
    })
  }

  try {
    const loggedUser = await firebase.auth().signInWithEmailAndPassword(user.email, user.password)
    const token = await loggedUser.user.getIdToken();

    return res.json({
      status: "OK",
      message: "User logged in successfully",
      data: {
        userId: loggedUser.user.uid,
        token: token
      }
    })
  } catch (error) {
    if(error.code && error.code.includes("auth")) {
      return res.status(400).json({
        status: "failed",
        message: "Wrong credentials",
        data: error.code
      })
    }

    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      data: error
    })
  }
}

// Handler para cambiar la contraseña del usuario
exports.changePassword = async (req, res) => {
  try {
    const userRecord = await admin.auth().updateUser(req.body.uid, {
      password: req.body.password
    })

    return res.status(200).json({
      status: "OK",
      message: "Password updated successfully",
      data: userRecord
    })
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      data: error
    })
  }
}

// Handler para actualizar el avatar del usuario
exports.uploadImg = async (req, res) => {
  try {
    const userRef = firestore.collection("users").doc(req.user.handle);
    const BusBoy = require("busboy");
    const path = require("path");
    const os = require("os");
    const fs = require("fs");
  
    let imageFileName = null;
    let imageToUpload = {};
    let avatarUpdateDate = null;  
    
    // Data del usuario actual
    const userDoc = await userRef.get();
    
    // Extensión del avatar actual del usuario
    const imageUrlArray = userDoc.data().imageURL.split("?")[0].split(".");
    const avatarExtension = imageUrlArray[imageUrlArray.length - 1]
    
    // Si el usuario ya había actualizado su avatar, borrarlo del storage antes de guardar el nuevo avatar
    if(userDoc.data().avatarUpdateDate) {
      // Nombre del avatar actual
      const previousAvatarFilename = `user-${req.user.uid}-${userDoc.data().avatarUpdateDate}.${avatarExtension}`;
      
      // Borrar el avatar del storage
      await admin.storage().bucket().file(previousAvatarFilename).delete();
    }

    // Construir el nuevo avatar
    const busboy = new BusBoy({headers: req.headers});
  
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      if(mimetype !== "image/jpeg" && mimetype !== "image/png") {
        return res.status(400).json({
          status: "failed",
          message: "Wrong file type. File must be a .jpeg or .png image"
        })
      }

      avatarUpdateDate = Date.now();

      const imageExtension = filename.split(".")[filename.split(".").length - 1];
      
      imageFileName = `user-${req.user.uid}-${avatarUpdateDate}.${imageExtension}`;
      
      const filePath = path.join(os.tmpdir(), imageFileName);
      
      imageToUpload = {filePath, mimetype};
      
      file.pipe(fs.createWriteStream(filePath));
    })
    
    // Guardar el nuevo avatar en el storage
    busboy.on("finish", async () => {
      
      try {
        await admin.storage().bucket().upload(imageToUpload.filePath, {
          resumable: false,
          metadata: {
            metadata: {
              contentType: imageToUpload.mimetype
            }
          }
        });
    
        // URL del nuevo avatar
        const newImageURL = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
        
        // Actualizar el avatar en el documento del usuario
        await userRef.update({imageURL: newImageURL, avatarUpdateDate: avatarUpdateDate});
    
        return res.json({
          status: "OK",
          message: "Avatar updated successfully"
        })
        
      } catch (error) {
        return res.status(400).json({
          status: "failed",
          message: "Error updating avatar. Try again",
          error: error
        })
      }
    });

    busboy.end(req.rawBody);
    
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error
    })
  }
}

// Handler para agregar/actualizar detalles del perfil del usuario
exports.addUserDetails = async (req, res) => {
  const userDetails = {}

  // Validar data ingresada por el usuario
  if(!isEmpty(req.body.bio.trim())) {
    userDetails.bio = req.body.bio.trim()
  }

  if(!isEmpty(req.body.website.trim())) {
    if(!req.body.website.includes("http")) {
      userDetails.website = `http://${req.body.website.trim()}`
    } else {
      userDetails.website = req.body.website.trim()
    }
  }

  if(!isEmpty(req.body.location.trim())) {
    userDetails.location = req.body.location.trim()
  }

  // Actualizar perfil con los nuevos datos
  try {
    await firestore.collection("users").doc(req.user.handle).update({...userDetails});
  
    return res.json({
      status: "OK",
      message: "Profile updated successfully"
    })    
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error
    })
  }  
}

// Handler para tomar los detalles del perfil del usuario
exports.getUserDetails = async (req, res) => {
  let userData = {};
  try {
    const userDoc = await firestore.collection("users").doc(req.user.handle).get();
    if(userDoc.exists) {
      userData.credentials = userDoc.data();
      userData.likes = [];
      userData.notifications = [];
  
      // Buscar los likes del usuario en la colección likes
      const likesSnapshot = await firestore.collection("likes").where("userHandle", "==", req.user.handle).get();
      likesSnapshot.docs.forEach(docSnapshot => userData.likes.push(docSnapshot.data()));

      // Buscar las notificaciones del usuario
      const userNotificationsSnapshot = await firestore.collection("notifications").where("recipient", "==", req.user.handle).orderBy("createdAt", "desc").get();

      userNotificationsSnapshot.docs.forEach(doc => userData.notifications.push({id: doc.id, ...doc.data()}));
  
      return res.json({
        status: "OK",
        data: userData
      })
    }    
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error
    })
  }
}

// Handler para tomar el perfil de un usuario específico
exports.getSpecificUserDetails = async (req, res) => {
  try {
    const user = await firestore.collection("users").doc(req.params.handle).get();

    if(!user.exists) {
      return res.status(404).json({
        status: "failed",
        message: "User not found"
      })
    }

    // Buscar los post del usuario
    const userPosts = [];

    const userPostsSnapshot = await firestore.collection("posts").where("userHandle", "==", req.params.handle).orderBy("createdAt", "desc").get();

    userPostsSnapshot.docs.forEach(doc => userPosts.push({id: doc.id, ...doc.data()}));

    return res.json({
      status: "OK",
      message: "",
      data: {
        user: user.data(),
        userPosts
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      data: error
    })
  }
}

// Handler para marcar las notificaciones como leídas
exports.markNotificationsRead = async (req, res) => {
  try {
    let batch = firestore.batch();
    
    req.body.notifications.forEach(notificationId => {
      const notification = firestore.collection("notifications").doc(notificationId);

      batch.update(notification, {read: true})
    })

    await batch.commit();

    return res.json({
      status: "OK",
      message: "Notifications marked as read"
    })
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error
    })
  }
}