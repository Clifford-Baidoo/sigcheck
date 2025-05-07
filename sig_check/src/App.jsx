import './Out.css';
import Home from './components/Home.jsx';
import Footer from './components/Footer.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './components/Dashboard.jsx';
import SignIn from './components/SignIn.jsx';
import SignUP from './components/SignUp.jsx';
import About from './components/About.jsx';
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
          <Route path="/signin" element={<SignIn />} /> 
          <Route path="/signup" element={<SignUP />} />
          <Route path='/about' element={<About />}/>
        </Routes>
      </div>
      <Footer />
    </div>
    </Router>
  );
}

export default App;
