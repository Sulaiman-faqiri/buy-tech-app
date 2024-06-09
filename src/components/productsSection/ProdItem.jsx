import Image from 'next/image'
import Grid from '@mui/material/Unstable_Grid2'
import Link from 'next/link'
import { useStore } from '../../lib/stateManagement'

const ProdItem = ({ image, name, prvPrice, curPrice, itemId, outOfStock }) => {
  const { addToCart } = useStore()

  const addProductToCart = () => {
    addToCart({ image, name, price: curPrice, itemId, qty: 1 })
  }
  return (
    <Grid className='prodItem'>
      <div className='imgBox'>
        <Link href={'products/' + itemId}>
          <Image src={image.src} alt={name} fill loading='lazy' />
        </Link>
      </div>
      <div className='info'>
        <h4>{name}</h4>
        <div className='price'>
          {!prvPrice == 0 && <span className='prvPrice'>${prvPrice}</span>}
          <span className='curPrice'>${curPrice}</span>
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
