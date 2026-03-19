import './App.css'
import { BrowserRouter, Route, Routes } from "react-router-dom"

import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";

import AdminSignin from './pages/adminSignIn'
import AdminLanding from './pages/AdminLanding'
import AdminDashboard from './pages/adminDashboard'
import AdminCinema from './pages/adminCinema'
import AdminCinemaPending from './pages/adminCinemaPending'
import AdminCinemaRejected from './pages/adminCinemaRejected'
import AdminScreen from './pages/adminScreen'
import AdminMovie from './pages/adminMovie'
import AdminMovieRequest from './pages/adminMovieRequest'
import AdminUser from './pages/adminUser'
import AdminCinemaOwner from './pages/adminCinemaOwner'
import AdminAdmin from './pages/adminAdmin'
import AdminBooking from './pages/adminBooking'
import AdminGenre from './pages/adminGenre'
import Home from './pages/Home'
import SingleMovie from './pages/singleMovie'
import UserSheetSelect from './pages/userSheetSelect'
import UserTicketSelect from './pages/userTicketSelect'
import UserSignin from './pages/userSignIn'
import OwnerSignin from './pages/ownerSignIn'
import SeatDesigner from './pages/x'
import UserSignup from './pages/userSignUp'
import OwnerSignup from './pages/ownerSignUp'
import CinemaLanding from './pages/CinemaLanding'
import CinemaDashboard from './pages/cinemaDashboard'
import CinemaScreen from './pages/cinemaScreen'
import CinemaScreenAdd from './pages/cinemaScreenAdd'
import CinemaTransaction from './pages/cinemaTransaction'
import CinemaBooking from './pages/cinemaBooking'
import CinemaShowTime from './pages/cinemaShowtime'
import CinemaAddShowtime from './pages/cinemaAddShowtime'
import CinemaMovie from './pages/cinemaMovie'
import CinemaAddMovie from './pages/cinemaAddMovie'
import CinemaRequestMovie from './pages/cinemaMovieRequest'
import OTPModel from './components/cinema/OTPModel';
import AdminHeroPosters from './pages/adminHero';
import PaymentTwo from './components/user/booking/py';
import BookingFailure from './components/user/booking/BookingFailure';
import BookingSuccess from './components/user/booking/BookingSuccess';
import TimeOutModel from './components/user/booking/TimeOutModel';
import Trailers from './components/user/home/Trailers';
import AboutUsPage from './pages/AboutUsPage';
import MoviePage from './pages/MoviePage';
import CinemaPage from './pages/CinemaPage';
import SingleCinemaPage from './pages/SingleCinemaPage';
import ScrollToTop from './components/user/ScrollToTop';
import MyBookings from './pages/MyBookings';
import MyWatchlist from './pages/MyWatchlist';
import CinemaUserProfile from './pages/CinemaUserProfile';

import { useDispatch } from "react-redux";
import { fetchCurrentUser } from "./store/slices/authSlice";
import type { AppDispatch } from "./store/store";
import { useEffect } from 'react';
import CinemaProtectedRoute from './components/cinema/CinemaProtectedRoute';
import AdminUserProfile from './pages/AdminUserProfile';

function App() {

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={true} newestOnTop={false} closeOnClick pauseOnHover draggable pauseOnFocusLoss theme="dark" toastStyle={{ background: "#121212", color: "#ffffff", borderRadius: "8px", border: "1px solid #2a2a2a", padding: "14px 16px", fontSize: "14.5px", fontFamily: "Poppins, sans-serif", boxShadow: "0 4px 12px rgba(0, 0, 0, 0.45)" }} closeButton={false} />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path='/admin/landing' element={<AdminLanding />}></Route>
          <Route path='/admin/signin' element={<AdminSignin />}></Route>
          <Route path='/admin/home' element={<AdminDashboard />}></Route>
          <Route path='/admin/cinema' element={<AdminCinema />}></Route>
          <Route path='/admin/cinema/pending' element={<AdminCinemaPending />}></Route>
          <Route path='/admin/cinema/rejected' element={<AdminCinemaRejected />}></Route>
          <Route path='/admin/screen' element={<AdminScreen />}></Route>
          <Route path='/admin/movie' element={<AdminMovie />}></Route>
          <Route path='/admin/movie/request' element={<AdminMovieRequest />}></Route>
          <Route path='/admin/user' element={<AdminUser />}></Route>
          <Route path='/admin/owner' element={<AdminCinemaOwner />}></Route>
          <Route path='/admin/admin' element={<AdminAdmin />}></Route>
          <Route path='/admin/booking' element={<AdminBooking />}></Route>
          <Route path='/admin/genre' element={<AdminGenre />}></Route>
          <Route path='/' element={<Home />}></Route>
          <Route path='/single/movie/:id' element={<SingleMovie />}></Route>
          <Route path='/booking/:id' element={<UserSheetSelect />}></Route>
          <Route path='/ticket' element={<UserTicketSelect />}></Route>
          <Route path='/user/signin' element={<UserSignin />}></Route>
          <Route path='/owner/signin' element={<OwnerSignin />}></Route>
          <Route path='/seats' element={<SeatDesigner />}></Route>
          <Route path='/user/signup' element={<UserSignup />}></Route>
          <Route path='/owner/signup' element={<OwnerSignup />}></Route>
          <Route path='/cinema/landing' element={<CinemaLanding />}></Route>
          <Route path='/cinema/home' element={<CinemaDashboard />}></Route>
          <Route path='/cinema/screens' element={<CinemaScreen />}></Route>
          <Route path='/owner/screen/add' element={<CinemaScreenAdd />}></Route>
          <Route path='/cinema/transactions' element={<CinemaTransaction />}></Route>
          <Route path='/cinema/bookings' element={<CinemaBooking />}></Route>
          <Route path='/cinema/showtimes' element={<CinemaShowTime />}></Route>
          <Route path='/cinema/add/showtime' element={<CinemaAddShowtime />}></Route>
          <Route path='/cinema/movies' element={<CinemaMovie />}></Route>
          <Route path='/cinema/movie/add' element={<CinemaAddMovie />}></Route>
          <Route path='/cinema/movie/request' element={<CinemaRequestMovie />}></Route>
          <Route path='/otp' element={<OTPModel />}></Route>
          <Route path='/admin/hero' element={<AdminHeroPosters />}></Route>
          <Route path='/payment' element={<PaymentTwo />}></Route>
          <Route path='/error/:id' element={<BookingFailure />}></Route>
          <Route path='/success/:id' element={<BookingSuccess />}></Route>
          <Route path='/timeOut' element={<TimeOutModel />}></Route>
          <Route path='/trailers' element={<Trailers />}></Route>
          <Route path='/aboutus' element={<AboutUsPage />}></Route>
          <Route path='/movie' element={<MoviePage />}></Route>
          <Route path='/cinema' element={<CinemaPage />}></Route>
          <Route path='/cinema/:id' element={<SingleCinemaPage />}></Route>
          <Route path='/mybookings' element={<MyBookings />}></Route>
          <Route path='/mywatchlist' element={<MyWatchlist />}></Route>
          <Route path='/cinema/profile' element={<CinemaProtectedRoute><CinemaUserProfile /></CinemaProtectedRoute>}></Route>
          <Route path='/admin/profile' element={<AdminUserProfile />}></Route>
        </Routes>
      </BrowserRouter>
    </>

  )
}

export default App
