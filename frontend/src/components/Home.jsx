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
        <div>
        <h1>Products</h1>
        <ul className='flex flex-wrap '>
            {items.map(each => (
                <li className='border rounded p-2 m-2 w-[200px]'>
                    <p>Item Name: {each.name}</p>
                    <p>Staus : {each.status}</p>
                </li>
            ))}
        </ul>
        </div>
    </>
  )
}

export default Home