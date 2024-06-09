'use client'
import { Search } from '@mui/icons-material'
import React, { useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import './SearchBox.scss'
const SearchBox = ({ placeholder }) => {
  const searchParams = useSearchParams()
  const pathName = usePathname()
  const { replace } = useRouter()
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    // Set the initial value of the search input based on the query parameter
    const query = searchParams.get('q') || ''
    setSearchText(query)
  }, [searchParams])

  const handleSearch = (e) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', 1)
    const value = e.target.value

    if (value.trim().length > 2) {
      params.set('q', value)
    } else {
      params.delete('q')
    }
    replace(`${pathName}?${params}`)
    setSearchText(value)
  }
  return (
    <div className='searchBoxReuseble'>
      <Search />
      <input
        type='text'
        name='searchUser'
        id='searchUser'
        placeholder={placeholder || 'Search'}
        onChange={handleSearch}
        value={searchText}
      />
    </div>
  )
}

export default SearchBox
