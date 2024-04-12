const Tweet = require("../../models/Tweet");
const checkAuth = require("./../../util/check-auth");
const { AuthenticationError , UserInputError} = require('apollo-server');


module.exports = {
    Mutation: {
        createComment: async (_, {tweetId, body}, context) => {
            //console.log("Test");
            //console.log(context)
            const {author} = checkAuth(context);
            //console.log(author);
            if (body.trim() === '') {
                throw new UserInputError('Empty comment', {
                    errors: {
                        body: 'Comment body must not be empty',
                    }
                });
            }
            const tweet = await Tweet.findById(tweetId);

            if (tweet) {
                tweet.comments.unshift({
                    body,
                    author,
                    createdAt: new Date().toISOString(),
                })
                await tweet.save();
                return tweet;
            } else {
                throw new UserInputError('tweet not found');
            }
        },
        deleteComment: async (_, {tweetId, commentId}, context) => {
            const {author} = checkAuth(context);

            const tweet = await Tweet.findById(tweetId);

            if (tweet) {
                const commentIndex = tweet.comments.findIndex(c => c.id === commentId);

                if (tweet.comments[commentIndex].author === author) {
                    tweet.comments.splice(commentIndex, 1);
                    await tweet.save();
                    return tweet
                }
                // saver check
                else {
                    throw new AuthenticationError('Action now allowed');
                }
            }
            else {
                throw new UserInputError('tweet not found');
            }
        }
    }
}