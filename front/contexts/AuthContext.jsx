import { createContext, useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [hasUsers, setHasUsers] = useState(true) // Para controlar si hay usuarios registrados
  const navigate = useNavigate()

  const login = (token, userData) => {
    localStorage.setItem('token', token)
    setToken(token)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
    navigate('/')
  }

  useEffect(() => {
    const checkInitialState = async () => {
      try {
        // Verificar si hay usuarios registrados
        const usersRes = await fetch('http://localhost:3000/api/auth/has-users')
        const { hasUsers: existingUsers } = await usersRes.json()
        setHasUsers(existingUsers)

        // Si no hay usuarios y no estamos en la página de registro, redirigir
        if (!existingUsers && window.location.pathname !== '/register') {
          navigate('/register')
        }

        // Si hay token, verificar si es válido
        if (token) {
          const res = await fetch('http://localhost:3000/api/auth/me', {
            headers: { 'Authorization': `Bearer ${token}` }
          })
          if (res.ok) {
            const data = await res.json()
            setUser(data)
          } else {
            logout()
          }
        }
      } catch (err) {
        console.error('Error al verificar estado inicial:', err)
        if (token) logout()
      } finally {
        setLoading(false)
      }
    }

    checkInitialState()
  }, [token])

  return (
    <AuthContext.Provider value={{ token, user, login, logout, loading, hasUsers }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}