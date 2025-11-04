import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Button } from './Button'

const ProductoForm = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useStore()
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    stock: ''
  })

  useEffect(() => {
    if (id) {
      fetchProducto()
    }
  }, [id])

  const fetchProducto = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/productos/${id}`, {
        headers: {
          'Authorization': user.token
        }
      })
      const data = await response.json()
      setFormData(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const url = id 
        ? `${import.meta.env.VITE_API_URL}/productos/${id}`
        : `${import.meta.env.VITE_API_URL}/productos`
      
      await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user.token
        },
        body: JSON.stringify(formData)
      })

      navigate('/private/productos')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        {id ? 'Editar Producto' : 'Nuevo Producto'}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-purple-200 mb-2">Nombre</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <div>
          <label className="block text-purple-200 mb-2">Descripción</label>
          <textarea
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="4"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-purple-200 mb-2">Precio</label>
            <input
              type="number"
              name="precio"
              value={formData.precio}
              onChange={handleChange}
              step="0.01"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div>
            <label className="block text-purple-200 mb-2">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" value={id ? 'Actualizar' : 'Crear'} />
          <button
            type="button"
            onClick={() => navigate('/private/productos')}
            className="w-full py-3 px-6 rounded-xl font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProductoForm