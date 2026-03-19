import React, { useState, useEffect } from 'react'
import { X, Check } from "lucide-react";
import arrow from '../assets/images/play (5).png'
import Navigation from '../components/user/Navigation';
import { useParams } from 'react-router-dom';
import SignIn from '../components/user/SignIn';
import SignUp from '../components/user/SignUp';
import { getShowtimeDetailsById, getUnavailableSeats } from '../services/user/showtimeService';
import UserTicketSelect from './userTicketSelect';
import OTPModel from '../components/user/OTPModel';
import Payment from '../components/user/booking/Payment';
import { Elements } from '@stripe/react-stripe-js';
import { stripePromise } from '../config/stripe';
import { checkIsSeatLock, checkLockedSeats, lockSeats } from '../services/user/seatsService';
import CountdownTimer from '../components/user/booking/CountdownTimer';
import TimeOutModel from '../components/user/booking/TimeOutModel';
import LoadingSpinner from '../components/user/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

function UserSheetSelect() {

    const { id } = useParams();

    const { user, loading } = useSelector((state: RootState) => state.auth);

    const alphabetUpper = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
    const pastelColors = ["border-[#FFB3BA] bg-[#FFB3BA]", "border-[#FFDFBA] bg-[#FFDFBA]", "border-[#FFFFBA] bg-[#FFFFBA]", "border-[#BAFFC9] bg-[#BAFFC9]", "border-[#BAE1FF] bg-[#BAE1FF]", "border-[#E2BAFF] bg-[#E2BAFF]", "border-[#FFD6E0] bg-[#FFD6E0]", "border-[#D6F5FF] bg-[#D6F5FF]", "border-[#E8FFD6] bg-[#E8FFD6]", "border-[#F3D9FF] bg-[#F3D9FF]", "border-[#FFF0D9] bg-[#FFF0D9]", "border-[#D9FFF8] bg-[#D9FFF8]"];

    const [activeTab, setActiveTab] = useState('Seats');

    const [signInVisible, setSignInVisible] = useState(false);
    const [signUpVisible, setSignUpVisible] = useState(false);
    const [otpVisible, setOtpVisible] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    const [showtimeDeatils, setShowtimeDeatils] = useState<any>({});
    const [seatTypes, setSeatTypes] = useState<any>([]);
    const [unavailableSeats, setUnavailableSeats] = useState<any>([]);
    const [selectedSeats, setSelectedSeats] = useState<any>([]);
    const [selectedSeatsTypes, setSelectedSeatsTypes] = useState<any>([]);

    const [choosedTicketTypesCount, setChoosedTicketTypesCount] = useState<any>(null);
    const [totalPayable, setTotalPayable] = useState<any>('');

    const [seatsLockingCheckResult, setSeatsLockingCheckResult] = useState<any>([]);
    let seatCounter = 0;

    const [timerShow, setTimerShow] = useState<boolean>(false);

    const FIVE_MINUTES = 5 * 60;
    const [timeLeft, setTimeLeft] = useState<number>(FIVE_MINUTES);

    const [timeOutModelDisplay, setTimeOutModelDisplay] = useState<boolean>(false);

    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (!timerShow) return;

        const interval = setInterval(() => {
            setTimeLeft(prev => {
                console.log('Current time:', prev);

                if (prev - 1 <= 0) {
                    console.log('Time is up!');
                    setTimeOutModelDisplay(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timerShow]);

    useEffect(() => {
        loadShowtimeDetails();
    }, []);

    async function loadShowtimeDetails() {
        if (!id) {
            //load error page
            return;
        }
        try {
            const res = await getShowtimeDetailsById(id);
            console.log(res.data.data);
            setShowtimeDeatils(res.data.data);

            let arr: any = [];
            for (let i = 0; i < res.data.data.seats.length; i++) {
                const row = res.data.data.seats[i];
                for (let j = 0; j < row.length; j++) {
                    const e = row[j];
                    if (e && !arr.includes(e.type)) {
                        arr.push(e.type);
                    }
                }
            }
            console.log(arr);
            setSeatTypes(arr);

            const res2 = await getUnavailableSeats(id);
            console.log('res2', res2.data.data);

            let arr2 = [];
            for (let i = 0; i < res2.data.data.length; i++) {
                const e = res2.data.data[i];
                for (let j = 0; j < e.seatsDetails.length; j++) {
                    const seatId = e.seatsDetails[j];
                    arr2.push(seatId);
                }
            }
            console.log('-------', arr2);
            setUnavailableSeats(arr2);

            const res4 = await checkLockedSeats(res.data.data._id);
            console.log(res4.data.data);
            setSeatsLockingCheckResult(res4.data.data);

        }
        catch (e) {
            console.log(e);
        }
    }

    function formatToTime12h(dateString: string) {
        const date = new Date(dateString);

        return date.toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    }

    function formatShowDate(dateStr: string) {
        const slDate = new Date(
            new Date(dateStr).toLocaleString("en-US", { timeZone: "Asia/Colombo" })
        );

        const todaySL = new Date(
            new Date().toLocaleString("en-US", { timeZone: "Asia/Colombo" })
        );

        const isToday =
            slDate.getFullYear() === todaySL.getFullYear() &&
            slDate.getMonth() === todaySL.getMonth() &&
            slDate.getDate() === todaySL.getDate();

        if (isToday) {
            return "Today";
        }

        return slDate.toLocaleDateString("en-GB", {
            weekday: "short",
            day: "2-digit",
            month: "short"
        }).replace(",", "");
    }

    function getSeatColor(type: string) {
        for (let i = 0; i < seatTypes.length; i++) {
            const t = seatTypes[i];
            if (t === type) {
                return `border ${pastelColors[i]} hover:bg-red-500 hover:border-red-500`;
            }
        }
        return 'border border-[#E0E0E0] bg-[#E0E0E0]';
    }

    function getSeatStyle(type: string) {
        const index = seatTypes.indexOf(type);

        if (index === -1) {
            return {
                border: "1px solid #E0E0E0",
                backgroundColor: "#E0E0E0"
            };
        }

        return {
            border: `1px solid ${pastelColors[index]}`,
            backgroundColor: pastelColors[index]
        };
    }

    function checkAvailabilityOfASeat(seatId: string) {

        if (unavailableSeats.includes(seatId)) {
            return `border border-[#d8d8d8] bg-[#d8d8d8] pointer-events-none`;
        }
        return '';
    }

    function checkIsSeatLocked(seatIndex: number) {
        if (seatIndex >= seatsLockingCheckResult.length) return '';

        const seat = seatsLockingCheckResult[seatIndex];

        if (!seat.locked) return '';
        if (seat.locked && seat.lockedByMe) return '';
        return 'border border-[#d8d8d8] bg-[#d8d8d8] pointer-events-none';
    }

    function checkIsSeatSelect(seatId: string) {

        if (selectedSeats.includes(seatId)) {
            return `border border-red-500 bg-red-500`;
        }
        return '';
    }

    function handleSeatClick(e: React.MouseEvent<HTMLDivElement>) {
        const seatStr: any = e.currentTarget.dataset.seat;
        const seat = seatStr ? JSON.parse(seatStr) : null;

        if (!seat) return;

        const seatId = seat.id;
        const seatType = seat.type;

        const isSelected = selectedSeats.includes(seatId);

        if (isSelected) {
            setSelectedSeats(prev =>
                prev.filter(id => id !== seatId)
            );

            setSelectedSeatsTypes(prev => {
                const idx = prev.indexOf(seatType);
                if (idx === -1) return prev;

                const copy = [...prev];
                copy.splice(idx, 1);
                return copy;
            });
        }
        else {
            setSelectedSeats(prev => [...prev, seatId]);

            setSelectedSeatsTypes(prev => [...prev, seatType]);
        }
    }

    async function handleShowTicketSelectTab() {

        if (!user || !user?.roles.includes('USER')) {
            setSignInVisible(true);
            return;
        }

        setIsLoading(true);

        const data = {
            showId: showtimeDeatils._id,
            seats: selectedSeats,
        };
        console.log(data);

        try {
            const res = await lockSeats(data);
            console.log('lock', res.data);
            setActiveTab('Tickets');
            setTimeLeft(FIVE_MINUTES)
            setTimerShow(true);
        }
        catch (e) {
            console.log(e);
        }

        setIsLoading(false);
    }

    function restartBooking() {
        window.location.reload();
    }

    function checkRowHasSeats(row: any) {

        for (let i = 0; i < row.length; i++) {
            const seat = row[i];
            if (seat) {
                return true;
            }
        }
        return false
    }

    return (
        <div className='bg-[#121212] font-[Poppins] text-white overflow-x-hidden relative pb-15'>

            {/* navigation */}
            <Navigation setSignInVisible={setSignInVisible} page={''} />

            {/* hero */}
            <div className='relative w-full h-[320px] overflow-x-hidden overflow-y-auto'>
                <div className='w-full h-full'>
                    <img src={showtimeDeatils.movieId?.bannerImageUrl} className='w-full h-full object-cover blur-xs'></img>
                </div>
                <div className='w-full h-full absolute top-0 inset-0 bg-gradient-to-t from-black/20 via-black/20 to-transparent flex justify-center items-end'>
                    <div className='flex items-start gap-5 pb-7'>
                        <div>
                            <img src={showtimeDeatils.movieId?.posterImageUrl} width={'122px'} className='rounded-xs'></img>
                        </div>
                        <div>
                            <p className='bg-blue-300 text-black mb-1.5 rounded-xs text-[10px] font-semibold p-1 inline'>PROCESSING</p>
                            <p className='text-[29px] font-medium'>{showtimeDeatils.movieId?.title}</p>
                            <p className='text-[15px]'>{showtimeDeatils.cinemaId?.cinemaName}: <span>{showtimeDeatils.screenId?.screenName} ({showtimeDeatils.formatShowing})</span></p>
                            <p className='text-[15px] mb-2'>{formatShowDate(showtimeDeatils.date)} {formatToTime12h(showtimeDeatils.time)}</p>
                            <div className='flex items-center gap-1 flex-wrap w-[300px]'>
                                {Object.keys(showtimeDeatils.ticketPrices ?? {}).map((key: string, index: number) => (
                                    <p key={index} className='text-[12px] text-black/80 px-1 py-0.5 bg-gray-200 rounded-xs inline'>{key}: <span>{showtimeDeatils.ticketPrices[key]}</span></p>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                {timerShow ?
                    <div className='absolute right-4 bottom-4.5'>
                        {/* timer */}
                        <CountdownTimer timeLeft={timeLeft} />
                    </div>
                    :
                    ''
                }
            </div>

            {activeTab === 'Seats' ?
                <div>
                    <div className='w-full h-[45px] bg-[#E0E0E0] flex items-center -translate-y-1'>
                        <div className='bg-[#1e1e1e] w-[25%] flex items-center justify-end'>
                            <p className='w-[80%] text-center text-[14px] font-medium'>Seats</p>
                            <img src={arrow} width={'45px'} className='translate-x-9'></img>
                        </div>

                        <div className='bg-[#E0E0E0] w-[25%] flex items-center justify-end'>
                            <p className='w-[80%] text-center text-[14px] font-medium text-black'>Tickets</p>
                            <img src={arrow} width={'45px'} className='translate-x-9 hidden'></img>
                        </div>

                        <div className='bg-[#E0E0E0] w-[25%] flex items-center justify-end'>
                            <p className='w-[80%] text-center text-[14px] font-medium text-black'>Payment</p>
                            <img src={arrow} width={'45px'} className='translate-x-9 hidden'></img>
                        </div>

                        <div className='bg-[#E0E0E0] w-[25%] flex items-center justify-end'>
                            <p className='w-[80%] text-center text-[14px] font-medium text-black'>Confirmation</p>
                            <img src={arrow} width={'45px'} className='translate-x-9 hidden'></img>
                        </div>
                    </div>

                    <div className='px-8 sm:px-15 mt-15 flex flex-col items-center w-screen overflow-x-auto no-scrollbar overscroll-x-contain'>
                        {/* screen */}
                        <div className="w-[100%] sm:w-[50%] mx-auto mb-6">
                            <svg width="100%" height="35" viewBox="0 0 600 35" xmlns="http://www.w3.org/2000/svg" className="mx-auto">
                                <defs>
                                    {/* Screen gradient matching #121212 environment */}
                                    <linearGradient id="screenDark212" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#2a2a2a" />
                                        <stop offset="100%" stopColor="#9E9E9E" />
                                    </linearGradient>

                                    {/* Glow tuned for #121212 background - more visible */}
                                    <radialGradient id="glow212" cx="50%" cy="0%" r="60%">
                                        <stop offset="0%" stopColor="#9E9E9E" stopOpacity="0.7" />
                                        <stop offset="50%" stopColor="#9E9E9E" stopOpacity="0.3" />
                                        <stop offset="100%" stopColor="transparent" />
                                    </radialGradient>
                                </defs>

                                {/* Ultra-thin curved cinema screen - much wider */}
                                <path
                                    d="M10 8 Q300 4 590 8 L590 18 Q300 15 10 18 Z"
                                    fill="url(#screenDark212)"
                                    rx="12"
                                />

                                {/* Soft glow below screen - more visible */}
                                <ellipse
                                    cx="300"
                                    cy="26"
                                    rx="280"
                                    ry="10"
                                    fill="url(#glow212)"
                                    opacity="0.9"
                                />
                            </svg>
                        </div>

                        {/* sheets */}
                        {showtimeDeatils.seats?.map((row, rowIndex) => (
                            <div key={rowIndex} className='flex items-center gap-10 mb-1.5'>
                                <div className={`w-[17px] ${checkRowHasSeats(row) ? 'opacity-100' : 'opacity-0'}`}>{alphabetUpper[rowIndex]}</div>
                                <div className='flex items-center gap-1.5'>
                                    {row.map((seat, seatIndex) => {
                                        const lockedClass = seat ? checkIsSeatLocked(seatCounter) : '';
                                        if (seat) seatCounter++;
                                        return (
                                            <div onClick={handleSeatClick} data-seat={JSON.stringify(seat)} key={seatIndex} className={`w-[22px] h-[22px] rounded-xs flex items-center justify-center transition-all duration-200
                                            ${seat ? getSeatColor(seat.type) : 'border border-[#121212] bg-[#121212] opacity-0 invisible'}
                                            ${lockedClass}
                                            ${seat ? checkIsSeatSelect(seat.id) : ''} 
                                            ${seat ? checkAvailabilityOfASeat(seat.id) : ''} 
                                            `}>
                                                <X className={`w-4.5 h-4.5 ${lockedClass.includes('bg-[#d8d8d8]') || (seat && checkAvailabilityOfASeat(seat.id) === 'border border-[#d8d8d8] bg-[#d8d8d8] pointer-events-none') ? '' : 'hidden'}`} />
                                                <Check className={`w-4.5 h-4.5 ${checkIsSeatSelect(seat?.id) === 'border border-red-500 bg-red-500' ? '' : 'hidden'}`} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}

                        {/* category */}
                        <div className='mt-25 flex flex-wrap items-center gap-10 py-2 px-5 rounded-sm'>
                            {seatTypes.map((type: any, index: number) => (
                                <div key={type} className='flex items-center gap-3'>
                                    <div className={`w-[22px] h-[22px] ${getSeatColor(type)} rounded-xs`}></div>
                                    <p className='text-[13px]'>{type}</p>
                                </div>
                            ))}

                            <div className='flex items-center gap-3'>
                                <div className='w-[22px] h-[22px] border border-[#d8d8d8] bg-[#d8d8d8] rounded-xs flex justify-center items-center'>
                                    <X className='w-4.5 h-4.5'></X>
                                </div>
                                <p className='text-[13px]'>Reserved</p>
                            </div>

                            <div className='flex items-center gap-3'>
                                <div className='w-[22px] h-[22px] border border-red-500 bg-red-500 rounded-xs flex justify-center items-center'>
                                    <Check className='w-4.5 h-4.5'></Check>
                                </div>
                                <p className='text-[13px]'>Selected</p>
                            </div>
                        </div>

                        <div className='mt-25'>
                            <button onClick={handleShowTicketSelectTab} className='flex items-center gap-2.5 px-7 py-3 rounded-br-3xl text-[14.8px] bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300'>Continue To Next
                                {isLoading ? <LoadingSpinner /> : ''}
                            </button>
                        </div>

                    </div>
                </div>
                :
                ''
            }

            {activeTab === 'Tickets' ? <UserTicketSelect setActiveTab={setActiveTab} showtimeDeatils={showtimeDeatils} selectedSeats={selectedSeats} selectedSeatsTypes={selectedSeatsTypes} setChoosedTicketTypesCount={setChoosedTicketTypesCount} setTotalPayable={setTotalPayable} /> : ''}

            {activeTab === 'Payment' ? <Elements stripe={stripePromise}><Payment setActiveTab={setActiveTab} showtimeDeatils={showtimeDeatils} selectedSeats={selectedSeats} choosedTicketTypesCount={choosedTicketTypesCount} totalPayable={totalPayable} /></Elements> : ''}

            {timeOutModelDisplay ? <TimeOutModel restartBooking={restartBooking} /> : ''}

            {/* sign in model */}
            {signInVisible ? <SignIn setSignInVisible={setSignInVisible} setSignUpVisible={setSignUpVisible} setOtpVisible={setOtpVisible} setUserEmail={setUserEmail} /> : ''}

            {/* sign up model */}
            {signUpVisible ? <SignUp setSignInVisible={setSignInVisible} setSignUpVisible={setSignUpVisible} setOtpVisible={setOtpVisible} setUserEmail={setUserEmail} /> : ''}

            {/* otp model */}
            {otpVisible ? <OTPModel setOtpVisible={setOtpVisible} userEmail={userEmail} setUserEmail={setUserEmail} setSignInVisible={setSignInVisible} /> : ''}

        </div>
    )
}

export default UserSheetSelect