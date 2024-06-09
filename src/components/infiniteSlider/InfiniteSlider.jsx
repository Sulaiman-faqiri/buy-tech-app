'use client'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import axios from 'axios'
import ProductSkeleton from '../productsSection/ProductSkeleton'
import Link from 'next/link'
import './InfiniteSlider.scss'
import { useStore } from '../../lib/stateManagement'

const InfiniteSlider = () => {
  const { addToCart } = useStore()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`
        )
        setData(response.data.products)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setError(error.message)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filter the products to get only discounted ones
  const discountedProducts = data.filter((product) => product.isDiscounted)
  const trackWidth =
    loading || error || discountedProducts.length === 0
      ? '100%'
      : `calc(300px * ${discountedProducts.length})`
  const animationStyle =
    loading || error || discountedProducts.length < 3
      ? 'none'
      : 'scroll 10s linear infinite'
  const sliderBoxClass =
    discountedProducts.length > 4 ? 'sliderBox hasPseudoElements' : 'sliderBox'

  return (
    <div id='showcase' className='sliderSection'>
      <h2>Exclusive Discounts</h2>
      <div className={sliderBoxClass}>
        <div
          className='slideTrack'
          style={{
            width: trackWidth,
            animation: animationStyle,
          }}
        >
          {!error &&
            !loading &&
            discountedProducts?.map((product) => {
              const discountedPrice =
                product.currentPrice -
                product.currentPrice * (product.discountPercentage / 100)
              return (
                <div className='slideItem' key={product._id}>
                  <Image src={product.images[0].src} alt={product.name} fill />
                  <div className='info'>
                    <div className='box'>
                      <h4>{product.name}</h4>
                      <span
                        style={{
                          textDecoration: 'red line-through',
                          border: 'none',
                        }}
                      >
                        ${product.currentPrice}
                      </span>
                      <span>${discountedPrice.toFixed(2)}</span>
                      <AddShoppingCartIcon
                        onClick={() =>
                          addToCart({
                            image: product.images[0],
                            name: product.name,
                            price: product.isDiscounted
                              ? product.currentPrice -
                                product.currentPrice *
                                  (product.discountPercentage / 100)
                              : product.currentPrice,
                            itemId: product._id,
                            qty: 1,
                          })
                        }
                      />
                      <Link href={'products/' + product._id}>
                        View more information
                      </Link>
                    </div>
                  </div>
                  {product.discountPercentage && (
                    <div className='bage'>
                      <div className='ribbon text-center'>
                        {product.discountPercentage}%
                        <br />
                        OFF
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

          {!loading && error && <h4>Error:{error}</h4>}
          {!loading && discountedProducts.length < 1 && (
            <h4>No Products discounted</h4>
          )}
          {loading && <ProductSkeleton />}
        </div>
      </div>
    </div>
  )
}

export default InfiniteSlider
