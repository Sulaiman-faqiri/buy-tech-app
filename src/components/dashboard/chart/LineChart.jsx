'use client'
import React from 'react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import './LineChart.scss'
const LineChart = ({ incomeData }) => {
  ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Filler,
    Legend
  )

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Last 6 Months (income)',
      },
    },
  }

  const data = {
    labels: incomeData.map((item) => item.monthName),
    datasets: [
      {
        label: 'Total Income',
        data: incomeData.map((item) => item.totalIncome),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  }
  return (
    <div className='lineChart'>
      <Line options={options} data={data} />
    </div>
  )
}

export default LineChart
