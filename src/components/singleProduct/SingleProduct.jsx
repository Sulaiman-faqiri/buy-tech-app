'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import './SingleProduct.scss'
import { useStore } from '../../lib/stateManagement'
const SingleProduct = ({ data }) => {
  const { addToCart } = useStore()
  const [currentImage, setCurrentImage] = useState(data.images[0].src)
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <div className='singleProduct'>
      <div className='images'>
        <div className='imgBox'>
          <Image
            src={currentImage}
            alt='singleProductImg'
            fill
            loading='lazy'
          />
        </div>
        <div className='smImgBox'>
          {data.images?.map((image, index) => (
            <div
              key={index}
              className={`smImg ${index === activeIndex ? 'activeImg' : ''}`}
              onMouseEnter={() => {
                setCurrentImage(image.src)
                setActiveIndex(index)
              }}
            >
              <Image src={image.src} alt={`singleProductImg-${index}`} fill />
            </div>
          ))}
        </div>
      </div>
      <div className='infoBox'>
        <h2>{data.name || 'Title'}</h2>
        <p>
          {data.description ||
            ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Ad quo
            soluta quae eos, eius, fugiat aliquam quisquam maxime ipsam illum
            saepe adipisci architecto provident commodi dolore dolorem accusamus
            nisi sit?`}
        </p>
        <div className='box'>
          {data.isDiscounted && (
            <span
              style={{
                textDecoration: 'tomato line-through',
                border: 'none',
                fontSize: 16,
                color: 'gray',
              }}
            >
              ${data.currentPrice}
            </span>
          )}

          <span>
            $
            {data.isDiscounted
              ? data.currentPrice -
                data.currentPrice * (data.discountPercentage / 100)
              : data.currentPrice}
          </span>
          {data.outOfStock && (
            <span style={{ color: 'red', fontWeight: 'bold' }}>
              Out of stock
            </span>
          )}
          {!data.outOfStock && (
            <button
              onClick={() =>
                addToCart({
                  image: data.images[0],
                  name: data.name,
                  price: data.isDiscounted
                    ? data.currentPrice -
                      data.currentPrice * (data.discountPercentage / 100)
                    : data.currentPrice,
                  itemId: data._id,
                  qty: 1,
                })
              }
            >
              Add to cart
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default SingleProduct
