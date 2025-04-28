import './Out.css';
import Home from './components/Home.jsx';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './components/Dashboard.jsx'
import { BrowserRouter as Router,Route,Routes} from 'react-router-dom';


function App() {
  return (
    <Router>
    <div className="App">
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
      <Footer />
    </div>
    </Router>
  );
}

export default App;
