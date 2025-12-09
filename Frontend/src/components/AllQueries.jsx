import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SummaryApi from '../common';
import { toast } from "react-toastify";
import { formatDate } from '../utils/dateFormator';
import { FaEye } from "react-icons/fa";
import { NavLink } from 'react-router-dom';

const AllQueries = () => {
    const [allQueries, setAllQueries] = useState([]);

    const fetchAllQueries = async () => {
        try {
            const response = await axios({
                method: SummaryApi.allQueries?.method || 'GET',
                url: SummaryApi.allQueries?.url,
                withCredentials: true, 
            });

            const dataResponse = response.data;

            if (dataResponse.success) {
                setAllQueries(dataResponse.data);
            } else if (dataResponse.error) {
                toast.error(dataResponse.message);
            }
        } catch (error) {
            console.error("Error fetching queries:", error);
            toast.error("Failed to fetch queries");
        }
    };

    useEffect(() => {
        fetchAllQueries();
    }, []);

    return (
        <div className="overflow-x-auto p-4 bg-[#121212] min-h-screen">
            <table className="w-full border-collapse border border-gray-700 bg-[#1b1b1b] text-gray-300">
                <thead className="bg-[#1b1b1b]">
                    <tr className="text-lg text-center border-b-2 border-gray-600">
                        <th className="text-lg text-blue-400 text-center border-r border-gray-600 p-2">Sr_No.</th>
                        <th className="text-lg text-blue-400 text-center border-r border-gray-600 p-2">Name</th>
                        <th className="text-lg text-blue-400 text-center border-r border-gray-600 p-2">Email</th>
                        <th className="text-lg text-blue-400 text-center border-r border-gray-600 p-2">Phone</th>
                        <th className="text-lg text-blue-400 text-center border-r border-gray-600 p-2">Message</th>
                        <th className="text-lg text-blue-400 text-center border-r border-gray-600 p-2">Sent On</th>
                        <th className="text-lg text-blue-400 text-center border-r border-gray-600 p-2">View</th>
                    </tr>
                </thead>
                <tbody className="text-center border-b-2 border-gray-600">
                    {allQueries.length > 0 ? (
                        allQueries.map((el, index) => (
                            <tr key={el._id || index} className="border-b border-gray-700 text-center text-lg hover:bg-[#2a2a2a]">
                                <td className="border-r text-gray-300 border-gray-700 p-4">{index + 1}</td>
                                <td className="border-r text-gray-300 border-gray-700 p-4">{el.name}</td>
                                <td className="border-r text-gray-300 border-gray-700 p-4">{el.email}</td>
                                <td className="border-r text-gray-300 border-gray-700 p-4">{el.number}</td>
                                <td className="border-r text-gray-300 border-gray-700 p-4">{el.message}</td>
                                <td className="border-r text-gray-300 border-gray-700 p-4">{formatDate(el?.sendedAt)}</td>
                                <td className="border-r text-gray-300 border-gray-700 p-4 justify-items-center">
                                    <NavLink to={`/ViewQuery/${el?._id}`}>
                                        <FaEye className="text-blue-400 hover:text-blue-500" />
                                    </NavLink>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="7" className="text-center text-gray-400 p-4">
                                No queries found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default AllQueries;
