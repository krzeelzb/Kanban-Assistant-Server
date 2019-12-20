const express = require('express');
const Column = require('../models/column');
const { User, validate } = require("../models/user");
const auth = require("../middleware/auth");
const columnRouter = express.Router();

columnRouter.post('/', auth, async (req, res, next) => {
    try {
        const { title, columnId } = req.body;
        await Column.find().exec();
        const newColumn = new Column({
            title,
            cardIds: [],
            columnId,
        });
        const result = await newColumn.save();
        return res.status(201).json();
    } catch (e) {
        return res.status(404).json()

    }
});

columnRouter.get('/', auth, async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        const columns = await Column.find()
            .select('cardIds title columnId')
            .exec();
        return res
            .status(200)
            .json({ message: 'success', columns: columns});
    } catch (e) {
        return res
            .status(404)
            .json({message: "error"});
    }
});

columnRouter.post('/column',  auth,async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        const {columnId} = req.body;
        const columns = await Column.find({columnId:columnId})
            .select('cardIds title columnId')
            .exec();
        return res.status(200).json({columns:columns});
    } catch (e) {
        return res.status(404).json();
    }
});

module.exports = columnRouter;
