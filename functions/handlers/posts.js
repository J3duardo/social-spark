const firestore = require("../utilities/admin").firestore;

// Handler para tomar todos los posts
exports.getPosts = async (req, res) => {
  try {
    const postsSnapshot = await firestore.collection("posts").orderBy("createdAt", "desc").get()
    const posts = postsSnapshot.docs.map(docSnapshot => {
      return {
        id: docSnapshot.id,
        body: docSnapshot.data().body,
        userHandle: docSnapshot.data().userHandle,
        userImage: docSnapshot.data().userImage,
        createdAt: docSnapshot.data().createdAt,
        commentCount: docSnapshot.data().commentCount,
        likeCount: docSnapshot.data().likeCount
      }
    })
    return res.json({
      status: "OK",
      message: "Posts successfully fetched",
      data: posts
    });

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      data: error
    });
  }
}

// Handler para crear posts
exports.createPost = async (req, res) => {
  try {
    const newPost = {
      body: req.body.body,
      userHandle: req.user.handle,
      userImage: req.user.imageURL,
      commentCount: 0,
      likeCount: 0,
      createdAt: Date.now()
    }

    if(req.body.body === "") {
      return res.status(400).json({
        status: "failed",
        message: "validation error",
        data: {
          errors: {body: "Post content is required"}
        }
      })
    }

    const createdPost = await firestore.collection("posts").add(newPost);
    const createdPostDoc = await createdPost.get()

    return res.json({
      status: "OK",
      message: "Post created successfully",
      data: {
        id: createdPost.id,
        ...createdPostDoc.data()
      }
    });

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      data: error
    });
  }
}

// Handler para tomar un post específico
exports.getPost = async (req, res) => {
  let postData = {};
  let postComments = [];

  try {
    const postDoc = await firestore.collection("posts").doc(req.params.postId).get();

    if(!postDoc.exists) {
      return res.status(404).json({
        status: "error",
        message: "Post not found"
      })
    }

    postData = {
      id: postDoc.id,
      ...postDoc.data()
    }

    // Buscar comentarios del post
    const commentsSnapshot = await firestore.collection("comments").orderBy("createdAt", "desc").where("postId", "==", req.params.postId).get();
    commentsSnapshot.docs.forEach(docSnapshot => postComments.push(docSnapshot.data()));

    postData.comments = postComments;

    return res.json({
      status: "OK",
      data: {
        ...postData
      }
    })
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error
    })
  }
}

// Handler para borrar post
exports.deletePost = async (req, res) => {
  try {
    // Chequear si el post existe
    const post = await firestore.collection("posts").doc(req.params.postId).get();
    
    // Retornar con error 404 si el post no existe
    if(!post.exists) {
      return res.status(404).json({
        status: "failed",
        message: "Post not found"
      })
    }

    // Chequear si el post a borrar pertenece al usuario que trata de borrarlo
    if(post.data().userHandle !== req.user.handle) {
      return res.status(401).json({
        status: "failed",
        message: "You can delete only your own posts!"
      })
    }

    // Borrar el post sólo si éste pertenece al usuario
    await post.ref.delete();

    // Borrar comentarios asociados al post
    const commentsPromises = [];
    const postCommentsSnapshot = await firestore.collection("comments").where("postId", "==", req.params.postId).get();
    postCommentsSnapshot.docs.forEach(doc => commentsPromises.push(doc.ref.delete()));
    await Promise.all(commentsPromises);

    // Borrar likes asociados al post
    const likesPromises = [];
    const postLikesSnapshot = await firestore.collection("likes").where("postId", "==", req.params.postId).get();
    postLikesSnapshot.docs.forEach(doc => likesPromises.push(doc.ref.delete()));
    await Promise.all(likesPromises);

    return res.json({
      status: "OK",
      message: "Post deleted successfully"
    })

  } catch (error) {
    return res.status(500).json({
      status: "OK",
      message: "Internal server error",
      error: error
    })
  }
}

// Handler para agregar comentarios a los posts
exports.addComment = async (req, res) => {
  if(req.body.body.trim() === "") {
    return res.status(400).json({
      status: "failed",
      message: "Comment can't be empty"
    })
  }

  const newComment = {
    body: req.body.body,
    createdAt: Date.now(),
    postId: req.params.postId,
    userHandle: req.user.handle,
    userAvatar: req.user.imageURL
  }

  try {
    // Chequear si el post a comentar existe
    const post = await firestore.collection("posts").doc(req.params.postId).get();
    if(!post.exists) {
      return res.status(404).json({
        status: "failed",
        message: "Post not found"
      })
    }

    // Si existe, agregar el nuevo comentario
    const newCommentRef = await firestore.collection("comments").add(newComment);
    const comment = await newCommentRef.get()

    // Sumar el comentario al contador de comentarios del post
    const postData = post.data();
    postData.commentCount = postData.commentCount + 1;
    await post.ref.update({commentCount: postData.commentCount});

    return res.json({
      status: "OK",
      message: `Comment ${newCommentRef.id} added successfully to post ${post.id}`,
      data: {
        id: comment.id,
        ...comment.data()
      }
    })
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error
    })
  }
}

// Handler para agregar likes a los posts
exports.addLike = async (req, res) => {
  try {
    // Chequear si el post existe
    const post = await firestore.collection("posts").doc(req.params.postId).get();
  
    // Retornar con error 404 si el post no existe
    if(!post.exists) {
      return res.status(404).json({
        status: "failed",
        message: "Post not found"
      })
    }
  
    // Data del like a agregar
    const newLike = {
      userHandle: req.user.handle,
      postId: req.params.postId
    }
  
    // Chequear si el post ya tiene un like del usuario
    const likeDocSnapshot = await firestore.collection("likes").where("userHandle", "==", req.user.handle).where("postId", "==", req.params.postId).get();
  
    // Agregar el like al post si el like no existe
    if(likeDocSnapshot.empty) {
      await firestore.collection("likes").add(newLike);

      // Sumar el like al contador de likes del post
      const postData = post.data();
      postData.likeCount = postData.likeCount + 1;  
      await post.ref.update({likeCount: postData.likeCount});
  
      return res.json({
        status: "OK",
        data: {
          id: req.params.postId,
          ...postData
        }
      })
    }
  
    // Retornar con error si el usuario ya agregó un like al post
    return res.status(400).json({
      status: "failed",
      message: "Post already liked"
    })
    
  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error
    })
  }
}

// Handler para remover likes
exports.removeLike = async (req, res) => {
  try {
    // Chequear si el post existe
    const post = await firestore.collection("posts").doc(req.params.postId).get();

    // Retornar con error 404 si el post no existe
    if(!post.exists) {
      return res.status(404).json({
        status: "failed",
        message: "Post not found"
      })
    }

    // Buscar el like
    const likeDocSnapshot = await firestore.collection("likes").where("postId", "==", req.params.postId).where("userHandle", "==", req.user.handle).get();

    // Retornar con error si el usuario no ha agregado el like al post
    if(likeDocSnapshot.empty) {
      return res.status(400).json({
        status: "failed",
        message: "You have not liked this post"
      })
    }

    // Remover el like
    await likeDocSnapshot.docs[0].ref.delete();

    // Restar el like al contador de likes del post
    const postData = post.data();
    postData.likeCount = postData.likeCount - 1;  
    await post.ref.update({likeCount: postData.likeCount});

    return res.json({
      status: "OK",
      data: {
        id: req.params.postId,
          ...postData
      }
    })

  } catch (error) {
    return res.status(500).json({
      status: "failed",
      message: "Internal server error",
      error: error
    })
  }
}