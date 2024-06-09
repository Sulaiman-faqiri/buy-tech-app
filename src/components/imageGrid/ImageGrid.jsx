import React from 'react'
import './ImageGrid.scss'
import Image from 'next/image'
const ImageGrid = () => {
  return (
    <div className='imgGridContainer'>
      <ul>
        <li>
          <Image src='/headphone.png' fill alt='img' />
        </li>
        <li>
          <Image src='/mouse.png' fill alt='img' />
        </li>
        <li>
          <Image src='/laptop.png' fill alt='img' />
        </li>

        <li>
          <Image src='/ipad.png' fill alt='img' />
        </li>

        <li>
          <Image src='/keyboard.png' fill alt='img' />
        </li>
      </ul>
    </div>
  )
}

export default ImageGrid
