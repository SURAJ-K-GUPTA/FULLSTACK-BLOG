const User = require('../../models/user/User')
const bcrypt = require("bcryptjs");
const appErr = require('../../utils/appErr');

//register
const resgisterCtrl = async (req, res, next) => {
    const { fullname, email, password } = req.body
    //check if field is empty
    if (!fullname || !email || !password) {
        // return next(appErr("All fields are required"))
        return res.render('users/register', {
            error: "All fields are required",
        })
    }
    try {
        //1. check if user exist (email)
        const userFound = await User.findOne({ email })
        //throw an error
        if (userFound) {
            // return next(appErr('User already Exist'))
            return res.render('users/register', {
                error: "User already Exist",
            })
        }
        //Hash password
        const salt = await bcrypt.genSalt(10)
        const passwordHashed = await bcrypt.hash(password, salt)

        //register user
        const user = await User.create({
            fullname,
            email,
            password: passwordHashed,
        });
        //redirect
        res.redirect('/api/v1/users/login')
    } catch (error) {
        res.json(error);
    }
};

//login
const loginCtrl = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        // return next(appErr("Email and password fields are required"));
        return res.render('users/login', {
            error: "Email and password fields are required",
        })
    }
    try {
        //check if email exist
        const userFound = await User.findOne({ email });
        if (!userFound) {
            //throw an error
            // return next(appErr("Invalid User Credentials"))
            return res.render('users/login', {
                error: "Invalid User Credentials",
            })
        }
        //verify password
        const isPasswordValid = await bcrypt.compare(password, userFound.password)
        if (!isPasswordValid) {
            //throw an error
            // return next(appErr("Invalid User Credentials"))
            return res.render('users/login', {
                error: "Invalid User Credentials",
            })
        }
        //save the user into session
        req.session.userAuth = userFound;
        //redirect
        res.redirect('/api/v1/users/profile-page')

    } catch (error) {
        res.json(error);
    }
};

//details
const userDetailsCtrl = async (req, res) => {
    try {
        //get userId from params
        const userId = req.params.id
        //find the user
        const user = await User.findById(userId)

        res.render("users/updateUser", {
            user,
            error: "",
        })
    } catch (error) {
        res.render("users/updateUser", {
            user,
            error: error.message,
        })
    }
}

//profile
const profileCtrl = async (req, res) => {
    try {
        //get the login user
        const userID = req.session.userAuth;
        //find the user
        const user = await User.findById(userID).populate('posts').populate("comments");
        res.render('users/profile', { user })
    } catch (error) {
        res.json(error);
    }
}

//upload profile photo
const uploadProfilePhotoCtrl = async (req, res) => {
    console.log(req.file);
    try {
        //check if file exist
        if (!req.file) {
            res.render('users/uploadProfilePhoto', {
                error: "Please upload image"
            })
        }
        //1. Find the user to be updated
        const userId = req.session.userAuth;
        const userFound = await User.findById(userId);
        //2. Check if user is found
        if (!userFound) {
            res.render('users/uploadProfilePhoto', {
                error: "User not found"
            })
        }
        //3. Update profile photo
        await User.findByIdAndUpdate(userId, {
            profileImage: req.file.path,
        }, {
            new: true,
        });
        //redirect
        res.redirect('/api/v1/users/profile-page')
    } catch (error) {
        res.render('users/uploadProfilePhoto', {
            error: error.message,
        })
    }
}

//upload cover photo
const uploadCoverPhotoCtrl = async (req, res) => {

    try {//check if file exist
        if (!req.file) {
            res.render('users/uploadProfilePhoto', {
                error: "Please upload image"
            })
        }
        //1. Find the user to be updated
        const userId = req.session.userAuth;
        const userFound = await User.findById(userId);
        //2. Check if user is found
        if (!userFound) {
            res.render('users/uploadProfilePhoto', {
                error: "User not found"
            })
        }
        //3. Update cover photo
        await User.findByIdAndUpdate(userId, {
            coverImage: req.file.path,
        }, {
            new: true,
        });
        //redirect
        res.redirect('/api/v1/users/profile-page')


    } catch (error) {
        res.render('users/uploadProfilePhoto', {
            error: error.message,
        })
    }
}

//update password
const updatePasswordCtrl = async (req, res, next) => {
    const { password } = req.body;
    try {
        //Check if user is updation the password
        if (password) {
            const salt = await bcrypt.genSalt(10);
            const passwordHashed = await bcrypt.hash(password, salt);
            //update user
            await User.findByIdAndUpdate(
                req.session.userAuth,
                {
                    password: passwordHashed,
                },
                {
                    new: true,
                }
            );
            //redirect
            res.redirect('/api/v1/users/profile-page')

        }

    } catch (error) {
        res.render('users/updatePassword', {
            error: error.message,
        })
    }
}

//update user
const updateUserCtrl = async (req, res, next) => {
    const { fullname, email, role, bio } = req.body;

    try {
        if (!fullname || !email) {
            res.render('users/updateUser', {
                error: "Please provide details",
                user,
            })
        }
        //Check if email is not taken
        if (email!==req.session.userAuth.email) {
            const emailTaken = await User.findOne({ email });
            if (emailTaken) {
                res.render('users/updateUser', {
                    error: "Email is Taken",
                    user,
                })
            }
        }
        //update the user
        await User.findByIdAndUpdate(req.session.userAuth, {
            fullname,
            email,
            role,
            bio,
        }, {
            new: true,
        })
        //redirect
        res.redirect('/api/v1/users/profile-page')

    } catch (error) {
        res.render('users/updateUser', {
            error: error.message,
            user: "",
        })
    }
}

//logout
const logoutCtrl = async (req, res) => {
    try {
        //destroy session
        req.session.destroy(() => {
            res.redirect('/api/v1/users/login');
        })
    } catch (error) {
        res.json(error);
    }
}

module.exports = {
    resgisterCtrl,
    loginCtrl,
    userDetailsCtrl,
    profileCtrl,
    uploadProfilePhotoCtrl,
    uploadCoverPhotoCtrl,
    updatePasswordCtrl,
    updateUserCtrl,
    logoutCtrl
}