import {useEffect, useState} from 'react'
import axios from 'axios'
import Cookies from 'js-cookie'
import Header from './Header'

function Cart() {

  const [cart, setCart] = useState([])

  const userId = Cookies.get("userId")

  useEffect(()=>{
    const getCartDetails = async () =>{
      axios.get(`http://localhost:5000/cart/${userId}`)
            .then((response) => {
                setCart(response.data)
            })
            .catch((err) => {
                console.log(err)
            });
    }
    getCartDetails()
  },[])

  console.log(cart)

  return (
    <>
    <Header/>
    <div className='flex flex-col justify-center items-center p-3 w-full'>
      <h1>My Cart</h1>
      <div className='flex justify-around bg-gray-200 w-[80%] p-2 m-2 rounded'>
        
      </div>
    </div>
    </>
  )
}

export default Cart