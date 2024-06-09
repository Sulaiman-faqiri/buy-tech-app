'use client'

import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart'
import RightArrow from '@mui/icons-material/ArrowCircleRight'
import Image from 'next/image'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import LeftArrow from '@mui/icons-material/ArrowCircleLeft'
import 'swiper/css'
import './Featured.scss'

// Import Swiper styles
// import img from '../../../public/headphone.png'
// import 'swiper/css/pagination'

// const SliderCard = () => {
//   return (
//     <div className='sliderCard'>
//       <div className='imgBox'>
//         <Image src={'/headphone.png'} alt='img' fill />
//       </div>
//       <div className='infoBox'>
//         <h4>Head phone</h4>
//         <p>
//           Elevate your senses with our immersive, high-performance headphones.
//         </p>
//         <div className='cartBtn'>
//           <div className='price'>
//             <span>55$</span>
//             <span>32$</span>
//           </div>
//           <AddShoppingCartIcon className='icon' />
//         </div>
//       </div>
//     </div>
//   )
// }

const Featured = () => {
  return (
    <div className='featuredSection'>
      <h2>Featured Tech Showcase</h2>

      <Swiper
        breakpoints={{
          300: {
            slidesPerView: 2,
            spaceBetween: 2,
          },

          600: {
            slidesPerView: 3,
            spaceBetween: 4,
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 50,
          },
        }}
        slidesPerView={4}
        spaceBetween={1}
        cssMode={true}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        grabCursor={true}
        modules={[Autoplay, Navigation]}
        className='mySwiper'
      >
        <SwiperSlide>
          <div className='sliderCard'>
            <div className='imgBox'>
              <Image src='/headphone.png' alt='imgdkl' fill />
            </div>
            <div className='infoBox'>
              <h4>Head phone</h4>
              <p>
                Elevate your senses with our immersive, high-performance
                headphones.
              </p>
              <div className='cartBtn'>
                <div className='price'>
                  <span>55$</span>
                  <span>32$</span>
                </div>
                <AddShoppingCartIcon className='icon' />
              </div>
            </div>
          </div>
        </SwiperSlide>

        <div className='btnsBox'>
          <LeftArrow className='swiper-button-prev' />
          <RightArrow className='swiper-button-next' />
        </div>
      </Swiper>
    </div>
  )
}
export default Featured
