const functions = require('firebase-functions');
const firestoreDB = require("./utilities/admin").firestore;

// Handlers de los posts
const {getPosts, createPost, getPost, addComment, deleteComment, addLike, removeLike, deletePost} = require("./handlers/posts");

// Handlers de los usuarios
const {userSignup, userLogin, uploadImg, addUserDetails, getUserDetails, getSpecificUserDetails, markNotificationsRead, changePassword, changeEmail} = require("./handlers/users");

// Middleware
const {authMiddleware} = require("./middleware/auth");

// App de express
const express = require("express");
const app = express();


//----------------------------//
//---- Rutas de los posts ----//
//----------------------------//

// Tomar todos los posts
app.get("/posts", getPosts);

// Crear post
app.post("/posts", authMiddleware, createPost);

// Tomar un post específico por su ID
app.get("/post/:postId", getPost);

// Borrar post
app.delete("/post/:postId", authMiddleware, deletePost);

// Agregar comentarios a los posts
app.post("/post/:postId/comment", authMiddleware, addComment);

// Eliminar comentarios
app.post("/post/:postId/comment/:commentId", authMiddleware, deleteComment);

// Agregar likes a los posts
app.get("/post/:postId/like", authMiddleware, addLike);

// Remover likes a los posts
app.get("/post/:postId/unlike", authMiddleware, removeLike);


//-------------------------------//
//---- Rutas de los usuarios ----//
//-------------------------------//

// Registrar nuevo usuario
app.post("/signup", userSignup);

// Iniciar sesión
app.post("/login", userLogin);

// Cambiar la contraseña del usuario
app.post("/change-password", authMiddleware, changePassword);

// Cambiar el email del usuario
app.post("/change-email", authMiddleware, changeEmail)

// Actualizar el avatar del usuario
app.post("/users/image", authMiddleware, uploadImg);

// Agregar detalles del usuario
app.post("/user", authMiddleware, addUserDetails);

// Tomar los detalles del perfil del usuario autenticado
app.get("/user", authMiddleware, getUserDetails);

// Tomar los detalles del perfil de un usuario mediante su handle
app.get("/user/:handle", getSpecificUserDetails);

// Marcar notificaciones como leídas
app.post("/notifications", authMiddleware, markNotificationsRead);


//---------------------//
//-- Cloud functions --//
//---------------------//

// Router para manejar las rutas de la app
exports.api = functions.https.onRequest(app);

// Crear notificaciones al agregar likes a los posts
exports.createNotificationOnLike = functions.firestore.document("likes/{id}").onCreate(async (snapshot) => {
  try {
    // Buscar el post al que se le dio like
    const postDoc = await firestoreDB.collection("posts").doc(snapshot.data().postId).get();
  
    // Crear la notificación de like sólo si el usuario que da el like no es el mismo autor del post
    // Esto es para evitar que el usuario sea notificado cuando él mismo da like a sus propios posts
    if(postDoc.exists && (postDoc.data().userHandle !== snapshot.data().userHandle)) {
      return await firestoreDB.collection("/notifications").doc(snapshot.id).set({
        id: snapshot.id,
        recipient: postDoc.data().userHandle,
        sender: snapshot.data().userHandle,
        postId: postDoc.id,
        type: "like",
        read: false,
        createdAt: Date.now()
      });
  
      return;
    }    
  } catch (error) {
    console.log(error);
    return;
  }
});

// Borrar notificación de like cuando el usuario remueve el like al post
exports.deleteNotificationOnLike = functions.firestore.document("likes/{id}").onDelete(async (snapshot) => {
  try {
    return await firestoreDB.collection("notifications").doc(snapshot.id).delete(); 

  } catch (error) {
    console.log(error);
    return;
  }
})

// Crear notificación cuando se agregan comentarios a los posts
exports.createNotificationOnComment = functions.firestore.document("comments/{id}").onCreate(async (snapshot) => {
  try {
    // Buscar el post comentado
    const postDoc = await firestoreDB.collection("posts").doc(snapshot.data().postId).get();

    // Crear la notificación de comentario sólo si el usuario que comenta no es el mismo autor del post
    // Esto es para evitar que el usuario sea notificado cuando él mismo comenta sus propios posts
    if(postDoc.exists && (postDoc.data().userHandle !== snapshot.data().userHandle)) {
      return await firestoreDB.collection("notifications").doc(snapshot.id).set({
        id: snapshot.id,
        recipient: postDoc.data().userHandle,
        sender: snapshot.data().userHandle,
        postId: postDoc.id,
        type: "comment",
        read: false,
        createdAt: Date.now()
      });
    }  
    
  } catch (error) {
    console.log(error);
    return;
  }
})

// Actualizar posts y comentarios cuando el usuario actualiza su avatar
exports.updateUserPostsAndComments = functions.firestore.document("users/{handle}").onUpdate(async (snapshot, context) => {
  try {
    // Handle del usuario que actualizó su avatar
    const userHandle = context.params.handle;

    // Documento actualizado del usuario
    const updatedUser = snapshot.after;

    // Actualizar los posts y comentarios sólo cuando el usuario actualiza su avatar
    if(snapshot.before.data().imageURL !== updatedUser.data().imageURL) {
      // Posts del usuario
      const userPostsSnapshot = await firestoreDB.collection("posts").where("userHandle", "==", userHandle).get();
      // Comentarios del usuario
      const userCommentsSnapshot = await firestoreDB.collection("comments").where("userHandle", "==", userHandle).get();
  
      // Actualizar avatar del usuario en sus posts
      const postsPromises = [];
      userPostsSnapshot.docs.forEach(doc => postsPromises.push(doc.ref.update({userImage: updatedUser.data().imageURL})));
      await Promise.all(postsPromises);
  
      // Actualizar avatar del usuario en sus comentarios
      const commentsPromises = [];
      userCommentsSnapshot.docs.forEach(doc => commentsPromises.push(doc.ref.update({userAvatar: updatedUser.data().imageURL}))); 
      return await Promise.all(commentsPromises);
    }

    return true;
    
  } catch (error) {
    console.log(error);
    return true;
  }
})

// Borrar comentarios, likes y notificaciones al borrar el post al que están asociados
exports.deletePostRelatedData = functions.firestore.document("posts/{postId}").onDelete(async (snapshot, context) => {  
  try {
    // ID del post que se eliminó
    const deletedPost = context.params.postId;

    // Buscar los comentarios asociados post que se borró
    const commentsPromises = [];
    const postCommentsSnapshot = await firestoreDB.collection("comments").where("postId", "==", deletedPost).get();
    postCommentsSnapshot.docs.forEach(doc => commentsPromises.push(doc.ref.delete()));

    // Buscar los likes asociados al post que se borró
    const likesPromises = [];
    const postLikesSnapshot = await firestoreDB.collection("likes").where("postId", "==", deletedPost).get();
    postLikesSnapshot.docs.forEach(doc => likesPromises.push(doc.ref.delete()));

    // Buscar las notificaciones asociadas al post que se borró
    const notificationsPromises = [];
    const postNotificationsSnapshot = await firestoreDB.collection("notifications").where("postId", "==", deletePost).get();
    postNotificationsSnapshot.docs.forEach(doc => notificationsPromises.push(doc.ref.delete()));

    // Borrar todos los comentarios, los likes y las notificaciones del post
    await Promise.all([...commentsPromises, ...likesPromises, ...notificationsPromises]);
    return true;

  } catch (error) {
    console.log(error);
    return true
  }
})