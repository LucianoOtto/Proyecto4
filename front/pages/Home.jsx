import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const { token, hasUsers } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Si no hay usuarios registrados, redirigir a registro
    if (!hasUsers) {
      navigate('/register')
      return
    }
    fetchProducts()
  }, [hasUsers])

  const fetchProducts = async () => {
    try {
      const res = await fetch('http://localhost:3000/api/products')
      const data = await res.json()
      setProducts(data)
    } catch (err) {
      console.error('Error al cargar productos:', err)
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return
    try {
      const res = await fetch(`http://localhost:3000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        setProducts(products.filter(p => p.id !== id))
      }
    } catch (err) {
      console.error('Error al eliminar:', err)
    }
  }

  if (loading) return <div className="text-center p-4">Cargando...</div>

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Productos</h1>
        {token && (
          <Link to="/add-product" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Agregar Producto
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No hay productos cargados</p>
          {token && (
            <Link to="/add-product" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600">
              Agregar el primer producto
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(product => (
            <div key={product.id} className="border rounded-lg p-4 shadow bg-white">
              <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
              <p className="text-gray-600">Precio: ${product.price}</p>
              <p className="text-gray-600 mb-4">Stock: {product.stock} unidades</p>
              
              {token && (
                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                  <Link 
                    to={`/edit-product/${product.id}`}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                  >
                    Editar
                  </Link>
                  <button
                    onClick={() => deleteProduct(product.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}