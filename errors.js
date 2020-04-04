module.exports = (req, res, next) => {
    function errorResp (code, msg) {
        msg = msg || code.toString();

        res.status(code).json({
            error: msg
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

        other: (code, msg) => errorResp(code, msg)
    };

    next();
};
