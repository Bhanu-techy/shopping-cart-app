import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/login' element={<Login/>}/>
      <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
