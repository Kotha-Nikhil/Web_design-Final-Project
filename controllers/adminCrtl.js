const Users = require('../models/userModel')
const Posts = require('../models/postModel')
const adminCtrl = {
    searchUser: async (req, res) => {
        try {
            const users = await Users.find({username: {$regex: req.query.username}}).limit(10).select("fullname username avatar")       
            res.json({users})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },

    getAllUsers: async (req, res) => {
        try {
            const users = await Users.find({}).select('-password')
                .populate({
                    path: 'followers',
                    select: '-password'  // Excluding password from populated followers
                })
                .populate({
                    path: 'following',
                    select: '-password'  // Excluding password from populated following
                });
    
            // Logging all users
            console.log(users);
    
            // Check if the users array is empty and respond accordingly
            if(!users.length) return res.status(404).json({ msg: "No users found." });
    
            // Sending the users in the response
            res.json(users);
        } catch (err) {
            // Handling errors and sending error message as response
            res.status(500).json({ msg: err.message });
        }
    },
    getPopularPosts: async (req, res) => { 
        try {
            const posts = await Posts.find({}).sort('-likes').limit(10);
            res.json({posts});
        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },
    deleteUser: async (req, res) => {
        try {
            const user = await Users.findByIdAndDelete(req.params.id);
            res.json({msg: "Deleted Success!"});
        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    },
    deletePost: async (req, res) => {
        try {
            const post = await Posts.findOneAndDelete({_id: req.params.id});
            res.json({msg: "Deleted Success!"});
        } catch (err) {
            return res.status(500).json({msg: err.message});
        }
    }
}
module.exports = adminCtrl