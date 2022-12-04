var bcrypt = require("bcryptjs");
const { Users } = require('../models/user')
var mongoose = require('mongoose')
const multer = require('multer')
const { Interests } = require('../models/interest')
const { LifeStyle } = require('../models/lifestyle')


const createInterest = async (req, res) => {

    const saveInterest = Interests({
        interestName: req.body.interestName
    })

    try {
        const save = await saveInterest.save();
        res.status(200).json({ 'success': true, 'message': 'interest saved successfully', data: save })

    } catch (error) {
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }

}

const createLifeStyleCategory = async (req, res) => {

    const saveCat = LifeStyle({
        lifeStyleCatName: req.body.lifeStyleCatName
    })

    try {
        const save = await saveCat.save();
        res.status(200).json({ 'success': true, 'message': 'LifeStyle saved successfully', data: save })

    } catch (error) {
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }
}


const createLifeStyleCategoryItems = async (req, res) => {

    // console.log(req.params.id);



    try {


        const update = await LifeStyle.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    lifeStyleItems: req.body.lifestyleitem
                }
            },
            { new: true }
        )
        res.status(200).json({ 'success': true, 'message': 'LifeStyle saved successfully', data: update })

    } catch (err) {
        console.log(err)
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }
}


const getInterest = async (req, res) => {


    try {
        const interests = await Interests.find();
        const life = await LifeStyle.find();

        const send = { 'interests': interests, 'lifestyles': life }

        res.status(200).json({ 'success': true, 'message': 'Success', data: send })

    } catch (error) {
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }

}

const getLifeStyle = async (req, res) => {


    try {
        const interests = await Interests.find();
        const life = await LifeStyle.find();

        const send = { 'interests': interests, 'lifestyles': life }
        res.status(200).json({ 'success': true, 'message': 'Success', data: send })

    } catch (error) {
        if (err.name === 'ValidationError') {
            console.error(Object.values(err.errors).map(val => val.message))
            return res.status(400).json({ success: false, message: Object.values(err.errors).map(val => val.message)[0] })
        }
        return res.status(400).json({ success: false, message: err })
    }

}

module.exports = {
    createInterest, getInterest, createLifeStyleCategory, getLifeStyle, createLifeStyleCategoryItems
};
