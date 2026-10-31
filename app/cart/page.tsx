import CartPage from '@/components/pages/Cart/cart'
import Footer from '@/components/pages/Footer/footer'
import Header from '@/components/pages/Header/header'
import React from 'react'
import HeaderLanding from '../dashboard/landing/headerLanding';

// import Header from '../header'
// import CartPage from '@/component/Cart/cart'
// import Footer from '@/component/Footer/footer'

const Cart = () => {
  return (
    <>
    
    <HeaderLanding />
    <CartPage />
    <Footer />
    
    </>
  )
}

export default Cart