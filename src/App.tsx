import { BrowserRouter } from 'react-router-dom'
import './App.css'
import Navbar from './components/common/Navbar'
import AppContent from './components/common/AppContent'
import Footer from './components/common/Footer'

function App() {

  return (
    <BrowserRouter>
      <Navbar />
      <AppContent />
      <Footer />
    </BrowserRouter>
  )
}

export default App