import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();
export const verifyToken = (req, res, next) => {


  try {
     const authHeader = req.headers.authorization
    
    if (!authHeader) {
      return res.status(401).json({
        error: true,
        msg: "No se proporcionó token de autenticación"
      })
    }

    // Formato: "Bearer TOKEN"
    const token = authHeader.split(" ")[1]
    
    if (!token) {
      return res.status(401).json({
        error: true,
        msg: "Token inválido"
      })
    }

    const decoded = jwt.verify(token, process.env.SECRET)
    req.user = decoded
    next()
    
  } catch (error) {
    return res.status(403).json({
      error: true,
      msg: "Token inválido o expirado"
    })
  
  }
}