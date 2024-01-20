require('dotenv').config()
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

//Configure cloudinary
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key : process.env.CLOUDINARY_KEY,
    api_secret : process.env.CLOUDINARY_SECRET_KEY,

});

//Instance of cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    allowedforamts:['jpg','jpeg','png'],
    params:{
        folder:'fullstack-blog',
        transformation:[{width:500, height:500, crop:'limit'}],
    }
});

module.exports = storage;