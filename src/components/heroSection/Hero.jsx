import './Hero.scss'

import ImageGrid from '../imageGrid/ImageGrid'

const Hero = () => {
  return (
    <>
      <div className='heroSection' id='home'>
        {/* <Navbar /> */}
        <div className='heroContainer'>
          <div className='textContent'>
            <h1>
              Innovative <span className='textGredient'>Gadgets</span> for a
              Brighter Future.
            </h1>
            <p>
              Discover the ultimate convenience at our one-stop destination for
              all your needs. Embrace the seamless shopping experience as you
              find everything you desire, thoughtfully curated in a single
              place.
            </p>

            <button role='button'>Find Your Perfect Gadgets</button>
          </div>
          {/* <div className='imgBox'>
            <div className='topBox'>
              <div className='mouseBox'>
                <Image src={'/mouse.png'} alt='mouse' fill />
              </div>
              <div className='headphoneBox'>
                <Image src={'/headphone.png'} alt='headphone' fill />
              </div>
            </div>
            <div className='laptopBox'>
              <Image src={'/laptop.png'} alt='laptop' fill />
            </div>
            <div className='bottomBox'>
              <div className='ipadBox'>
                <Image src={'/ipad.png'} alt='ipad' fill />
              </div>
              <div className='keyboardBox'>
                <Image src={'/keyboard.png'} alt='keyboard' fill />
              </div>
            </div>
          </div> */}
          <ImageGrid />
        </div>
      </div>
    </>
  )
}

export default Hero
