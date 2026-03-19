import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Search, User, Tags, Bookmark, ChevronLeft, ChevronRight, ListFilterPlus } from "lucide-react";
import { getAllShowtimesOfAMovie } from '../../../services/user/showtimeService';
import FilterModel from '../showtime/FilterModel';

type TimeFrame = "Morning" | "Afternoon" | "Evening" | "Night";

function Showtimes(props: any) {

    const navigate = useNavigate();

    const [dates, setDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [showtimesList, setShowtimesList] = useState([]);
    const [selectedDateShowtimes, setSelectedDateShowtimes] = useState<any>([]);
    const [immutableSelectedDateShowtimes, setImmutableSelectedDateShowtimes] = useState<any>([]);

    const [showFiltersModel, setShowFiltersModel] = useState(false);

    const [experience, setExperience] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        setDates(getNext7Days());
        loadAllShowtimeOfAMovie();
    }, []);

    async function loadAllShowtimeOfAMovie() {
        try {
            const res = await getAllShowtimesOfAMovie(props.id);
            console.log(res.data.data);
            setShowtimesList(res.data.data);

            for (let i = 0; i < res.data.data.length; i++) {
                const e = res.data.data[i];
                if (e.length > 0) {
                    setSelectedDate(formatShowDate(e[0][0].date));
                    setSelectedDateShowtimes(e);
                    setImmutableSelectedDateShowtimes(e);
                    break;
                }
            }
        }
        catch (e) {
            console.log(e);
        }
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

    function getNext7Days() {
        const days: string[] = [];
        const today = new Date();

        for (let i = 0; i < 7; i++) {
            const d = new Date();
            d.setDate(today.getDate() + i);

            if (i === 0) {
                days.push("TODAY");
            } else {
                const formatted = d.toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "2-digit",
                    month: "short"
                });

                days.push(formatted.replace(",", ""));
            }
        }
        return days;
    }

    function formatToTime12h(dateString: string) {
        const date = new Date(dateString);

        return date.toLocaleString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        });
    }

    function handleNavigateToBookingPage(showtimeId: string) {
        if (showtimeId) {
            navigate('/booking/' + showtimeId);
        }
    }

    function isTimeNotPast(dateTimeString: string): boolean {
        const givenTime = new Date(dateTimeString).getTime();
        const now = Date.now();

        return givenTime > now;
    }

    function isTimeInFrame(dateTime: string, timeFrame: TimeFrame): boolean {
        const date = new Date(dateTime);
        const hours = date.getHours();
        const minutes = date.getMinutes();

        const totalMinutes = hours * 60 + minutes;

        switch (timeFrame) {
            case "Morning":
                return totalMinutes >= 6 * 60 && totalMinutes <= 11 * 60 + 59;

            case "Afternoon":
                return totalMinutes >= 12 * 60 && totalMinutes <= 16 * 60 + 59;

            case "Evening":
                return totalMinutes >= 17 * 60 && totalMinutes <= 20 * 60 + 59;

            case "Night":
                return (
                    totalMinutes >= 21 * 60 ||
                    totalMinutes <= 5 * 60 + 59
                );

            default:
                return false;
        }
    }

    function filterShowtimes(rules: any) {

        setExperience(rules.experience);
        setTime(rules.time);

        const arr = [];

        if (rules.experience && rules.time) {
            for (let i = 0; i < immutableSelectedDateShowtimes.length; i++) {
                const singleScreenShowtimesList: any = immutableSelectedDateShowtimes[i];
                const ar = [];
                for (let j = 0; j < singleScreenShowtimesList.length; j++) {
                    const showtime = singleScreenShowtimesList[j];
                    if (showtime.formatShowing === rules.experience && isTimeInFrame(showtime.time, rules.time)) {
                        ar.push(showtime);
                    }
                }
                if (ar.length > 0) {
                    arr.push(ar);
                }
            }
            setSelectedDateShowtimes(arr);
        }
        else if (rules.experience) {
            for (let i = 0; i < immutableSelectedDateShowtimes.length; i++) {
                const singleScreenShowtimesList: any = immutableSelectedDateShowtimes[i];
                const ar = [];
                for (let j = 0; j < singleScreenShowtimesList.length; j++) {
                    const showtime = singleScreenShowtimesList[j];
                    if (showtime.formatShowing === rules.experience) {
                        ar.push(showtime);
                    }
                }
                if (ar.length > 0) {
                    arr.push(ar);
                }
            }
            setSelectedDateShowtimes(arr);
        }
        else if (rules.time) {
            for (let i = 0; i < immutableSelectedDateShowtimes.length; i++) {
                const singleScreenShowtimesList: any = immutableSelectedDateShowtimes[i];
                const ar = [];
                for (let j = 0; j < singleScreenShowtimesList.length; j++) {
                    const showtime = singleScreenShowtimesList[j];
                    if (isTimeInFrame(showtime.time, rules.time)) {
                        ar.push(showtime);
                    }
                }
                if (ar.length > 0) {
                    arr.push(ar);
                }
            }
            setSelectedDateShowtimes(arr);
        }
        else {
            setSelectedDateShowtimes(immutableSelectedDateShowtimes);
        }
    }

    return (
        <div className='mb-47'>
            <div className='px-8 sm:px-13 flex items-center justify-between'>
                <div>
                    <ChevronLeft />
                </div>
                <div className='flex items-center justify-between w-[100%] overflow-x-auto no-scrollbar overscroll-x-contain'>
                    {dates.map((d, index: number) => (
                        <div onClick={(e) => {
                            if (showtimesList[index]?.length > 0) {
                                setSelectedDate(d);
                                setSelectedDateShowtimes(showtimesList[index]);
                                setImmutableSelectedDateShowtimes(showtimesList[index]);
                                setExperience('');
                                setTime('');
                            }
                        }}
                            key={index} className={`whitespace-nowrap mx-8.5 cursor-pointer ${showtimesList[index]?.length > 0 && selectedDate.toLowerCase() !== d.toLowerCase() ? 'text-white' : 'text-[#BDBDBD] font-light opacity-70'} ${selectedDate.toLowerCase() === d.toLowerCase() ? 'border-b-4 border-b-red-500 pb-3.5 px-3 text-red-600 font-medium' : ''}`}>{d}</div>
                    ))}
                </div>
                <div>
                    <ChevronRight />
                </div>
            </div>

            <div className='px-14.5 flex flex-col gap-[3px] mt-8'>
                <hr className='border-red-400/17'></hr>
                <hr className='border-red-400/17'></hr>
            </div>

            <div onClick={(e) => setShowFiltersModel(true)} className='mt-8 flex justify-end items-start px-14 cursor-pointer'>
                <ListFilterPlus className='w-5.5 h-5.5 text-white/95' />
            </div>

            <div className='px-8 sm:px-14 mt-2'>
                {/* single screen show time */}
                {selectedDateShowtimes.length > 0 ? selectedDateShowtimes.map((s: any, index: number) => (
                    <div key={index} className='flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-7'>
                        <div className='w-[25%]'>
                            <p className='text-[16.8px] font-normal'>{s[0].screenId.screenName}</p>
                            <p className='text-[12px] text-gray-500 font-normal'>{s[0].cinemaId.cinemaName}</p>
                        </div>
                        <div className='flex flex-wrap items-center ml-8 sm:ml-0 relative gap-13'>
                            {s.map((t: any, index: number) => (
                                <div key={index} className='flex items-center -translate-x-2.5 relative'>
                                    <div className={`absolute left-0 rotate-270 w-[72.3px] py-[1px] text-center text-black font-medium border text-[14px] origin-top-left -translate-x-[23px] translate-y-[48px] ${isTimeNotPast(t.time) ? 'bg-red-400 border-red-300' : 'bg-gray-500 border-gray-400'}`}>{t.formatShowing}</div>
                                    <div className={`group flex flex-col justify-between items-center border rounded-br-xl pt-2 ${isTimeNotPast(t.time) ? 'border-red-300' : 'border-gray-500 pointer-events-none'}`}>
                                        <div className='flex'>
                                            <p className={`pl-1.5 pr-1 text-[23px] font-medium ${isTimeNotPast(t.time) ? '' : 'text-gray-500'}`}>{formatToTime12h(t.time).split(' ')[0]}</p>
                                            <p className={`pr-1.5 pb-1 text-[11px] font-medium self-end ${isTimeNotPast(t.time) ? '' : 'text-gray-500'}`}>{formatToTime12h(t.time).split(' ')[1]}</p>
                                        </div>
                                        <button onClick={() => handleNavigateToBookingPage(t._id)} data-id={t._id} className={`w-full text-[13.7px] font-medium text-black py-1 px-2 rounded-br-xl ${isTimeNotPast(t.time) ? 'bg-red-400 cursor-pointer' : 'bg-gray-500'}`}>Book Now</button>
                                        {/* Hover Tooltip */}
                                        <div className='absolute -top-16 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 ease-out group-hover:pointer-events-none z-100'>
                                            <div className='bg-gray-400/85 text-white px-4 py-3 rounded-sm shadow-2xl'>
                                                <p className='text-[14.5px] font-normal whitespace-nowrap'>
                                                    {Number(t.screenId.numberOfSeats) - t.bookings > 0 ? <span className='font-medium'>{Number(t.screenId.numberOfSeats) - t.bookings}</span> : 'No'} Seats Available
                                                </p>
                                            </div>
                                            {/* Arrow */}
                                            <div className='absolute left-1/2 -translate-x-1/2 -bottom-1.5 w-3 h-3 bg-gray-400/85 rotate-45'></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )) :
                    <p className='text-[15px] text-[#BDBDBD] font-light'>No showtimes</p>}
            </div>

            {showFiltersModel ? <FilterModel setShowFiltersModel={setShowFiltersModel} filterShowtimes={filterShowtimes} loadAllShowtimeOfAMovie={loadAllShowtimeOfAMovie} experience={experience} time={time} /> : ''}
        </div>
    )
}

export default Showtimes