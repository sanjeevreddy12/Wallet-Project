import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useRecoilState } from 'recoil';
import { userAuth } from './atoms';
import toast from 'react-hot-toast';
import axios from 'axios';

const UpdateDetails = () => {
    const [value, setValue] = useRecoilState(userAuth);
    const [ID, setID] = useState('');
    const [firstName, setFirstname] = useState('');
    const [lastName, setLastName] = useState('');
    const navigate = useNavigate();

    const signOutHandler = () => {
        localStorage.removeItem('authToken');
        setValue(false);
        toast("Signed Out successfully");
        navigate('/login');
    };

    const updateUserDetail = async () => {
        const authToken = localStorage.getItem('authToken');
        const authAxios = axios.create({
            headers: {
                authorization: `Bearer ${authToken}`,
            },
        });
        const { data } = await authAxios.get(`${import.meta.env.VITE_URL ?? "http://localhost:5000"}/v1/fetchDetails`);
        if (data.success) {
            setID(data.user.username);
        }
    };

    const updateIt = async () => {
        const authToken = localStorage.getItem('authToken');
        const authAxios = axios.create({
            headers: {
                authorization: `Bearer ${authToken}`,
            },
        });
        const { data: updatedUser } = await authAxios.put(`${import.meta.env.VITE_URL ?? "http://localhost:5000"}/v1/updateInfo`, {
            username: ID,
            firstName: firstName,
            lastName: lastName,
        });
        if (updatedUser.success) {
            toast('Update User Successfully');
            navigate('/Dashboard');
        }
    };

    useEffect(() => {
        if (value === false) {
            navigate('/login');
        }
        updateIt();
    }, [ID]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6 space-y-6">
                <div className="text-center text-2xl font-bold mb-4">Update User Info</div>
                <div>
                    <label className="block font-semibold mb-2" htmlFor="firstName">First Name</label>
                    <input
                        onChange={(e) => setFirstname(e.target.value)}
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter First Name"
                    />
                </div>
                <div>
                    <label className="block font-semibold mb-2" htmlFor="lastName">Last Name</label>
                    <input
                        onChange={(e) => setLastName(e.target.value)}
                        type="text"
                        className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                        placeholder="Enter Last Name"
                    />
                </div>
                <div className="flex justify-between mt-4">
                    <button
                        onClick={updateUserDetail}
                        className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                    >
                        Update Info
                    </button>
                    <button
                        onClick={signOutHandler}
                        className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition duration-200"
                    >
                        Sign Out
                    </button>
                </div>
                <div className="text-center mt-4">
                    <Link to="/Dashboard" className="text-blue-600 hover:underline">Back to Dashboard</Link>
                </div>
            </div>
        </div>
    );
};

export default UpdateDetails;
