import React from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import './Featured.scss'

import {
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreVertOutlined,
} from '@mui/icons-material'

const Featured = ({ data }) => {
  // Ensure data is defined before accessing properties
  const salesToday = data?.salesToday || 0
  const target = data?.target || 0
  const salesLastWeek = data?.salesLastWeek || 0
  const salesLastMonth = data?.salesLastMonth || 0

  // Calculate achieved percentage of target
  const achievedPercentage = target !== 0 ? (salesToday / target) * 100 : 0

  // Function to determine trend class based on value
  const getTrendClass = (value) => {
    return value > 1 ? 'up' : 'down'
  }

  return (
    <div className='adminFeatured'>
      <div className='topBox'>
        <h3>Total Revenue</h3>
        <MoreVertOutlined fontSize='small' />
      </div>
      <div className='centerBox'>
        <div className='circleBox'>
          <CircularProgress
            size={130}
            value={achievedPercentage}
            variant='determinate'
          />
          <div className='label'>
            <span>{achievedPercentage?.toFixed(1)}%</span>
          </div>
        </div>
        <h4>Total sales made today</h4>
        <span>${salesToday}</span>
      </div>
      <div className='bottomBox'>
        <span>
          Previous transactions processing. Last payments may not be included.
        </span>
        <div className='historyBox'>
          <div className={`smBox ${getTrendClass(target)}`}>
            <span>Target</span>
            <div className={`box ${getTrendClass(target)}`}>
              {target > 1 ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              <span>{achievedPercentage?.toFixed(1)}%</span>
            </div>
          </div>
          <div className={`smBox ${getTrendClass(salesLastWeek)}`}>
            <span>Last week</span>
            <div className={`box ${getTrendClass(salesLastWeek)}`}>
              {salesLastWeek > 1 ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              <span>{salesLastWeek?.toFixed(1)}%</span>
            </div>
          </div>
          <div className={`smBox ${getTrendClass(salesLastMonth)}`}>
            <span>Last month</span>
            <div className={`box ${getTrendClass(salesLastMonth)}`}>
              {salesLastMonth > 1 ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
              <span>{salesLastMonth?.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Featured
