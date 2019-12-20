/* eslint-disable no-await-in-loop */
const express = require('express');
const Card = require('../models/card');
const Column = require('../models/column');
const cardRouter = express.Router();
const {User, validate} = require("../models/user");
const auth = require("../middleware/auth");

//new Card
cardRouter.post('/', auth, async (req, res, next) => {
    const {title, columnId, cardId} = req.body;
    addCard(req, res, title, columnId, cardId);
});

cardRouter.post('/getAllCards', async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select("-password");
        const {columnIds} = req.body;
        let totalCards = [];
        if (columnIds && columnIds.length > 0) {
            let i = 0;
            for (const columnId of columnIds) {
                const cards = await Card.find({column: String(columnId)}).select('cardId title').exec();
                if (cards.length > 0) {
                    totalCards.push(cards);
                }
            }
            return res.status(200).json({message: 'Success', cards: totalCards});
        }
    } catch (error) {
        return res
            .status(404)
            .json({message: "Column of provided id doesn't exist"});
    }
});

cardRouter.delete('/delete', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select("-password");
    const {cardId} = req.body;
    console.log(req);
    deleteCard(req, res, cardId)
});

cardRouter.post('/moveCard', auth, async (req, res, next) => {
        try {
            const user = await User.findById(req.user._id).select("-password");
            const {
                originColumnId,
                destColumnId,
                cardId
            } = req.body;
            if (!(
                destColumnId &&
                cardId
            )) {
                return res.status(400).json();
            }
            await deleteCard(req, res, cardId);
            await addCard(req, res, cardId, destColumnId, cardId);
            return res
                .status(200)
        } catch (e) {
            return res
                .status(404)
        }
    }
);

// helpers
const deleteCard = async (req, res, cardId) => {
    try {
        const card = await Card.findOne({cardId: cardId}).select('cardId column').exec();
        const column = await Column.findOne({columnId: card.column}).exec();
        if (!column) {
            return res.status(404).json()
            // .json({message: "Column of provided id doesn't exist"});
        }
        let cardIds = Array.from(column.cardIds);
        cardIds = cardIds.filter((i => i !== cardId));
        column.set({cardIds: cardIds});
        const result2 = await column.save();
        await Card.findOne({cardId: cardId}).remove().exec();
        return res.status(201).json();
    } catch (error) {
        return res
            .status(404).json()
    }
};

const addCard = async (req, res, title, columnId, cardId) => {
    try {
        await Card.find().exec();
        const newCard = new Card({
            title,
            column: columnId,
            cardId,
        });
        const result = await newCard.save();
        const column = await Column.findOne({columnId}).exec();
        if (!column) {
            return res
                .status(404).json();
            // .json({message: "Column of provided id doesn't exist"});
        }
        const newCardIds = Array.from(column.cardIds);
        newCardIds.push(result.cardId);
        column.set({cardIds: newCardIds});
        const result2 = await column.save();
        return res.status(201).json();
        // return res.status(201).json({
        //     // message: 'new card is created and also cardIds in column is also updated',
        //     // card: result,
        //     // column: result2,
        // });
    } catch (e) {
        return res
            .status(404).json();
        // .json({message: "error"});
    }
};
//TODO: more routes

module.exports = cardRouter;
