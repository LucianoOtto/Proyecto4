
import express from 'express'
import { Product } from '../models/Product.mjs'
import { authenticate } from '../middleware/auth.mjs'

export const productRoutes = express.Router()

// GET - Obtener todos los productos (PÚBLICO - sin login)
productRoutes.get('/', async (req, res) => {
  try {
    const products = await Product.findAll()
    return res.json({
      error: false,
      data: products
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: true,
      msg: 'No se pudieron cargar los productos'
    })
  }
})

// GET - Obtener un producto por ID (PÚBLICO)
productRoutes.get('/:id', async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    
    if (!product) {
      return res.status(404).json({
        error: true,
        msg: 'Producto no encontrado'
      })
    }

    return res.json({
      error: false,
      product
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: true,
      msg: 'Hubo un error en el servidor'
    })
  }
})

// POST - Crear producto (PROTEGIDO - requiere login)
productRoutes.post('/', authenticate, async (req, res) => {
  try {
    const { name, price, stock } = req.body
    
    if (!name || price == null || stock == null) {
      return res.status(400).json({
        error: true,
        msg: 'Todos los campos son obligatorios'
      })
    }
    
    const product = await Product.create({
      name,
      price: Number(price),
      stock: Number(stock)
    })
    
    return res.status(201).json({
      error: false,
      msg: 'Producto creado exitosamente',
      product
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: true,
      msg: err.message
    })
  }
})

// PUT - Actualizar producto (PROTEGIDO - requiere login)
productRoutes.put('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)

    if (!product) {
      return res.status(404).json({
        error: true,
        msg: 'No se puede actualizar, el producto no existe'
      })
    }

    const { name, price, stock } = req.body
    await product.update({
      name: name ?? product.name,
      price: price ?? product.price,
      stock: stock ?? product.stock
    })

    return res.json({
      error: false,
      msg: 'Producto actualizado exitosamente',
      product
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: true,
      msg: 'Ocurrió un error al actualizar'
    })
  }
})

// DELETE - Eliminar producto (PROTEGIDO - requiere login)
productRoutes.delete('/:id', authenticate, async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id)
    
    if (!product) {
      return res.status(404).json({
        error: true,
        msg: 'Producto no encontrado'
      })
    }
    
    await product.destroy()

    return res.json({
      error: false,
      msg: 'Producto eliminado exitosamente'
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: true,
      msg: 'Ocurrió un error al eliminar'
    })
  }
})