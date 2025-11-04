import { Router } from "express"
import { Product } from "../models/Product.mjs"
import { verifyToken } from '../middleware/auth.mjs'

export const productRoutes = Router()

// GET - Obtener todos los productos (PÚBLICO - sin login)
productRoutes.get("/", async (req, res) => {
  try {
    const products = await Product.findAll()
    res.json({
      error: false,
      data: products
    })
  } catch (error) {
    res.status(500).json({
      error: true,
      msg: "No se pudieron cargar los productos"
    })
  }
})

// GET - Obtener un producto por ID (PÚBLICO)
productRoutes.get("/:id", async (req, res) => {
  try {
    const product = await Product.findOne({
      where: { id: req.params.id }
    })
    
    if (!product) {
      return res.status(404).json({
        error: true,
        msg: "Producto no encontrado"
      })
    }

    res.json({
      error: false,
      product
    })

  } catch (error) {
    res.status(500).json({
      error: true,
      msg: "Hubo un error en el servidor"
    })
  }
})

// POST - Crear producto (PROTEGIDO - requiere login)
productRoutes.post("/", verifyToken, async (req, res) => {
  try {
    const body = req.body
    
    if (!body.name || !body.price || !body.stock) {
      return res.status(400).json({
        error: true,
        msg: "Todos los campos son obligatorios"
      })
    }
    
    const product = new Product({
      name: body.name,
      price: Number(body.price),
      stock: Number(body.stock)
    })
    
    await product.save()
    
    res.json({
      error: false,
      msg: "Producto creado exitosamente",
      product
    })
    
  } catch (err) {
    res.status(500).json({
      error: true,
      msg: err.message
    })
  }
})

// PUT - Actualizar producto (PROTEGIDO - requiere login)
productRoutes.put("/:id", verifyToken, async (req, res) => {
  try {
    const body = req.body
    const product = await Product.findOne({
      where: { id: req.params.id }
    })

    if (!product) {
      return res.status(404).json({
        error: true,
        msg: "No se puede actualizar, el producto no existe"
      })
    }

    product.name = body.name
    product.stock = body.stock
    product.price = body.price

    await product.save()

    res.json({
      error: false,
      msg: "Producto actualizado exitosamente",
      product
    })

  } catch (error) {
    res.status(500).json({
      error: true,
      msg: "Ocurrió un error al actualizar"
    })
  }
})

// DELETE - Eliminar producto (PROTEGIDO - requiere login)
productRoutes.delete("/:id", verifyToken, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    
    if (!product) {
      return res.status(404).json({
        error: true,
        msg: "Producto no encontrado"
      })
    }
    
    await product.destroy()

    res.json({
      error: false,
      msg: "Producto eliminado exitosamente"
    })
    
  } catch (error) {
    res.status(500).json({
      error: true,
      msg: "Ocurrió un error al eliminar"
    })
  }
})