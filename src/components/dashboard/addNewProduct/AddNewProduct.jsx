'use client'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { formatFileSize } from '../addNewUser/AddNewUser'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import LeftBoxInputs from './LeftBoxInputs'
import RightBoxImages from './RightBoxImages'
import { v4 as uuidv4 } from 'uuid'
import './AddNewProduct.scss'

const AddNewProduct = ({ categories }) => {
  const router = useRouter()
  const inputRefs = useRef([null, null, null, null, null])
  const [images, setImages] = useState(
    Array.from({ length: 5 }, () => ({
      name: null,
      size: null,
      src: null,
      file: null,
    }))
  )
  const [error, setError] = useState(false)
  const [imgError, setImgError] = useState('')
  const [uploadProgress, setUploadProgress] = useState(Array(5).fill(0))
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    productName: '',
    prvPrice: '',
    curPrice: '',
    description: '',
    category: 'select a category',
    isNewArrival: false,
    isDiscounted: false,
    discountPercentage: '',
    discountStartDate: null,
    discountEndDate: null,
    stockQuantity: '',
  })

  const handleImages = (index, { target: { files } }) => {
    if (files[0]) {
      const { name, size } = files[0]
      const newImages = [...images]
      newImages[index] = {
        name: `${uuidv4()}_${name}`,
        size: formatFileSize(size),
        src: URL.createObjectURL(files[0]),
        file: files[0],
      }
      setImages(newImages)
    }
  }

  const submitForm = async (e) => {
    e.preventDefault()

    const formDataToSubmit = {
      ...formData,
      imgUrls: [],
    }
    const {
      productName,
      prvPrice,
      curPrice,
      description,
      category,
      isNewArrival,
      isDiscounted,
      discountPercentage,
      discountStartDate,
      discountEndDate,
      stockQuantity,
    } = formDataToSubmit

    const hasUploadedImages = images.some((image) => image.src !== null)
    const hasBigSize = images.some(
      (img) => img.file && img.file.size > 2 * 1024 * 1024
    )
    if (
      !productName.trim() ||
      +curPrice < 1 ||
      +stockQuantity < 1 ||
      !description.trim() ||
      !category.trim()
    ) {
      setError('Please fill out all the fields')
      return
    }

    if (isDiscounted && (+discountPercentage > 99 || discountPercentage < 1)) {
      setError('Discount percentage cannot be > 99 or < 1')
      return
    }

    setError(false)

    if (!hasUploadedImages) {
      setImgError('Please upload at least one image')
      return
    }

    if (hasBigSize) {
      setImgError('Image size should be less than 2MB')
      return
    }

    setImgError(false)
    const imgUrls = []
   const formImages = images.filter((item) => item.src !== null)

setFormSubmitted(true)

try {
  const imgUrls = await Promise.all(
    formImages.map(async (img, index) => {

const form = new FormData()
   form.append('file', img.file) 

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      })

      if (!response.ok) {
        throw new Error('Failed to upload image')
      }

      const data = await response.json()

      setUploadProgress((prev) => {
        const updated = [...prev]
        updated[index] = 100
        return updated
      })

      return {
        name: img.name,
        size: img.size,
        src: data.url,
      }
    })
  )

  await axios.post('/api/products', {
    productName,
    prvPrice,
    curPrice,
    description,
    category,
    imgUrls,
    isNewArrival,
    isDiscounted,
    discountPercentage,
    discountStartDate,
    discountEndDate,
    stockQuantity,
  })

  toast.success('Product added successfully')

  router.push('/dashboard/products')
  router.refresh()
} catch (error) {
  console.error(error)

  setFormSubmitted(false)

  toast.error('Failed to upload product')
}
  }

  return (
    <div className='addNewProduct'>
      <h2> Add New Product</h2>
      <form onSubmit={submitForm}>
        <div className='bigBox'>
          <LeftBoxInputs
            setFormData={setFormData}
            formData={formData}
            error={error}
            formSubmitted={formSubmitted}
            categories={categories}
          />
          <RightBoxImages
            images={images}
            handleImages={handleImages}
            imgError={imgError}
            inputRefs={inputRefs}
            uploadProgress={uploadProgress}
          />
        </div>
      </form>
    </div>
  )
}

export default AddNewProduct
