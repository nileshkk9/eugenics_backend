const { queryOld, query } = require("../db/mysql");

const migrate = {};
migrate.doctor = async (user) => {
  const doctorsOldSQL = `SELECT distinct UPPER(docname) as name FROM ${user}`;
  const resOld = await queryOld(doctorsOldSQL);
  const cleanData = resOld.map((item) => cleanDoctorsName(item.name)).slice(1);
  const finalArray = [...new Set(cleanData)];

  const response = await Promise.all(
    finalArray.map((name) => {
      return query(`INSERT INTO doctor(name) VALUE ('${name}')`);
    })
  );
    return finalArray;

//   await migrate.qualification(user);
};

migrate.qualification = async (user) => {
  const resOld = await queryOld(
    `SELECT distinct UPPER(quali) as qualification FROM ${user}`
  );
  const cleanData = resOld
    .map((item) => cleanDoctorQuali(item.qualification))
    .slice(1);
  const finalArray = [...new Set(cleanData)];
  const response = await Promise.all(
    finalArray.map((qualification) => {
      return query(
        `INSERT INTO qualification(qualification) VALUE ('${qualification}')`
      );
    })
  );

    return finalArray;
//   await migrate.location(user);
};

migrate.location = async (user) => {

  const resOld = await queryOld(`SELECT UPPER(place) as name FROM ${user}`);
  const cleanData = resOld.map((item) => cleanLocation(item.name)).slice(1);
  const finalArray = [...new Set(cleanData)];

  const response = await Promise.all(
    finalArray.map((locationName) => {
      const insertLocationSQL = `INSERT INTO location(name) VALUE ('${locationName}')`;
      return query(insertLocationSQL);
    })
  );

    return finalArray;
//   await migrate.entries(user);
};

migrate.entries = async (user) => {

  const resOld = await queryOld(`SELECT * FROM ${user}`);
  const currentUser = await query(
    `SELECT * FROM users WHERE username = '${user}'`
  );
  const cleanData = resOld
    .map((item) => {
      return {
        ...item,
        docname: cleanDoctorsName(item.docname),
        place: cleanLocation(item.place),
        qualification: cleanDoctorQuali(item.quali),
      };
    })
    .slice(1);
  const doctors = await query(`SELECT * from doctor`);
  const locations = await query(`SELECT * from location`);
  const qualification = await query(`SELECT * from qualification`);
  const response = await Promise.all(
    cleanData.map(async (element) => {
      const doc = doctors.find((item) => item.name === element.docname);
      const loc = locations.find((item) => item.name === element.place);
      const quali = qualification.find(
        (item) => item.qualification === element.qualification
      );
      if (
        doc == undefined ||
        doc.id == undefined ||
        loc == undefined ||
        loc.id == undefined ||
        quali == undefined ||
        quali.id == undefined
      ) {
        console.log(`ERROR for User = ${user}`, element);
      }
      let chemists = "";
      for (let i = 1; i <= 6; i++) {
        const c = element[`chemist${i}`];
        if (c !== "") {
          if (i == 1) chemists += `${c}`;
          else chemists += `,${c}`;
        }
      }
      const res = await query(`INSERT INTO entries 
      (uid, docid, qualiid, locid, sample, chemists, partner, miscellaneous, geolocation, fullgeolocation, date) 
      VALUES ('${currentUser[0].id}',
      '${doc.id}',
      '${quali.id}',
      '${loc.id}','
      ${element.sample}','${chemists}',
      '${element.worked}','${element.other}','${element.location}','${
        element.fulladdress
      }','${new Date(element.date).toISOString()}')`);
      return res;
    })
  );


  return cleanData;
};

const cleanLocation = (name) => {
  return name
    .replace(/[^a-zA-Z ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
};
const cleanDoctorsName = (name) => {
  const pattern = /\b(?:dr\.? *|dr\. *)\b/gi;
  const newName = name
    .replace(pattern, "")
    .replace(/ *\([^)]*\) */g, "")
    .replace(/[^a-zA-Z ]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
  if (newName.startsWith("Dr") || newName.startsWith("dr"))
    return newName.substring(2);
  return newName;
};

const cleanDoctorQuali = (qualification) => {
  if (qualification !== "") {
    return qualification
      .split(",")[0]
      .replace(/ *\([^)]*\) */g, "")
      .replace(/[^a-zA-Z ]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .toUpperCase();
  }
  return "MBBS";
};

module.exports = migrate;
