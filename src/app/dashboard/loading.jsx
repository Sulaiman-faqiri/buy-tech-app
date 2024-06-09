'use client'
import React from 'react'

const loading = () => {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '70vh',
      }}
    >
      <div className='lds-dual-ring'></div>
    </div>
  )
}

export default loading
