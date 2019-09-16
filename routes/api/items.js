const express = require('express');
const router = express.Router();

// Item Model
const Item = require('../../models/Item');


/**
 * @route   GET api/items
 * @desc    Get All Items
 * @access  Public
 */
router.get('/', (request, response) => {
    Item.find()
        .sort({
            date: -1
        })
        .then(items => response.json(items))
});

/**
 * @route   POST api/items
 * @desc    Create An Item
 * @access  Public
 */
router.post('/', (request, response) => {
    const newItem = new Item({
        text: request.body.text,
        isCompleted: request.body.isCompleted,
        id: request.body.id
    });

    newItem.save().then(item => response.json(item));
});

/**
 * @route   DELETE api/items/:id
 * @desc    Delete An Item
 * @access  Public
 */
router.delete('/:id', (request, response) => {
    Item.findById(request.params.id)
        .then(item => item.remove().then(() => response.json({idTriedToRemove: request.params.id, success: true})))
        .catch(err => response.status(404).json({idTriedToRemove: request.params.id, success: false}));
});

/**
 * @route   PUT api/items/:id
 * @desc    Update An Item
 * @access  Public
 */
router.put('/update/:id', (request, response) => {
    Item.findByIdAndUpdate(
        // the id of the item to find
        request.params.id,
        
        // the change to be made. Mongoose will smartly combine your existing 
        // document with this change, which allows for partial updates too
        request.body,
        
        // an option that asks mongoose to return the updated version 
        // of the document instead of the pre-updated one.
        {new: true},
        
        // the callback function
        (err, todo) => {
        // Handle any possible database errors
            if (err) return response.status(500).send(err);
            return response.send(todo);
        }
    )
});

module.exports = router;