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
  const docid = await getDocId(docname, qualification);
  const locid = await getLocId(locname);
  const sql = `INSERT INTO entries (uid, docid, locid, sample, 
    chemists, partner, miscellaneous, geolocation, fullgeolocation, date) 
    VALUES ('${uid}', '${docid}' , '${locid}', '${sample}','${chemists}','${partner}',
    '${miscellaneous}','${geolocation}','${fullgeolocation}',NOW())`;
  const res = await query(sql);
  return res;
};

report.getReportsByUser = async (user, pagenumber) => {
  const limit = 20;
  const offset = limit * pagenumber - limit;
  const sql = `SELECT e.id, d.name as docname, d.qualification as docquali, 
    l.name as locname, e.sample, e.chemists, e.partner, e.miscellaneous,e.date
    FROM entries e INNER JOIN doctor d on e.docid = d.id 
    INNER JOIN location l on e.locid = l.id 
    WHERE e.uid = '${user.id}' ORDER BY date DESC LIMIT ${limit} OFFSET ${offset} `;
  const res = await query(sql);
  return res;
};

report.createExcel = async (user, date) => {
  const sql = `SELECT e.id, d.name as docname, d.qualification as docquali, 
    l.name as locname, e.sample, e.chemists, e.partner, e.miscellaneous,e.date
    FROM entries e INNER JOIN doctor d on e.docid = d.id 
    INNER JOIN location l on e.locid = l.id 
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
  ];
  worksheet.addRows(entries);

  return workbook;
};

const getDocId = async (docname, qualification) => {
  const findDocSql = `SELECT * FROM doctor WHERE name = '${docname.toUpperCase()}' 
    AND  qualification = '${qualification.toUpperCase()}'`;
  const resFindDoc = await query(findDocSql);
  if (resFindDoc.length > 0) return resFindDoc[0].id;

  const insertDocSql = `INSERT INTO doctor (name, qualification) 
      VALUES('${docname.toUpperCase()}' ,'${qualification.toUpperCase()}')`;
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

module.exports = report;
