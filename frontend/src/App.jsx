import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './components/Login'
import Home from './components/Home'
import './App.css'

function App() {

  return (
    <BrowserRouter>
    <Routes>
      <Route path='/' element={<Login/>}/>
      <Route path='/home' element={<Home/>} />
    </Routes>
    </BrowserRouter>
  )
}

export default App
