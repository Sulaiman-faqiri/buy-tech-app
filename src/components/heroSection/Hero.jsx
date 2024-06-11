import './Hero.scss'

import ImageGrid from '../imageGrid/ImageGrid'

const Hero = () => {
  return (
    <>
      <div className='heroSection' id='home'>
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
          <ImageGrid />
        </div>
      </div>
    </>
  )
}

export default Hero
