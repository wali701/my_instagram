import React, { useState } from 'react';
import { uploadData, getUrl } from '@aws-amplify/storage';
import { generateClient } from '@aws-amplify/api';
import { createPost } from '../../graphql/mutations';
import { fetchUserAttributes } from '@aws-amplify/auth';
import './PostPage.css';
import EmojiPicker from 'emoji-picker-react'; // Install via `npm install emoji-picker-react`

function PostPage({ onPostCreation, isCompact = false }) {
    const [text, setText] = useState('');
    const [file, setFile] = useState(null);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);

    const handleFileChange = (e) => setFile(e.target.files[0]);
    const handleTextChange = (e) => setText(e.target.value);

    const handleEmojiClick = (emojiObject) => {
        setText(prev => prev + emojiObject.emoji);
        setShowEmojiPicker(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) return alert('Please select a file.');

        try {
            const fileName = `${Date.now()}-${file.name}`;
            const result = await uploadData({
                key: fileName,
                data: file,
                options: { contentType: file.type }
            }).result;
            const imageKey = result.key;

            const signedUrl = await getUrl({ key: imageKey });

            const userAttributes = await fetchUserAttributes();
            const userId = userAttributes.sub;

            const postInput = {
                text,
                imageKey,
                userId,
                likes: 0,
                timestamp: new Date().toISOString()
            };

            const client = generateClient();
            const response = await client.graphql({ 
                query: createPost, 
                variables: { input: postInput } 
            });

            if (response.errors) throw new Error(JSON.stringify(response.errors));
            const newPost = response.data.createPost;
            newPost.postImage = signedUrl.url;

            alert('Post created successfully!');
            if (onPostCreation) onPostCreation(newPost);
            setText('');
            setFile(null);
        } catch (error) {
            console.error('Error creating post:', error);
            alert('Failed to create post: ' + error.message);
        }
    };

    return (
        <div className={`post-page-container ${isCompact ? 'compact' : ''}`}>
            <div className="post-page-modal">
                <div className="post-page-header">
                    <h2>Create new post</h2>
                </div>
                <form onSubmit={handleSubmit} className="post-page-form">
                    <div className="post-page-upload">
                        <input 
                            type="file" 
                            onChange={handleFileChange} 
                            accept="image/*,video/*" 
                            id="file-upload" 
                            className="file-input" 
                        />
                        <label htmlFor="file-upload" className="file-upload-label">
                            {file ? file.name : 'Select a file'}
                        </label>
                    </div>
                    <div className="post-page-caption-container">
                        <textarea 
                            value={text} 
                            onChange={handleTextChange} 
                            placeholder="Write a caption..." 
                            className="post-page-caption"
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            className="emoji-button"
                        >
                            😊
                        </button>
                        {showEmojiPicker && (
                            <div className="emoji-picker">
                                <EmojiPicker onEmojiClick={handleEmojiClick} />
                            </div>
                        )}
                    </div>
                    <button type="submit" className="post-page-share">Share</button>
                </form>
            </div>
        </div>
    );
}

export default PostPage;