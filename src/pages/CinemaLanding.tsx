import React, { useState, useEffect } from 'react';
import { Film, TrendingUp, Clock, Users, Star, Zap, ArrowRight, CheckCircle, Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Monitor, Calendar, DollarSign, BarChart } from 'lucide-react';
import logo2 from '../assets/images/attachment_69652587-removebg-preview.png'
import Footer from '../components/user/Footer';
import Auth from '../components/cinema/Auth';

const CinemaLanding = () => {

    const [isVisible, setIsVisible] = useState(false);
    const [authVisible, setAuthVisible] = useState(false);
    const [authType, setAuthType] = useState('');
    const [cinemaAdminEmail, setCinemaAdminEmail] = useState('');

    useEffect(() => {
        setIsVisible(true);
    }, []);

    function handleOpenSignUpModel() {
        setAuthVisible(true);
        setAuthType('SignUp');
    }

    function handleOpenSignInModel() {
        setAuthVisible(true);
        setAuthType('SignIn');
    }

    const features = [
        {
            icon: <Monitor className="w-8 h-8" strokeWidth={1.5} />,
            title: "Screen Management",
            description: "Effortlessly manage multiple screens, layouts, and seating arrangements with intuitive controls"
        },
        {
            icon: <Clock className="w-8 h-8" strokeWidth={1.5} />,
            title: "Showtime Control",
            description: "Schedule shows, manage timings, and optimize your daily operations seamlessly"
        },
        {
            icon: <Film className="w-8 h-8" strokeWidth={1.5} />,
            title: "Movie Catalog",
            description: "Add and update movies, trailers, and promotional content instantly across all platforms"
        },
        {
            icon: <DollarSign className="w-8 h-8" strokeWidth={1.5} />,
            title: "Dynamic Pricing",
            description: "Set flexible ticket prices for different shows, seats, and peak hours to maximize revenue"
        },
        {
            icon: <Calendar className="w-8 h-8" strokeWidth={1.5} />,
            title: "Online Bookings",
            description: "Accept bookings 24/7 through our seamless digital platform with instant confirmation"
        },
        {
            icon: <BarChart className="w-8 h-8" strokeWidth={1.5} />,
            title: "Real-time Analytics",
            description: "Track revenue, occupancy rates, and customer insights with live dashboards"
        }
    ];

    const benefits = [
        "Increase revenue by up to 40% with online bookings",
        "Reduce manual work with automated scheduling",
        "Reach millions of potential customers nationwide",
        "Get real-time insights and detailed reports",
        "24/7 customer support for your cinema",
        "Zero commission on first 100 bookings"
    ];

    const stats = [
        { number: "500+", label: "Partner Cinemas" },
        { number: "50K+", label: "Daily Bookings" },
        { number: "2M+", label: "Active Users" },
        { number: "99.9%", label: "Platform Uptime" }
    ];

    const process = [
        { num: "01", title: "Register", desc: "Complete your cinema profile and upload documentation" },
        { num: "02", title: "Configure", desc: "Set up screens, pricing, and scheduling preferences" },
        { num: "03", title: "Integrate", desc: "Connect your existing systems with our platform" },
        { num: "04", title: "Launch", desc: "Go live and start accepting online bookings instantly" }
    ];

    return (
        <div className="min-h-screen bg-[#121212] text-white font-[Poppins] overflow-hidden">

            {/* Navigation */}
            <nav className="relative z-10 flex items-center justify-between px-8 py-1">
                <div className="flex items-center space-x-3 ml-1">
                    <div className="flex items-center justify-center z-10">
                        <img src={logo2} width={'80px'} alt="logo"></img>
                    </div>
                </div>
                <div className="flex items-center -translate-y-1">
                    <button onClick={handleOpenSignInModel} className="px-2 py-5 text-white/87 hover:text-white transition-colors font-[Poppins] text-[13.5px] cursor-pointer font-light tracking-wider">
                        {'Login'.toUpperCase()}
                    </button>
                    <button onClick={handleOpenSignUpModel} className="px-4 pl-2.5 text-white/87 hover:text-white transition-colors font-[Poppins] text-[13.5px] cursor-pointer font-light tracking-wider">
                        {'Register'.toUpperCase()}
                    </button>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="max-w-7xl mx-auto px-8 pt-16 pb-25">
                <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                    <div className="max-w-4xl mx-auto text-center">
                        <p className="text-gray-500 text-sm tracking-[3px] uppercase mb-8">Cinema Partner Platform</p>
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-light leading-tight mb-8 text-gray-200">
                            Transform your cinema into a digital powerhouse
                        </h1>
                        <p className="text-gray-400 text-lg md:text-xl leading-relaxed font-light max-w-3xl mx-auto mb-12">
                            Join 500+ cinema partners who trust Synema to manage screens, showtimes, and online bookings with enterprise-grade technology
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={handleOpenSignUpModel}
                                className="bg-white text-black px-12 py-5 hover:bg-red-700 hover:text-white transition-all duration-300 text-sm tracking-[2px] uppercase font-light"
                            >
                                Register Your Cinema
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="">
                <div className="max-w-6xl mx-auto px-8 py-20">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="text-5xl font-light text-white/90 mb-2">{stat.number}</div>
                                <div className="text-gray-500 text-sm tracking-wider uppercase">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="max-w-6xl mx-auto px-8 py-30">
                <div className="mb-20 text-center">
                    <p className="text-gray-500 text-sm tracking-[3px] uppercase mb-4">Platform Features</p>
                    <h2 className="text-4xl md:text-5xl font-light text-gray-200">Everything you need to succeed</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="border border-white/10 p-10 hover:border-red-700/30 transition-all duration-500 group"
                        >
                            <div className="text-red-700 mb-8 group-hover:scale-110 transition-transform duration-500">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-light mb-4 text-white">{feature.title}</h3>
                            <p className="text-gray-500 font-light text-sm leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* How It Works */}
            <section className="bg-white/[0.02] border-t border-white/5 py-32">
                <div className="max-w-6xl mx-auto px-8">
                    <div className="mb-20 text-center">
                        <p className="text-gray-500 text-sm tracking-[3px] uppercase mb-4">Getting Started</p>
                        <h2 className="text-4xl md:text-5xl font-light text-gray-200">Four steps to launch</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                        {process.map((step, index) => (
                            <div key={index} className="text-center group">
                                <div className="text-7xl font-light text-white/10 group-hover:text-red-700/20 transition-colors duration-500 mb-6">
                                    {step.num}
                                </div>
                                <h3 className="text-xl font-light mb-3 text-white">{step.title}</h3>
                                <p className="text-gray-500 font-light text-sm leading-relaxed">{step.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Grid */}
            <section className="max-w-6xl mx-auto px-8 py-32">
                <div className="mb-20 text-center">
                    <p className="text-gray-500 text-sm tracking-[3px] uppercase mb-4">Why Choose Synema</p>
                    <h2 className="text-4xl md:text-5xl font-light text-gray-200">Built for cinema owners</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="border-l border-white/10 pl-6 py-4 hover:border-red-700/50 transition-all duration-300"
                        >
                            <p className="text-gray-300 font-light leading-relaxed">{benefit}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="border-t border-white/10 bg-white/[0.02]">
                <div className="max-w-4xl mx-auto px-8 py-32 text-center">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight mb-8 text-gray-200">
                        Ready to transform your cinema?
                    </h2>
                    <p className="text-gray-400 text-lg mb-12 font-light max-w-2xl mx-auto">
                        Join hundreds of cinema partners who trust Synema for seamless digital operations
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
                        <button
                            onClick={handleOpenSignUpModel}
                            className="bg-white text-black px-12 py-5 hover:bg-red-700 hover:text-white transition-all duration-300 text-sm tracking-[2px] uppercase font-light"
                        >
                            Start Free Trial
                        </button>
                        <button className="border border-white/20 hover:border-red-700/50 px-12 py-5 transition-all text-sm tracking-[2px] uppercase font-light">
                            Contact Sales
                        </button>
                    </div>
                    <p className="text-gray-500 text-sm font-light">
                        No credit card required • Free setup assistance • Cancel anytime
                    </p>
                </div>
            </section>

            {/* Footer */}
            <Footer />

            {authVisible && authType ? <Auth authType={authType} setAuthVisible={setAuthVisible} setAuthType={setAuthType} cinemaAdminEmail={cinemaAdminEmail} setCinemaAdminEmail={setCinemaAdminEmail} /> : ''}
        </div>
    );
};

export default CinemaLanding;