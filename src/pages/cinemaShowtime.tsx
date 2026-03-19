import { useEffect, useState } from 'react'
import { Home, Tv, Clock, Search, Settings, Bell, User, Film, Tag, Wallet, Filter, DollarSign, CheckCircle, AlertCircle, Users, Eye, Download } from 'lucide-react';
import SidebarNavigation from '../components/cinema/SidebarNavigation';
import Showtimes from '../components/cinema/Showtimes';
import AddShowtime from '../components/cinema/AddShowtime';
import { getAllTransactions, getCinemaRevenue } from '../services/cinema/transactionService';
import { getScheduledShowtimesCount, getTodayShowtimesCount, getTotalShowtimesCount } from '../services/cinema/showtimeService';

import { useSelector } from "react-redux";
import type { RootState } from "../store/store";
import { useNavigate } from 'react-router-dom';

function CinemaShowTime() {

    const { user, loading } = useSelector((state: RootState) => state.auth);

    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState('showtimes');
    const [load, setLoad] = useState(0);
    const [showtimesList, setShowtimesList] = useState([]);

    const [totalShowtimes, setTotalShowtimes] = useState(0);
    const [todayShowtimes, setTodayShowtimes] = useState(0);
    const [scheduledShowtimes, setScheduledShowtimes] = useState(0);
    const [revenue, setRevenue] = useState(0);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/cinema/landing', { replace: true });
        }
        if (!loading && user && !user.roles.includes('CINEMA')) {
            navigate('/cinema/landing', { replace: true });
        }
    }, [loading, user, navigate]);

    useEffect(() => {
        loadStats();
    }, []);

    async function loadStats() {
        try {
            const res = await getTotalShowtimesCount();
            setTotalShowtimes(res.data.data);

            const res2 = await getTodayShowtimesCount();
            setTodayShowtimes(res2.data.data);

            const res3 = await getScheduledShowtimesCount();
            setScheduledShowtimes(res3.data.data);

            const res4 = await getCinemaRevenue();
            setRevenue(res4.data.data);
        }
        catch (e) {
            console.log(e);
        }
    }


    return (
        <div className='bg-[#121212] flex font-[Poppins] min-h-screen'>
            {/* Sidebar Navigation */}
            <SidebarNavigation page={'showtimes'} />

            {/* Main Content */}
            <div className='flex-1 text-white px-3 sm:px-7 py-3 pt-7 overflow-auto ml-[25px] sm:ml-[65px]'>
                {/* Header */}
                <div className='flex justify-between items-center mb-[22px]'>
                    <div>
                        <div className="flex items-center space-x-3">
                            <span className="bg-gradient-to-r from-red-900 to-red-700 bg-clip-text text-transparent text-[16.5px] font-semibold z-0">
                                <span className='text-[18px] font-medium text-gray-500'>Home {`>`}</span>&nbsp;Showtimes
                            </span>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6'>
                    <div className='bg-[#1e1e1e] rounded-lg p-4 border border-gray-800'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-[12px] text-gray-500 mb-1'>Total Showtimes</p>
                                <p className='text-[18px] font-medium text-white'>{totalShowtimes}</p>
                            </div>
                            <Tag className='w-8 h-8 text-red-700 opacity-20' />
                        </div>
                    </div>
                    <div className='bg-[#1e1e1e] rounded-lg p-4 border border-gray-800'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-[12px] text-gray-500 mb-1'>Today</p>
                                <p className='text-[18px] font-medium text-green-500'>{todayShowtimes}</p>
                            </div>
                            <CheckCircle className='w-8 h-8 text-green-500 opacity-20' />
                        </div>
                    </div>
                    <div className='bg-[#1e1e1e] rounded-lg p-4 border border-gray-800'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-[12px] text-gray-500 mb-1'>Scheduled</p>
                                <p className='text-[18px] font-medium text-orange-500'>{scheduledShowtimes}</p>
                            </div>
                            <AlertCircle className='w-8 h-8 text-orange-500 opacity-20' />
                        </div>
                    </div>
                    <div className='bg-[#1e1e1e] rounded-lg p-4 border border-gray-800'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-[12px] text-gray-500 mb-1'>Revenue</p>
                                <p className='text-[18px] font-medium text-white'>{revenue} LKR</p>
                            </div>
                            <DollarSign className='w-8 h-8 text-red-700 opacity-20' />
                        </div>
                    </div>
                </div>

                {/* tabs */}
                <div className='flex items-center gap-6 border-b border-gray-800 mb-6'>
                    <button
                        onClick={() => setActiveTab('showtimes')}
                        className={`px-2.5 pb-2 text-[18px] -mb-[1px] transition-colors ${activeTab === 'showtimes' ? 'border-b-2 border-red-900 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Showtimes
                    </button>
                    <button
                        onClick={() => setActiveTab('add')}
                        className={`px-2.5 pb-2 text-[18px] -mb-[1px] transition-colors ${activeTab === 'add' ? 'border-b-2 border-red-900 text-white' : 'text-gray-500 hover:text-gray-300'}`}
                    >
                        Add
                    </button>
                </div>

                {/* Table Card */}
                {activeTab === 'showtimes' ? <Showtimes load={load} setLoad={setLoad} setShowtimesList={setShowtimesList} /> : ''}

                {/* Form */}
                {activeTab === 'add' ? <AddShowtime setShowtimesList={setShowtimesList} /> : ''}

            </div>
        </div>
    )
}

export default CinemaShowTime