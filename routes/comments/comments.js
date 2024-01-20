const express=require('express')
const { 
    createCommentCtrl, 
    commentDetailsCtrl, 
    deleteCommentCtrl, 
    updateCommentCtrl 
} = require('../../controllers/comments/comments')
const protected = require('../../middlewares/protected')
const commentsRoutes=express.Router()


//POST/api/v1/comments/:id
commentsRoutes.post('/:id',protected, createCommentCtrl);


//GET/api/v1/comments/:id
commentsRoutes.get('/:id',commentDetailsCtrl);

//DELETE/api/v1/comments/:id
commentsRoutes.delete('/:id',protected, deleteCommentCtrl);

//PUT/api/v1/comments/:id
commentsRoutes.put('/:id',protected, updateCommentCtrl);

module.exports = commentsRoutes;
