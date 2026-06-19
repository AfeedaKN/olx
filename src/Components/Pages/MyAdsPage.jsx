import React, { useState, useEffect } from "react";
import { UserAuth } from "../Context/Auth";
import { fireStore, deleteProduct, updateProduct } from "../Firebase/Firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import Navbar from "../Navbar/Navbar";
import loadingIcon from '../../assets/loading.gif';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

const MyAdsPage = () => {
    const { user } = UserAuth();
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingAd, setEditingAd] = useState(null);
    const [editingImage, setEditingImage] = useState(null);
    const [updating, setUpdating] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            if (!loading) navigate('/login');
            return;
        }

        setLoading(true);
        const q = query(collection(fireStore, "products"), where("userId", "==", user.uid));
        
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const userAds = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setAds(userAds);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching my ads:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [user, navigate]);

const handleDelete = async (id) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this ad deletion!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#002f34',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
        try {
            await deleteProduct(id);

            setAds(ads.filter(ad => ad.id !== id));

            const wishlist = JSON.parse(localStorage.getItem("olx_wishlist")) || [];
            const updatedWishlist = wishlist.filter(item => item.id !== id);
            localStorage.setItem("olx_wishlist", JSON.stringify(updatedWishlist));

            toast.success("Ad deleted successfully");
        } catch (error) {
            toast.error("Failed to delete ad");
        }
    }
};

    const handleEdit = (ad) => {
        setEditingAd({ ...ad });
        setEditingImage(null);
    };

    const readImageAsDataUrl = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const MAX_SIZE = 800;
                    if (width > height) {
                        if (width > MAX_SIZE) {
                            height *= MAX_SIZE / width;
                            width = MAX_SIZE;
                        }
                    } else {
                        if (height > MAX_SIZE) {
                            width *= MAX_SIZE / height;
                            height = MAX_SIZE;
                        }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, width, height);
                    const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                    resolve(dataUrl);
                };
                img.src = event.target.result;
            };
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setUpdating(true);
            let updateData = {
                title: editingAd.title.trim(),
                price: editingAd.price.trim(),
                description: editingAd.description.trim(),
                category: editingAd.category.trim()
            };

            if (editingImage) {
                const imageUrl = await readImageAsDataUrl(editingImage);
                updateData.imageUrl = imageUrl;
            }

            await updateProduct(editingAd.id, updateData);
            setAds(ads.map(ad => ad.id === editingAd.id ? { ...editingAd, ...updateData } : ad));
            setEditingAd(null);
            setEditingImage(null);
            toast.success("Ad updated successfully");
        } catch (error) {
            toast.error("Failed to update ad");
        } finally {
            setUpdating(false);
        }
    };

    if (!user) return null;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
                <div className="max-w-6xl mx-auto">
                    <h1 className="text-2xl font-bold text-teal-900 mb-8">Manage My Ads</h1>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <img src={loadingIcon} className="w-20" alt="Loading" />
                        </div>
                    ) : ads.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-lg shadow">
                            <p className="text-xl text-gray-500">You haven't posted any ads yet.</p>
                            <button 
                                onClick={() => navigate('/post')}
                                className="mt-4 bg-teal-900 text-white px-6 py-2 rounded font-bold"
                            >
                                Post your first ad
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {ads.map(ad => (
                                <div key={ad.id} className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
                                    <div className="h-48 overflow-hidden bg-gray-200">
                                        <img src={ad.imageUrl} alt={ad.title} className="w-full h-full object-contain" />
                                    </div>
                                    <div className="p-4 flex-grow">
                                        <p className="text-xl font-bold">₹ {ad.price}</p>
                                        <p className="text-gray-600 truncate">{ad.title}</p>
                                        <p className="text-xs text-gray-400 mt-2">{ad.category}</p>
                                    </div>
                                    <div className="p-4 border-t flex justify-between gap-2">
                                        <button 
                                            onClick={() => handleEdit(ad)}
                                            className="flex-grow bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600"
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(ad.id)}
                                            className="flex-grow bg-red-500 text-white py-2 rounded font-semibold hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {editingAd && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Edit Ad</h2>
                        <form onSubmit={handleUpdate} className="space-y-4">
                            <input 
                                className="w-full border p-2 rounded" 
                                value={editingAd.title} 
                                onChange={(e) => setEditingAd({...editingAd, title: e.target.value})}
                                placeholder="Title"
                            />
                            <input 
                                className="w-full border p-2 rounded" 
                                value={editingAd.price} 
                                onChange={(e) => setEditingAd({...editingAd, price: e.target.value})}
                                placeholder="Price"
                            />
                            <select 
                                className="w-full border p-2 rounded" 
                                value={editingAd.category} 
                                onChange={(e) => setEditingAd({...editingAd, category: e.target.value})}
                            >
                                <option value="Cars">Cars</option>
                                <option value="Properties">Properties</option>
                                <option value="Mobiles">Mobiles</option>
                                <option value="Jobs">Jobs</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Bikes">Bikes</option>
                                <option value="Furniture">Furniture</option>
                            </select>
                            <textarea 
                                className="w-full border p-2 rounded h-24" 
                                value={editingAd.description} 
                                onChange={(e) => setEditingAd({...editingAd, description: e.target.value})}
                                placeholder="Description"
                            />
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Update Image</label>
                                <div className="relative h-32 w-full border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors overflow-hidden">
                                    <img 
                                        className="h-full w-full object-contain p-2" 
                                        src={editingImage ? URL.createObjectURL(editingImage) : editingAd.imageUrl} 
                                        alt="Current Ad" 
                                    />
                                    <input
                                        type="file"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={(e) => { if (e.target.files) setEditingImage(e.target.files[0]) }}
                                        accept="image/*"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <button 
                                    type="button" 
                                    onClick={() => { setEditingAd(null); setEditingImage(null); }}
                                    className="px-4 py-2 text-gray-500 hover:text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    disabled={updating}
                                    className="bg-teal-900 text-white px-6 py-2 rounded font-bold disabled:bg-gray-400"
                                >
                                    {updating ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
};

export default MyAdsPage;
