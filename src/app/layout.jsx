import './globals.css'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import AuthProvider from '../components/providers/AuthProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Buy-Tech',
  description: 'Ecommerce app',
}

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster position='top-center' richColors />
        </AuthProvider>
      </body>
    </html>
  )
}
