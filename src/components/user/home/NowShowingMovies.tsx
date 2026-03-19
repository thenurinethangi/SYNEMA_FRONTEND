import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';

import { Search, User, Tags, Bookmark } from "lucide-react";
import { getAllNowShowingMovies, getMoviesBookingsCount } from '../../../services/user/movieService';
import ShowingMovieFilterModel from '../movie/ShowingMovieFilterModel';
import { addMovieToWatchlist, getAllWatchlistMovies, removeMovieFromWatchlist } from '../../../services/user/watchlistService';

import { useSelector } from "react-redux";
import type { RootState } from "../../../store/store";

function NowShowingMovies(props: any) {

    const navigate = useNavigate();

    const { user, loading } = useSelector((state: RootState) => state.auth);

    const [nowShowingMovies, setNowShowingMovies] = useState<any>([]);
    const [immutableNowShowingMovies, setImmutableNowShowingMovies] = useState([]);
    const [nowShowingMoviesBookingsCount, setNowShowingMoviesBookingsCount] = useState([]);
    const [wachlistMovies, setWachlistMovies] = useState<string[]>([]);

    const [genre, setGenre] = useState([]);
    const [popularity, setPopularity] = useState('');

    useEffect(() => {
        loadAllNowShowingMovies();
    }, []);

    async function loadAllNowShowingMovies() {
        try {
            const res = await getAllNowShowingMovies();
            console.log(res.data.data);
            setNowShowingMovies(res.data.data);
            setImmutableNowShowingMovies(res.data.data);

            const res2 = await getMoviesBookingsCount(res.data.data);
            console.log(res2.data.data);
            setNowShowingMoviesBookingsCount(res2.data.data);

            const res3 = await getAllWatchlistMovies();
            console.log(res3.data.data);

            let arr = [];
            for (let i = 0; i < res3.data.data.length; i++) {
                const e = res3.data.data[i];
                arr.push(e.movieId._id);
            }
            setWachlistMovies(arr);
        }
        catch (e) {
            console.log(e);
        }
    }

    function formatDate(dateStr: string) {
        return new Date(dateStr).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        })
    }

    function handleNavigateToMovieDetailsPage(movieId: string) {
        if (movieId) {
            navigate('/single/movie/' + movieId);
        }
    }

    function filterNowShowingMovie(rules: any) {

        console.log(rules);

        setGenre(rules.genre);
        setPopularity(rules.popularity);

        const arr = [];
        const arr2: any = [];

        if (rules.genre.length > 0 && rules.popularity) {
            for (let i = 0; i < immutableNowShowingMovies.length; i++) {
                const movie: any = immutableNowShowingMovies[i];
                for (let j = 0; j < movie.genres.length; j++) {
                    const g = movie.genres[j];
                    if (rules.genre.includes(g)) {
                        arr.push(movie);
                        arr2.push(nowShowingMoviesBookingsCount[i]);
                        break;
                    }
                }
            }

            const combined = arr.map((movie, index) => ({
                movie,
                count: arr2[index],
            }));


            if (rules.popularity === "High to Low") {
                combined.sort((a, b) => b.count - a.count);
            } else {
                combined.sort((a, b) => a.count - b.count);
            }

            const sortedMovies = combined.map(item => item.movie);
            setNowShowingMovies(sortedMovies);

        }
        else if (rules.genre.length > 0) {
            for (let i = 0; i < immutableNowShowingMovies.length; i++) {
                const movie: any = immutableNowShowingMovies[i];
                for (let j = 0; j < movie.genres.length; j++) {
                    const g = movie.genres[j];
                    if (rules.genre.includes(g)) {
                        arr.push(movie);
                        break;
                    }
                }
            }

            setNowShowingMovies(arr);
        }
        else if (rules.popularity) {
            const combined = immutableNowShowingMovies.map((movie, index) => ({
                movie,
                count: nowShowingMoviesBookingsCount[index],
            }));


            if (rules.popularity === "High to Low") {
                combined.sort((a, b) => b.count - a.count);
            } else {
                combined.sort((a, b) => a.count - b.count);
            }

            const sortedMovies = combined.map(item => item.movie);
            setNowShowingMovies(sortedMovies);
        }
        else {
            setNowShowingMovies(immutableNowShowingMovies);
        }
    }

    async function handleAddOrRemoveFromwatchlist(id: string) {

        if (!user && !loading) {
            props.setSignInVisible(true);
            return;
        }

        if (id && wachlistMovies.includes(id)) {
            try {
                const res = await removeMovieFromWatchlist({ movieId: id });
                console.log(res.data);
                loadAllNowShowingMovies();
            }
            catch (e) {
                console.log(e);
            }
        }
        else if (id && !wachlistMovies.includes(id)) {
            try {
                const res = await addMovieToWatchlist({ movieId: id });
                console.log(res.data);
                loadAllNowShowingMovies();
            }
            catch (e) {
                console.log(e);
            }
        }
    }


    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 [min-width:900px]:grid-cols-4 lg:grid-cols-5 gap-9 px-4 sm:px-6 md:px-10 lg:px-15 justify-items-center md:justify-items-start mt-11 mb-10'>
            {/* single movie */}
            {nowShowingMovies.length > 0
                ? nowShowingMovies.map((movie: any) => (
                    <div key={movie._id} className='mb-4'>
                        <div className='relative w-[203.198px] h-[300.885px]'>
                            <Bookmark onClick={() => handleAddOrRemoveFromwatchlist(movie._id)} data-id={movie._id} className={`text-white/90 w-[22px] h-[25px] absolute right-1 top-1 cursor-pointer z-[100] ${wachlistMovies.includes(movie._id) ? 'fill-red-600 stroke-none' : ''}`} />
                            <img src={movie.posterImageUrl} className='rounded-sm object-cover w-full h-full object-top'></img>
                            <div className=" w-full h-full absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent hover:from-black/50 hover:via-black/20 hover:to-transparent transition-all duration-700 ease-in-out"></div>
                        </div>
                        <div className='flex flex-col items-start'>
                            <h1 onClick={() => handleNavigateToMovieDetailsPage(movie._id)} data-id={movie._id} className='text-[16px] font-medium text-[#dedede] mt-3.5 cursor-pointer'>{movie.title}</h1>
                            <div className='flex items-center gap-1.5 mt-1'>
                                <p className='text-[12px] text-[#999] font-medium'>{movie.duration} | </p>
                                <p className='text-[12px] text-[#999] font-medium'>{formatDate(movie.releaseDate)}</p>
                            </div>
                            <div className='flex items-center gap-1 mt-1.5'>
                                <Tags onClick={() => handleNavigateToMovieDetailsPage(movie._id)} data-id={movie._id} className="text-white/90 w-[22px] h-[22px] cursor-pointer" />
                            </div>
                        </div>
                    </div>
                ))
                : <p className='text-[15px] text-[#BDBDBD] font-light pl-2.5 mb-20'>No movies</p>
            }

            {props.showNowShowingFiltersModel ? <ShowingMovieFilterModel setShowNowShowingFiltersModel={props.setShowNowShowingFiltersModel} genre={genre} popularity={popularity} filterNowShowingMovie={filterNowShowingMovie} /> : ''}
        </div>
    )
}

export default NowShowingMovies