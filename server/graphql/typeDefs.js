const gql = require('graphql-tag');

module.exports = gql`
    type Tweet{
        id :ID!
        createdAt :String!
        author :String!
        body :String!
    }
    type Like{
        id :ID!
        createdAt: String!
        author :String!
    }
    type Tweet{
        id: ID!
        body: String!
        createdAt: String!
        author: String!
        comments:[Comment]!
        likes:[Like]!
        newTweet: Tweet
        likeCount:Int!
        commentCount:Int!
    }
    
    type Query{
        getTweets: [Tweet]
        getTweet(tweetId: ID!):Tweet
        getUsers: [User]
    }
    type User{
        id:  ID!
        email: String!
        token: String!
        author: String!
        createdAt: String!
    }
    input RegisterInput{
        author: String!
        password: String!
        confirmPassword: String!
        email: String!
    }
    type Mutation{
        register(registerInput : RegisterInput): User!
        login(author: String! , password: String!): User!
        createTweet(body: String!): Tweet!
        deleteTweet(tweetId: ID!): String!
        createComment(tweetId: String! , body: String!): Tweet!
        deleteComment(tweetId: String! , commentId: ID!): Tweet!
        likeTweet(tweetId: ID!): Tweet!
    }
    
    type Subscription{
        newTweet :Tweet!
    }

`;
