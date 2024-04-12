const Tweet = require("../../models/Tweet");
const checkAuth = require("../../util/check-auth");
const { AuthenticationError, UserInputError} = require('apollo-server');
const {PubSub} = require('graphql-subscriptions');
const pubsub = new PubSub();

module.exports = {
    Query: {
        async getTweets() {
            try {
                return await Tweet.find().sort({createdAt : -1});
            } catch (err) {
                throw new Error(err);
            }
        },
        async getTweet(_, {tweetId}) {
            try {
                const tweet = await Tweet.findById(tweetId);
                if (tweet) {
                    return tweet;
                } else {
                    throw new Error('Tweet not found');
                }
            } catch (err) {
                throw new Error(err);
            }
        }
    },
    Mutation: {
        async createTweet(_, { body }, context) {
            const user = checkAuth(context);
            //console.log(user);
            const newTweet = new Tweet({
                body,
                user: user.id,
                author: user.author,
                createdAt: new Date().toISOString(),
            });

            const tweet = await newTweet.save();

            await pubsub.publish('NEW_Tweet', {
                newTweet: tweet
            });


            return tweet;
        },
        async deleteTweet(_, {tweetId} , context) {
          const user = checkAuth(context);
         try {
             const tweet = await Tweet.findById(tweetId);
             if (user.username === Tweet.username){
                 await Tweet.deleteOne();
                 return 'Tweet deleted successfully';
             }
             else {
                 throw new AuthenticationError('Action now allowed');
             }
         }
         catch (err){
             throw new Error(err);
         }
        },
        async likeTweet(_,{tweetId} , context) {

            const {username} = checkAuth(context);
            const tweet = await Tweet.findById(tweetId);
            if (tweet){
                if (tweet.likes.find(like => like.username === username)){
                    // tweet Already liked
                    // remove it
                    tweet.likes = tweet.likes.filter(like => like.username !== username);
                }
                else {
                    // not liked
                    tweet.likes.push({
                       username,
                       createdAt: new Date().toISOString(),
                    });
                }
                tweet.save();
                return tweet;
            }
            else {
                throw new UserInputError('tweet not found');
            }
        },
    },
    Subscription: {
        newTweet: {
            subscribe: ()=> pubsub.asyncIterator('NEW_Tweet'),
        }
    }
}