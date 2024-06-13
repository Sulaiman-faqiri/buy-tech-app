'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Grid from '@mui/material/Unstable_Grid2'
import ProdItem from './ProdItem'
import ProductSkeleton from './ProductSkeleton'

import './Product.scss'

const Product = () => {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState('all')
  const [sortOption, setSortOption] = useState('')

  const handleSort = (event) => {
    setSortOption(event.target.value)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products?item=all`
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

  // Extract categories from products
  const categories = [...new Set(data?.map((item) => item.category))]

  const filteredProducts = data.filter((item) => {
    if (filter === 'all') {
      return true
    } else {
      return item.category === filter
    }
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOption === 'priceAsc') {
      return a.currentPrice - b.currentPrice
    } else if (sortOption === 'priceDsc') {
      return b.currentPrice - a.currentPrice
    } else if (sortOption === 'name') {
      return a.name.localeCompare(b.name)
    } else {
      return 0
    }
  })

  return (
    <div id='products' className='productSection'>
      <div>
        <h2>Complete Collection</h2>
        <p>
          Explore our entire tech collection, featuring the latest gadgets,
          devices, and accessories that will revolutionize the way you live and
          work.
        </p>
        <div className='filterBox'>
          <div className='btnBox'>
            <button
              className={filter === 'all' ? 'activeBtn' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>
            {categories.map((category, i) => {
              return (
                <button
                  key={i}
                  className={filter === category ? 'activeBtn' : ''}
                  onClick={() => setFilter(category)}
                >
                  {category}
                </button>
              )
            })}
          </div>
          <select name='filter' id='filter' onChange={handleSort}>
            <option className='opt' value=''>
              Sort
            </option>
            <option value='priceAsc'>Price Ascending</option>
            <option value='priceDsc'>Price Descending</option>
            <option value='name'>Name</option>
          </select>
        </div>
      </div>

      <Grid container spacing={1} className='productsBox'>
        {loading && <ProductSkeleton />}
        {!loading && error && <div>Something went wrong...</div>}
        {!loading && sortedProducts.length === 0 && (
          <div>No product found...</div>
        )}
        {!loading &&
          !error &&
          sortedProducts.map((item) => {
            return (
              <ProdItem
                curPrice={item.currentPrice}
                discountPercentage={item.discountPercentage}
                isDiscounted={item.isDiscounted}
                image={item.images[0]}
                name={item.name}
                itemId={item._id}
                outOfStock={item.outOfStock}
                key={item._id}
                id={item._id}
              />
            )
          })}
      </Grid>
    </div>
  )
}

export default Product
