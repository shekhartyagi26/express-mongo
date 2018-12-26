let constants = require('./constant');

exports.parameterMissing = (res, result) => {
    let response = {
        response: result,
        message: constants.responseMessages.PARAMETER_MISSING
    };
    res.status(constants.responseFlags.PARAMETER_MISSING).json(response);
};

exports.sendError = function(res, err) {
    let response = {
        response: err,
        message: constants.responseMessages.ERROR_IN_EXECUTION
    };
    res.status(constants.responseFlags.ERROR_IN_EXECUTION).json(response);
}

exports.success = function(res, values) {
    let response = {
        response: values,
        message: constants.responseMessages.ACTION_COMPLETE
    };
    res.status(constants.responseFlags.ACTION_COMPLETE).json(response);
}

exports.numberAlreadyExist = function(res) {
    let response = {
        response: {},
        message: constants.responseMessages.MOBILE_NUMBER_ALREADY_EXISTS
    };
    res.status(constants.responseFlags.ALREADY_EXIST).json(response);
}
exports.emailAlreadyExist = function(res) {
    let response = {
        response: {},
        message: constants.responseMessages.EMAIL_ALREADY_EXISTS
    };
    res.status(constants.responseFlags.ALREADY_EXIST).json(response);
}
exports.nodata = function(res) {
    let response = {
        response: {},
        message: constants.responseMessages.NO_DATA_FOUND

    };
    res.status(constants.responseFlags.NO_DATA_FOUND).json(response);

}
exports.idNotFound = function(res) {
    let response = {
        response: {},
        message: constants.responseMessages.ID_NOT_FOUND
    };
    res.status(constants.responseFlags.ID_NOT_FOUND).json(response);
}
exports.invalidData = function(res) {
    let response = {
        response: {},
        message: constants.responseMessages.INVALID_DATA
    };
    res.status(constants.responseFlags.INVALID_DATA).json(response);
}
exports.invalidOtp = function(res) {
    let response = {
        response: {},
        message: constants.responseMessages.OTP_NOT_MATCHED
    };
    res.status(constants.responseFlags.OTP_NOT_MATCHED).json(response);
}
exports.invalidAccessToken = function(res) {
    let response = {
        response: {},
        message: constants.responseMessages.INVALID_ACCESS_TOKEN
    };
    res.status(constants.responseFlags.INVALID_ACCESS_TOKEN).json(response);
}

exports.uploadError = function(res) {
    let response = {
        response: {},
        message: constants.responseMessages.UPLOAD_ERROR
    };
    res.status(constants.responseFlags.UPLOAD_ERROR).json(response);
}

exports.invalidCredential = function(res, msg) {
    let response = {
        "message": msg,
        "response": {}
    };
    res.status(constants.responseFlags.INVALID_CREDENTIAL).json(response);
    return false;
};