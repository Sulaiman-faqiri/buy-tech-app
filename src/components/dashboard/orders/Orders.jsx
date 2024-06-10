'use client'
import React, { useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import SearchBox from '../searchBox/SearchBox'
import Pagination from '../pagination/Pagination'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { toast } from 'sonner'
import Image from 'next/image'
import { Box, Collapse, IconButton } from '@mui/material'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import './Orders.scss' // Ensure this import is correct

const Orders = ({ data, count, ITEM_PER_PAGE }) => {
  const [openOrders, setOpenOrders] = useState({})
  const router = useRouter()

  const handleToggleCollapse = (orderId) => {
    setOpenOrders((prevState) => ({
      ...prevState,
      [orderId]: !prevState[orderId],
    }))
  }

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const response = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${orderId}`,
        { orderStatus: newStatus }
      )
      router.refresh('dashboard/orders')
      if (response.status !== 200) {
        toast.error(`Status of the order didn't change, something went wrong.`)
        return
      }
      toast.success('Order status updated successfully')
    } catch (error) {
      console.error('Error updating order status:', error)
      toast.error(`Status of the order didn't change, something went wrong.`)
    }
  }

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URL}/api/orders/${id}`
      )
      if (response.status === 200) {
        toast.success('Order has been deleted successfully!')
        router.refresh('dashboard/orders')
      }
    } catch (error) {
      console.error('Error deleting order:', error)
      toast.error(`Order deletion was not successful`)
    }
  }

  return (
    <div className='ordersTable'>
      <div className='topBox'>
        <SearchBox placeholder={'Search order...'} />
        <button>Add new</button>
      </div>
      <TableContainer component={Paper} className='tbl'>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '40px' }}>ID</TableCell>
              <TableCell sx={{ width: '140px' }}>Customer Name</TableCell>
              <TableCell sx={{ width: '200px' }}>Address</TableCell>
              <TableCell sx={{ width: '140px' }}>Phone</TableCell>
              <TableCell sx={{ width: '140px' }}>Total Price</TableCell>
              <TableCell sx={{ width: '80px' }}>Paid</TableCell>
              <TableCell sx={{ width: '140px' }}>Date</TableCell>
              <TableCell sx={{ width: '80px' }}>Status</TableCell>
              <TableCell sx={{ width: '140px' }} className='action'>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((order) => {
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
              const orderDate = new Date(createdAt)
                .toLocaleDateString('en-CA')
                .replace(/-/g, '/')
              return (
                <React.Fragment key={_id}>
                  <TableRow>
                    <TableCell>{orderId}</TableCell>
                    <TableCell>{customerName}</TableCell>
                    <TableCell>{address || ''}</TableCell>
                    <TableCell>{phoneNumber || ''}</TableCell>
                    <TableCell>${totalPrice?.toFixed(2) || 0}</TableCell>
                    <TableCell>{isPaid ? 'Yes' : 'No'}</TableCell>
                    <TableCell>{orderDate}</TableCell>
                    <TableCell
                      className={
                        orderStatus === 'Pending'
                          ? 'pending'
                          : orderStatus === 'Delivered'
                          ? 'delivered'
                          : orderStatus === 'Cancelled'
                          ? 'cancelled'
                          : ''
                      }
                    >
                      {orderStatus}
                    </TableCell>
                    <TableCell>
                      <div className='btnBox'>
                        <select
                          value={orderStatus}
                          onChange={(e) =>
                            handleStatusChange(_id, e.target.value)
                          }
                        >
                          <option className='pending' value='Pending'>
                            Pending
                          </option>
                          <option className='delivered' value='Delivered'>
                            Delivered
                          </option>
                          <option className='cancelled' value='Cancelled'>
                            Cancelled
                          </option>
                        </select>
                        <button
                          className='delete'
                          onClick={() => handleDelete(_id)}
                        >
                          Delete
                        </button>
                        <IconButton
                          aria-label='expand row'
                          sx={{ width: 25, height: 25 }}
                          onClick={() => handleToggleCollapse(_id)}
                        >
                          {openOrders[_id] ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={9} className='colapseTbl'>
                      <Collapse
                        in={openOrders[_id]}
                        timeout='auto'
                        unmountOnExit
                      >
                        <Box>
                          <Table size='small' aria-label='purchases'>
                            <TableHead>
                              <TableRow>
                                <TableCell>Product Name</TableCell>
                                <TableCell>Image</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Quantity</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {orderItems.map((item) => {
                                const {
                                  productId,
                                  _id: itemId,
                                  quantity,
                                } = item

                                if (productId) {
                                  const { name, currentPrice, images } =
                                    productId
                                  return (
                                    <TableRow
                                      key={itemId}
                                      sx={{ color: 'var(--light1)' }}
                                    >
                                      <TableCell>{name || ''}</TableCell>
                                      <TableCell>
                                        <div className='product'>
                                          <div className='imgBox'>
                                            <Image
                                              src={images[0]?.src}
                                              alt={'img'}
                                              fill
                                            />
                                          </div>
                                        </div>
                                      </TableCell>
                                      <TableCell>
                                        {currentPrice || 0}$
                                      </TableCell>
                                      <TableCell>{quantity || 0}</TableCell>
                                    </TableRow>
                                  )
                                } else {
                                  return (
                                    <TableRow key={itemId}>
                                      <TableCell colSpan={4}>
                                        <div className='collapsible'>
                                          <span>Product has been deleted</span>
                                        </div>
                                      </TableCell>
                                    </TableRow>
                                  )
                                }
                              })}
                            </TableBody>
                          </Table>
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </React.Fragment>
              )
            })}
          </TableBody>
        </Table>
        {data.length < 1 && <h3>No orders found.</h3>}
      </TableContainer>
      <Pagination count={count} ITEM_PER_PAGE={ITEM_PER_PAGE} />
    </div>
  )
}

export default Orders
