import React, { useState } from 'react'
import Navbar from '../Navbar/Navbar'
// import Login from '../Modal/Login'
// import Sell from '../Modal/Sell'
import Card from '../Card/Card'
import { useWishlist } from '../Context/Wishlist'
import { ItemsContext } from '../Context/Item'


const WishlistPage = () => {
    const [openModal, setModal] = useState(false);
    const [openModalSell, setModalSell] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const toggleModal = () => setModal(!openModal);
    const toggleModalSell = () => setModalSell(!openModalSell);

    const { wishlist } = useWishlist();
    const itemsCtx = ItemsContext();

    const filteredWishlist = searchQuery.trim()
        ? wishlist.filter(item =>
            item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category?.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : wishlist;

    return (
        <div>
            <Navbar
                // toggleModal={toggleModal}
                // toggleModalSell={toggleModalSell}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            {/* <Login toggleModal={toggleModal} status={openModal} /> */}
            {/* <Sell
                setItems={itemsCtx?.setItems}
                toggleModalSell={toggleModalSell}
                status={openModalSell}
            /> */}

            <div className="pt-5">
                <div className="px-5 sm:px-15 md:px-30 lg:px-40 pt-10">
                    <h1 style={{ color: '#002f34' }} className="text-3xl font-bold">My Wishlist</h1>
                    <p className="text-gray-500 mt-2">
                        {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>

                {wishlist.length === 0 ? (
                    <div className="min-h-[60vh] flex flex-col items-center justify-center">
                        <p className="text-6xl mb-4">❤️</p>
                        <h2 className="text-xl font-semibold text-gray-700">Your wishlist is empty</h2>
                        <p className="text-gray-500 mt-2 text-center max-w-xs">
                            Discover something you love and save it here to keep track of it!
                        </p>
                        <button 
                            onClick={() => window.location.href = '/'}
                            className="mt-6 px-6 py-2 bg-[#002f34] text-white rounded-md font-bold hover:bg-[#004a52] transition-colors"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <Card items={filteredWishlist} />
                )}
            </div>
        </div>
    );
};

export default WishlistPage;
