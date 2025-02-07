import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [url, setUrl] = useState('');
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetchRepos();
  }, []);

  const fetchRepos = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/repos`);
      setRepos(response.data);
    } catch (err) {
      setError('Failed to fetch repos');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await axios.post(`${API_URL}/api/repos`, { url });
      setUrl('');
      await fetchRepos();
    } catch (err) {
      setError('Failed to add repository');
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">GitHub Repository Metrics</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter GitHub repository URL"
            className="flex-1 p-2 border rounded"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Adding...' : 'Add Repository'}
          </button>
        </div>
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </form>

      <div className="space-y-4">
        {repos.map((repo) => (
          <div key={repo._id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{repo.name}</h2>
            <div className="mt-2 grid grid-cols-3 gap-4">
              <div>
                ⭐ Stars: {repo.stars}
              </div>
              <div>
                🍴 Forks: {repo.forks}
              </div>
              <div>
                ⚠️ Issues: {repo.issues}
              </div>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Added: {new Date(repo.createdAt).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;