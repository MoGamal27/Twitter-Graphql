const {model , Schema} = require('mongoose');

const tweetSchema = new Schema({
   text: String,
   author: String,
   createdAt: String,
   comments:[
       {
           text: String,
           author: String,
           createdAt: String,
       }
   ],
   likes:[
       {
           author: String,
           createdAt: String,

       }
   ],
   user:{
       type: Schema.Types.ObjectId,
       ref: 'users'
   }

});

module.exports = model('Tweet' , tweetSchema);