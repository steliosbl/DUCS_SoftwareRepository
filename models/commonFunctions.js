module.exports = {
    authorMustExist: {
        errorMessage: 'Author does not exist',
        options: (value, {
            req
        }) => Boolean(req.app.db
            .get('authors')
            .find({
                id: value
            })
            .value())
    }
};
