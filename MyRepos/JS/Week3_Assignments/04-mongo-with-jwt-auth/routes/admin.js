const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const router = Router();
const {Admin, User, Course} = require("../db");
const {JWT_SECRET} = require("../config");
const jwt = require("jsonwebtoken");

// Admin Routes
router.post('/signup', async(req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;

    await Admin.create({
        username: username,
        password: password,
    })
    res.json({
        message: "Admin created successfully",
    })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    console.log(JWT_SECRET);
    const user = await User.find({
        username,
        password
    })
    if(user){
        const token = await jwt.sign({
            username},JWT_SECRET);
        res.json({
            token
        })
    }else{
        res.status(403).json({
            msg: "Incorrect username and password"
        })
    }
});

router.post('/courses', adminMiddleware, async (req, res) => {
    // Implement course creation logic
    const title = req.body.title;
    const description = req.body.description;
    const imageLink = req.body.imageLink;
    const price = req.body.price;
    //do input validation here
    const newCourse = await Course.create({
        title,
        description,
        imageLink,
        price,
    })
    console.log(newCourse);
    res.json({
        message: "Course created successfully", courseId: newCourse._id
    })
});

router.get('/courses', adminMiddleware, async (req, res) => {
    // Implement fetching all courses logic
    const allCourses = await Course.find({});
    res.json({
        courses: allCourses
    })
});

module.exports = router;