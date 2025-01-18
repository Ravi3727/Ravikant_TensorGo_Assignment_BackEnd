const express = require('express');
const router = express.Router();

const { getOrganizations, deleteOrganization, updateOrganization, getUserOrganizations } = require("../Controllers/organization");

router.get("/org", getOrganizations);

router.delete("/org/:id", deleteOrganization);
router.get("/orgbyid", getUserOrganizations);
router.patch("/org/:id", updateOrganization);

module.exports = router;