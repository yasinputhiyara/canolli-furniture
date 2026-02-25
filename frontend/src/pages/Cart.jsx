

import React from 'react'
import { useSelector } from 'react-redux'
import {} from "../features/cart/cartSlice"


const Cart = () => {

    const {items} = useSelector((state)=> state.items)


  return (
    <div>
      
    </div>
  )
}

export default Cart
