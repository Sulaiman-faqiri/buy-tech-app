import './WhyChooseUs.scss'

import {
  MonetizationOnOutlined,
  HeadsetMicOutlined,
  AccountBalanceOutlined,
  Inventory2Outlined,
} from '@mui/icons-material'

const WhyChooseUs = () => {
  return (
    <div className='whyChooseUs'>
      <h2>Why Choose Us?</h2>
      <div className='infoBox nn'>
        <div className='box'>
          <Inventory2Outlined />
          <h4>Free Shipping</h4>
          <span>Free shipping for order above $150.</span>
        </div>
        <div className='box'>
          <MonetizationOnOutlined />
          <h4>Money Guarantee</h4>
          <span>within 30 days for an exchange.</span>
        </div>
        <div className='box'>
          <HeadsetMicOutlined />
          <h4>Online Support</h4>
          <span>24 hours a day. 7 days a week.</span>
        </div>
        <div className='box'>
          <AccountBalanceOutlined />
          <h4>Flexible Payment</h4>
          <span>Pay with multipe credit cards.</span>
        </div>
      </div>
    </div>
  )
}

export default WhyChooseUs
