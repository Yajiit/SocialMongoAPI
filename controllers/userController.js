// controller/userController.js
const {User, Thought} = require('../models');

const userController = {
    async getAllUsers(req, res) { //get all users
      try {
        const dbUserData = await User.find()
          .select('-__v') 
        res.json(dbUserData);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },
    async getSingleUser(req, res) { //get single user by id
      try {
        const dbUserData = await User.findOne({ _id: req.params.userId })
          .select('-__v')
          .populate('friends')
          .populate('thoughts');
  
        if (!dbUserData) {
          return res.status(404).json({ message: 'ID not found!' });
        }  
        res.json(dbUserData);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },
    async createUser(req, res) { //create User
      try {
        const dbUserData = await User.create(req.body);
        res.json(dbUserData);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },
    async updateUser(req, res) { //update User
      try {
        const dbUserData = await User.findOneAndUpdate(
          { _id: req.params.userId },
          {
            $set: req.body,
          },
          {
            runValidators: true,
            new: true,
          }
        );
  
        if (!dbUserData) {
          return res.status(404).json({ message: 'ID not found!' });
        }
  
        res.json(dbUserData);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },
    async deleteUser(req, res) { //delete User
      try {
        const dbUserData = await User.findOneAndDelete({ _id: req.params.userId })
  
        if (!dbUserData) {
          return res.status(404).json({ message: 'ID not found!' });
        }
        await Thought.deleteMany({ _id: { $in: dbUserData.thoughts } }); //deletes thoughts
        res.json({ message: 'User and Thoughts deleted!' });
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },
    async addFriend(req, res) { //add Friend
      try {
        const dbUserData = await User.findOneAndUpdate({ _id: req.params.userId }, { $addToSet: { friends: req.params.friendId } }, { new: true });
  
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user with this id!' });
        }
  
        res.json(dbUserData);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },
    async removeFriend(req, res) { //remove Friend
      try {
        const dbUserData = await User.findOneAndUpdate({ _id: req.params.userId }, { $pull: { friends: req.params.friendId } }, { new: true });
  
        if (!dbUserData) {
          return res.status(404).json({ message: 'No user with this id!' });
        }
  
        res.json(dbUserData);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    },
  };
  
  module.exports = userController;
  