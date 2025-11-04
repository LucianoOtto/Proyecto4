import { Outlet, useNavigate } from 'react-router'
import { useEffect, useState } from 'react'
import { useStore } from '../store/useStore'

const Public = () => {
  const { user, setUser } = useStore()
  const navigate = useNavigate()
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    async function verifyUser() {
      if (!user?.token) {
        setIsVerifying(false)
        return
      }

      try {
        const url = `${import.meta.env.VITE_API_URL}/verify-token`
        const config = {
          method: "GET",
          headers: {
            'content-type': "application/json",
            'authorization': user.token
          }
        }

        const req = await fetch(url, config)
        const res = await req.json()

        if (res.error) {
          setUser({
            full_name: null,
            token: null,
            email: null
          })
          setIsVerifying(false)
          return
        }

        navigate("/private")
      } catch (error) {
        console.error('Error verificando token:', error)
        setUser({
          full_name: null,
          token: null,
          email: null
        })
        setIsVerifying(false)
      }
    }

    verifyUser()
  }, [user?.token, navigate, setUser])

  return (
    <div className="min-h-screen bg-gray-700 flex items-center justify-center p-4 relative overflow-hidden">


      <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

     
      <div className="relative z-10 w-full max-w-md">

        <div className="text-center mb-8 space-y-2">
          
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Stock Manager
          </h1>
          <p className="text-purple-200 text-sm">
            Sistema de Gestión de Productos
          </p>
        </div>

        {isVerifying ? (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-12 text-center">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-purple-200/30 border-t-purple-500 rounded-full animate-spin"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 border-4 border-pink-200/30 border-t-pink-500 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1s' }}></div>
              </div>
              <div className="space-y-1">
                <p className="text-white font-semibold text-lg">Verificando sesión</p>
                <p className="text-purple-200 text-sm">Por favor espera un momento...</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/10 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-8 transform transition-all duration-500 hover:shadow-purple-500/20 hover:shadow-3xl">
            <Outlet />
          </div>
        )}
      </div>
    </div>
  )
}

export default Public