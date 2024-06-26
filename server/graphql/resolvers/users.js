const User = require("../../models/User");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {UserInputError} = require('apollo-server');

const {validateRegisterInput, validateLoginInput} = require('../../util/validators')


function generateToken(user) {
    return jwt.sign({
        id: user.id,
        email: user.email,
        author: user.author,
    }, process.env.JWT_SECRET, {expiresIn: '1h'});

}

module.exports = {

    Query:{
        async getUsers (){
            try {
                return await User.find();
            }
            catch (err){
                console.log(err);
            }
        }
    },
    Mutation: {
        async login(_, {author, password}) {
            const {errors, valid} = validateLoginInput(author, password);
            const user = await User.findOne({author});

            if (!valid){
                throw new UserInputError('Wrong credentials' , {errors});
            }

            if (!user) {
                errors.general = 'User not found';
                throw new UserInputError('User not found', {errors});
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                errors.general = 'Wrong credentials';
                throw new UserInputError('Wrong credentials', {errors});
            }
            const token = generateToken(user);
            return {
                ...user._doc,
                id: user._id,
                token
            };

        },

        async register(_, {registerInput: {author, email, password, confirmPassword}}) {
            // TODO Validate user data
            const {valid, errors} = validateRegisterInput(author, email, password, confirmPassword);
            if (!valid) {
                throw new UserInputError('Errors', {errors});
            }
            // TODO Make sure user doesn't already exist
            const user = await User.findOne({author});

            if (user) {
                throw new UserInputError('User already exists', {
                    errors: {
                        author: 'This author is taken,'
                    }
                });
            }

            // hash password and create an auth token
            password = await bcrypt.hash(password, 12);

            const newUser = new User({
                email,
                author,
                password,
                confirmPassword,
                createdAt: new Date().toISOString(),
            });
            const res = await newUser.save();
            const token = generateToken(res);

            return {
                ...res._doc,
                id: res._id,
                token
            };
        }
    }
}