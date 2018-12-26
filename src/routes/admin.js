var admin = require('../controller/adminController');

exports.default = function (app) {

    /* ********************* admin routes******************* */
    app.route('/admin/appInfo').get(admin.getAppInfo);

    return (app)
}