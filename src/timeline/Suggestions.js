import React, { useState, useEffect } from 'react';
import { Avatar } from "@mui/material";
import './Suggestions.css';
import friendSuggests from '../data/friendSuggests';
import { useNavigate } from 'react-router-dom';
import { saveUsers } from '../utils/localStorage';
import { generateClient } from '@aws-amplify/api';
import { updateUser } from '../graphql/mutations';

function Suggestions({ currentUserId }) {
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();
    const client = generateClient();

    useEffect(() => {
        console.log('Current User ID:', currentUserId);
        console.log('Friend Suggests:', friendSuggests);

        const filteredUsers = friendSuggests
            .filter(user => {
                const isCurrentUser = currentUserId ? user.id !== currentUserId : true;
                console.log(`Filtering ${user.username}: ${isCurrentUser ? 'Included' : 'Excluded'}`);
                return isCurrentUser;
            })
            .map(user => ({
                ...user,
                followed: currentUserId ? user.followers.includes(currentUserId) : false,
                liked: currentUserId ? user.likedBy.includes(currentUserId) : false,
            }))
            .sort(() => 0.5 - Math.random())
            .slice(0, 5);

        console.log('Filtered Suggestions:', filteredUsers);
        setSuggestions([...filteredUsers]);
    }, [currentUserId]);

    const handleFollow = (userIdToFollow) => {
        if (!currentUserId) return;
        setSuggestions(prev => {
            const updatedSuggestions = prev.map(user => {
                if (user.id === userIdToFollow) {
                    const updatedFollowers = user.followed
                        ? user.followers.filter(id => id !== currentUserId)
                        : [...user.followers, currentUserId];
                    return { ...user, followed: !user.followed, followers: updatedFollowers };
                }
                return user;
            });
            friendSuggests.forEach(user => {
                if (user.id === userIdToFollow) {
                    user.followers = updatedSuggestions.find(u => u.id === userIdToFollow).followers;
                }
            });
            saveUsers(friendSuggests);
            return updatedSuggestions;
        });
    };

    const handleLikeProfile = async (userIdToLike) => {
        if (!currentUserId) return;
        console.log('Liking user ID:', userIdToLike, 'Is mock?', userIdToLike.startsWith('mock')); // Debug ID
        try {
            const userToLike = friendSuggests.find(user => user.id === userIdToLike);
            if (!userToLike) {
                console.error('User not found in friendSuggests:', userIdToLike);
                return;
            }
            const isLiked = userToLike.likedBy.includes(currentUserId);
            const updatedLikedBy = isLiked
                ? userToLike.likedBy.filter(id => id !== currentUserId)
                : [...userToLike.likedBy, currentUserId];
            const updatedLikes = isLiked ? Math.max(userToLike.likes - 1, 0) : userToLike.likes + 1;

            // Only update backend for non-mock users
            if (!userIdToLike.startsWith('friend')) {
                console.log('Updating real user in backend:', userIdToLike);
                const response = await client.graphql({
                    query: updateUser,
                    variables: {
                        input: {
                            id: userIdToLike,
                            likedBy: updatedLikedBy,
                            likes: updatedLikes,
                        },
                    },
                });
                if (response.errors) throw new Error(JSON.stringify(response.errors));
                console.log('Backend update response:', response);
            } else {
                console.log('Skipping backend update for mock user:', userIdToLike);
            }

            // Update local state
            setSuggestions(prev => {
                const updatedSuggestions = prev.map(user =>
                    user.id === userIdToLike
                        ? { ...user, liked: !isLiked, likedBy: updatedLikedBy, likes: updatedLikes }
                        : user
                );
                friendSuggests.forEach(user => {
                    if (user.id === userIdToLike) {
                        user.likedBy = updatedLikedBy;
                        user.likes = updatedLikes;
                    }
                });
                saveUsers(friendSuggests);
                console.log('Updated local suggestions:', updatedSuggestions);
                return updatedSuggestions;
            });
        } catch (error) {
            console.error('Error liking/unliking profile:', error);
            console.log('Full error details:', JSON.stringify(error, null, 2));
        }
    };

    const handleViewProfile = (userId) => {
        navigate(`/profile/${userId}`);
    };

    return (
        <div className="suggestions">
            <div className="suggestions__title">Suggestions for you</div>
            <div className="suggestions__usernames">
                {suggestions.length > 0 ? (
                    suggestions.map(user => (
                        <div className="suggestion__username" key={user.id}>
                            <div className="username__left" onClick={() => handleViewProfile(user.id)}>
                                <span className="avatar">
                                    {console.log(`Rendering ${user.username} with image:`, user.profilePicture)}
                                    {user.profilePicture ? (
                                        <Avatar src={user.profilePicture} alt={user.username} />
                                    ) : (
                                        <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
                                    )}
                                </span>
                                <div className="username__info">
                                    <span className="username">{user.username}</span>
                                    <span className="relation">{user.bio || 'New to Instagram'}</span>
                                </div>
                            </div>
                            <div className="suggestion__actions">
                                <button
                                    className="follow__button"
                                    onClick={() => handleFollow(user.id)}
                                    disabled={!currentUserId}
                                >
                                    {user.followed ? 'Unfollow' : 'Follow'}
                                </button>
                                <button
                                    className={`like__button ${user.liked ? 'liked' : ''}`}
                                    onClick={() => handleLikeProfile(user.id)}
                                    disabled={!currentUserId}
                                >
                                    {user.liked ? 'Unlike' : 'Like'} ({user.likes})
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="no-suggestions">No suggestions available.</div>
                )}
            </div>
        </div>
    );
}

export default Suggestions;