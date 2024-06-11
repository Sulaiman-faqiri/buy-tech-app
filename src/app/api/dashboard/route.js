import { NextResponse } from 'next/server'
import { User, Order } from '../../../models/models'
import { connectToDb } from '../../../lib/connectToDb'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  timeout: 80000, // increase timeout
  maxNetworkRetries: 5, // number of retries
})

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

export async function GET() {
  try {
    // Connect to the database
    await connectToDb()

    // Fetch total number of active users
    const totalUsers = await User.countDocuments({ isActive: true })

    // Calculate the start and end of yesterday
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const startOfYesterday = new Date(startOfToday)
    startOfYesterday.setDate(startOfYesterday.getDate() - 1)

    // Fetch number of users created yesterday
    const yesterdayUsers = await User.countDocuments({
      createdAt: { $gte: startOfYesterday, $lt: startOfToday },
    })

    // Calculate percentage change for totalUsers
    const usersChange =
      yesterdayUsers !== 0
        ? ((totalUsers - yesterdayUsers) / yesterdayUsers) * 100
        : 0

    // Fetch total number of orders
    const totalOrders = await Order.countDocuments()

    // Fetch number of orders created yesterday
    const yesterdayOrders = await Order.countDocuments({
      createdAt: { $gte: startOfYesterday, $lt: startOfToday },
    })

    // Calculate percentage change for totalOrders
    const ordersChange =
      yesterdayOrders !== 0
        ? ((totalOrders - yesterdayOrders) / yesterdayOrders) * 100
        : 0

    // Calculate total earnings
    const orders = await Order.find()
      .populate('userId')
      .populate('orderItems.productId')

    const totalEarnings = orders.reduce((sum, order) => {
      const orderTotal = order.orderItems.reduce(
        (itemSum, item) => itemSum + item.totalPrice,
        0
      )
      return sum + orderTotal
    }, 0)

    const yesterdayOrdersData = await Order.find({
      createdAt: { $gte: startOfYesterday, $lt: startOfToday },
    }).populate('orderItems.productId')

    const yesterdayEarnings = yesterdayOrdersData.reduce((sum, order) => {
      const orderTotal = order.orderItems.reduce(
        (itemSum, item) => itemSum + item.totalPrice,
        0
      )
      return sum + orderTotal
    }, 0)

    // Calculate percentage change for totalEarnings
    const earningsChange =
      yesterdayEarnings !== 0
        ? ((totalEarnings - yesterdayEarnings) / yesterdayEarnings) * 100
        : 0

    // Calculate last 6 months income by month
    const sixMonthsAgo = new Date()
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)

    // Generate the last six months with month names and 0 income
    const lastSixMonths = []
    for (let i = 5; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      lastSixMonths.push({
        month: date.getMonth() + 1, // store the month number
        monthName: monthNames[date.getMonth()],
        year: date.getFullYear(),
        totalIncome: 0,
      })
    }

    // Get actual income data for the last six months
    const incomeData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $unwind: '$orderItems',
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          totalIncome: { $sum: '$orderItems.totalPrice' },
        },
      },
      {
        $sort: {
          '_id.year': 1,
          '_id.month': 1,
        },
      },
      {
        $project: {
          _id: 0,
          month: '$_id.month',
          year: '$_id.year',
          totalIncome: 1,
        },
      },
    ])

    // Merge actual data with the default last six months data
    const lastSixMonthsIncome = lastSixMonths.map((monthData) => {
      const data = incomeData.find(
        (item) => item.month === monthData.month && item.year === monthData.year
      )
      return data ? { ...monthData, totalIncome: data.totalIncome } : monthData
    })

    // Calculate sales made today
    const startOfDay = new Date()
    startOfDay.setHours(0, 0, 0, 0)
    const endOfDay = new Date()
    endOfDay.setHours(23, 59, 59, 999)

    const salesToday = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay },
        },
      },
      {
        $unwind: '$orderItems',
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$orderItems.totalPrice' },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
        },
      },
    ])

    // Calculate sales made in the last week
    const startOfLastWeek = new Date()
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7)
    startOfLastWeek.setHours(0, 0, 0, 0)

    const salesLastWeek = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastWeek, $lt: startOfDay },
        },
      },
      {
        $unwind: '$orderItems',
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$orderItems.totalPrice' },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
        },
      },
    ])

    // Calculate sales made in the last month
    const startOfLastMonth = new Date()
    startOfLastMonth.setMonth(startOfLastMonth.getMonth() - 1)
    startOfLastMonth.setDate(1) // First day of the last month
    startOfLastMonth.setHours(0, 0, 0, 0)

    const endOfLastMonth = new Date(startOfLastMonth)
    endOfLastMonth.setMonth(endOfLastMonth.getMonth() + 1)
    endOfLastMonth.setDate(0) // Last day of the last month
    endOfLastMonth.setHours(23, 59, 59, 999)

    const salesLastMonth = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfLastMonth, $lt: endOfLastMonth },
        },
      },
      {
        $unwind: '$orderItems',
      },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$orderItems.totalPrice' },
        },
      },
      {
        $project: {
          _id: 0,
          totalIncome: 1,
        },
      },
    ])

    // Define target value
    const target = 10000 // You can adjust this value as needed

    // Fetch balance from Stripe
    const balanceResult = await stripe.balance.retrieve()

    const balance = balanceResult.available[0].amount / 100 // Convert balance to dollars

    // Calculate start and end timestamps for yesterday
    const startOfYesterdayTimestamp = Math.floor(
      startOfYesterday.getTime() / 1000
    )
    const endOfYesterdayTimestamp = Math.floor(startOfToday.getTime() / 1000)

    // Fetch transactions for yesterday
    const yesterdayTransactions = await stripe.balanceTransactions.list({
      created: {
        gte: startOfYesterdayTimestamp,
        lt: endOfYesterdayTimestamp,
      },
    })

    // Calculate yesterday's balance based on transactions
    let yesterdayBalance = balance // Start with today's balance

    yesterdayTransactions.data.forEach((transaction) => {
      if (
        transaction.created >= startOfYesterdayTimestamp &&
        transaction.created < endOfYesterdayTimestamp
      ) {
        if (transaction.type === 'payment') {
          yesterdayBalance += transaction.amount
        } else if (transaction.type === 'refund') {
          yesterdayBalance -= transaction.amount
        }
      }
    })

    // Calculate percentage change for balance
    const balanceChange =
      yesterdayBalance !== 0
        ? ((balance - yesterdayBalance) / yesterdayBalance) * 100
        : 0

    // Fetch transactions from Stripe
    const transactions = await stripe.balanceTransactions.list({
      limit: 10, // You can adjust the limit as per your requirements
    })
    // Enhance transaction data with customer name and product image
    const enhancedTransactions = await Promise.all(
      transactions.data.map(async (transaction) => {
        // Find the corresponding order by Stripe charge ID and ensure the order is paid
        const order = await Order.findOne({
          stripeChargeId: transaction.source,
          isPaid: true, // Ensure the order is paid
        })
          .populate('userId')
          .populate('orderItems.productId')

        if (order) {
          return {
            ...transaction,
            customerName: order.userId.username,
            productName: order.orderItems[0]?.productId.name,
            productImage: order.orderItems[0]?.productId.images[0]?.src || null,
          }
        }

        // If order is not paid, return null
        return null
      })
    )

    // Filter out null values
    const successfulTransactions = enhancedTransactions.filter(
      (transaction) => transaction !== null
    )

    // Respond with the data
    return NextResponse.json({
      usersChange,
      totalUsers,
      totalOrders,
      ordersChange,
      totalEarnings,
      earningsChange,
      balance,
      balanceChange,
      transactions: successfulTransactions,
      lastSixMonthsIncome,
      salesToday: salesToday[0]?.totalIncome || 0,
      salesLastWeek: salesLastWeek[0]?.totalIncome || 0,
      salesLastMonth: salesLastMonth[0]?.totalIncome || 0,
      target,
    })
  } catch (error) {
    console.log('Error fetching data:', error)
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 })
  }
}
