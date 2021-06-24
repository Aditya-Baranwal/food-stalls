// @ts-check
const Joi = require('@hapi/joi');

/* This file contains all the building blocks required to build a Joi schema. */

// Joi object
exports.object = Joi.object();

// Joi string
exports.string = Joi.string();

// Joi number
exports.number = Joi.number();

// Joi integer
exports.integer = Joi.number().integer();

// Joi boolean
exports.boolean = Joi.boolean();

// Joi date
exports.date = Joi.date();

// Joi array
exports.array = Joi.array();

// Joi unique items array
exports.uniqueItemsArray = Joi.array().unique();

// Joi non empty array
exports.nonEmptyArray = Joi.array().min(1);

// Joi non empty unique items array
exports.nonEmptyUniqueItemsArray = Joi.array().min(1).unique();
