import { Tv, Trash, Edit, Eye, Clock, Calendar, Star, Tag, X } from "lucide-react";
import { useEffect, useState } from "react";
import { changeStatusOfTheMovie, getAllMovies, removeMovieFromCinemasManageMovieList } from "../../services/cinema/movieService";
import { toast } from "react-toastify";

const ConfirmToast = (props: any) => {
    const { closeToast, onConfirm } = props;

    return (
        <div className='font-[Poppins]'>
            <p className='text-[17px] mb-1.5'>Remove Movie?</p>
            <p className='text-[14px] text-gray-500'>Are you certain you want to remove this movie from cinemas' currently managed movie list?</p>
            <div className="flex gap-3 mt-3">
                <button onClick={closeToast} className='text-[13px] font-medium px-2 py-2 border border-gray-800 rounded-md'>Cancel</button>
                <button onClick={() => { onConfirm(); closeToast(); }} className='text-[13px] font-medium px-2 h-[32px] bg-red-700 rounded-md'>
                    Confirm
                </button>
            </div>
        </div>
    );
};

export function askConfirm(onConfirm: () => void) {
    toast((toastProps: any) => (
        <ConfirmToast {...toastProps} onConfirm={onConfirm} />
    ));
}

function Movies(props: any) {

    const [movies, setMovie] = useState([]);
    const [immutableMovies, setImmutableMovies] = useState<any[]>([]);

    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState<any>(null);

    useEffect(() => {
        loadAllMovies();

    }, [props.loadMovies]);

    useEffect(() => {
        filterMoviesBySearch(props.searchKey);
    }, [props.searchKey, immutableMovies]);

    async function loadAllMovies() {

        try {
            const res = await getAllMovies();
            setMovie(res.data.data);
            setImmutableMovies(res.data.data);
            props.setmanageMovies(res.data.data);
            console.log(res.data.data);
        }
        catch (e) {

        }
    }

    function filterMoviesBySearch(key: string) {
        if (!key || key.trim() === "") {
            setMovie(immutableMovies);
            return;
        }

        const search = key.toLowerCase();

        const filtered = immutableMovies.filter((movie: any) => {
            return (
                movie.movieDetails?.title?.toLowerCase().includes(search) ||
                movie.status?.toLowerCase().includes(search) ||
                movie.formatsAvailble?.some((f: string) =>
                    f.toLowerCase().includes(search)
                ) ||
                movie.movieDetails?.genres?.some((g: string) =>
                    g.toLowerCase().includes(search)
                ) ||
                String(movie.movieDetails?.ratings?.imdb)?.includes(search)
            );
        });

        setMovie(filtered);
    }

    async function handleRemoveMovie(id: string) {
        if (!id) {
            return;
        }

        askConfirm(async () => {
            try {
                const res = await removeMovieFromCinemasManageMovieList(id);
                toast.success('Successfully removed movie!');
                loadAllMovies();
            }
            catch (e) {
                toast.error('Failed to remove movie, try again later!');
                console.log(e);
            }
        });
    }

    const handleStatusChange = async (id: string, newStatus: string, currentStatus: string) => {
        if (newStatus === currentStatus) {
            setShowEditModal(false);
            return;
        }

        try {
            const res = await changeStatusOfTheMovie({ id, status: newStatus });
            console.log(res.data.data);
            toast.success('Updated!');
            loadAllMovies();
        }
        catch (e) {
            toast.success('Failed!');
            console.log(e);
        }
        setShowEditModal(false);
    };


    return (
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
            {movies.length > 0 && movies.map((movie: any) => (
                <div key={movie._id} className='rounded-lg bg-[#1e1e1e] h-[250px] sm:h-[190px] flex items-start pr-2 border border-gray-800 hover:border-gray-700 transition-all duration-300 group'>
                    <div className='h-[100%] w-[22%] rounded-l-sm overflow-hidden relative'>
                        <img
                            src={movie.movieDetails.posterImageUrl}
                            alt={movie.movieDetails.title}
                            className='w-full h-full object-cover rounded-l-sm opacity-85 group-hover:scale-105 transition-transform duration-500'
                        />
                        <div className='absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 bg-black/60 backdrop-blur-sm rounded text-[9px] font-bold text-white/90'>
                            <Star className='w-2.5 h-2.5 fill-white' />
                            {movie.movieDetails.ratings.imdb}
                        </div>
                    </div>
                    <div className='pl-4.5 pr-1.5 py-4 flex justify-between h-[100%] flex-1'>
                        <div className='flex flex-col justify-between'>
                            <div>
                                <h3 className='text-[16px] text-[#dedede] font-medium mb-2'>{movie.movieDetails.title}</h3>
                                <div className='flex flex-col gap-1'>
                                    <div className='flex items-center gap-1.5'>
                                        <Clock className='w-3.5 h-3.5 text-gray-500' />
                                        <p className='text-[12px] text-[#999]'>{movie.movieDetails.duration}</p>
                                    </div>
                                    <div className='flex items-center gap-1.5'>
                                        <Calendar className='w-3.5 h-3.5 text-gray-500' />
                                        <p className='text-[12px] text-[#999]'>{movie.movieDetails.releaseDate}</p>
                                    </div>
                                    <div className='flex items-center gap-1.5'>
                                        <Tv className='w-3.5 h-3.5 text-gray-500' />
                                        {movie.formatsAvailble.map((format: string) => (
                                            <p className='text-[12px] text-[#999]'>{format}</p>
                                        ))}
                                    </div>
                                    <div className='flex items-center gap-1.5'>
                                        <Tag className='w-3.5 h-3.5 text-gray-500' />
                                        <p className='text-[12px] text-[#999]'>3000 bookings</p>
                                    </div>
                                </div>
                            </div>
                            <div className='flex items-center gap-2 mt-2'>
                                <p className={`text-[11px] px-2 py-[2px] rounded font-medium ${movie.status === 'Now Showing' ? 'text-black bg-[#f5cc50]' : 'bg-[#02a8b3]'}`}>
                                    {movie.status}
                                </p>
                                <div className="flex items-center gap-2 flex-wrap">
                                    {movie.movieDetails.genres.map((genre: string) => (
                                        <p className='px-1 py-0.5 bg-[#353535] text-[9px] rounded-xs text-[#999] font-bold'>{genre}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col justify-end gap-2'>
                            <button className='w-6.5 h-6.5 rounded-lg bg-[#252525] hover:bg-[#2a2a2a] transition-colors flex items-center justify-center group/btn'>
                                <Eye className='text-gray-500 group-hover/btn:text-gray-400 w-[15px] h-[15px]' />
                            </button>
                            <button onClick={(e) => { setSelectedMovie(movie); setShowEditModal(true) }} className='w-6.5 h-6.5 rounded-lg bg-[#252525] hover:bg-[#2a2a2a] transition-colors flex items-center justify-center group/btn'>
                                <Edit className='text-gray-500 group-hover/btn:text-gray-400 w-[14px] h-[14px]' />
                            </button>
                            <button onClick={() => handleRemoveMovie(movie._id)} data-id={movie._id} className='w-6.5 h-6.5 rounded-lg bg-[#252525] hover:bg-red-900/20 transition-colors flex items-center justify-center group/btn'>
                                <Trash className='text-gray-500 group-hover/btn:text-red-500 w-[14px] h-[14px]' />
                            </button>
                        </div>
                    </div>
                </div>
            ))}

            {/* Edit Modal */}
            {showEditModal && (
                <div className='fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50'>
                    <div className='bg-[#1a1a1a] rounded-lg p-5 w-[420px] border border-[#2a2a2a]'>
                        <div className='flex justify-between items-center mb-4'>
                            <h3 className='text-[16px] font-medium text-white'>Update Movie Status</h3>
                            <button onClick={() => setShowEditModal(false)}>
                                <X className='w-5 h-5 text-gray-500 hover:text-gray-300' />
                            </button>
                        </div>

                        <div className='mb-5 p-3 bg-[#151515] rounded border border-[#252525]'>
                            <p className='text-[13px] text-[#888] mb-1'>Movie Title</p>
                            <p className='text-[14px] text-white font-medium mb-2'>{selectedMovie.movieDetails.title}</p>
                            <p className='text-[12px] text-[#888]'>Current Status: <span className='text-[#ccc]'>{selectedMovie.status}</span></p>
                        </div>

                        <div className='space-y-2.5'>
                            <button
                                onClick={() => handleStatusChange(selectedMovie._id, 'Now Showing', selectedMovie.status)}
                                className='w-full px-4 py-2.5 bg-[#f5cc50] text-black text-[13px] font-medium rounded hover:bg-[#f5d670] transition-colors'
                            >
                                ✓ Set as Now Showing
                            </button>
                            <button
                                onClick={() => handleStatusChange(selectedMovie._id, 'Coming Soon', selectedMovie.status)}
                                className='w-full px-4 py-2.5 bg-[#2a2a2a] text-white text-[13px] font-medium rounded hover:bg-[#333] transition-colors'
                            >
                                ⏱ Set as Coming Soon
                            </button>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className='w-full px-4 py-2.5 bg-transparent border border-[#3a3a3a] text-gray-400 text-[13px] font-medium rounded hover:border-[#4a4a4a] transition-colors'
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}


            {movies.length <= 0 && <p className="text-[14px] text-white/80 font-light">No Movies</p>}
        </div>
    )
}

export default Movies