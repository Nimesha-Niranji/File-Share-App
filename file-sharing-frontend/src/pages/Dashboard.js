import { useState,useEffect } from 'react';
import API from '../services/api';

function Dashboard() {
  const [file, setFile] = useState();
  const [files, setFiles] = useState([]);

  const uploadFile = async () => {
    const formData = new FormData();
    formData.append('file', file);
    await API.post('/upload', formData);
    alert('File uploaded');
    fetchFiles();
  };

  const fetchFiles = async () => {
    const res = await API.get('/files');
    setFiles(res.data);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>

      <h3>Your Uploaded Files</h3>
      <ul>
        {files.map((f) => (
          <li key={f.id}>
            {f.filename} - <a href={`http://localhost:5000/${f.path}`} target="_blank" rel="noreferrer">Download</a>
          </li>
        ))}
      </ul>

    </div>
  );
}

export default Dashboard;
