/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreatePost = /* GraphQL */ `
  subscription OnCreatePost(
    $filter: ModelSubscriptionPostFilterInput
    $userId: String
  ) {
    onCreatePost(filter: $filter, userId: $userId) {
      id
      text
      imageKey
      userId
      likes
      likedBy
      tags
      comments {
        nextToken
        __typename
      }
      timestamp
      createdAt
      updatedAt
      userPostsId
      __typename
    }
  }
`;
export const onUpdatePost = /* GraphQL */ `
  subscription OnUpdatePost(
    $filter: ModelSubscriptionPostFilterInput
    $userId: String
  ) {
    onUpdatePost(filter: $filter, userId: $userId) {
      id
      text
      imageKey
      userId
      likes
      likedBy
      tags
      comments {
        nextToken
        __typename
      }
      timestamp
      createdAt
      updatedAt
      userPostsId
      __typename
    }
  }
`;
export const onDeletePost = /* GraphQL */ `
  subscription OnDeletePost(
    $filter: ModelSubscriptionPostFilterInput
    $userId: String
  ) {
    onDeletePost(filter: $filter, userId: $userId) {
      id
      text
      imageKey
      userId
      likes
      likedBy
      tags
      comments {
        nextToken
        __typename
      }
      timestamp
      createdAt
      updatedAt
      userPostsId
      __typename
    }
  }
`;
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($filter: ModelSubscriptionUserFilterInput) {
    onCreateUser(filter: $filter) {
      id
      username
      bio
      profilePicture
      posts {
        nextToken
        __typename
      }
      likes
      likedBy
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($filter: ModelSubscriptionUserFilterInput) {
    onUpdateUser(filter: $filter) {
      id
      username
      bio
      profilePicture
      posts {
        nextToken
        __typename
      }
      likes
      likedBy
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($filter: ModelSubscriptionUserFilterInput) {
    onDeleteUser(filter: $filter) {
      id
      username
      bio
      profilePicture
      posts {
        nextToken
        __typename
      }
      likes
      likedBy
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onCreateComment = /* GraphQL */ `
  subscription OnCreateComment(
    $filter: ModelSubscriptionCommentFilterInput
    $userId: String
  ) {
    onCreateComment(filter: $filter, userId: $userId) {
      id
      text
      userId
      postId
      post {
        id
        text
        imageKey
        userId
        likes
        likedBy
        tags
        timestamp
        createdAt
        updatedAt
        userPostsId
        __typename
      }
      timestamp
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onUpdateComment = /* GraphQL */ `
  subscription OnUpdateComment(
    $filter: ModelSubscriptionCommentFilterInput
    $userId: String
  ) {
    onUpdateComment(filter: $filter, userId: $userId) {
      id
      text
      userId
      postId
      post {
        id
        text
        imageKey
        userId
        likes
        likedBy
        tags
        timestamp
        createdAt
        updatedAt
        userPostsId
        __typename
      }
      timestamp
      createdAt
      updatedAt
      __typename
    }
  }
`;
export const onDeleteComment = /* GraphQL */ `
  subscription OnDeleteComment(
    $filter: ModelSubscriptionCommentFilterInput
    $userId: String
  ) {
    onDeleteComment(filter: $filter, userId: $userId) {
      id
      text
      userId
      postId
      post {
        id
        text
        imageKey
        userId
        likes
        likedBy
        tags
        timestamp
        createdAt
        updatedAt
        userPostsId
        __typename
      }
      timestamp
      createdAt
      updatedAt
      __typename
    }
  }
`;
