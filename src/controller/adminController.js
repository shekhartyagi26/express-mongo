const { appInfoModel } = require('../model/appInfo');
const responses = require('../module/responses');

exports.getAppInfo = function (req, res) {
    appInfoModel.findOne({})
        .then(appInfo => responses.success(res, appInfo))
        .catch(err => responses.sendError(res, err))
}
