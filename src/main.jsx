import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Navbar from './Components/Navbar.jsx';
import './Styles/global.css';
import Dashboard from './Pages/Dashboard.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   <Dashboard />
    
  </StrictMode>,
)
