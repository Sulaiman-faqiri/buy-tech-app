'use client'
import { useEffect, useState } from 'react'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { Badge } from '@mui/material'
import Link from 'next/link'
import { useStore } from '../../lib/stateManagement' // Update with the correct path to your store file
import { signOut, useSession } from 'next-auth/react'
import ShopingCart from './ShopingCart'
import { toast } from 'sonner'
import './Navbar.scss'

const Navbar = () => {
  const session = useSession()
  const { totalAmount, cart, removeFromCart, addToCart, clearCart } = useStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showCart, setShowCart] = useState(false)
  const [prevTotalAmount, setPrevTotalAmount] = useState(0)
  const [cartCountIncreased, setCartCountIncreased] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [successPayment, setSuccessPayment] = useState('nothing')

  // Ensure the component is mounted before accessing client-side state
  useEffect(() => {
    setIsMounted(true)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const status = params.get('status')
    if (status === 'success') {
      setSuccessPayment('success')
    }
    if (status === 'canceled') {
      setSuccessPayment('canceled')
    }

    if (successPayment === 'success') {
      toast.success('Payment completed')
      clearCart()
      params.delete('status')
      window.history.replaceState({}, '', `${window.location.pathname}`)
    }
    if (successPayment === 'canceled') {
      toast.error('Something went wrong!')
      params.delete('status')
      window.history.replaceState({}, '', `${window.location.pathname}`)
    }
  }, [clearCart, successPayment])

  useEffect(() => {
    setCartCountIncreased(true)
    setPrevTotalAmount(totalAmount)
    const timeout = setTimeout(() => setCartCountIncreased(false), 300)
    return () => clearTimeout(timeout)
  }, [totalAmount, prevTotalAmount])

  if (!isMounted) return null
  return (
    <nav className='nav'>
      <Link href={'/'}>
        <h2 className='logo'>BuyTech</h2>
      </Link>

      <div onClick={() => setMenuOpen((p) => !p)} className='menu-icon'>
        <input className='menu-icon__cheeckbox' type='checkbox' />
        <div>
          <span></span>
          <span></span>
        </div>
      </div>

      <ul
        style={{ left: menuOpen ? 0 : '' }}
        className={`${
          session?.status === 'authenticated' ? 'ulBig ' : 'ulSmall'
        }`}
      >
        <div className='centerPart'>
          <li onClick={() => setMenuOpen(false)}>
            <Link className='active' href='/'>
              Home
            </Link>
          </li>
          <li onClick={() => setMenuOpen(false)}>
            <a href='#showcase'>Showcase</a>
          </li>
          <li onClick={() => setMenuOpen(false)}>
            <a href='#products'>Products</a>
          </li>
          {session.status === 'authenticated' && (
            <li onClick={() => setMenuOpen(false)}>
              <Link
                className='active'
                href={`/orders/${session.data?.user.id}`}
              >
                Orders
              </Link>
            </li>
          )}
          {session.data?.user.isAdmin && (
            <li onClick={() => setMenuOpen(false)}>
              <Link className='active' href='/dashboard'>
                Dashboard
              </Link>
            </li>
          )}
        </div>
        <div className='rightPart'>
          <li onClick={() => setMenuOpen(false)} className='login'>
            {session.status === 'authenticated' ? (
              <Link href='#' onClick={() => signOut()}>
                Logout
              </Link>
            ) : (
              <Link href='/login'>Login</Link>
            )}
          </li>
          <li className='addToCart'>
            <Badge
              badgeContent={cart.length}
              color='primary'
              onClick={() => setShowCart((p) => !p)}
              className={`${cartCountIncreased && 'bump-up'}`}
            >
              <ShoppingCartIcon />
            </Badge>

            {showCart && (
              <ShopingCart
                showCart={showCart}
                setShowCart={setShowCart}
                cart={cart}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                totalAmount={totalAmount}
                session={session}
              />
            )}
          </li>
        </div>
      </ul>
    </nav>
  )
}

export default Navbar
