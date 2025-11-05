import express from "express"
import "dotenv/config"
import cors from "cors"
import { sequelize } from './config/db.mjs'
import { authRoutes } from "./routes/auth.mjs"
import { productRoutes } from "./routes/product.mjs"
import { User } from './models/user.mjs'
import bcrypt from 'bcrypt'

const PORT = process.env.PORT ?? 3000
const app = express()

app.use(cors())
app.use(express.json())

// Rutas de autenticación
app.use("/api/auth", authRoutes)

// Rutas de productos
app.use("/api/products", productRoutes)

app.get('/', (req, res) => {
  res.json({ message: 'API backend funcionando. Rutas: /api/auth, /api/products' })
})

app.listen(PORT, async () => {
  try {
    console.log('Intentando conectar a la base de datos...')
    console.log('Configuración:', {
      database: process.env.NAME_DB,
      host: process.env.HOST_DB,
      port: process.env.PORT_DB,
      dialect: process.env.DIALECT_DB
    })
    
    await sequelize.sync() // sincroniza y crea tablas si no existen
    console.log("Base de datos conectada y tablas sincronizadas")
    console.log(`Servidor corriendo en http://localhost:${PORT}`)

    
    } catch (seedErr) {
      console.error('Error al comprobar/crear usuario administrador:', seedErr)
    }
  })
