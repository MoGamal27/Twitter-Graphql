const tweetsResolvers = require('./tweet');
const userResolvers = require('./users');
const commentsResolvers = require('./comments');

module.exports = {
    Tweet:{
      likeCount(parent){
          console.log(parent);
        return parent.likes.length;
      },
      commentCount: (parent) =>parent.comments.length

    },
    Query: {
        ...tweetsResolvers.Query,
        ...userResolvers.Query,
    },
    Mutation:{
        ...tweetsResolvers.Mutation,
        ...userResolvers.Mutation,
        ...commentsResolvers.Mutation,
    },
    Subscription: {
        ...tweetsResolvers.Subscription
    }
}