const admin = require("../utilities/admin").admin;
const firestore = require("../utilities/admin").firestore;

// Middleware de autenticación
exports.authMiddleware = async (req, res, next) => {
  let idToken = null;

  if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    idToken = req.headers.authorization.split("Bearer ")[1]
  } else {
    return res.status(403).json({
      status: "failed",
      message: "Unauthorized"
    })
  }

  try {
    // Verificar y decodificar el token
    // Almacenar el usuario extraído del token en el req
    const decodedToken = await admin.auth().verifyIdToken(idToken)
    req.user = decodedToken;
  
    // Tomar el handle del usuario y almacenarlo en el req
    const userSnapshot = await firestore.collection("users").where("userId", "==", req.user.uid).limit(1).get()
    req.user.handle = userSnapshot.docs[0].data().handle;
    req.user.imageURL = userSnapshot.docs[0].data().imageURL;
  
    return next()
    
  } catch (error) {
    return res.status(403).json({
      status: "failed",
      message: "Error verifying token",
      error: error
    })
  }
}