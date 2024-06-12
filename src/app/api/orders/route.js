import { NextResponse } from 'next/server'
import { Order, Product } from '../../../models/models'
import { connectToDb } from '../../../lib/connectToDb'
import { revalidatePath } from 'next/cache'

export const dynamic = 'force-dynamic'

export const GET = async (request) => {
  try {
    const url = new URL(request.url)
    const query = url.searchParams.get('query') || ''
    let page = parseInt(url.searchParams.get('page'))
    page = page > 0 ? page : 1
    const ITEM_PER_PAGE = 9

    await connectToDb()

    const filter = query
      ? { customerName: { $regex: query, $options: 'i' } }
      : {}

    const count = await Order.countDocuments(filter)

    let orders = await Order.find(filter)
      .populate({
        path: 'orderItems.productId',
        populate: { path: 'category' }, // Populate the category reference in product
      })
      .limit(ITEM_PER_PAGE)
      .skip(ITEM_PER_PAGE * (page - 1))

    // Apply discount to each product's price in the order items
    for (let order of orders) {
      for (let orderItem of order.orderItems) {
        const product = await Product.findById(orderItem.productId)

        if (product) {
          console.log(orderItem)
          let discountedPrice = product.currentPrice

          // Check if the product has a discount
          if (product.isDiscounted) {
            const discountPercentage = product.discountPercentage || 0
            discountedPrice =
              product.currentPrice * (1 - discountPercentage / 100)
          }

          // Update order item prices
          orderItem.unitPrice = discountedPrice
          orderItem.totalPrice = discountedPrice * orderItem.quantity
        }
      }
    }

    return NextResponse.json({ ITEM_PER_PAGE, count, orders }, { status: 200 })
  } catch (err) {
    console.log(err.message)
    return NextResponse.error('Failed to fetch orders', { status: 500 })
  }
}

export const POST = async (req) => {
  try {
    const {
      userId,
      customerName,
      productName,
      productImg,
      quantity,
      unitPrice,
      totalPrice,
      orderStatus,
    } = await req.json()

    // Validate required fields
    if (
      !userId ||
      !customerName ||
      !productName ||
      !quantity ||
      !unitPrice ||
      !totalPrice
    ) {
      return NextResponse.json(
        {
          message: 'Order fields cannot be empty!',
        },
        { status: 400 }
      )
    }

    // Create new order
    const newOrder = new Order({
      userId,
      customerName,
      productName,
      productImg,
      quantity,
      unitPrice,
      totalPrice,
      orderStatus: orderStatus || 'Pending', // Default to 'Pending' if orderStatus is not provided
    })

    // Save the order to the database
    await newOrder.save()
    revalidatePath('/dashboard', 'page')
    revalidatePath('/dashboard/orders', 'page')
    return NextResponse.json({
      message: 'Order created successfully',
      order: newOrder,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.error({ message: 'Failed to create order' })
  }
}
