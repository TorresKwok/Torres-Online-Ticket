import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { getAuth } from "firebase/auth";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ForgotPassword from "./pages/ForgotPassword";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Explore from "./pages/Explore";
import PrivateRoute from "./components/PrivateRoute";
import Purchase from "./pages/Purchase";
import Cart from "./pages/Cart";
import Edit from "./pages/Edit";

function App() {

    const auth = getAuth()

    return (
        <>
          <Router>
              <div className="flex flex-col justify-between h-screen">
                  <Navbar />
                  <main className="container mx-auto px-3 pb-12">
                      <Routes>
                          <Route path='/' element={<Explore />} />
                          <Route path='/profile' element={<PrivateRoute />}>
                              <Route path='/profile' element={<Profile />} />
                          </Route>
                          <Route path='/sign-in' element={<SignIn />} />
                          <Route path='/sign-up' element={<SignUp />} />
                          <Route path='/purchase/:eventId' element={<Purchase />} />
                          <Route path='/edit/:ticketId' element={<Edit />} />
                          <Route path='/forgot-password' element={<ForgotPassword />} />
                          <Route path='/cart' element={<Cart/>} />
                      </Routes>
                  </main>
                  <Footer />
              </div>
          </Router>

          <ToastContainer />
        </>
    )
}

export default App;
