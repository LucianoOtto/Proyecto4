import { BrowserRouter, Routes, Route } from 'react-router'
import Public from './componentes/Public'
import Private from './componentes/Private'
import Login from './componentes/Login'
import Register from './componentes/Register'
import Listproducts from './componentes/Listproducts'
import Formproducts from './componentes/Formproducts'
import { ToastContainer } from "react-toastify"
const App = () => {
  return (
    <BrowserRouter>
  <Routes>
    <Route element={<Public />} path="/">
      <Route index element={<Login />} />
      <Route path="register" element={<Register />} />
    </Route>
    <Route element={<Private />} path="/private">
      <Route index element={<h1>Dashboard</h1>} />
      <Route path="productos" element={<Listproducts />} />
      <Route path="productos/nuevo" element={<Formproducts />} />
      <Route path="productos/editar/:id" element={<Formproducts />} />
    </Route>
    <Route path="*" element={<h1>404</h1>} />
  </Routes>
  <ToastContainer />
</BrowserRouter>
)}


export default App