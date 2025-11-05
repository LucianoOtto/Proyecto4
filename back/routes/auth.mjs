import express from 'express'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../models/user.mjs'
import { authenticate } from '../middleware/auth.mjs'
import dotenv from 'dotenv'

dotenv.config()

export const authRoutes = express.Router()

// Registro
authRoutes.post('/register', async (req, res) => {
  const { fullName, email, password, confirmPassword } = req.body
  if (!fullName || !email || !password || !confirmPassword) return res.status(400).json({ message: 'Faltan datos' })

  if (password !== confirmPassword) return res.status(400).json({ message: 'Las contraseñas no coinciden' })
  if (String(password).length < 6) return res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' })

  try {
    const existing = await User.findOne({ where: { email } })
    if (existing) return res.status(409).json({ message: 'Usuario ya existe' })

    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
    const user = await User.create({ fullName, email, hash })
    return res.status(201).json({ message: 'Usuario creado', user: { id: user.id, fullName: user.fullName, email: user.email } })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Error en el servidor' })
  }
})

// Login
authRoutes.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ message: 'Faltan datos' })

  try {
    // Logging para depuración: no imprimir la contraseña en claro
    const maskedBody = { ...req.body, password: req.body.password ? '*****' : '' }
    console.log('[LOGIN] incoming request — ip:', req.ip, 'user-agent:', req.headers['user-agent'])
    console.log('[LOGIN] request body (masked):', maskedBody)
    const user = await User.findOne({ where: { email } })
    console.log('[LOGIN] user found:', user ? user.email : null, user ? { id: user.id, createdAt: user.createdAt } : null)
    if (!user) return res.status(401).json({ message: 'Credenciales inválidas' })

    const match = await bcrypt.compare(password, user.hash)
    console.log('[LOGIN] password match:', match)
    if (!match) return res.status(401).json({ message: 'Credenciales inválidas' })

    const payload = { id: user.id, email: user.email, fullName: user.fullName }
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'changeme', { expiresIn: '8h' })
    return res.json({ token })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Error en el servidor' })
  }
})

// Verificar token (protegido)
authRoutes.get('/verify-token', authenticate, async (req, res) => {
  try {
    return res.json({ user: req.user })
  } catch (err) {
    console.error('verify-token error', err)
    return res.status(500).json({ message: 'Error en el servidor' })
  }
})

// Verificar si hay usuarios registrados
authRoutes.get('/has-users', async (req, res) => {
  try {
    const count = await User.count()
    return res.json({ hasUsers: count > 0 })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Error en el servidor' })
  }
})

// Endpoint protegido de ejemplo: listar usuarios (solo admin/dev)
authRoutes.get('/users', authenticate, async (req, res) => {
  try {
    const users = await User.findAll({ attributes: ['id', 'fullName', 'email', 'isActivate', 'createdAt'] })
    return res.json(users)
  } catch (err) {
    console.error(err)
    return res.status(500).json({ message: 'Error en el servidor' })
  }
})

// Endpoint temporal de debug (solo en desarrollo): lista usuarios sin auth
authRoutes.get('/debug-users', async (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(403).json({ message: 'Forbidden' })
  try {
    const users = await User.findAll({ attributes: ['id', 'fullName', 'email', 'createdAt'] })
    return res.json({ users })
  } catch (err) {
    console.error('debug-users error', err)
    return res.status(500).json({ message: 'Error en el servidor' })
  }
})