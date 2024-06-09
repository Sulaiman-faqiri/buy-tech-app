'use client'
import * as React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Row from './Row'
import './UserOrders.scss'
export default function UserOrders({ orders }) {
  return (
    <>
      <div className='usersTbl'>
        <h2>Orders</h2>
        <TableContainer component={Paper} className='tbl'>
          <Table aria-label='collapsible table'>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Total Price</TableCell>
                <TableCell>Paid</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders?.length > 0 &&
                orders?.map((order) => {
                  const {
                    _id,
                    customerName,
                    address,
                    phoneNumber,
                    orderItems,
                    isPaid,
                    orderStatus,
                    createdAt,
                  } = order
                  const orderId = _id.slice(-3)

                  const totalPrice = orderItems.reduce(
                    (total, item) => total + item.totalPrice,
                    0
                  )
                  const orderDate = new Intl.DateTimeFormat('en-US', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                  }).format(new Date(createdAt))
                  return (
                    <Row
                      key={orderId}
                      id={_id}
                      customerName={customerName}
                      address={address}
                      phoneNumber={phoneNumber}
                      orderItems={orderItems}
                      isPaid={isPaid}
                      orderStatus={orderStatus}
                      orderDate={orderDate}
                      orderId={orderId}
                      totalPrice={totalPrice}
                    />
                  )
                })}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  )
}
