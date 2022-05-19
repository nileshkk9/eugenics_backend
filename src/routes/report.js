const express = require("express");
const reportService = require("../services/report");
const router = express.Router();
const auth = require("../middleware/auth");
router.post("/report", auth, async (req, res, next) => {
  try {
    const report = {
        uid:req.user.id,
        docname:req.body.docname,
        qualification: req.body.qualification,
        locname:req.body.locname,
        sample:req.body.sample,
        chemists:req.body.chemists,
        partner:req.body.partner,
        miscellaneous: req.body.miscellaneous,
        geolocation: req.body.geolocation,
        fullgeolocation: req.body.fullgeolocation,
     };
    const data = await reportService.postReport(report, req.user);
    res.send({ message: "Report Submitted Successfully" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
