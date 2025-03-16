import React from 'react';

const TableLoader = ({ columns, rows, onRowClick }) => {
    return (
        <table className="min-w-full bg-white border border-gray-300">
            <thead>
                <tr>
                    {columns.map((column, index) => (
                        <th key={index} className="py-2 px-4 border-b">{column}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, rowIndex) => (
                    <tr 
                        key={rowIndex} 
                        onClick={() => onRowClick(row, rowIndex)} 
                        className="cursor-pointer hover:bg-gray-100"
                    >
                        {columns.map((column, colIndex) => (
                            <td key={colIndex} className="py-2 px-4 border-b">{row[column]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default TableLoader;