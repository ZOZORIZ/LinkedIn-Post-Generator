import '../styles/globals.css'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from '../context/AuthContext'

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <AuthProvider>
      <Component {...pageProps} />
      </AuthProvider>
      <Toaster position="top-right" />
      <Footer />
    </>
  )
}

export default MyApp 