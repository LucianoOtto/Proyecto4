import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../store/useStore'

const ProductosLista = () => {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useStore()

  useEffect(() => {
    fetchProductos()
  }, [])

  const fetchProductos = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/productos`, {
        headers: {
          'Authorization': user.token
        }
      })
      const data = await response.json()
      setProductos(data)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const eliminarProducto = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return

    try {
      await fetch(`${import.meta.env.VITE_API_URL}/productos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': user.token
        }
      })
      fetchProductos()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) return <div className="text-white text-center">Cargando...</div>

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-white">Productos</h1>
        <Link 
          to="/private/productos/nuevo"
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          + Nuevo Producto
        </Link>
      </div>

      <div className="grid gap-4">
        {productos.map(producto => (
          <div key={producto.id} className="bg-white/10 backdrop-blur-xl rounded-xl p-4 border border-white/20 flex justify-between items-center">
            <div>
              <h3 className="text-white font-semibold text-lg">{producto.nombre}</h3>
              <p className="text-purple-200 text-sm">{producto.descripcion}</p>
              <p className="text-white mt-2">Stock: {producto.stock} | Precio: ${producto.precio}</p>
            </div>
            <div className="flex gap-2">
              <Link 
                to={`/private/productos/editar/${producto.id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
              >
                Editar
              </Link>
              <button 
                onClick={() => eliminarProducto(producto.id)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
              >
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductosLista