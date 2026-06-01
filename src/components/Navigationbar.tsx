import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import { SunibLogo,PersonLogo,BellLogo } from "../assets";
import Sidebar from "./Sidebar";

function Navigationbar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <>
        <header className="w-full py-5 px-5 flex items-center justify-between gap-3 border-size-1 border-gray-100 shadow-sm mx-auto ">
            {/* Hamburger menu for mobile */}
            <button
                className="md:hidden text-2xl pr-10 text-neutral-700 hover:text-orange-400 transition-colors"
                onClick={() => setSidebarOpen(true)}
            >
                ☰
            </button>

            {/* Logo */}
            <Link to={"/}"} className=" flex-1 md:flex-none"><img src={SunibLogo} className=""/></Link>
            
            {/* Desktop navigation */}
            <nav className="hidden md:flex gap-3 justify-center flex-1">
                <NavLink to="/" className={({ isActive }: { isActive: boolean }) => isActive ? 'text-orange-400' : 'text-neutral-700'}>Home</NavLink>
                <NavLink to={"/events"}  className={({ isActive }: { isActive: boolean }) => isActive ? 'text-orange-400' : 'text-neutral-700'}>Events</NavLink>
                <NavLink to={"/dashboard"}  className={({ isActive }: { isActive: boolean }) => isActive ? 'text-orange-400' : 'text-neutral-700'}>Dashboard</NavLink>
                <NavLink to={"*"}  className={({ isActive }: { isActive: boolean }) => isActive ? 'text-orange-400' : 'text-neutral-700'}>Not Found</NavLink>
            </nav>
            <div className="hidden md:flex items-center gap-4">
                <button><img src={BellLogo}/></button>
                <button><img src={PersonLogo}/></button>

                <Link to="/login" className="text-sm rounded-lg px-4 py-2 font-medium border-gray-400 border text-neutral-700">
                    Login
                </Link>
                <Link to="/signup" className="rounded-lg bg-orange-400 px-4 py-2 text-sm font-medium text-white">
                    Sign Up
                </Link>
            </div>
        </header>
        
        {/* Mobile sidebar */}
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        </>
    )
}

export default Navigationbar;