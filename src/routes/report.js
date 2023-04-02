const express = require("express");
const reportService = require("../services/report");
const router = express.Router();
const auth = require("../middleware/auth");
const { throwError } = require("../utils/utils");
const moment = require("moment");

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

router.post("/regional-report", auth, async (req, res, next) => {
  try {
    if (req.user.level === "EMP") {
      throwError("EMP Level Not Authorized", 404);
    }
    
    const s = new Date(req.body.startDate).toLocaleString(undefined, {
      timeZone: "Asia/Kolkata",
    });
    const e = new Date(req.body.endDate).toLocaleString(undefined, {
      timeZone: "Asia/Kolkata",
    });
    console.log(req.body, s, e);
    const data = await reportService.getAllEntriesByUser(
      req.body.username,
      `${s.split("/")[2].split(",")[0]}-${s.split("/")[0]}-${s.split("/")[1]}`,
      `${e.split("/")[2].split(",")[0]}-${e.split("/")[0]}-${e.split("/")[1]}`
    );
    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.post("/reports/create-excel", auth, async (req, res, next) => {
  try {
    const date = {
      startDate: req.body.startDate.substring(0, 10),
      endDate: req.body.endDate.substring(0, 10),
    };
    const workbook = await reportService.createExcel(req.user, date);
    //IMPORTANT FOR React.js content-disposition get Name
    res.setHeader("Access-Control-Expose-Headers", "Content-Disposition");
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" +
        `${req.user.username}_${moment().format("DD-mm-yyyy")}.xlsx`
    );
    await workbook.xlsx.write(res);
    res.send();
  } catch (error) {
    next(error);
  }
});

router.post("/reports/doctors", auth, async (req, res, next) => {
  try {
    const data = await reportService.getDoctorsByUserId(req.user);
    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.post("/reports/qualifications", auth, async (req, res, next) => {
  try {
    const data = await reportService.getDoctorsQualificationByUserId(req.user);
    res.send(data);
  } catch (error) {
    next(error);
  }
});

router.post("/reports/locations", auth, async (req, res, next) => {
  try {
    const data = await reportService.getLocationsByUserId(req.user);
    res.send(data);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
