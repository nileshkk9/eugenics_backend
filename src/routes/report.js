const express = require("express");
const reportService = require("../services/report");
const router = express.Router();
const auth = require("../middleware/auth");
router.post("/report", auth, async (req, res, next) => {
  try {
    const report = {
      uid: req.user.id,
      docname: req.body.docname,
      qualification: req.body.qualification,
      locname: req.body.locname,
      sample: req.body.sample,
      chemists: req.body.chemists,
      partner: req.body.partner,
      miscellaneous: req.body.miscellaneous,
      geolocation: req.body.geolocation,
      fullgeolocation: req.body.fullgeolocation,
    };
    const data = await reportService.postReport(report);
    res.send({ message: "Report Submitted Successfully" });
  } catch (error) {
    next(error);
  }
});

router.get("/reports/:pagenumber", auth, async (req, res, next) => {
  try {
    const data = await reportService.getReportsByUser(
      req.user,
      req.params.pagenumber
    );
    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.post("/reports/create-excel", auth, async (req, res, next) => {
  try {
    const date = {
      startDate: req.body.date1.substring(0, 10),
      endDate: req.body.date2.substring(0, 10),
    };
    const workbook = await reportService.createExcel(req.user, date);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + `${req.user.username}.xlsx`
    );
    await workbook.xlsx.write(res);
    res.send();
  } catch (error) {
    next(error);
  }
});

module.exports = router;
