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
import SearchBox from '../searchBox/SearchBox'
import Pagination from '../pagination/Pagination'
import './UsersTable.scss'
import Link from 'next/link'
import DeleteUserBtn from './DeleteUserBtn'

const UsersTable = ({ users, count, ITEM_PER_PAGE }) => {
  return (
    <div className='usersTable'>
      <div className='topBox'>
        <SearchBox placeholder={'Search by username...'} />
        <Link href={'/dashboard/users/add'}>
          <button>Add new</button>
        </Link>
      </div>
      <TableContainer component={Paper} className='tbl'>
        <Table aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: '40px' }}>ID</TableCell>
              <TableCell sx={{ width: '50px' }}>Image</TableCell>
              <TableCell sx={{ width: '80px' }}>Name</TableCell>
              <TableCell sx={{ width: '180px' }}>Email</TableCell>
              <TableCell sx={{ width: '100px' }}>Created at</TableCell>
              <TableCell sx={{ width: '40px' }}>Role</TableCell>
              <TableCell sx={{ width: '140px' }} className='action'>
                Action
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users &&
              users.length > 0 &&
              users.map((item) => {
                const { _id, username, img, createdAt, isAdmin, email } = item
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
                    <TableCell>{_id.slice(-4)}</TableCell>
                    <TableCell className='usrImg'>
                      <div className='imgBox'>
                        {img ? <Image src={img.src} alt={'img'} fill /> : 'Img'}
                      </div>
                    </TableCell>
                    <TableCell>{username}</TableCell>
                    <TableCell>{email}</TableCell>
                    <TableCell>{formattedDate}</TableCell>
                    <TableCell>{isAdmin ? 'Admin' : 'Client'}</TableCell>
                    <TableCell>
                      <div className='btnBox'>
                        <Link href={`/dashboard/users/${_id}`}>
                          <button className='edit'>View</button>
                        </Link>
                        <DeleteUserBtn
                          _id={_id}
                          image={{
                            src: img ? img.src : '',
                            name: img ? img.name : '',
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
          </TableBody>
        </Table>
        {users.length < 1 && <h3>No users found.</h3>}
      </TableContainer>
      <Pagination count={count} ITEM_PER_PAGE={ITEM_PER_PAGE} />
    </div>
  )
}

export default UsersTable
