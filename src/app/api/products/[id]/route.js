import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { Product } from '../../../../models/models'
import { connectToDb } from '../../../../lib/connectToDb'

export const GET = async (request, { params }) => {
  const { id } = params

  try {
    await connectToDb()
    const product = await Product.findOne({ _id: id })

    return NextResponse.json(product)
  } catch (err) {
    console.log(err)
    throw new Error('Failed to fetch product!')
  }
}

export const PUT = async (request, { params }) => {
  const { id } = params

  try {
    const {
      productName,
      prvPrice,
      curPrice,
      description,
      category,
      isNewArrival,
      isDiscounted,
      discountPercentage,
      discountEndDate,
      discountStartDate,
      stockQuantity,
      outOfStock,
      imgUrls,
    } = await request.json()
    if (!productName || !curPrice || !description || !category) {
      return NextResponse.json(
        { message: 'Product fields can not be empty!' },
        { status: 400 }
      )
    }
    connectToDb()
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        name: productName,
        description,
        category,
        images: imgUrls,
        currentPrice: +curPrice,
        previousPrice: prvPrice === 0 || prvPrice === '' ? null : +prvPrice,
        isNewArrival: !!isNewArrival,
        isDiscounted: !!isDiscounted,
        discountPercentage: isDiscounted ? +discountPercentage : null,
        discountStartDate: isDiscounted ? new Date(discountStartDate) : null,
        discountEndDate: isDiscounted ? new Date(discountEndDate) : null,
        stockQuantity: +stockQuantity,
        outOfStock,
      },

      {
        new: true, // Return the updated document
        runValidators: true, // Run validators to ensure data validity
      }
    )
    if (!updatedProduct) {
      return NextResponse.error('Product not found', { status: 404 })
    }
    revalidatePath('/dashboard/products')
    return NextResponse.json(updatedProduct)
  } catch (err) {
    console.error(err)
    return NextResponse.error('Failed to update product', { status: 500 })
  }
}
export const DELETE = async (request, { params }) => {
  const { id } = params

  try {
    connectToDb()

    const deletedProduct = await Product.findByIdAndDelete(id)

    if (!deletedProduct) {
      return NextResponse.error('Product not found', { status: 404 })
    }

    revalidatePath('/dashboard/products', 'page')

    return NextResponse.json({ message: 'Product deleted successfully' })
  } catch (err) {
    console.error(err)
    return NextResponse.error('Failed to delete product', { status: 500 })
  }
}
