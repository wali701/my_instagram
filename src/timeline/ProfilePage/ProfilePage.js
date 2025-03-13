import React, { useState, useEffect } from 'react';
import { uploadData, getUrl } from '@aws-amplify/storage';
import { generateClient } from '@aws-amplify/api';
import { updateUser } from '../../graphql/mutations';
import { getUser } from '../../graphql/queries';
import { fetchUserAttributes } from '@aws-amplify/auth';
import './ProfilePage.css';
import friendSuggests from '../../data/friendSuggests'; // Imported correctly
import { useParams } from 'react-router-dom';

function ProfilePage() {
    const [username, setUsername] = useState('');
    const [bio, setBio] = useState('');
    const [profilePicture, setProfilePicture] = useState(null);
    const [profilePictureUrl, setProfilePictureUrl] = useState('');
    const [userId, setUserId] = useState(null);
    const { userId: paramUserId } = useParams();
    const client = generateClient();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const userAttributes = await fetchUserAttributes();
                if (!userAttributes.sub) throw new Error('No user ID found');
                const currentUserId = userAttributes.sub;
                setUserId(currentUserId);
                console.log('Current User ID:', currentUserId);
                console.log('Param User ID:', paramUserId);

                if (!paramUserId || paramUserId === currentUserId) {
                    const userResponse = await client.graphql({
                        query: getUser,
                        variables: { id: currentUserId }
                    });
                    const userData = userResponse.data.getUser || {};
                    setUsername(userData.username || userAttributes.preferred_username || '');
                    setBio(userData.bio || '');
                    if (userData.profilePicture) {
                        const urlResult = await getUrl({ key: userData.profilePicture });
                        setProfilePictureUrl(urlResult.url);
                    }
                }
            } catch (error) {
                console.error('Error fetching profile:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [paramUserId]);

    const handleFileChange = (e) => setProfilePicture(e.target.files[0]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let pictureKey = null;
            if (profilePicture) {
                const fileName = `${Date.now()}-${profilePicture.name}`;
                const result = await uploadData({
                    key: fileName,
                    data: profilePicture,
                    options: { contentType: profilePicture.type }
                }).result;
                pictureKey = result.key;
            } else if (profilePictureUrl) {
                pictureKey = profilePictureUrl.split('/').pop().split('?')[0];
            }

            const input = {
                id: userId,
                username,
                bio,
                profilePicture: pictureKey
            };
            const response = await client.graphql({
                query: updateUser,
                variables: { input }
            });

            if (response.errors) throw new Error(JSON.stringify(response.errors));
            const updatedUser = response.data.updateUser;
            setUsername(updatedUser.username || '');
            setBio(updatedUser.bio || '');
            if (updatedUser.profilePicture) {
                const urlResult = await getUrl({ key: updatedUser.profilePicture });
                setProfilePictureUrl(urlResult.url);
            }
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile: ' + error.message);
        }
    };

    const suggestedFriend = friendSuggests.find(u => u.id === paramUserId); // Renamed to avoid conflict

    if (isLoading) return <div>Loading...</div>;

    return (
        <div className="profile-page">
            {suggestedFriend ? (
                <div className="mock-profile">
                    <div className="profile-header">
                        <img className="profile-image" src={suggestedFriend.profilePicture} alt={suggestedFriend.username} />
                        <h2 className="profile-username">{suggestedFriend.username}</h2>
                    </div>
                    <div className="profile-details">
                        <p className="profile-bio">{suggestedFriend.bio}</p>
                        <p className="profile-stats">Likes: {suggestedFriend.likes || 0}</p>
                        <p className="profile-stats">Followers: {suggestedFriend.followers?.length || 0}</p>
                        <p className="profile-stats">Following: {suggestedFriend.following?.length || 0}</p>
                        <p className="profile-stats">Posts: 0 (Mock User)</p>
                    </div>
                </div>
            ) : paramUserId && paramUserId !== userId ? (
                <div>
                    <h2>User Profile (Real)</h2>
                    <p>Username: {username || 'Loading...'}</p>
                    <p>Bio: {bio || 'No bio'}</p>
                    <img src={profilePictureUrl || 'https://via.placeholder.com/50'} alt="Profile" />
                </div>
            ) : (
                <>
                    <h2>Edit Profile</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="profile-picture">
                            {profilePictureUrl && (
                                <img src={profilePictureUrl} alt="Profile" />
                            )}
                            <input type="file" onChange={handleFileChange} accept="image/*" />
                        </div>
                        <div className="form-field">
                            <label>Username:</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="form-field">
                            <label>Bio:</label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                placeholder="Tell us about yourself..."
                            />
                        </div>
                        <button type="submit">Save Changes</button>
                    </form>
                </>
            )}
        </div>
    );
}

export default ProfilePage;