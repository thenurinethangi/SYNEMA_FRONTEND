import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Navigation from '../components/user/Navigation';
import SignIn from '../components/user/SignIn';
import SignUp from '../components/user/SignUp';
import OTPModel from '../components/user/OTPModel';
import { cancelBooking, getMyBookings } from '../services/user/bookingService';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

function MyBookings() {

    const navigate = useNavigate();

    const { user, loading } = useSelector((state: RootState) => state.auth);

    const [signInVisible, setSignInVisible] = useState(false);
    const [signUpVisible, setSignUpVisible] = useState(false);
    const [otpVisible, setOtpVisible] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    const [bookings, setBookings] = useState([]);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);

    useEffect(() => {
        loadBookings();
    }, []);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/', { replace: true });
        }
        if (!loading && user && !user.roles.includes('USER')) {
            navigate('/', { replace: true });
        }
    }, [loading, user, navigate]);

    async function loadBookings() {
        try {
            const res = await getMyBookings();
            console.log(res.data.data);
            setBookings(res.data.data)
        }
        catch (e) {
            console.log(e);
        }
    }

    function formatShowDate(dateStr) {
        return new Date(dateStr).toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short"
        }).replace(",", "");
    }

    function formatShowTime(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    }

    function isBookingExpired(dateStr) {
        return new Date(dateStr).getTime() < Date.now();
    }

    function handleCancelBooking(booking) {
        setSelectedBooking(booking);
        setCancelModalVisible(true);
    }

    async function confirmCancelBooking() {

        setCancelModalVisible(false);

        try {
            const res = await cancelBooking(selectedBooking._id);
            console.log(res.data.data);
            loadBookings();
        }
        catch (e) {
            toast.error('Cancellation failed!');
            console.log(e);
        }
    }

    return (
        <div className='bg-[#121212] font-[Poppins] text-white min-h-screen overflow-x-hidden relative'>

            {/* Navigation */}
            <Navigation setSignInVisible={setSignInVisible} page='' />

            {/* Header */}
            <div className='px-15 md:px-20 pt-37 pb-6'>
                <h1 className='text-[16.5px] tracking-wide'>My Bookings</h1>
            </div>

            {/* Bookings List */}
            <div className='px-15 md:px-20 pb-20'>
                {bookings.length > 0 ? (
                    <div className='flex flex-col gap-5'>
                        {bookings.map((booking: any) => {
                            const isExpired = isBookingExpired(booking?.showtimeId.date);
                            return (
                                <div
                                    key={booking?._id}
                                    className='w-[100%] h-[480px] md:w-[710px] md:h-[128px] pt-3 md:pt-0 flex flex-col md:flex-row items-center gap-6 p-2 bg-[#1a1a1a]/40 rounded-md border border-white/5 hover:border-white/10 transition-all'
                                >
                                    {/* Poster */}
                                    <div className='flex-shrink-0'>
                                        <div className="w-full h-[200px] md:w-[150px] md:h-[115px] relative overflow-hidden rounded-sm">
                                            <img
                                                src={booking?.movie.posterImageUrl}
                                                className={`w-full h-full object-cover`}
                                                alt={booking?.movie.title}
                                            />
                                        </div>
                                    </div>

                                    {/* Details */}
                                    <div className='flex-1 flex flex-col justify-center items-center md:items-start h-[120px]'>
                                        <div>
                                            <h2 className='text-[15px] font-medium mb-1 text-center md:text-start'>{booking?.movie.title}</h2>
                                            <p className='text-[13px] text-white/75 mb-4 text-center md:text-start'>{booking?.cinema?.cinemaName}-{booking?.screen?.screenName}</p>

                                            <div className='space-y-0.5'>
                                                <p className='text-[12px] text-white/50 text-center md:text-start'>
                                                    {formatShowDate(booking?.showtimeId.date)} at {formatShowTime(booking?.showtimeId.time)}
                                                </p>
                                                <p className='text-[12px] text-white/50 text-center md:text-start'>
                                                    Seat Number: <span className='text-white/90'>{booking?.seatsDetails.join(', ')}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Price and Action */}
                                    <div className='flex flex-col items-end justify-center h-[160px] mr-2'>
                                        <div className='text-right'>
                                            <p className='text-[20px] font-medium'>{booking?.total}</p>
                                            <p className='text-[11px] text-white/50 mt-0.5'>Total Tickets: {booking?.seatsDetails.length}</p>
                                        </div>

                                        {!isExpired && booking?.status !== 'Canceled' && (
                                            <button
                                                onClick={() => handleCancelBooking(booking)}
                                                className='mt-2 px-3 py-2 bg-[#FF4646] hover:bg-[#ff5555] rounded-[1px] text-[12.5px] font-medium text-white transition-all'
                                            >
                                                Cancel Booking
                                            </button>
                                        )}
                                        {booking?.status === 'Canceled' ?
                                            <p className='text-[13px] mt-2 text-gray-500'>Booking Canceled</p>
                                            :
                                            ''}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className='text-center py-32'>
                        <p className='text-[16px] text-white/40'>No bookings yet</p>
                    </div>
                )}
            </div>

            {/* Cancel Confirmation Modal */}
            {cancelModalVisible && selectedBooking && (
                <div
                    className='fixed inset-0 bg-black/40 backdrop-blur-md flex items-center justify-center z-50 px-4'
                    onClick={() => setCancelModalVisible(false)}
                >
                    <div
                        className='bg-black shadow-2xl rounded-lg border border-white/5 p-8 max-w-md w-full'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='flex items-start justify-between mb-5'>
                            <div>
                                <p className='text-[12px] text-white/50'>BOOKING ID: {selectedBooking?._id}</p>
                            </div>
                            <button
                                onClick={() => setCancelModalVisible(false)}
                                className='text-white/60 hover:text-white transition-colors'
                            >
                                <X className='w-5 h-5' />
                            </button>
                        </div>

                        <div className='mb-3 p-2 border border-white/5 rounded-sm'>
                            <p className='text-[15px] font-normal mb-2'>{selectedBooking?.movie.title}</p>
                            <p className='text-[13px] text-white/60'>{selectedBooking?.cinema.cinemaName}</p>
                            <p className='text-[13px] text-white/60'>{formatShowDate(selectedBooking?.showtimeId.date)} at {formatShowTime(selectedBooking?.showtimeId.date)}</p>
                            <p className='text-[13px] text-white/60 mt-2'>Seats: {selectedBooking?.seatsDetails.join(', ')}</p>
                        </div>

                        <p className='text-[13px] text-white/70 mb-8'>
                            Cancelling this booking is permanent, non-refundable, cannot be undone, and will immediately release your seats according to SYNEMA policies.
                        </p>

                        <div className='flex gap-3'>
                            <button
                                onClick={() => setCancelModalVisible(false)}
                                className='flex-1 px-6 py-2.5 border border-white/20 hover:border-white/40 rounded-xs tracking-widest  transition-all text-[13px] font-normal'
                            >
                                Keep Booking
                            </button>
                            <button
                                onClick={confirmCancelBooking}
                                className='flex-1 px-6 h-[38px] text-black bg-white rounded-xs tracking-widest transition-all text-[13px] font-medium'
                            >
                                Yes, Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* sign in model */}
            {signInVisible ? <SignIn setSignInVisible={setSignInVisible} setSignUpVisible={setSignUpVisible} setOtpVisible={setOtpVisible} setUserEmail={setUserEmail} /> : ''}

            {/* sign up model */}
            {signUpVisible ? <SignUp setSignInVisible={setSignInVisible} setSignUpVisible={setSignUpVisible} setOtpVisible={setOtpVisible} setUserEmail={setUserEmail} /> : ''}

            {/* otp model */}
            {otpVisible ? <OTPModel setOtpVisible={setOtpVisible} userEmail={userEmail} setUserEmail={setUserEmail} setSignInVisible={setSignInVisible} /> : ''}
        </div>
    );
}

export default MyBookings;