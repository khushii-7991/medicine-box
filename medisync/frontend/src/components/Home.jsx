import React from 'react';

const Home = () => {
    return (
        <div className="min-h-screen w-full bg-gradient-to-r from-teal-700 via-blue-500 to-teal-700 flex justify-center items-center p-5 text-white">
            <div className="bg-gradient-to-r from-teal-700 via-blue-500 to-teal-700 bg-opacity-5 backdrop-blur-md p-10 rounded-2xl shadow-lg flex flex-col items-center gap-8 max-w-xl w-full">
                <div className="flex items-center gap-3">
                    <i className="fa-solid fa-pills text-5xl text-amber-300"></i>
                    <span className="text-4xl font-bold shadow-md">Smart Medical System</span>
                </div>

                <div className="w-64 h-64 bg-cover bg-center rounded-xl shadow-lg" style={{backgroundImage: "url('https://media.istockphoto.com/id/1351305343/vector/take-a-course-of-medicines.jpg?s=612x612&w=0&k=20&c=-3Iym_XKdeB0bnF5by4CqfAR8arGP1zjlHxNz-vNBe8=')"}}></div>

                <div className="text-center">
                    <h2 className="text-2xl mb-2">Your personal health assistance</h2>
                    <h3 className="text-base font-light opacity-90">Upload medicines, get reminders, book nurses & manage appointments with ease!</h3>
                </div>

                <div className="flex gap-5 flex-wrap justify-center">
                    <a href="/patient" className="px-6 py-3 bg-amber-300 text-teal-700 font-bold rounded-lg no-underline transition-all duration-300 shadow-md hover:bg-amber-400 hover:-translate-y-0.5 hover:shadow-xl">Login As Patient</a>
                    <a href="/doctor" className="px-6 py-3 bg-amber-300 text-teal-700 font-bold rounded-lg no-underline transition-all duration-300 shadow-md hover:bg-amber-400 hover:-translate-y-0.5 hover:shadow-xl">Login As Doctor</a>
                </div>
            </div>
        </div>
    );
};

export default Home;