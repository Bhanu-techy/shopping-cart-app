import {useEffect, useState} from 'react'
import Header from './Header'
import axios from 'axios';

function Home() {
    const [items, setItems] = useState([])

    useEffect(()=>{
        const getItems = async () => {
            axios.get("https://shopping-cart-app-g9ye.onrender.com/items")
            .then((response) => {
                setItems(response.data)
            })
            .catch((err) => {
                console.log(err)
            });
        }
        getItems()
    },[])

  return (
    <>
    <Header/>
        <div className='p-3'>
        <h1 className='text-center text-3xl font-serif text-orange-500 m-3'>Products List</h1>
        <ul className='flex flex-wrap m-2'>
            {items.map(each => (
                <li className='shadow-lg shadow-purple-200 rounded p-3 m-5 w-[240px] h-[90px] hover:shadow-yellow-200 flex flex-col justify-center items-center'>
                    <p>Product Name: {each.name}</p>
                    <p>Status : {each.status}</p>
                </li>
            ))}
        </ul>
        </div>
    </>
  )
}

export default Home