import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { Save, X, Loader2, ArrowLeft } from 'lucide-react'
import { toast } from 'react-toastify'

const Formproducts = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useStore()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: ''
  })

  useEffect(() => {
    if (id) {
      fetchProducto()
    }
  }, [id])

  const fetchProducto = async () => {
    setFetching(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      })
      
      if (!response.ok) {
        throw new Error('No se pudo cargar el producto')
      }

      const data = await response.json()
      setFormData({
        name: data.name || '',
        price: data.price || '',
        stock: data.stock || ''
      })
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar el producto')
      navigate('/private/productos')
    } finally {
      setFetching(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const url = id 
        ? `${import.meta.env.VITE_API_URL}/api/products/${id}`
        : `${import.meta.env.VITE_API_URL}/api/products`
      
      const response = await fetch(url, {
        method: id ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          name: formData.name,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
        })
      })

      if (!response.ok) {
        throw new Error('Error al guardar el producto')
      }

      toast.success(id ? 'Producto actualizado correctamente' : 'Producto creado correctamente')
      navigate('/private/productos')
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.message || 'Error al guardar el producto')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500" />
          <p className="mt-2 text-purple-300">Cargando producto...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/private/productos')}
          className="flex items-center gap-2 text-purple-300 hover:text-white transition-colors mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a productos
        </button>
        <h1 className="text-3xl font-bold text-white">
          {id ? 'Editar Producto' : 'Nuevo Producto'}
        </h1>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/20 space-y-6">
        <div>
          <label className="block text-purple-200 mb-2 font-medium">
            Nombre del Producto
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Ej: Laptop HP"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            required
            disabled={loading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-purple-200 mb-2 font-medium">
              Precio ($)
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              placeholder="0.00"
              step="0.01"
              min="0"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-purple-200 mb-2 font-medium">
              Stock (unidades)
            </label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              placeholder="0"
              min="0"
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-purple-300/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              required
              disabled={loading}
            />
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-6 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 hover:shadow-lg hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {id ? 'Actualizando...' : 'Creando...'}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {id ? 'Actualizar Producto' : 'Crear Producto'}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate('/private/productos')}
            disabled={loading}
            className="flex-1 sm:flex-none py-3 px-6 rounded-xl font-semibold text-white bg-white/10 border border-white/20 hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <X className="w-5 h-5" />
            Cancelar
          </button>
        </div>
      </form>
    </div>
  )
}

export default Formproducts