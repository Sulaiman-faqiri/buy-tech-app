import { Skeleton } from '@mui/material'
import React from 'react'

const ProductSkeleton = () => {
  return (
    <div className='skeletonBox'>
      <div className='box'>
        <Skeleton variant='rounded' width={270} height={250} />
        <Skeleton variant='text' width={100} height={20} />
        <Skeleton variant='text' width={50} height={20} />
      </div>
      <div className='box'>
        <Skeleton variant='rounded' width={270} height={250} />
        <Skeleton variant='text' width={100} height={20} />
        <Skeleton variant='text' width={50} height={20} />
      </div>
      <div className='box'>
        <Skeleton variant='rounded' width={270} height={250} />
        <Skeleton variant='text' width={100} height={20} />
        <Skeleton variant='text' width={50} height={20} />
      </div>
      <div className='box'>
        <Skeleton variant='rounded' width={270} height={250} />
        <Skeleton variant='text' width={100} height={20} />
        <Skeleton variant='text' width={50} height={20} />
      </div>
      <div className='box'>
        <Skeleton variant='rounded' width={270} height={250} />
        <Skeleton variant='text' width={100} height={20} />
        <Skeleton variant='text' width={50} height={20} />
      </div>
    </div>
  )
}

export default ProductSkeleton
