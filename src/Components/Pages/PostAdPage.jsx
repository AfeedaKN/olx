import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserAuth } from "../Context/Auth";
import { addDoc, collection } from "firebase/firestore";
import { fireStore } from "../Firebase/Firebase";
import Navbar from "../Navbar/Navbar";
import fileUpload from '../../assets/fileUpload.svg';
import loadingIcon from '../../assets/loading.gif';
import { toast } from 'react-toastify';

const PostAdPage = () => {
    const { user } = UserAuth();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleImageUpload = (event) => {
        if (event.target.files) setImage(event.target.files[0]);
    }

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

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!user) return;

        setSubmitting(true);

        if (!title.trim() || !category || !price || !description.trim()) {
            toast.warn('Please fill out all required fields.');
            setSubmitting(false);
            return; 
        }

        if (!image) {
            toast.warn('Please upload an image for your ad.');
            setSubmitting(false);
            return;
        }

        let imageUrl = '';
        if (image) {
            try {
                imageUrl = await readImageAsDataUrl(image);
            } catch (error) {
                console.error(error);
                toast.error('Failed to read image');
                setSubmitting(false);
                return;
            }
        }

        try {
            await addDoc(collection(fireStore, 'products'), {
                title: title.trim(),
                category: category.trim(),
                price: price.trim(),
                description: description.trim(),
                imageUrl,
                userId: user.uid,
                userName: user.displayName || 'Anonymous',
                createdAt: new Date().toDateString(),
            });

            toast.success('Your ad was posted successfully!');
            navigate('/');
        } catch (error) {
            console.error(error);
            toast.error('Failed to add item: ' + error.message);
        } finally {
            setSubmitting(false);
        }
    }

    if (!user) return null;

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-md">
                    <h2 className="text-3xl font-extrabold text-teal-900 mb-8 border-b pb-4">POST YOUR AD</h2>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Ad Title</label>
                            <input
                                type="text"
                                className="w-full border-2 border-gray-300 p-3 rounded-md focus:border-teal-900 outline-none transition-all"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="What are you selling?"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Category</label>
                            <select 
                                className="w-full border-2 border-gray-300 p-3 rounded-md focus:border-teal-900 outline-none transition-all"
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option value="">Select Category</option>
                                <option value="Cars">Cars</option>
                                <option value="Properties">Properties</option>
                                <option value="Mobiles">Mobiles</option>
                                <option value="Jobs">Jobs</option>
                                <option value="Electronics">Electronics</option>
                                <option value="Bikes">Bikes</option>
                                <option value="Furniture">Furniture</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Price</label>
                            <input
                                type="number"
                                className="w-full border-2 border-gray-300 p-3 rounded-md focus:border-teal-900 outline-none transition-all"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="Set a price"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Description</label>
                            <textarea
                                className="w-full border-2 border-gray-300 p-3 rounded-md focus:border-teal-900 outline-none transition-all h-32"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Describe your product in detail"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2 uppercase">Upload Image</label>
                            <div className="relative h-64 w-full border-2 border-dashed border-gray-400 rounded-lg flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
                                {image ? (
                                    <img className="h-full w-full object-contain p-2" src={URL.createObjectURL(image)} alt="Preview" />
                                ) : (
                                    <div className="flex flex-col items-center">
                                        <img className="w-16 mb-2 opacity-50" src={fileUpload} alt="Upload" />
                                        <p className="text-gray-500 font-medium">Click to upload a photo</p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    onChange={handleImageUpload}
                                    accept="image/*"
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-teal-900 text-white p-4 rounded-md font-bold text-lg hover:bg-teal-800 disabled:bg-gray-400 transition-all shadow-lg flex justify-center items-center"
                            >
                                {submitting ? (
                                    <>
                                        <img src={loadingIcon} className="w-6 mr-2" alt="loading" />
                                        POSTING...
                                    </>
                                ) : "POST NOW"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default PostAdPage;
