import React from 'react'
import Header from './components/Header'
import { Outlet } from 'react-router-dom'
import Footer from './components/Footer'


function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default Layout