import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { Search, User, Tags, Bookmark, ChevronLeft, ChevronRight, ListFilterPlus } from "lucide-react";
import { getAllShowtimesOfACinema, getAllShowtimesOfAMovie } from '../../../services/user/showtimeService';
import FilterModel from '../showtime/FilterModel';
import { MdGridView, MdViewList } from "react-icons/md";
import { BiSortAlt2 } from "react-icons/bi";
import TrailerModal from '../movie/TrailerModel';

type TimeFrame = "Morning" | "Afternoon" | "Evening" | "Night";

function Showtimes(props: any) {

    const navigate = useNavigate();

    const [dates, setDates] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState('');
    const [showtimesList, setShowtimesList] = useState([]);
    const [selectedDateShowtimes, setSelectedDateShowtimes] = useState<any>([]);
    const [immutableSelectedDateShowtimes, setImmutableSelectedDateShowtimes] = useState<any>([]);

    const [trailerVisible, setTrailerVisible] = useState(false);
    const [trailerUrl, setTrailerUrl] = useState('');

    const [isSorted, setIsSorted] = useState(false);

    const [showFiltersModel, setShowFiltersModel] = useState(false);

    const [experience, setExperience] = useState('');
    const [time, setTime] = useState('');

    useEffect(() => {
        setDates(getNext7Days());
        loadAllShowtimeOfAMovie();
    }, []);

    async function loadAllShowtimeOfAMovie() {
        try {
            const res = await getAllShowtimesOfACinema(props.id);
            console.log('showtimes', res.data.data);
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

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    }

    function formatDate2(dateString: string): string {
        const targetDate = new Date(dateString);
        const today = new Date();

        today.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);

        const diffTime = targetDate.getTime() - today.getTime();
        const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

        const formattedDate = targetDate.toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
        });

        if (diffDays === 0) {
            return `Today · ${formattedDate}`;
        }

        if (diffDays === 1) {
            return `Tomorrow · ${formattedDate}`;
        }

        if (diffDays > 1 && diffDays <= 7) {
            return `In ${diffDays} days · ${formattedDate}`;
        }

        return formattedDate;
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

    function handleSorted() {
        setIsSorted(!isSorted);

        if (!isSorted) {
            sort_by_popularity();
        }
        else {
            setSelectedDateShowtimes(immutableSelectedDateShowtimes);
        }
    }

    function sort_by_popularity() {
        const sorted = [...selectedDateShowtimes].sort((a, b) => {
            const bookingsA = a[0]?.bookings ?? 0;
            const bookingsB = b[0]?.bookings ?? 0;

            return bookingsB - bookingsA;
        });

        setSelectedDateShowtimes(sorted);
    }


    return (
        <div className='mb-47 mt-12'>
            <div className='px-10 sm:px-17 flex flex-col gap-4'>
                <div className='flex flex-wrap items-center justify-start gap-2.5 overflow-x-auto no-scrollbar overscroll-x-contain'>
                    {dates.map((d, index: number) => (
                        <div
                            onClick={(e) => {
                                if (showtimesList[index]?.length > 0) {
                                    setSelectedDate(d);
                                    setSelectedDateShowtimes(showtimesList[index]);
                                    setImmutableSelectedDateShowtimes(showtimesList[index]);
                                    setExperience('');
                                    setTime('');
                                }
                            }}
                            key={index} className={`flex items-center justify-center w-[105px] h-[33px] cursor-pointer text-[12px] font-semibold rounded-sm px-[12px] ${showtimesList[index]?.length <= 0 ? 'text-[#BDBDBD] pointer-events-none opacity-50' : 'text-white'} ${selectedDate.toLowerCase() === d.toLowerCase() ? 'bg-[#ff2e38] border border-[#ff2e38]' : 'bg-[#2e2e2e] border border-[#383838]'}`}>{d.toUpperCase()}</div>
                    ))}
                </div>

                <div className='flex items-center gap-5'>
                    <div onClick={(e) => setShowFiltersModel(true)} className='relative'>
                        <ListFilterPlus className='w-4 h-4 text-[#ff2e38] cursor-pointer absolute left-1.5 top-2.5' />
                        <button className='px-[11px] pl-6.5 py-[7px] border border-gray-300/50 rounded-sm text-[14px] font-light cursor-pointer'>Key & Filters</button>
                    </div>
                    <div onClick={handleSorted} className='relative'>
                        <BiSortAlt2 className='w-5 h-5 text-[#ff2e38] cursor-pointer absolute left-0.5 top-2' />
                        <button className={`px-[11px] pl-6 py-[7px] border border-gray-300/50 rounded-sm text-[14px] font-light cursor-pointer ${isSorted ? 'text-[#ff2e38]' : 'text-white'}`}>Popularity</button>
                    </div>
                </div>
            </div>

            <div className='mt-12 px-10 sm:px-17'>
                { selectedDateShowtimes.length > 0 ? selectedDateShowtimes.map((showtimesOfSingleMovie: any, index: number) => (
                    <div key={index} className='mb-12 flex flex-col gap-8'>
                        <div className='flex flex-wrap items-end gap-8'>
                            <div className="shrink-0">
                                <img src={showtimesOfSingleMovie[0].movieId.posterImageUrl} className='w-[156px] h-[231px] object-cover object-center rounded-sm'></img>
                            </div>
                            <div className="flex-1">
                                <h3 onClick={(e) => navigate(`/single/movie/${showtimesOfSingleMovie[0].movieId._id}`)} className='text-[24px] font-medium text-white cursor-pointer'>{showtimesOfSingleMovie[0].movieId.title}</h3>
                                <div className='flex items-center gap-1.5 mt-2'>
                                    <p className='text-[12px] text-[#999] font-medium mr-0.5'>{showtimesOfSingleMovie[0].movieId.duration}</p>
                                    <p className='text-[12px] text-[#999] font-light'>|</p>
                                    <p className='text-[12px] text-[#999] font-medium ml-0.5'>{formatDate(showtimesOfSingleMovie[0].movieId.releaseDate)}</p>
                                </div>
                                <p className='mt-2 text-[#999] font-light w-[90%]'>{showtimesOfSingleMovie[0].movieId.description}</p>
                                <div className='mt-3.5 flex items-center gap-4'>
                                    <div onClick={(e) => { setTrailerUrl(showtimesOfSingleMovie[0].movieId.trailerUrl); setTrailerVisible(true) }} className='flex items-center gap-2 cursor-pointer'>
                                        <svg
                                            width="23"
                                            height="23"
                                            viewBox="0 0 100 100"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="44"
                                                fill="rgba(0,0,0,0.12)"
                                            />

                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="46"
                                                fill="none"
                                                stroke="#ff2e38"
                                                stroke-width="8"
                                            />

                                            <path
                                                d="
      M 45 28
      C 40 26 37 29 37 34
      L 37 66
      C 37 71 40 74 45 72
      L 74 54
      C 79 51 79 49 74 46
      Z
    "
                                                fill="#FFFFFF"
                                                transform="translate(50 50) scale(0.75) translate(-50 -50)"
                                            />
                                        </svg>
                                        <p className='text-[12px] font-medium text-white/90'>Trailer</p>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <svg
                                            width="23"
                                            height="23"
                                            viewBox="0 0 100 100"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="44"
                                                fill="rgba(0,0,0,0.12)"
                                            />

                                            <circle
                                                cx="50"
                                                cy="50"
                                                r="46"
                                                fill="none"
                                                stroke="#ff2e38"
                                                stroke-width="8"
                                            />

                                            <path
                                                d="
      M50 72
      C50 72 22 52 22 35
      C22 26 28 20 36 20
      C42 20 47 24 50 28
      C53 24 58 20 64 20
      C72 20 78 26 78 35
      C78 52 50 72 50 72
      Z
    "
                                                fill="#FFFFFF"
                                                transform="translate(50 50) scale(0.75) translate(-50 -50)"
                                            />
                                        </svg>

                                        <p className='text-[12px] font-medium text-white/90'>Watchlist</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div>
                                <p className='text-[14px] text-[#999] font-light mt-1'>{formatDate2(showtimesOfSingleMovie[0].date)}</p>
                            </div>
                            <div className='flex items-center flex-wrap gap-3.5 mt-4'>
                                {showtimesOfSingleMovie.map((showtime: any) => (
                                    <div key={showtime._id} onClick={() => handleNavigateToBookingPage(showtime._id)} data-id={showtime._id} className={`w-[310px] h-[79px] ${isTimeNotPast(showtime.time) ? 'border-l-4 border-l-[#cd242c]' : 'border-l-4 border-gray-400 pointer-events-none' } rounded-sm bg-[#2c2c2c] px-2.5 py-2.5 cursor-pointer hover:bg-[#3a3a3a] transition-all duration-400`}>
                                        <div className='flex items-center gap-2.5'>
                                            <p className='font-medium text-[16.5px] tracking-wide'>{formatToTime12h(showtime.time)}</p>
                                            <div className='text-[12px] font-medium bg-[#dedede] text-black px-2 py-px rounded-[20px]'>{showtime.formatShowing}</div>
                                        </div>
                                        <p className='font-medium text-[12.5px] mt-1'>{showtime.screenId.screenName.toUpperCase()}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                    </div>
                ))
                : <p className='text-[#BDBDBD] text-[15px] font-light'>No movies</p>}
            </div>

            {/* Trailer Modal */}
            <TrailerModal
                trailerUrl={trailerUrl || ''}
                isVisible={trailerVisible}
                onClose={() => setTrailerVisible(false)}
            />

            {showFiltersModel ? <FilterModel setShowFiltersModel={setShowFiltersModel} filterShowtimes={filterShowtimes} loadAllShowtimeOfAMovie={loadAllShowtimeOfAMovie} experience={experience} time={time} /> : ''}

        </div>
    )
}

export default Showtimes