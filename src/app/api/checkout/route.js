import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { connectToDb } from '../../../lib/connectToDb'
import { Order, Product, User } from '../../../models/models'
import { revalidatePath } from 'next/cache'
export const dynamic = 'force-dynamic'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(req) {
  const { cart, email } = await req.json()
  try {
    await connectToDb()
    const user = await User.findOne({ email })
    if (!user) {
      throw new Error('User not found')
    }

    // Create an order with references to products
    const orderItems = await Promise.all(
      cart.map(async (item) => {
        const product = await Product.findById(item.itemId)
        if (!product) {
          throw new Error(`Product with id ${item.itemId} not found`)
        }

        let unitPrice = +product.currentPrice
        if (product.isDiscounted && product.discountPercentage) {
          unitPrice = unitPrice - (unitPrice * product.discountPercentage) / 100
        }

        return {
          productId: item.itemId,
          quantity: +item.qty,
          unitPrice: unitPrice,
          totalPrice: unitPrice * +item.qty,
        }
      })
    )

    const order = new Order({
      userId: user._id,
      customerName: user.username,
      address: '', // Address will be updated after Stripe session
      phoneNumber: '', // Phone number will be updated after Stripe session
      orderItems: orderItems,
    })

    await order.save()

    // Create a Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      billing_address_collection: 'required',
      phone_number_collection: {
        enabled: true,
      },
      customer_email: email,
      line_items: cart.map((item) => {
        const product = orderItems.find(
          (orderItem) => orderItem.productId.toString() === item.itemId
        )
        return {
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              images: [item.image.src],
            },
            unit_amount: Math.round(product.unitPrice * 100),
          },
          quantity: item.qty,
        }
      }),
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/?status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/?status=canceled`,
      metadata: {
        orderId: order._id.toString(),
      },
    })

    revalidatePath('/dashboard', 'page')

    return NextResponse.json(
      { id: session.id, url: session.url },
      { headers: corsHeaders }
    )
  } catch (err) {
    console.error('Error creating Stripe session:', err)
    return NextResponse.error({ error: err.message }, { status: 500 })
  }
}
