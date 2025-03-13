import React, { useState } from 'react';
import './Homepage.css';
import Sidenav from './navigation/Sidenav';
import Timeline from './timeline/Timeline';
import PostPage from './timeline/PostPage/PostPage';
import ProfilePage from './timeline/ProfilePage/ProfilePage';
import SearchBar from './SearchBar/SearchBar';
import Suggestions from './timeline/Suggestions';
import { Routes, Route, Navigate } from 'react-router-dom';

function Homepage({ currentUserId }) {
  const [searchResults, setSearchResults] = useState(null);

  console.log('Homepage currentUserId:', currentUserId); 

  const handleSearchResults = (results) => {
    setSearchResults(results);
  };

  return (
    <div className="homepage">
      <div className="homepage__nav">
        <Sidenav />
      </div>
      <div className="homepage__main">
        <SearchBar onSearchResults={handleSearchResults} />
        {searchResults ? (
          <div className="search-results">
            <h2>Search Results</h2>
            <h3>Users</h3>
            {searchResults.users?.map(user => (
              <p key={user.id}>{user.username}</p>
            ))}
            <h3>Posts by Tag</h3>
            {searchResults.postsByTag?.map(post => (
              <p key={post.id}>{post.text} (Tags: {post.tags?.join(', ')})</p>
            ))}
          </div>
        ) : (
          <div className="homepage__content">
            <div className="homepage__timeline">
              <Routes>
                <Route path="/" element={<Timeline />} />
                <Route path="/create-post" element={<PostPage />} />
                <Route path="/profile/:userId" element={<ProfilePage />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </div>
            <div className="homepage__suggestions">
              <Suggestions currentUserId={currentUserId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Homepage;