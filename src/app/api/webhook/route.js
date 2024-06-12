import Stripe from 'stripe'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { connectToDb } from '../../../lib/connectToDb'
import { Order, Product } from '../../../models/models'
import { revalidatePath } from 'next/cache'
export const dynamic = 'force-dynamic'
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(req) {
  const body = await req.text()
  const signature = headers().get('Stripe-Signature')
  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    )
  } catch (error) {
    return new NextResponse(`Webhook errorr: ${error.message}`, { status: 400 })
  }

  const session = event.data.object
  const address = session?.customer_details?.address
  const addressComponents = [
    address?.line1,
    address?.line2,
    address?.city,
    address?.state,
    address?.postal_code,
    address?.country,
  ]
  const addressString = addressComponents.filter((c) => c !== null).join(', ')

  if (event.type === 'checkout.session.completed') {
    const { orderId } = session.metadata

    try {
      await connectToDb()

      // Fetch the payment intent to get the charge ID
      const paymentIntent = await stripe.paymentIntents.retrieve(
        session.payment_intent
      )

      // Use latest_charge to get the charge ID
      const chargeId = paymentIntent.latest_charge

      // Fetch the charge to ensure it exists
      const charge = await stripe.charges.retrieve(chargeId)
      console.log(charge, 'webhookcharge')

      const order = await Order.findByIdAndUpdate(orderId, {
        isPaid: true,
        address: addressString,
        phoneNumber: session?.customer_details?.phone || '',
        stripeChargeId: chargeId, // Store the charge ID
      })

      if (!order) {
        return new NextResponse('Order not found', { status: 404 })
      }

      for (const item of order.orderItems) {
        const product = await Product.findById(item.productId)

        if (product) {
          product.stockQuantity -= item.quantity
          if (product.stockQuantity <= 0) {
            product.stockQuantity = 0
            product.outOfStock = true
          }
          await product.save()
        }
      }
      revalidatePath('/dashboard', 'page')

      return new NextResponse('Order updated successfully', { status: 200 })
    } catch (error) {
      console.error('Error updating order:', error)
      return new NextResponse(`Database error: ${error.message}`, {
        status: 500,
      })
    }
  }

  return new NextResponse('Unhandled event type', { status: 400 })
}
