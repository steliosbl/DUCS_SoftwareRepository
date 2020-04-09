module.exports = (req, res, next) => {
    function errorResp (code, msg) {
        msg = msg || code.toString();

        res.status(code).json({
            errors: msg
        });
    }

    res.respond = {
        notfound: (msg) => {
            errorResp(404, msg);
        },

        invalid: (msg) => {
            errorResp(400, msg);
        },

        forbidden: (msg) => {
            errorResp(403, msg);
        },

        conflict: (msg) => {
            errorResp(409, msg);
        },

        unprocessable: (msg) => {
            errorResp(422, msg);
        },

        tooLarge: (msg) => {
            errorResp(413, msg);
        },

        failedDependency: (msg) => {
            errorResp(424, msg);
        },

        other: (code, msg) => errorResp(code, msg)
    };

    next();
};
