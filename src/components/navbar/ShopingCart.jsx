'use client'
import Image from 'next/image'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import Button from '@mui/material/Button'
import CloseIcon from '@mui/icons-material/Close'
import IconButton from '@mui/material/IconButton'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
import './Navbar.scss'

function ShopingCart({
  showCart,
  setShowCart,
  cart,
  removeFromCart,
  addToCart,
  totalAmount,
  session,
}) {
  const router = useRouter()

  const handleCheckout = async () => {
    if (session.status !== 'authenticated') {
      router.push('/login')
      return
    }
    try {
      const response = await axios.post(`http://localhost:3000/api/checkout`, {
        cart,
        totalAmount,
        email: session.data.user.email,
      })
      window.location = response.data.url
    } catch (error) {
      console.error('Checkout error:', error)
      toast.error('Checkout failed')
    }
  }

  return (
    <div className={`shopingCart ${showCart ? 'openCart' : 'closeCart'}`}>
      <IconButton onClick={() => setShowCart((p) => !p)}>
        <CloseIcon />
      </IconButton>
      {cart.length < 1 && (
        <h4
          style={{
            textAlign: 'center',
          }}
        >
          No product is added.
        </h4>
      )}
      {cart.map((product) => {
        const { image, name, price, itemId, qty } = product
        return (
          <div className='shopItem' key={itemId}>
            <DeleteIcon
              color='error'
              sx={{
                cursor: 'pointer',
              }}
              onClick={() =>
                removeFromCart({
                  image,
                  name,
                  price,
                  itemId,
                  qty,
                })
              }
            />

            <div className='imgBox'>
              <Image src={image.src} alt={name} fill />
            </div>
            <h5>{name}</h5>
            <div className='box'>
              <AddIcon
                sx={{
                  cursor: 'pointer',
                }}
                onClick={() =>
                  addToCart({
                    image,
                    name,
                    price: price / qty,
                    itemId,
                    qty: qty + 1,
                  })
                }
              />
              <input value={qty} disabled />
              <RemoveIcon
                sx={{
                  cursor: 'pointer',
                }}
                onClick={() =>
                  removeFromCart({
                    image,
                    name,
                    price,
                    itemId,
                    qty,
                  })
                }
              />
            </div>

            <span>${price?.toFixed(1)}</span>
          </div>
        )
      })}
      <div className='checkout'>
        <Button onClick={handleCheckout}>Checkout</Button>
        <div className='total'>
          <span>Total :</span>
          <span>${totalAmount.toFixed(1)}</span>
        </div>
      </div>
    </div>
  )
}
export default ShopingCart
