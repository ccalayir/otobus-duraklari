const express = require("express");
const router = express.Router();
const {
  connectionSuccess,
  getAllStops,
  getStops,
  getBusLocations,
  getLineName
} = require("../controllers/tasks");

router.route("/").get(connectionSuccess);
router.route("/all").get(getAllStops);
router.route("/buses/:hatNo").get(getBusLocations);
router.route("/linename/:hatNo").get(getLineName); // Yeni eklediğimiz rota
router.route("/:id").get(getStops);

module.exports = router;