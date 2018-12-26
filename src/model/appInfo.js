const { mongoose, conn, autoIncrement } = require("../module/connection");

const appInfoSchema = mongoose.Schema({
    privacy: { type: String, required: true },
    terms: { type: String, required: true },
    cookiesPolicy: { type: String, required: true },
    acknowledgement: { type: String, required: true },
    endUserLicenseAggrement: { type: String, required: true },
    updatedAt: { type: Number, default: new Date().getTime() },
});

appInfoSchema.plugin(autoIncrement.plugin, {
    model: 'appInfo',
    field: '_id',
    startAt: 100000,
    incrementBy: 1
});

exports.appInfoModel = conn.model("appInfo", appInfoSchema);