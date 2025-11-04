import { Router } from "express"
import { User } from '../models/User.mjs'
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import { verifyToken } from '../middleware/auth.mjs'

export const userRoutes = Router()

// Obtener todos los usuarios (protegido)
userRoutes.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['hash', 'activateToken'] }
    })
    
    res.json({
      error: false,
      users
    })
  } catch (error) {
    res.status(500).json({
      error: true,
      msg: "Error al obtener usuarios"
    })
  }
})

// Registro de usuario
userRoutes.post("/register", async (req, res) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body
    
    if (password !== confirmPassword) {
      return res.status(403).json({
        error: true,
        msg: "Las contraseñas no coinciden"
      })
    }
    
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const activateToken = "123"
    
    const user = new User({
      fullName,
      email,
      hash,
      activateToken
    })

    await user.save()
    
    res.json({
      error: false,
      msg: "Usuario creado exitosamente"
    })

  } catch (err) {
    res.status(400).json({
      error: true,
      msg: err.message
    })
  }
})

// Login
userRoutes.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    const user = await User.findOne({
      where: { email }
    })

    if (!user) {
      return res.status(404).json({
        error: true,
        msg: "El usuario no existe"
      })
    }

    const checkPasswd = await bcrypt.compare(password, user.hash)

    if (!checkPasswd) {
      return res.status(403).json({
        error: true,
        msg: "Contraseña incorrecta"
      })
    }

    const payload = {
      email: email,
      id: user.id
    }

    const token = jwt.sign(payload, process.env.SECRET)

    res.json({
      error: false,
      user: {
        fullName: user.fullName,
        email: user.email,
        token: `Bearer ${token}`
      }
    })
    
  } catch (error) {
    res.status(500).json({
      error: true,
      msg: "Hubo un error al iniciar sesión"
    })
  }
})

// Verificar token
userRoutes.get("/verify-token", async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader) {
      return res.json({ error: true })
    }
    
    const token = authHeader.split(" ")[1]
    const verify = jwt.verify(token, process.env.SECRET)

    if (!verify) {
      return res.json({ error: true })
    }

    res.json({
      error: false,
      user: verify
    })
    
  } catch (error) {
    res.json({ error: true })
  }
})