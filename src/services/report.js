const { query } = require("../db/mysql");
const { throwError } = require("../utils/utils");
const excel = require("exceljs");

const report = {};
report.postReport = async (reportobj) => {
  const {
    uid,
    docname,
    qualification,
    locname,
    sample,
    chemists,
    partner,
    miscellaneous,
    geolocation,
    fullgeolocation,
  } = reportobj;
  const docid = await getDocId(docname);
  const qualiId = await getQualiId(qualification);
  const locid = await getLocId(locname);
  const sql = `INSERT INTO entries (uid, docid, qualiid, locid, sample,
    chemists, partner, miscellaneous, geolocation, fullgeolocation, date)
    VALUES ('${uid}','${docid}','${qualiId}', '${locid}', '${sample}','${chemists}','${partner}',
    '${miscellaneous}','${geolocation}','${fullgeolocation}', CONVERT_TZ(Now(),'+00:00','+05:30'))`;
  const res = await query(sql);
  return res;
};

report.getReportsByUser = async (user, pagenumber) => {
  const limit = 10;
  const offset = limit * pagenumber - limit;
  const sql = `SELECT e.id, d.name as docname, q.qualification as docquali, 
    l.name as locname, e.sample, e.chemists, e.partner, e.miscellaneous, e.date
    FROM entries e INNER JOIN doctor d on e.docid = d.id 
    INNER JOIN location l on e.locid = l.id 
    INNER JOIN qualification q on e.qualiid = q.id
    WHERE e.uid = '${user.id}' ORDER BY date DESC LIMIT ${limit} OFFSET ${offset} `;
  const res = await query(sql);
  const r = res.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleString(undefined, {
      timeZone: "Asia/Kolkata",
    }),
  }));
  return r;
};

report.getAllEntriesByUser = async (username, startDate, endDate) => {
  const userRes = await query(
    `SELECT * FROM users WHERE username='${username}'`
  );
  const sql = `SELECT e.id, d.name as docname, q.qualification as docquali, 
    l.name as locname, e.sample, e.chemists, e.partner, e.miscellaneous,e.date, e.fullgeolocation
    FROM entries e INNER JOIN doctor d on e.docid = d.id 
    INNER JOIN location l on e.locid = l.id 
    INNER JOIN qualification q on e.qualiid = q.id
    WHERE e.uid = '${userRes[0].id}' AND e.date BETWEEN '${startDate}' AND '${endDate}' ORDER BY date DESC`;

  const res = await query(sql);
  const r = res.map((item) => ({
    ...item,
    date: new Date(item.date).toLocaleString(undefined, {
      timeZone: "Asia/Kolkata",
    }),
  }));
  return r;
};

report.createExcel = async (user, date) => {
  const sql = `SELECT e.id, d.name as docname, q.qualification as docquali, 
    l.name as locname, e.sample, e.chemists, e.partner, e.miscellaneous,e.date, e.fullgeolocation
    FROM entries e INNER JOIN doctor d on e.docid = d.id 
    INNER JOIN location l on e.locid = l.id 
    INNER JOIN qualification q on q.id = e.qualiid 
    WHERE e.uid = '${user.id}' AND e.date BETWEEN '${date.startDate}' AND '${date.endDate}'
    ORDER BY e.id`;
  const entries = await query(sql);
  const workbook = new excel.Workbook();
  const worksheet = workbook.addWorksheet(user.username);
  worksheet.columns = [
    { header: "Id", key: "id", width: 5 },
    { header: "Doctor Name", key: "docname", width: 25 },
    { header: "Doctor Qualification", key: "docquali", width: 20 },
    { header: "Location", key: "locname", width: 20 },
    { header: "Sample", key: "sample", width: 20 },
    { header: "Chemists", key: "chemists", width: 30 },
    { header: "Worked With", key: "partner", width: 20 },
    { header: "Miscellaneous", key: "miscellaneous", width: 20 },
    { header: "Date", key: "date", width: 10 },
    { header: "Geo Location", key: "fullgeolocation", width: 30 },
  ];
  worksheet.addRows(entries);

  return workbook;
};

report.getDoctorsByUserId = async (user) => {
  const sql = `SELECT DISTINCT d.name label FROM entries e 
  INNER JOIN doctor d on e.docid = d.id WHERE e.uid = ${user.id}`;
  const res = await query(sql);
  return res;
};

report.getDoctorsQualificationByUserId = async (user) => {
  const sql = `SELECT DISTINCT q.qualification label FROM entries e 
  INNER JOIN qualification q on e.qualiid = q.id WHERE e.uid = ${user.id}`;
  const res = await query(sql);
  return res;
};

report.getLocationsByUserId = async (user) => {
  const sql = `SELECT DISTINCT l.name label FROM entries e 
  INNER JOIN location l on e.locid = l.id WHERE e.uid = ${user.id}`;
  const res = await query(sql);
  return res;
};

const getDocId = async (docname) => {
  const findDocSql = `SELECT * FROM doctor WHERE name = '${docname.toUpperCase()}'`;
  const resFindDoc = await query(findDocSql);
  if (resFindDoc.length > 0) return resFindDoc[0].id;

  const insertDocSql = `INSERT INTO doctor (name) 
      VALUES('${docname.toUpperCase()}')`;
  const resInsertDoc = await query(insertDocSql);
  return resInsertDoc.insertId;
};

const getLocId = async (locname) => {
  const findLocSql = `SELECT * FROM location WHERE name = '${locname.toUpperCase()}'`;
  const resFindLoc = await query(findLocSql);
  if (resFindLoc.length > 0) return resFindLoc[0].id;

  const insertDocSql = `INSERT INTO location (name) VALUES('${locname.toUpperCase()}')`;
  const resInsertLoc = await query(insertDocSql);
  return resInsertLoc.insertId;
};

const getQualiId = async (qualification) => {
  const findDocSql = `SELECT * FROM qualification WHERE qualification = '${qualification.toUpperCase()}'`;
  const resFindDoc = await query(findDocSql);
  if (resFindDoc.length > 0) return resFindDoc[0].id;

  const insertQualiSql = `INSERT INTO qualification (qualification) 
      VALUES('${qualification.toUpperCase()}')`;
  const resInsertQuali = await query(insertQualiSql);
  return resInsertQuali.insertId;
};

module.exports = report;
