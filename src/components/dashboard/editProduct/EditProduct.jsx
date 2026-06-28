'use client'
import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios'
import { formatFileSize } from '../addNewUser/AddNewUser'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import '../addNewProduct/AddNewProduct.scss'
import LeftBoxInputs from '../addNewProduct/LeftBoxInputs'
import RightBoxImages from '../addNewProduct/RightBoxImages'
import { v4 as uuidv4 } from 'uuid'

const EditProduct = ({ editMode, editData, prodId, categories }) => {
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
  const [uploadProgress, setUploadProgress] = useState(Array(5).fill(0))
  const [error, setError] = useState(false)
  const [imgError, setImgError] = useState('')
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
    discountStartDate: '',
    discountEndDate: '',
    stockQuantity: '',
  })
  const [removedImages, setRemovedImages] = useState([])

  useEffect(() => {
    if (editMode) {
      setFormData({
        productName: editData.name ?? '',
        prvPrice: editData.previousPrice ?? '',
        curPrice: editData.currentPrice ?? '',
        description: editData.description ?? '',
        category: editData.category ?? '',
        isNewArrival: editData.isNewArrival ?? false,
        isDiscounted: editData.isDiscounted ?? false,
        discountPercentage: editData.discountPercentage ?? '',
        discountStartDate: editData.discountStartDate ?? '',
        discountEndDate: editData.discountEndDate ?? '',
        stockQuantity: editData.stockQuantity ?? '',
      })

      const editedImages = editData.images.concat(
        Array.from({ length: 5 - editData.images.length }, () => ({
          name: null,
          size: null,
          src: null,
          file: null,
        }))
      )
      setImages(editedImages)
    }
  }, [editData, editMode])

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

  const removeImage = (index) => {
    const newImages = [...images]
    const removedImage = newImages[index]
    newImages[index] = { name: null, size: null, src: null, file: null }
    setImages(newImages)

    setRemovedImages((prevRemovedImages) => [
      ...prevRemovedImages,
      removedImage,
    ])
  }

  const submitForm = async (e) => {
    e.preventDefault()

    const formDataToSubmit = {
      ...formData,
      imgUrls: [],
    }
    console.log(formDataToSubmit)
    const { productName, curPrice, description, category } = formDataToSubmit
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
      setError(true)
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

    const formImages = images.filter((item) => item.src !== null)
    setFormSubmitted(true)

    try {
  const uploadedImageURLs = await Promise.all(
  formImages.map(async (img, i) => {
    // Existing image, keep it
    if (!img.file) {
      return img
    }

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
      updated[i] = 100
      return updated
    })

    return {
      name: img.name,
      size: img.size,
      src: data.url,
    }
  })
)

      formDataToSubmit.imgUrls.push(...uploadedImageURLs)

      await Promise.all(
  removedImages.map(async (removedImage) => {
    if (removedImage.src && !removedImage.file) {
      await fetch('/api/upload/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: removedImage.src,
        }),
      })
    }
  })
)

      await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products/${prodId}`,
        formDataToSubmit
      )
      router.push('/dashboard/products')
      router.refresh('/dashboard/products')
      toast.success('Product is updated successfully')
    } catch (error) {
      setFormSubmitted(false)
      console.error('Error sending data to backend:', error)
      toast.error('Failed to update product')
    }
  }

  return (
    <div className='addNewProduct'>
      <h2>Edit Product</h2>
      <form onSubmit={submitForm}>
        <div className='bigBox'>
          <LeftBoxInputs
            setFormData={setFormData}
            formData={formData}
            error={error}
            formSubmitted={formSubmitted}
            editMode={editMode}
            categories={categories}
          />
          <RightBoxImages
            images={images}
            handleImages={handleImages}
            removeImage={removeImage}
            imgError={imgError}
            inputRefs={inputRefs}
            uploadProgress={uploadProgress}
            editMode={editMode}
          />
        </div>
      </form>
    </div>
  )
}

export default EditProduct
