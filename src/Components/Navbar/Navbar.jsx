import './Navbar.css'
import logo from '../../assets/symbol.png'
import search from '../../assets/search1.svg'
import arrow from '../../assets/arrow-down.svg'
import searchWt from '../../assets/search.svg'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../Firebase/Firebase'
import addBtn from '../../assets/addButton.png'
import { signOut } from 'firebase/auth'
import { useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useWishlist } from '../Context/Wishlist'
import heartIcon from '../../assets/favorite.svg'
import { toast } from 'react-toastify'

const Navbar = (props) => {
    const [user] = useAuthState(auth)
    const { toggleModal, toggleModalSell, searchQuery, setSearchQuery } = props
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef();
    const navigate = useNavigate();
    const location = useLocation();
    const { wishlist } = useWishlist();

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        // if (location.pathname !== '/') {
        //     navigate('/');
        // }
    }

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast.success("Logged out successfully");
            navigate('/');
        } catch (error) {
            toast.error("Logout error: " + error.message);
        }
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, []);

    return (
        <div className="font-sans">
            <nav className="fixed z-50 w-full flex items-center h-[72px] p-2 px-4 bg-[#eff1f3] shadow-sm box-border">
                <div className="mr-4">
                    <img src={logo} alt="OLX" className='w-11 cursor-pointer' onClick={() => navigate('/')} />
                </div>
                
                <div className='relative flex items-center bg-white border-[2px] border-[#002f34] rounded-[4px] h-12 w-[280px] mr-4 hidden md:flex'>
                    <img src={search} alt="Search" className='w-5 mx-2' />
                    <input 
                        placeholder='Search city, area, or locality...' 
                        className='w-full h-full outline-none placeholder-[#002f34] text-[16px] bg-transparent' 
                        type="text" 
                    />
                    <img src={arrow} alt="Arrow" className='w-6 mx-2 cursor-pointer' />
                </div>

                <div className="relative flex-grow flex items-center h-12">
                    <div className="flex w-full h-full border-[2px] border-[#002f34] rounded-[4px] bg-white overflow-hidden focus-within:border-[#23e5db]">
                        <input
                            placeholder='Find Cars, Mobile Phones and more...'
                            className='w-full h-full px-3 outline-none text-[16px] placeholder-[#002f34] bg-transparent'
                            type="text"
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <div className="w-12 h-full bg-[#002f34] flex items-center justify-center cursor-pointer hover:bg-teal-900 flex-shrink-0">
                            <img className="w-5 filter invert" src={searchWt} alt="Search Icon" />
                        </div>
                    </div>
                </div>

                <div className="hidden lg:flex items-center mx-4 cursor-pointer hover:text-teal-700">
                    <span className="font-bold text-[14px] text-[#002f34] mr-1 uppercase">English</span>
                    <img src={arrow} alt="Arrow" className='w-6' />
                </div>

                {user && (
                    <Link to="/wishlist" className="mx-2 relative cursor-pointer group hover:bg-gray-200 p-2 rounded-full transition-colors">
                        <img src={heartIcon} alt="Wishlist" className="w-6" />
                        <span className="absolute -top-0 -right-0 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center font-bold">
                            {wishlist.length}
                        </span>
                        <div className="hidden group-hover:block absolute top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] p-1 px-2 rounded whitespace-nowrap">
                            Wishlist
                        </div>
                    </Link>
                )}

                {!user ? (
                    <Link
                        to="/login"
                        className='font-bold ml-4 mr-4 cursor-pointer text-[#002f34] text-[16px] hover:underline'
                    >
                        Login
                    </Link>
                ) : (
                    <div className="relative mx-4 flex items-center cursor-pointer" ref={menuRef}>
                        <div 
                            className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-[#002f34] font-bold border border-teal-300"
                            onClick={() => setShowMenu(prev => !prev)}
                        >
                            {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                        </div>
                        <img src={arrow} alt="Arrow" className='w-6 ml-1' onClick={() => setShowMenu(prev => !prev)} />
                        
                        {showMenu && (
                            <div className="absolute top-12 right-0 mt-2 w-48 bg-white shadow-lg rounded-[4px] border border-gray-200 z-50 overflow-hidden">
                                <ul className="text-[14px] text-[#002f34]">
                                    <li 
                                        onClick={() => { navigate('/my-ads'); setShowMenu(false); }}
                                        className="p-3 px-4 hover:bg-[#eff1f3] cursor-pointer"
                                    >
                                        My Ads
                                    </li>
                                    <li
                                        onClick={handleLogout}
                                        className="p-3 px-4 hover:bg-[#eff1f3] cursor-pointer text-red-500 font-bold border-t"
                                    >
                                        Logout
                                    </li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}

                <div 
                    onClick={() => navigate('/post')}
                    className='cursor-pointer rounded-full p-[5px] bg-gradient-to-br from-[#ffce32] via-[#23e5db] to-[#3a77ff] shadow-[0_2px_4px_0_rgba(0,0,0,0.1)] hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.15)] transition-shadow'
                >
                    <div className='flex items-center justify-center gap-1 bg-white text-[#002f34] font-bold text-[14px] uppercase tracking-wide h-10 px-5 rounded-full'>
                        <span className="text-xl leading-none mr-1">+</span> SELL
                    </div>
                </div>
            </nav>

            <div className='w-full relative z-40 bg-white shadow-[0_1px_4px_0_rgba(0,0,0,0.1)] border-b border-[#ccd5d6]/50 pt-[72px]'>
                <div className="max-w-[1280px] mx-auto flex items-center h-12 px-4 text-[#002f34]">
                    <div className='flex items-center font-bold cursor-pointer hover:text-teal-700 mr-4'>
                        <span className="uppercase text-[14px]">All categories</span>
                        <img className='w-6 ml-1' src={arrow} alt="Arrow" />
                    </div>
                    <ul className='hidden md:flex items-center space-x-4 text-[14px] ml-4 text-[#002f34]'>
                        <li className="cursor-pointer hover:text-[#00a49f]" onClick={() => handleSearchChange({target: {value: 'Cars'}})}>Cars</li>
                        <li className="cursor-pointer hover:text-[#00a49f]" onClick={() => handleSearchChange({target: {value: 'Properties'}})}>Properties</li>
                        <li className="cursor-pointer hover:text-[#00a49f]" onClick={() => handleSearchChange({target: {value: 'Mobiles'}})}>Mobiles</li>
                        <li className="cursor-pointer hover:text-[#00a49f]" onClick={() => handleSearchChange({target: {value: 'Jobs'}})}>Jobs</li>
                        <li className="cursor-pointer hover:text-[#00a49f]" onClick={() => handleSearchChange({target: {value: 'Electronics'}})}>Electronics</li>
                        <li className="cursor-pointer hover:text-[#00a49f]" onClick={() => handleSearchChange({target: {value: 'Bikes'}})}>Bikes</li>
                        <li className="cursor-pointer hover:text-[#00a49f]" onClick={() => handleSearchChange({target: {value: 'Furniture'}})}>Furniture</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default Navbar;