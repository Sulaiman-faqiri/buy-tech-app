'use client'
import React from 'react'

export default function Error({ error, reset }) {
  console.log(error)
  return (
    <div>
      <h2>Something went wrong!</h2>
    </div>
  )
}
