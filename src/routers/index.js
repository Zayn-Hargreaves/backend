const express = require("express");
const { apiKey, permission } = require("../auth/checkAuth");
const router = express.Router();
const { pushToLogDiscord } = require("../middlewares/")

//add log to discord
router.use(pushToLogDiscord)
// check api key
router.use(apiKey)
router.use(permission("0000"))
router.use('/v1/api/inventory', require("./inventory"))
router.use("/v1/api/checkout", require("./checkout"))
router.use("/v1/api/cart", require("./cart"))
router.use("/v1/api/discount", require("./discount"))
router.use("/vi/api/product", require("./product"))
router.use("/v1/api", require("./access"));
router.use("/v1/api/notification", require("./notification"))
router.use("/v1/api/comment", require("./comment"))
module.exports = router;
