const jwt = require('jsonwebtoken');
const User  = require('../models/User');
const requireAuth = async (request, response, next) => {
    // verify authentification
    const {authorization} = request.headers;
    if (!authorization) {
        return response.status(401).json('Unauthorized');
    }

    const token = authorization.split(' ')[1];

    try {
        const {_id} = jwt.verify(token, process.env.SECRET_SIGNATURE);
        request.user = await User.findOne({_id}).select('_id');
        next()
    } catch (error) {
        console.log(error)
        return response.status(401).json('Unauthorized request');
    }

}

export default requireAuth;