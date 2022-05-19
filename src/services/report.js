const { query } = require("../db/mysql");
const { throwError } = require("../utils/utils");
const sendMail = require("../utils/mailTransporter");

const report = {};
report.postReport = async (reportobj, user) => {
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
  const locid = await getLocId(locname)
  const sql = `INSERT INTO entries (uid, docid, locid, sample, 
    chemists, partner, miscellaneous, geolocation, fullgeolocation, date) 
    VALUES ('${uid}', '${docid}' , '${locid}', '${sample}','${chemists}','${partner}',
    '${miscellaneous}','${geolocation}','${fullgeolocation}',NOW())`;
  const res = await query(sql);
  return res;
};

const getDocId = async (docname, qualification)=>{
    const findDocSql = `SELECT * FROM doctor WHERE name = '${docname.toUpperCase()}'`;
    const resFindDoc = await query(findDocSql);
    if (resFindDoc.length > 0)
        return resFindDoc[0].id
    
      const insertDocSql = `INSERT INTO doctor (name, qualification) VALUES('${docname.toUpperCase()}' ,'${qualification}')`;
      const resInsertDoc = await query(insertDocSql);
      return resInsertDoc.insertId;
}

const getLocId = async (locname)=>{

    const findLocSql = `SELECT * FROM location WHERE name = '${locname.toUpperCase()}'`;
    const resFindLoc = await query(findLocSql);
    if (resFindLoc.length > 0)
        return resFindLoc[0].id
    
      const insertDocSql = `INSERT INTO location (name) VALUES('${locname.toUpperCase()}')`;
      const resInsertLoc = await query(insertDocSql);
      return resInsertLoc.insertId;
   
}

module.exports = report;
