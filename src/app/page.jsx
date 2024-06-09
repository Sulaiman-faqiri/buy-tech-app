// import Footer from '@/components/footer/Footer'
import Footer from '../components/footer/Footer'
import Hero from '../components/heroSection/Hero'
import Product from '../components/productsSection/Product'
// import Featured from '@/components/featuredSection/Featured'
import Featured from '../components/featuredSection/Featured'
import InfiniteSlider from '../components/infiniteSlider/InfiniteSlider'
import ImageGrid from '../components/imageGrid/ImageGrid'
import Navbar from '../components/navbar/Navbar'
import WhyChooseUs from '../components/whyChooseUs/WhyChooseUs'

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />

      <main>
        {/* <Featured /> */}
        <WhyChooseUs />
        <InfiniteSlider />
        <Product />
      </main>
      <Footer />
    </>
  )
}

export default Home
