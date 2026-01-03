const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    me: async (parent, args, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      return User.findById(context.user._id).select('-__v -password');
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);
      return { token, user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Incorrect credentials');
      }
      const correctPw = await user.isCorrectPassword(password);
      if (!correctPw) {
        throw new Error('Incorrect credentials');
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { bookData }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $addToSet: { savedBooks: bookData } },
        { new: true, runValidators: true }
      );
      return updatedUser;
    },
    removeBook: async (parent, { bookId }, context) => {
      if (!context.user) {
        throw new Error('Not authenticated');
      }
      const updatedUser = await User.findByIdAndUpdate(
        context.user._id,
        { $pull: { savedBooks: { bookId } } },
        { new: true }
      );
      return updatedUser;
    },
  },
};

module.exports = resolvers;
