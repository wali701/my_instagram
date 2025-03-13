import React, { useState } from 'react';
import { generateClient } from '@aws-amplify/api';
import './SearchBar.css';

const client = generateClient();

const SEARCH_QUERY = `
  query Search($searchTerm: String!) {
    listUsers(filter: { username: { contains: $searchTerm } }) {
      items { id username }
    }
    listPosts(filter: { tags: { contains: $searchTerm } }) {
      items { id text tags }
    }
  }
`;

function SearchBar({ onSearchResults }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    try {
      const response = await client.graphql({
        query: SEARCH_QUERY,
        variables: { searchTerm }
      });
      console.log('Search results:', response.data);
      onSearchResults({
        users: response.data.listUsers.items,
        postsByTag: response.data.listPosts.items
      });
    } catch (error) {
      console.error('Error searching:', error);
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-bar">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search users or tags..."
        className="search-input"
      />
      <button type="submit" className="search-button">Search</button>
    </form>
  );
}

export default SearchBar;