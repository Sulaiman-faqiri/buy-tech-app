import { NextResponse } from 'next/server'
import { connectToDb } from '../../../../lib/connectToDb'
import { Order } from '../../../../models/models'
import { revalidatePath } from 'next/cache'
export const dynamic = 'force-dynamic'
export const GET = async (request, { params }) => {
  const { orderId: userId } = params
  if (!userId) {
    return NextResponse.json(
      { message: 'User ID is required' },
      { status: 400 }
    )
  }

  try {
    await connectToDb()

    // Fetch orders for the specified user
    const userOrders = await Order.find({ userId }).populate({
      path: 'orderItems.productId',
      model: 'Product',
    })

    return NextResponse.json(userOrders, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Failed to fetch orders', error: err.message },
      { status: 500 }
    )
  }
}

export const PUT = async (request, { params }) => {
  const { orderId } = params

  try {
    const data = await request.json()
    const { orderStatus } = data

    // Validate order status
    const validStatuses = ['Pending', 'Delivered', 'Cancelled']
    if (!orderStatus || !validStatuses.includes(orderStatus)) {
      return NextResponse.json(
        { message: 'Invalid order status provided' },
        { status: 400 }
      )
    }

    await connectToDb()

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus },
      { new: true, runValidators: true }
    )

    if (!updatedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }
    revalidatePath('/dashboard/orders', 'page')
    revalidatePath('/dashboard', 'page')

    return NextResponse.json({
      message: 'Order status updated successfully',
      updatedOrder,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { message: 'Failed to update order', error: err.message },
      { status: 500 }
    )
  }
}
export const DELETE = async (request, { params }) => {
  const { orderId } = params

  try {
    await connectToDb()

    const deletedOrder = await Order.findByIdAndDelete(orderId)

    if (!deletedOrder) {
      return NextResponse.json({ message: 'Order not found' }, { status: 404 })
    }
    revalidatePath('/dashboard', 'page')
    revalidatePath('/dashboard/orders', 'page')

    return NextResponse.json(
      { message: 'Order deleted successfully' },
      { status: 200 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.error('Failed to delete order', { status: 500 })
  }
}
