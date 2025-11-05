import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

export const authenticate = (req, res, next) => {
  const auth = req.headers.authorization
  
  if (!auth) {
    return res.status(401).json({ message: 'No se proporcionó token de autenticación' })
  }
  
  const parts = auth.split(' ')
  
  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Token error' })
  }
  
  const [scheme, token] = parts
  
  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Token malformado' })
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'changeme')
    req.user = payload
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido o expirado' })
  }
}