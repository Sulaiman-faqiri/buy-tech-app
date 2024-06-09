'use client'
import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Image from 'next/image'
import './TransactionTable.scss'

// const tblData = [
//   {
//     id: 1212,
//     product: 'Laptop',
//     imgSrc: '/laptop1.png',
//     customer: 'Jena',
//     date: '2023-03-01',
//     price: 1999,
//     status: 'Approved',
//   },
//   {
//     id: 12,
//     product: 'Ipad',
//     imgSrc: '/ipad2.png',
//     customer: 'Ahmad',
//     date: '2023-01-01',
//     price: 944,
//     status: 'Pending',
//   },
//   {
//     id: 143,
//     product: 'Mouse',
//     imgSrc: '/mouse1.png',
//     customer: 'Jamal',
//     date: '2023-02-01',
//     price: 343,
//     status: 'Pending',
//   },
//   {
//     id: 14,
//     product: 'Headphone',
//     imgSrc: '/headphone3.png',
//     customer: 'Milad',
//     date: '2023-04-01',
//     price: 244,
//     status: 'Declined',
//   },
// ]

const TransactionTable = ({ data }) => {
  console.log(data.productImages)
  return (
    <div className='transactionTable'>
      <h3>Transaction Table</h3>
      <TableContainer component={Paper} className='tbl'>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Tracking ID</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((item) => {
              const {
                id,
                productName,
                customerName,
                created,
                amount,
                status,
                productImage,
              } = item
              console.log(item)
              // Format date into 'YYYY-MM-DD' to 'DD Month YYYY'
              const timestamp = 1717586253 * 1000 // Convert to milliseconds
              const date = new Date(timestamp)
              const formattedDate = date.toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric',
              })

              // Format the date to 'year/day/month'
              const [month, day, year] = formattedDate.split('/')
              const paddedDay = day.padStart(2, '0')
              const paddedMonth = month.padStart(2, '0')
              const finalFormattedDate = `${year}/${paddedDay}/${paddedMonth}`
              return (
                <TableRow key={id}>
                  <TableCell>{id?.slice(-4)}</TableCell>
                  <TableCell className='productItem'>
                    <div className='product'>
                      <div className='imgBox'>
                        <Image
                          src={productImage}
                          alt={'img'}
                          width={50}
                          height={50}
                        />
                      </div>
                      <span>{productName || 'product name'}</span>
                    </div>
                  </TableCell>
                  <TableCell>{customerName}</TableCell>
                  <TableCell>{finalFormattedDate}</TableCell>
                  <TableCell>${(amount / 100).toFixed(2)}</TableCell>
                  <TableCell className={status.toLowerCase()}>
                    {status}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  )
}

export default TransactionTable
