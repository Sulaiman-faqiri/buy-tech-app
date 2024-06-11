import Image from 'next/image'
import Grid from '@mui/material/Unstable_Grid2'
import Link from 'next/link'
import { useStore } from '../../lib/stateManagement'

const ProdItem = ({
  image,
  name,
  curPrice,
  itemId,
  outOfStock,
  discountPercentage,
  isDiscounted,
  id,
}) => {
  const { addToCart } = useStore()

  const addProductToCart = () => {
    addToCart({ image, name, price: curPrice, itemId, qty: 1 })
  }
  const discountedPrice = curPrice - curPrice * (discountPercentage / 100)
  return (
    <Grid className='prodItem' key={id}>
      <div className='imgBox'>
        <Link href={'products/' + itemId}>
          <Image src={image.src} alt={name} fill loading='lazy' />
        </Link>
      </div>
      <div className='info'>
        <h4>{name}</h4>
        <div className='price'>
          {isDiscounted && <span className='prvPrice'>${curPrice}</span>}
          <span className='curPrice'>
            ${isDiscounted ? discountedPrice?.toFixed(0) : curPrice}
          </span>
          {outOfStock && (
            <span style={{ color: 'red', fontWeight: 'bold' }}>
              out of stock
            </span>
          )}
        </div>
        {!outOfStock && <button onClick={addProductToCart}>Add to cart</button>}
      </div>
    </Grid>
  )
}

export default ProdItem
