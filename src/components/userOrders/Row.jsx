import * as React from 'react'
import Box from '@mui/material/Box'
import Collapse from '@mui/material/Collapse'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'
import Image from 'next/image'

export default function Row({
  customerName,
  address,
  phoneNumber,
  orderStatus,
  isPaid,
  totalPrice,
  orderItems,
  orderDate,
  orderId,
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <React.Fragment>
      <TableRow>
        <TableCell>{orderId}</TableCell>
        <TableCell>{customerName}</TableCell>
        <TableCell>{address || ''}</TableCell>
        <TableCell>{phoneNumber || ''}</TableCell>
        <TableCell>{totalPrice || 0}$</TableCell>
        <TableCell>{isPaid ? 'Yes' : 'No' || ''}</TableCell>
        <TableCell>{orderDate || ''}</TableCell>
        <TableCell>{orderStatus}</TableCell>
        <TableCell>
          <IconButton
            aria-label='expand row'
            size='small'
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={4} className='colapseTbl'>
          <Collapse in={open} timeout='auto' unmountOnExit>
            <Box sx={{ margin: 1 }}>
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
                    const { productId, _id, quantity } = item
                    const { name, currentPrice, images } = productId
                    return (
                      <TableRow key={_id}>
                        <TableCell>{name}</TableCell>
                        <TableCell>
                          <div className='product'>
                            <div className='imgBox'>
                              <Image src={images[0].src} alt={'img'} fill />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{currentPrice}$</TableCell>
                        <TableCell>{quantity}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  )
}
