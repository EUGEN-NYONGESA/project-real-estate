import { createRoot } from 'react-dom/client'
import './index.css'; // Ensure the correct path to your CSS file
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom';
import { AppContextProvider } from './components/context/AppContext.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <AppContextProvider>
    <App />
    </AppContextProvider>
  </BrowserRouter>,
)
