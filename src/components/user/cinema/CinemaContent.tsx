import React, { useEffect, useRef, useState } from 'react'
import { getAllCinemas } from '../../../services/user/cinemaService';
import { MapPin, Search } from 'lucide-react';
import { BiSortAlt2 } from "react-icons/bi";
import { useNavigate } from 'react-router-dom';
import FilterModel from './FilterModel';

function CinemaContent() {

    const navigate = useNavigate();

    const [allCinemas, setAllCinemas] = useState([]);
    const [filteredCinemas, setFilteredCinemas] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [searchQuery, setSearchQuery] = useState('');

    const [showFiltersModel, setShowFiltersModel] = useState(false);

    const [experience, setExperience] = useState([]);
    const [location, setLocation] = useState([]);

    useEffect(() => {
        loadAllCinemas();
    }, []);

    async function loadAllCinemas() {
        try {
            const res = await getAllCinemas();
            console.log(res.data.data);
            setAllCinemas(res.data.data);
            setFilteredCinemas(res.data.data);

            let cityArr: string[] = [];
            for (let i = 0; i < res.data.data.length; i++) {
                const cinema = res.data.data[i];
                if (!cityArr.includes(cinema.city)) {
                    cityArr.push(cinema.city);
                }
            }
            setCities(cityArr);
        }
        catch (e) {
            console.log(e);
        }
    }

    function handleNavigateToSingleCinemaPage(cinemaId: string) {
        if (cinemaId) {
            navigate('/cinema/' + cinemaId);
        }
    }

    function searchCinemas(key: string) {
        const query = key.trim().toLowerCase();

        if (query.length === 0) {
            setFilteredCinemas(allCinemas);
            return;
        }

        if (query.length < 3) return;

        const filtered = allCinemas.filter((cinema: any) =>
            cinema.cinemaName.toLowerCase().includes(query) ||
            cinema.distric.toLowerCase().includes(query) ||
            cinema.city.toLowerCase().includes(query) ||
            cinema.address.toLowerCase().includes(query)
        );

        setFilteredCinemas(filtered);
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

        setSearchQuery('');

        setExperience(rules.experience);
        setLocation(rules.location);

        const arr = [];

        if (rules.experience.length > 0 && rules.location.length > 0) {
            for (let i = 0; i < allCinemas.length; i++) {
                const cinema: any = allCinemas[i];
                if (rules.location.includes(cinema.city) && rules.experience.some(a => cinema.formats.some(b => a.toLowerCase() === b.toLowerCase()))) {
                    arr.push(cinema);
                }
            }
            setFilteredCinemas(arr);
        }
        else if (rules.experience.length > 0) {
            for (let i = 0; i < allCinemas.length; i++) {
                const cinema: any = allCinemas[i];
                if (rules.experience.some(a => cinema.formats.some(b => a.toLowerCase() === b.toLowerCase()))) {
                    arr.push(cinema);
                }
            }
            setFilteredCinemas(arr);
        }
        else if (rules.location.landing > 0) {
            for (let i = 0; i < allCinemas.length; i++) {
                const cinema: any = allCinemas[i];
                if (rules.location.includes(cinema.city)) {
                    arr.push(cinema);
                }
            }
            setFilteredCinemas(arr);
        }
        else {
            setFilteredCinemas(allCinemas);
        }
    }

    return (
        <div className='pb-10'>
            <div className="bg-red-100/10 mx-7 sm:mx-12 mt-10 h-[110px] sm:h-[80px] flex flex-wrap justify-between items-center gap-2.5 pl-6 pr-6 backdrop-blur-sm">
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                        <input
                            className="font-light bg-transparent border-b-2 border-b-white/30 hover:border-b-white/50 focus:border-b-white/60 pl-10 pr-3 py-2 text-[17px] tracking-[0.5px] w-[300px] outline-none transition-colors"
                            type="text"
                            placeholder="Search by name or location"
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); searchCinemas(e.target.value) }}
                        />
                    </div>
                    {/* <a href="" className="text-blue-400 hover:text-blue-300 transition-colors text-[15px]">All Lanka Cinemas</a> */}
                </div>
                <div className="flex items-center gap-5">
                    <button className="flex items-center gap-3 hover:text-red-200 transition-colors cursor-pointer">
                        <div className="text-[16.5px]">Locate me</div>
                        <MapPin className='w-4 h-5' />
                    </button>
                    <button onClick={(e) => setShowFiltersModel(true)} className="flex items-center gap-2 hover:text-red-200 transition-colors cursor-pointer">
                        <div className="text-[16.5px]">Filter By</div>
                        <BiSortAlt2 className='w-5 h-5 text-white' />
                    </button>
                </div>
            </div>

            <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center gap-9 px-15 mt-11 mb-10'>
                {filteredCinemas.length > 0
                    ? filteredCinemas.map((cinema: any) => (
                        <div key={cinema._id} className='group cursor-pointer mb-3 w-full'>
                            <div onClick={() => handleNavigateToSingleCinemaPage(cinema._id)} data-id={cinema._id} className='relative w-[257.5px] h-[205px] rounded-sm'>
                                <img src={cinema.cinemaImageUrl} className='object-cover w-full h-full object-top transition-transform duration-500 group-hover:scale-105'></img>
                                <div className="w-full h-full absolute inset-0 bg-gradient-to-t from-black/40 via-black/15 to-transparent group-hover:from-black/60 group-hover:via-black/25 group-hover:scale-105 transition-all duration-500"></div>

                                <div className='absolute bottom-0 -left-2 right-0'>
                                    <h1 className='text-[25px] font-bold text-white drop-shadow-lg'>{cinema.cinemaName.toUpperCase()}</h1>
                                </div>
                            </div>

                            <div className='flex flex-col items-start mt-3.5 -translate-x-2'>
                                <p className='text-[20.5px] text-white/90 tracking-[0.5px] font-normal font-[Nunito_Sans] leading-relaxed line-clamp-2 w-[70%] sm:w-[100%]'>{cinema.address}</p>

                                <div className='flex flex-wrap items-center gap-1.5 mt-2.5'>
                                    {cinema.formats.map((f: string, index: number) => (
                                        <p key={index} className='text-[13px] bg-[#353535] text-[#999] font-semibold rounded-xs py-1 px-2'>{f}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))
                    : <p className='text-[15px] text-[#BDBDBD] font-light pl-2.5 mb-20'>No cinemas</p>
                }
            </div>

            {showFiltersModel ? <FilterModel setShowFiltersModel={setShowFiltersModel} filterShowtimes={filterShowtimes} cities={cities} experience={experience} location={location} /> : ''}
        </div>
    )
}

export default CinemaContent