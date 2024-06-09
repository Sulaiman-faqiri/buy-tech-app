import React from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Image from 'next/image'
import SearchBox from '../searchBox/SearchBox'
import Pagination from '../pagination/Pagination'
import Link from 'next/link'
import DeleteProductBtn from './DeleteProductBtn'
import './ProductsTable.scss'

const ProductsTable = ({ data, count, ITEM_PER_PAGE }) => {
  return (
    <div className='productsTable'>
      <div className='topBox'>
        <SearchBox placeholder={'Search product...'} />
        <Link href={'/dashboard/products/add'}>
          <button>Add new product</button>
        </Link>
      </div>
      <TableContainer component={Paper} className='tbl'>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '40px' }}>ID</TableCell>
              <TableCell sx={{ width: '80px' }}>Image</TableCell>
              <TableCell sx={{ width: '140px' }}>Name</TableCell>
              <TableCell sx={{ width: '140px' }}>Catagory</TableCell>
              <TableCell sx={{ width: '140px' }}>Created at</TableCell>
              <TableCell sx={{ width: '140px' }}>Stock quantitiy</TableCell>
              <TableCell sx={{ width: '140px' }}>Price</TableCell>
              <TableCell sx={{ width: '140px' }} className='action'>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.length > 0 &&
              data?.map((item) => {
                const {
                  _id,
                  name,
                  images,
                  createdAt,
                  category,
                  currentPrice: price,
                  stockQuantity,
                } = item
                const date = new Date(createdAt)

                const year = date.getFullYear()
                const day = date.getDate()

                const monthNames = [
                  'JAN',
                  'FEB',
                  'MAR',
                  'APR',
                  'MAY',
                  'JUN',
                  'JUL',
                  'AUG',
                  'SEP',
                  'OCT',
                  'NOV',
                  'DEC',
                ]

                const monthIndex = date.getMonth()
                const monthName = monthNames[monthIndex]

                const formattedDate = `${year} / ${monthName} / ${day}`
                return (
                  <TableRow key={_id}>
                    <TableCell>{_id.slice(-3)}</TableCell>
                    <TableCell className='usrImg'>
                      <div className='imgBox'>
                        <Image src={images[0].src} alt={'img'} fill />
                      </div>
                    </TableCell>
                    <TableCell>{name}</TableCell>
                    <TableCell>{category}</TableCell>
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>{stockQuantity}</TableCell>
                    <TableCell>${price}</TableCell>
                    <TableCell>
                      <div className='btnBox'>
                        <Link href={`/dashboard/products/${_id}`}>
                          <button className='edit'>Edit</button>
                        </Link>
                        <DeleteProductBtn _id={_id} images={images} />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
        {data.length < 1 && <h3>No products found add some new products.</h3>}
      </TableContainer>
      <Pagination count={count} ITEM_PER_PAGE={ITEM_PER_PAGE} />
    </div>
  )
}

export default ProductsTable
