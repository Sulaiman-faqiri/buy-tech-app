import Link from 'next/link'

import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  PersonSharp,
  ShoppingCartOutlined,
  MonetizationOnOutlined,
  AccountBalanceWalletOutlined,
} from '@mui/icons-material'
import LineChart from '../chart/LineChart'
import Featured from '../fetured/Featured'
import TransactionTable from '../transactionTable.jsx/TransactionTable'
import './Overview.scss'

const Overview = ({ data }) => {
  return (
    <div className='adminOverView'>
      <div className='info'>
        <div className='infoBox '>
          <div className='topBox'>
            <span>Users</span>
            <div className={`smBox ${data?.usersChange < 1 ? 'down' : 'up'}`}>
              {data?.usersChange < 1 ? (
                <KeyboardArrowDown />
              ) : (
                <KeyboardArrowUp />
              )}
              <span>{Math.abs(data?.usersChange?.toFixed(1))}%</span>
            </div>
          </div>
          <h2>{data?.totalUsers}</h2>
          <div className='bottomBox'>
            <Link href={'/dashboard/users'}>See all users</Link>
            <PersonSharp className='user' />
          </div>
        </div>
        <div className='infoBox '>
          <div className='topBox'>
            <span>Orders</span>
            <div className={`smBox ${data?.ordersChange < 1 ? 'down' : 'up'}`}>
              {data?.ordersChange < 1 ? (
                <KeyboardArrowDown />
              ) : (
                <KeyboardArrowUp />
              )}
              <span>{Math.abs(data?.ordersChange?.toFixed(1))}%</span>
            </div>
          </div>
          <h2>{data?.totalOrders}</h2>
          <div className='bottomBox'>
            <Link href={'/dashboard/orders'}>See all orders</Link>
            <ShoppingCartOutlined className='cart' />
          </div>
        </div>
        <div className='infoBox '>
          <div className='topBox'>
            <span>Earnings</span>
            <div
              className={`smBox ${data?.earningsChange < 1 ? 'down' : 'up'}`}
            >
              {data?.earningsChange < 1 ? (
                <KeyboardArrowDown />
              ) : (
                <KeyboardArrowUp />
              )}
              <span>{Math.abs(data?.earningsChange?.toFixed(1))}%</span>
            </div>
          </div>
          <h2>${data?.totalEarnings}</h2>
          <div className='bottomBox'>
            <Link href={'/dashboard/orders'}>See all earnings</Link>
            <MonetizationOnOutlined className='dollar' />
          </div>
        </div>
        <div className='infoBox '>
          <div className='topBox '>
            <span>My Balance</span>
            <div className={`smBox ${data?.balanceChange < 1 ? 'down' : 'up'}`}>
              {data?.balanceChange < 1 ? (
                <KeyboardArrowDown />
              ) : (
                <KeyboardArrowUp />
              )}
              <span>{Math.abs(data?.balanceChange?.toFixed(1))}%</span>
            </div>
          </div>
          <h2>${data?.balance}</h2>
          <div className='bottomBox'>
            <Link href={'/dashboard/orders'}>See balance details</Link>
            <AccountBalanceWalletOutlined className='wallet' />
          </div>
        </div>
      </div>
      <div className='featuredBox'>
        <Featured data={data} />
        <LineChart incomeData={data?.lastSixMonthsIncome} />
      </div>
      <TransactionTable data={data?.transactions} />
    </div>
  )
}

export default Overview
