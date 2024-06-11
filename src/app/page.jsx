import Footer from '../components/footer/Footer'
import Hero from '../components/heroSection/Hero'
import Product from '../components/productsSection/Product'
import InfiniteSlider from '../components/infiniteSlider/InfiniteSlider'
import Navbar from '../components/navbar/Navbar'
import WhyChooseUs from '../components/whyChooseUs/WhyChooseUs'

const Home = () => {
  return (
    <>
      <Navbar />
      <Hero />
      <main>
        <WhyChooseUs />
        <InfiniteSlider />
        <Product />
      </main>
      <Footer />
    </>
  )
}

export default Home
