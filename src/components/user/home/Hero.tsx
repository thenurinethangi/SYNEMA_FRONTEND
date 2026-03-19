import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllHeroPosters } from '../../../services/user/heroService';

interface Slide {
    movieId: string
    image: string;
    trailer: string;
    title: string;
    description: string;
    status: string
}

function Hero() {

    const navigate = useNavigate();

    const [currentSlide, setCurrentSlide] = useState<number>(0);
    const [showTrailer, setShowTrailer] = useState<boolean>(false);
    const [isTransitioning, setIsTransitioning] = useState<boolean>(true);
    const [slides, setSlides] = useState<Slide[]>([]);
    const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

    useEffect(() => {
        loadAllHeroPosters();
    }, []);

    async function loadAllHeroPosters() {
        try {
            const res = await getAllHeroPosters();
            console.log(res.data.data);
            setSlides(res.data.data);
        }
        catch (e) {
            console.error("Error loading hero posters:", e);
        }
    }

    const extendedSlides = slides.length > 0 ? [...slides, slides[0]] : [];

    useEffect(() => {
        if (slides.length === 0) return;

        const slideInterval = setInterval(() => {
            setShowTrailer(false);
            setCurrentSlide((prev) => prev + 1);
        }, 16000);

        return () => clearInterval(slideInterval);
    }, [slides.length]);


    useEffect(() => {
        if (slides.length === 0) return;

        if (currentSlide === slides.length) {
            setTimeout(() => {
                setIsTransitioning(false);
                setCurrentSlide(0);
            }, 700);

            setTimeout(() => {
                setIsTransitioning(true);
            }, 750);
        }
    }, [currentSlide, slides.length]);


    useEffect(() => {
        if (slides.length === 0) return;

        setShowTrailer(false);

        const trailerTimeout = setTimeout(() => {
            setShowTrailer(true);
            const actualIndex = currentSlide % slides.length;
            if (videoRefs.current[actualIndex]) {
                const video = videoRefs.current[actualIndex];
                if (video) {
                    video.currentTime = 0;
                    video.play().catch(err => console.log("Video play error:", err));
                }
            }
        }, 3000);

        return () => {
            clearTimeout(trailerTimeout);
            videoRefs.current.forEach((video) => {
                if (video) {
                    video.pause();
                    video.currentTime = 0;
                }
            });
        };
    }, [currentSlide, slides.length]);

    if (slides.length === 0) {
        return <div className='w-full h-[600px] bg-black'></div>;
    }

    function handleNavigateToMovieDetailsPage(movieId: string){
        if(movieId){
            navigate('/single/movie/'+movieId);
        }
    }

    return (
        <div>
            <div className='relative w-full h-[600px] overflow-x-hidden overflow-y-auto'>
                {/* single slide */}
                {extendedSlides.map((slide, index) => (
                    <div key={index} className={`absolute w-full h-full ${isTransitioning ? 'transition-transform duration-700 ease-in-out' : ''}`} style={{ transform: `translateX(${(index - currentSlide) * 100}%)` }}>
                        {/* Poster Image */}
                        <img src={slide.image} className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${showTrailer && index === currentSlide ? 'opacity-0' : 'opacity-100'}`} style={{ objectPosition: 'center' }} alt={slide.title} />

                        {/* Trailer Video */}
                        <video ref={(el) => {
                            const actualIndex = index % slides.length;
                            if (el && !videoRefs.current[actualIndex]) {
                                videoRefs.current[actualIndex] = el;
                            }
                        }} muted loop playsInline className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${showTrailer && index === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
                            <source src={slide.trailer} type="video/mp4" />
                        </video>

                        {/* Overlay Content */}
                        <div className='w-full h-full absolute top-0 inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-end'>
                            <div className='px-10 py-20 sm:px-20'>
                                <p className={`text-black mb-1.5 rounded-xs text-[10px] font-semibold p-1 inline ${slide.status === 'Now Showing' ? 'bg-[#02a8b3]' : 'bg-[#f5cc50]'}`}>{slide.status.toUpperCase()}</p>
                                <h1 className='text-[32px] font-medium'>{slide.title}</h1>
                                <p className='text-[#999] font-normal mt-2.5 text-[16px] leading-normal w-[80%]'>{slide.description}</p>
                                <button onClick={() => handleNavigateToMovieDetailsPage(slide.movieId)} data-id={slide.movieId} className='text-[#ff2e38] font-medium text-[14px] mt-[15px] hover:text-[#ff4e58] transition-colors cursor-pointer'>Book Now</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slide Indicators */}
            <div className='flex gap-2 z-20 pl-18 pt-[12px] pb-6'>
                {slides.map((_, index) => (
                    <button key={index} onClick={() => { setShowTrailer(false); setCurrentSlide(index); }} className={`w-7 h-[2.5px] rounded-sm transition-all duration-300 ${(currentSlide % slides.length) === index ? 'bg-[#ff2e38] w-12' : 'bg-white/50'}`} />
                ))}
            </div>
        </div>
    )
}

export default Hero