import React, { useEffect, useState, useRef } from 'react';

function FileList() {
    const [files, setFiles] = useState([]);
    const [clicked, setClicked] = useState(false);
    const [points, setPoints] = useState({ x: 0, y: 0 });
    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        fetchFiles();
    }, []);

    const fetchFiles = () => {
        fetch('http://localhost:8000/files')
            .then(response => response.json())
            .then(data => setFiles(data.files));
    };

    const fileInputRef = useRef();

    const handleUploadClick = () => {
        fileInputRef.current.click();
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        handleUpload(file);
    };

    const handleUpload = (file) => {
        const formData = new FormData();
        formData.append('file', file);

        fetch('http://localhost:8000/files', {
            method: 'POST',
            body: formData
        }).then(() => fetchFiles());
    };

    const handleDelete = () => {
        if (selectedFile) {
            fetch(`http://localhost:8000/files?file_name=${selectedFile}`, {
                method: 'DELETE'
            }).then(() => fetchFiles());
        }
    };

    const handleRename = () => {
        if (selectedFile) {
            const newName = prompt('Enter new name');
            if (newName) {
                fetch(`http://localhost:8000/files?file_name=${selectedFile}&new_name=${newName}`, {
                    method: 'PUT'
                }).then(() => fetchFiles());
            }
        }
    };

    const handleContextMenu = (event, file) => {
        event.preventDefault();
        setClicked(true);
        setPoints({ x: event.pageX, y: event.pageY });
        setSelectedFile(file);
    };

    const handleClick = () => {
        setClicked(false);
    };

    useEffect(() => {
        window.addEventListener('click', handleClick);
        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, []);

    return (
        <div className="bg-gray-100 h-screen w-64 overflow-auto">
            <ul className="divide-y divide-gray-300">
                {files.map(file => (
                    <li key={file} className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onContextMenu={(e) => handleContextMenu(e, file)}>
                        <a href={file} className="text-gray-700">{file}</a>
                    </li>
                ))}
            </ul>
            {clicked && (
                <div style={{ position: 'absolute', top: points.y, left: points.x }} className="bg-white shadow-lg rounded-md">
                    <ul className="divide-y divide-gray-300">
                        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={handleUploadClick}>Upload</li>
                        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={handleDelete}>Delete</li>
                        <li className="px-4 py-2 hover:bg-gray-200 cursor-pointer" onClick={handleRename}>Rename</li>
                    </ul>
                </div>
            )}
            <input type="file" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
        </div>
    );
}

export default FileList;