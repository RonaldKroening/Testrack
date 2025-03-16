import React, { useEffect, useState } from 'react';

import axios from 'axios';
import TableLoader from './TableLoader';
import { useNavigate } from 'react-router-dom';

const PracticeExams = ({username}) => {
    const [data, setData] = useState({ columns: [], rows: [] });
    const [error, setError] = useState(null);
    const [row_ids, setRowIds] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        axios.get('http://127.0.0.1:8000/get_tests')
            .then((response) => {
                if (response.data) {
                    console.log(response.data);
                    setData({
                        columns: Object.keys(response.data.data[0]),
                        rows: response.data.data,
                    });
                    let new_ids = [];
                    for (let id of response.data.ids){
                        new_ids.push(id['id']);
                    }
                    
                    setRowIds(new_ids); // Convert IDs to strings
                    console.log(response.data.ids);
                }
            })
            .catch((error) => {
                console.error(error);
                setError('Failed to load practice exams.');
            });
    }, []);
    const onRowClick = (row, idx) => {
        console.log("for row: ", idx);
        console.log("Row data: ", row); // Log the entire row object for debugging
        var id = row_ids[idx];
        console.log(row_ids);
        console.log(`Showing row with ID: ${id}`);
    
        // Conditionally include the username in the URL
        let un = username ? `/${encodeURIComponent(username)}` : ""; // Append username if it exists, otherwise use an empty string
    
        // Navigate to the dynamic route
        navigate(`/run-exam/${id}${un}`);
    };
    return (
        <div className="p-6" id="prac-ex">
            {error && <p className="text-red-500">{error}</p>}
            {data.columns.length > 0 && data.rows.length > 0 ? (
                <TableLoader columns={data.columns} rows={data.rows}  onRowClick={onRowClick}/>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default PracticeExams;
