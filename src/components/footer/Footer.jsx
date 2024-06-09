import React from 'react'
import './Footer.scss'
const Footer = () => {
  return (
    <div className='footer'>
      <div className='footer__addr'>
        <h1 className='footer__logo'>BuyTech</h1>

        <div>
          5124 Somewhere In. The World 2193-1022
          <br />
        </div>
      </div>

      <div className='legal'>
        <p>&copy; {new Date().getFullYear()} BuyTech. All rights reserved.</p>

        <div className='legal__links'>
          <span>
            Made with <span className='heart'>♥</span> by Sulaiman
          </span>
        </div>
      </div>
    </div>
  )
}

export default Footer
