import React, { useState, useEffect } from 'react';
import './Timeline.css';
import Post from './posts/Post';
import PostPage from './PostPage/PostPage';
import { generateClient } from '@aws-amplify/api';
import { listPosts, getUser } from '../graphql/queries';
import { getUrl } from '@aws-amplify/storage';
import { fetchUserAttributes } from '@aws-amplify/auth';

function Timeline() {
    const [posts, setPosts] = useState([]);
    const [authUserId, setAuthUserId] = useState(null);
    const client = generateClient();

    const fetchPosts = async () => {
        try {
            const userAttributes = await fetchUserAttributes();
            setAuthUserId(userAttributes.sub);

            const postData = await client.graphql({ 
                query: listPosts,
                variables: { limit: 10 }
            });
            console.log('Fetched posts with comments:', postData.data.listPosts.items);
            const fetchedPosts = postData.data.listPosts.items;

            const postsWithUserData = await Promise.all(
                fetchedPosts.map(async (post) => {
                    const signedUrlResult = await getUrl({ key: post.imageKey });
                    const postImage = signedUrlResult.url;

                    const userResponse = await client.graphql({
                        query: getUser,
                        variables: { id: post.userId }
                    });
                    const user = userResponse.data.getUser || { username: 'Unknown', profilePicture: null };
                    const profilePictureUrl = user.profilePicture 
                        ? (await getUrl({ key: user.profilePicture })).url 
                        : null;

                    const commentsWithUsernames = await Promise.all(
                        (post.comments?.items || []).map(async (comment) => {
                            const commenterResponse = await client.graphql({
                                query: getUser,
                                variables: { id: comment.userId }
                            });
                            const commenter = commenterResponse.data.getUser || { username: 'Unknown' };
                            return { ...comment, username: commenter.username };
                        })
                    );

                    return { 
                        ...post, 
                        postImage, 
                        user: { username: user.username || 'Unknown', profilePictureUrl },
                        comments: commentsWithUsernames
                    };
                })
            );

            setPosts(postsWithUserData);
        } catch (error) {
            console.error('Error fetching posts:', error);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, [client]);

    const handleNewPost = async (newPost) => {
        try {
            const userResponse = await client.graphql({
                query: getUser,
                variables: { id: newPost.userId }
            });
            const user = userResponse.data.getUser || { username: 'Unknown', profilePicture: null };
            const profilePictureUrl = user.profilePicture 
                ? (await getUrl({ key: user.profilePicture })).url 
                : null;

            const updatedPost = { 
                ...newPost, 
                user: { username: user.username || 'Unknown', profilePictureUrl },
                comments: newPost.comments?.items || []
            };
            setPosts((prev) => [updatedPost, ...prev]);
        } catch (error) {
            console.error('Error handling new post:', error);
            setPosts((prev) => [{ ...newPost, user: { username: 'Unknown', profilePictureUrl: null }, comments: [] }, ...prev]);
        }
    };

    const handleDeletePost = (postId) => {
        setPosts((prev) => prev.filter(post => post.id !== postId));
    };

    const handlePostUpdate = (postId, updatedData) => {
        setPosts((prev) =>
            prev.map(post => {
                if (post.id === postId) {
                    return { 
                        ...post, 
                        likes: updatedData.likes, 
                        likedBy: updatedData.likedBy, 
                        comments: updatedData.comments || post.comments
                    };
                }
                return post;
            })
        );
        fetchPosts();
    };

    return (
        <div className="timeline">
            <div className="timeline__left">
                <div className="timeline__createPost">
                    <PostPage onPostCreation={handleNewPost} isCompact={true} />
                </div>
                <div className="timeline__posts">
                    {posts.map((post) => (
                        <Post
                            key={post.id}
                            user={post.user?.username || 'Unknown'}
                            profilePictureUrl={post.user?.profilePictureUrl}
                            postImage={post.postImage}
                            text={post.text}
                            likes={post.likes || 0}
                            likedBy={post.likedBy || []}
                            comments={post.comments}
                            timestamp={post.timestamp}
                            userId={authUserId}
                            postId={post.id}
                            postUserId={post.userId}
                            onDelete={handleDeletePost}
                            onUpdate={handlePostUpdate}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Timeline;