import React from 'react'
import { useNavigate, Link } from 'react-router-dom'
import Cookies from 'js-cookie'

function Header() {
    const userId = Cookies.get('userId')
    const navigate = useNavigate()

    const onClickLogout = async () => {
    const userDetails = {userId}
    const url = 'https://shopping-cart-app-g9ye.onrender.com/users/logout'
    const options = {
      method: 'POST',
      headers : {"Content-Type" : "application/json"},
      body: JSON.stringify(userDetails),
    }
     const response = await fetch(url, options)
     if (response.ok){
        navigate("/login",  {replace : true})
        Cookies.remove('jwt_token')
     }

    }
    
  return (
    <div className='w-full h-[10vh] bg-blue-100 flex justify-between items-center p-5'>
        <h2>Shoppy</h2>
        <nav className='flex justify-between w-[200px]'>
          <Link to='/' className='text-purple-700 font-serif underline'>Home</Link>
          <Link to='/cart' className='text-lg text-purple-700 font-serif underline'>Cart</Link>
        </nav>
        <button className='bg-blue-500 text-white rounded w-[90px]' onClick={onClickLogout}>Logout</button>
    </div>
  )
}

export default Header