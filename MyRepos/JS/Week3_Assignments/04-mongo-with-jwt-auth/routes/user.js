const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const {Admin,User, Course} = require("../db");
const {JWT_SECRET} = require("../config");
const jwt = require("jsonwebtoken");

// User Routes
router.post('/signup', (req, res) => {
    // Implement user signup logic
    const username = req.body.username;
    const password = req.body.password;

    User.create({
        username,
        password,
    })
    res.json({
        msg: "User created successfully",
    })
});

router.post('/signin', async (req, res) => {
    // Implement admin signup logic
    const username = req.body.username;
    const password = req.body.password;
    const user = await User.find({
        username,
        password
    });
    if (user) {
        const token = await jwt.sign({
            username
        }, JWT_SECRET);
        res.json({
            token
        })
    }
});

router.get('/courses', async (req, res) => {
    // Implement listing all courses logic
    const courses = await Course.find({});
    res.json({
        courses: courses
    })
});

router.post('/courses/:courseId', userMiddleware, async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.username;
    try {
        await User.updateOne({
            username: username,
        }, {
            "$push": {
                purchasedCourses: courseId
            }
            //purchasedCourses: {$push: courseId} // this is syntax error
        })
        console.log(courseId);
    } catch (error) {
        console.log(error);
    }
    res.json({
        msg: "Purchase complete"
    })
});

router.get('/purchasedCourses', userMiddleware, async (req, res) => {
    // Implement fetching purchased courses logic
    const user = await Course.findOne({
        username: req.username,
    });
    console.log(username);
    const courses = await Course.find({
        _id: {"$in": user.purchasedCourses}
    });
    res.json({
        courses: courses
    })
});

module.exports = router