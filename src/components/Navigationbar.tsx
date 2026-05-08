import { Link, NavLink } from "react-router-dom";
import { SunibLogo,PersonLogo,BellLogo } from "../assets";

function Navigationbar() {
    return (
        <header className="w-full py-5 px-5 flex justify-between items-center align-middle border-b-2 shadow-md mx-auto ">
            <Link to={"/"}><img src={SunibLogo} className=""/></Link>
            <nav className="flex gap-3 justify-center">
                <NavLink to="/" className={({ isActive }: { isActive: boolean }) => isActive ? 'text-orange-400' : 'text-neutral-700'}>Home</NavLink>
                <NavLink to={"/events"}  className={({ isActive }: { isActive: boolean }) => isActive ? 'text-orange-400' : 'text-neutral-700'}>Events</NavLink>
                <NavLink to={"/dashboard"}  className={({ isActive }: { isActive: boolean }) => isActive ? 'text-orange-400' : 'text-neutral-700'}>Dashboard</NavLink>
                <NavLink to={"*"}  className={({ isActive }: { isActive: boolean }) => isActive ? 'text-orange-400' : 'text-neutral-700'}>Not Found</NavLink>
            </nav>
            <div className="flex items-center gap-4">
                <button><img src={BellLogo}/></button>
                <button><img src={PersonLogo}/></button>

                <Link to="/signin" className="text-sm text-neutral-700">
                    Sign In
                </Link>
                <Link to="/signup" className="rounded-lg bg-orange-400 px-4 py-2 text-sm font-medium text-white">
                    Sign Up
                </Link>
            </div>
        </header>
    )
}

export default Navigationbar;