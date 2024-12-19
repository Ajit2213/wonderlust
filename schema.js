const Joi = require('joi');


module.exports. listingschema=Joi.object({
    listing:Joi.object({
        title:Joi.string().required(),
        description:Joi.string().required(),
        price:Joi.number().required(),
        location:Joi.string().required().min(0),
        image:Joi.string().allow("",null),
        country:Joi.string().required()

    }).required(),

})



// module.exports.reviewSchema=Joi.object({
//     review:Joi.object({
//         rating:Joi.number().required().min(1).max(5),
//         comment:Joi.string().required(),
//     }).required(),
// })


// const Joi = require('joi');

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        comment: Joi.string().required()
    }).required()
});

