import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'
import { Product } from '../../../models/models'
import { connectToDb } from '../../../lib/connectToDb'
export const dynamic = 'force-dynamic'

export const GET = async (request) => {
  try {
    const url = new URL(request.url)
    const query = url.searchParams.get('query') || ''
    const itemParam = url.searchParams.get('item') || ''
    let page = parseInt(url.searchParams.get('page'))
    page = page > 0 ? page : 1
    const ITEM_PER_PAGE = 9

    await connectToDb()

    const filter = query ? { name: { $regex: query, $options: 'i' } } : {}
    const count = await Product.countDocuments(filter)

    let products

    if (itemParam === 'all') {
      products = await Product.find(filter).populate('category')
    } else {
      products = await Product.find(filter)
        .populate('category')
        .limit(ITEM_PER_PAGE)
        .skip(ITEM_PER_PAGE * (page - 1))
    }

    const now = new Date()

    const productsWithCategoryName = await Promise.all(
      products.map(async (product) => {
        if (
          product.isDiscounted &&
          product.discountEndDate &&
          now > new Date(product.discountEndDate)
        ) {
          product.isDiscounted = false
          product.discountPercentage = null
          product.discountStartDate = null
          product.discountEndDate = null
          await product.save()
        }

        product.outOfStock = product.stockQuantity === 0

        if (product.isModified()) {
          await product.save()
        }

        return {
          ...product._doc,
          category: product.category.name,
        }
      })
    )

    return NextResponse.json(
      { ITEM_PER_PAGE, count, products: productsWithCategoryName },
      { status: 200 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.error('Failed to fetch products', { status: 500 })
  }
}

export const POST = async (req, res) => {
  try {
    const {
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
    } = await req.json()

    if (
      !productName.trim() ||
      +curPrice < 1 ||
      +stockQuantity < 1 ||
      !description.trim() ||
      !category.trim()
    ) {
      return NextResponse.json(
        { message: 'Product fields cannot be empty!' },
        { status: 400 }
      )
    }

    await connectToDb()

    const newProduct = new Product({
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
    })

    await newProduct.save()

    revalidatePath('/dashboard/categories', 'page')
    revalidatePath('/dashboard', 'page')

    return NextResponse.json(
      { message: 'Product has been created successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.log(err)
    return NextResponse.json(
      { message: 'Failed to create the product!' },
      { status: 500 }
    )
  }
}
