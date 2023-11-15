import '@/styles/globals.css'
import '../../configureAmplify';
import { Divider } from '@aws-amplify/ui-react';
import Navbar from '@/Components/Navbar/Navbar';

export default function App({ Component, pageProps }) {
  return (
    <div>
      <Navbar />
      <div>
      <Component {...pageProps} />
      </div>
    </div>
  )
}
