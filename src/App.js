import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import Womenstore from './darshan/pages/Womenstore';
import Home from './Vivek/Component/Home/Home'
// import Electronics from './Parth/Component/Electronics/Electronics'; 
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Beauty from './Parth/Component/Beauty/Beauty';
import Womenfilter from './darshan/pages/Womenfilter';
import ContactUs from './Parth/Component/ContactUs/ContactUs'
import AboutUs from './Parth/Component/ContactUs/AboutUs'
import UserProfile from './Vivek/Component/User/UserProfile';
import User from './Vivek/Component/User/User';


function App() {
  return (
    <div className="App">

      <BrowserRouter>
        <Routes>
          <Route path='/womenfilter' element={<Womenfilter />} />
          <Route path='/womenstore' element={<Womenstore />} />
          <Route path='/parth' element={<Beauty />} />
          <Route path='/home' element={<Home />} />
          <Route path='/user' element={<User />}>
            <Route path='profile' element={<UserProfile />}></Route>
          </Route>
          <Route path="/parth/Beauty" element={<Beauty />} />
          <Route path="/contactus" element={<ContactUs />} />
          <Route path="/aboutus" element={<AboutUs />} />
        </Routes>
      </BrowserRouter>


    </div>
  );
}

export default App;