'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { Badge } from '@mui/material'
import { StyledInputBase } from './MuiDesignUtils'
import {
  Close,
  Logout,
  PeopleOutlined,
  NotificationsNone,
  NightsStayOutlined,
  LightModeOutlined,
  DashboardOutlined,
  Inventory2Outlined,
  ListAltOutlined,
  CategoryOutlined,
  SettingsOutlined,
} from '@mui/icons-material'
import MenuIcon from '@mui/icons-material/Menu'
import SearchIcon from '@mui/icons-material/Search'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import './Sidebar.scss'

const Sidebar = ({ children }) => {
  const path = usePathname()
  const [openSidebar, setOpenSidebar] = useState(false)
  const [theme, setTheme] = useState(false)
  const setDarkMode = () => {
    document.querySelector('.adminSidebar').setAttribute('data-theme', 'dark')
  }
  const setLightMode = () => {
    document.querySelector('.adminSidebar').setAttribute('data-theme', 'light')
  }
  const { data } = useSession()
  return (
    <div className='adminSidebar '>
      <div
        className={`sidebar ${openSidebar ? 'openSidebar' : 'closeSidebar'}  `}
      >
        <div className='box'>
          <h2>Dashboard</h2>
          <Close onClick={() => setOpenSidebar((p) => !p)} />
        </div>
        <div className='links'>
          <Link
            className={`${path === '/dashboard' ? 'active' : ''}`}
            href={'/dashboard'}
          >
            <DashboardOutlined />
            <span>Dashboard</span>
          </Link>
          <Link
            className={`${path === '/dashboard/users' ? 'active' : ''}`}
            href={'/dashboard/users'}
          >
            <PeopleOutlined />
            <span>Users</span>
          </Link>
          <Link
            className={`${path === '/dashboard/products' ? 'active' : ''}`}
            href={'/dashboard/products'}
          >
            <Inventory2Outlined />
            <span>Products</span>
          </Link>
          <Link
            className={`${path === '/dashboard/categories' ? 'active' : ''}`}
            href={'/dashboard/categories'}
          >
            <CategoryOutlined />
            <span>Categories</span>
          </Link>
          <Link
            className={`${path === '/dashboard/orders' ? 'active' : ''}`}
            href={'/dashboard/orders'}
          >
            <ListAltOutlined />
            <span>Orders</span>
          </Link>
        </div>

        <div className='logout'>
          <Link href={`/dashboard/users/${data?.user?.id}`}>
            <SettingsOutlined />
            <span>Settings</span>
          </Link>
          <Link onClick={() => signOut()} href={'#'}>
            <Logout />
            <span>Logout</span>
          </Link>
        </div>
      </div>
      <div className='main'>
        <div className='header'>
          <MenuIcon
            className='menu'
            onClick={() => setOpenSidebar((p) => !p)}
          />
          <div className='searchBox'>
            <div className='searchWrapper'>
              <SearchIcon />
            </div>
            <StyledInputBase
              placeholder='Search…'
              inputProps={{ 'aria-label': 'search' }}
            />
          </div>
          <div className='box'>
            <div className='themeBtn'>
              {theme ? (
                <NightsStayOutlined
                  onClick={() => {
                    setTheme(false)
                    setLightMode()
                  }}
                />
              ) : (
                <LightModeOutlined
                  onClick={() => {
                    setTheme(true)
                    setDarkMode()
                  }}
                />
              )}
            </div>
            <Badge badgeContent={3} color='error'>
              <NotificationsNone />
            </Badge>
            <div className='userImg'>
              <Image src={'/user.jpg'} alt='user' fill />
            </div>
          </div>
        </div>
        <div className='content' onClick={() => setOpenSidebar(false)}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
