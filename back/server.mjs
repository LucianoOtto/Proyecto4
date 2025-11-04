import express from "express"
import "dotenv/config"
import cors from "cors"
import { sequelize } from './config/db.mjs'
import { userRoutes } from "./routes/user.mjs"
import { productRoutes } from "./routes/products.mjs"

const PORT = process.env.PORT ?? 3001  // ← Cambiar esto
const app = express()
app.use(cors())
app.use(express.json())
app.use("/api/auth", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/auth", userRoutes)
app.use("/api/products", productRoutes)

// Debug: mostrar todas las rutas registradas
console.log('\n📋 Rutas registradas:');
app._router.stack.forEach((r) => {
  if (r.route) {
    console.log(`   ${Object.keys(r.route.methods)} /api/auth${r.route.path}`);
  } else if (r.name === 'router') {
    r.handle.stack.forEach((route) => {
      if (route.route) {
        const method = Object.keys(route.route.methods)[0].toUpperCase();
        console.log(`   ${method} ${r.regexp.source.replace('\\/?', '')}${route.route.path}`);
      }
    });
  }
});
console.log('\n');

app.listen(PORT, async () => {
  // ... resto del código
})

app.listen(PORT, async () => {
  try {
    await sequelize.sync({ alter: true })
    console.log("Base de datos conectada")
    console.log(`Servidor corriendo en http://localhost:${PORT}`)
  } catch (error) {
    console.log("Error en la conexión a la base de datos:", error)
  }
})