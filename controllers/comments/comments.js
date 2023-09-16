const Comment = require("../../models/comment/Comment");
const Post = require("../../models/post/Post");
const User = require("../../models/user/User");
const appErr = require("../../utils/appErr");
//create
const createCommentCtrl = async(req, res, next) => {
    const { message } = req.body;
    try {
        //Find the post
        const post = await Post.findById(req.params.id)
        //create the comment
        const comment = await Comment.create({
            user: req.session.userAuth,
            message,
            post: post._id,
        });

        //push the comment to post
        post.comments.push(comment._id);
        //find the user
        const user = await User.findById(req.session.userAuth._id)
        //push the comment into suer
        user.comments.push(comment._id);
        //disable validation
        //save
        await post.save({validateBeforeSave : false});
        await user.save({validateBeforeSave : false});

        //redirect
        res.redirect(`/api/v1/posts/${post._id}`)
    } catch (error) {
        next(appErr(error.message))

    }
}

//single
const commentDetailsCtrl = async(req, res, next) => {
    try {
        //find the comment
        const comment = await Comment.findById(req.params.id)
        res.render('comments/updateComment',{
            comment, error:"",
        })
    } catch (error) {
        res.render('comments/updateComment',{
            comment:"", error:error.message,
        })
    }
}

//delete
const deleteCommentCtrl = async(req, res, next) => {
    try {
        //find the comment
        const comment = await Comment.findById(req.params.id)
        //check if the comment belongs to the user
        if(comment.user.toString() !== req.session.userAuth._id.toString()){
            return next(appErr("You are not allowed to delete this post",403))
        } 
        //delete comment
        const deletedComment = await Comment.findByIdAndDelete(req.params.id);
        //redirect
        res.redirect(`/api/v1/posts/${req.query.postId}`)
    } catch (error) {
        next(appErr(error.message))

    }
}

const updateCommentCtrl = async(req, res, next) => {
    try {
        //find the comment
        const comment = await Comment.findById(req.params.id)
        if(!comment){
            return next(appErr("Comment Not Found"))
        }
        //check if the comment belongs to the user
        if(comment.user.toString() !== req.session.userAuth._id.toString()){
            return next(appErr("You are not allowed to update this comment",403))
        }
        //update user

        const commentUpdated = await Comment.findByIdAndUpdate(req.params.id,{
            message : req.body.message,
        },{
            new : true,
        })
        //redirect
        res.redirect(`/api/v1/posts/${req.query.postId}`)
    } catch (error) {
        next(appErr(error))
        
    }
}

module.exports = {
    createCommentCtrl,
    commentDetailsCtrl,
    deleteCommentCtrl,
    updateCommentCtrl
    
}