import { useState, useEffect, useRef } from 'react';

import Navigation from '../components/user/Navigation';
import Hero from '../components/user/home/Hero';
import Tabs from '../components/user/home/Tabs';
import NowShowingMovies from '../components/user/home/NowShowingMovies';
import Footer from '../components/user/Footer';
import SignIn from '../components/user/SignIn';
import SignUp from '../components/user/SignUp';
import ComingSoonMovies from '../components/user/home/ComingSoonMovies';
import Trailers from '../components/user/home/Trailers';
import OTPModel from '../components/user/OTPModel';


function Home() {

    const [signInVisible, setSignInVisible] = useState(false);
    const [signUpVisible, setSignUpVisible] = useState(false);
    const [otpVisible, setOtpVisible] = useState(false);
    const [userEmail, setUserEmail] = useState('');

    const [tab, setTab] = useState('Now Showing');

    const [showNowShowingFiltersModel, setShowNowShowingFiltersModel] = useState(false);
    const [showComingSoonFiltersModel, setShowComingSoonFiltersModel] = useState(false);

    function handleClickKeyFilters() {
        if (tab === 'Now Showing') {
            setShowNowShowingFiltersModel(true);
        }
        else {
            setShowComingSoonFiltersModel(true);
        }
    }

    return (
        <div className='bg-[#121212] font-[Poppins] text-white overflow-x-hidden relative'>

            {/* navigation */}
            <Navigation setSignInVisible={setSignInVisible} page={''} />

            {/* hero */}
            <Hero />

            {/* tabs */}
            <Tabs tab={tab} setTab={setTab} handleClickKeyFilters={handleClickKeyFilters} />

            {/* movie container */}
            {tab === 'Now Showing' ? <NowShowingMovies showNowShowingFiltersModel={showNowShowingFiltersModel} setShowNowShowingFiltersModel={setShowNowShowingFiltersModel} setSignInVisible={setSignInVisible} /> : ''}

            {/* movie container */}
            {tab === 'Coming Soon' ? <ComingSoonMovies showComingSoonFiltersModel={showComingSoonFiltersModel} setShowComingSoonFiltersModel={setShowComingSoonFiltersModel} setSignInVisible={setSignInVisible} /> : ''}

            <div className='mb-25'></div>

            {/* movie container */}
            {/* <Trailers /> */}

            {/* Footer */}
            <Footer />

            {/* sign in model */}
            {signInVisible ? <SignIn setSignInVisible={setSignInVisible} setSignUpVisible={setSignUpVisible} setOtpVisible={setOtpVisible} setUserEmail={setUserEmail} /> : ''}

            {/* sign in model */}
            {signUpVisible ? <SignUp setSignInVisible={setSignInVisible} setSignUpVisible={setSignUpVisible} setOtpVisible={setOtpVisible} setUserEmail={setUserEmail} /> : ''}

            {/* otp model */}
            {otpVisible ? <OTPModel setOtpVisible={setOtpVisible} userEmail={userEmail} setUserEmail={setUserEmail} setSignInVisible={setSignInVisible} /> : ''}

        </div>
    )
}

export default Home