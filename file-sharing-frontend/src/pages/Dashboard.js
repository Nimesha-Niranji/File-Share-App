import { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import API from '../services/api';

function Dashboard() {
  const [file, setFile] = useState();
  const [files, setFiles] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);

  // Fetch files (user or admin)
  const fetchFiles = async () => {
    try {
      const token = localStorage.getItem('token');
      const decoded = jwtDecode(token);
      const role = decoded.role;
      const id = decoded.id;

      setIsAdmin(role === 'admin');
      setUserId(id);

      const res = await API.get(role === 'admin' ? '/admin/files' : '/files');
      setFiles(res.data);
    } catch (err) {
      console.error('Failed to fetch files', err);
      alert('Error loading files.');
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // Upload file
  const uploadFile = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      await API.post('/upload', formData);
      alert('File uploaded successfully!');
      fetchFiles(); // refresh list
    } catch (err) {
      console.error('Upload error:', err);
      alert('File upload failed.');
    }
  };

  // Delete file
  const deleteFile = async (id) => {
    try {
      await API.delete(`/files/${id}`);
      alert('File deleted!');
      fetchFiles(); // refresh list
    } catch (err) {
      console.error('Delete error:', err);
      alert(err.response?.data?.msg || 'Delete failed');
    }
  };

  // Split files for admin view
  const adminFiles = files.filter(f => f.userId === userId);
  const otherUserFiles = files.filter(f => f.userId !== userId);

  return (
    <div>
      <h2>Dashboard ({isAdmin ? 'Admin' : 'User'})</h2>

      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile}>Upload</button>

      {isAdmin ? (
        <>
          <h3>📁 Your Uploaded Files</h3>
          <ul>
            {adminFiles.map(f => (
              <li key={f.id}>
                {f.filename}
                <a href={`http://localhost:5000/${f.path}`} target="_blank" rel="noreferrer">Download</a>
                <button onClick={() => deleteFile(f.id)}>Delete</button>
              </li>
            ))}
          </ul>

          <h3>🗂️ Files Uploaded by Other Users</h3>
          <ul>
            {otherUserFiles.map(f => (
              <li key={f.id}>
                {f.filename} <br />
                <small>Uploaded by: {f.User?.username} ({f.User?.email})</small> <br />
                <a href={`http://localhost:5000/${f.path}`} target="_blank" rel="noreferrer">Download</a>
                <button onClick={() => deleteFile(f.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <>
          <h3>📁 Your Uploaded Files</h3>
          <ul>
            {files.map(f => (
              <li key={f.id}>
                {f.filename}
                <a href={`http://localhost:5000/${f.path}`} target="_blank" rel="noreferrer">Download</a>
                <button onClick={() => deleteFile(f.id)}>Delete</button>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default Dashboard;
