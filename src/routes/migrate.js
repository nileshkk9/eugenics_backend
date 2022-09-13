const express = require("express");
const router = express.Router();
const { query } = require("../db/mysql");
const migrate = require("../services/migrationHelper");

router.post("/migrate/doctors", async (req, res, next) => {
  try {
    const doctors = await migrate.doctor(req.body.user);
    res.send(doctors);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/migrate/qualification", async (req, res, next) => {
  try {
    const qualifications = await migrate.qualification(req.body.user);
    res.send(qualifications);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/migrate/location", async (req, res, next) => {
  try {
    const locations = await migrate.location(req.body.user);
    res.send(locations);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/migrate/entries", async (req, res, next) => {
  try {
    const entries = await migrate.entries(req.body.user);
    res.send(entries);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/migrate/all", async (req, res, next) => {
  try {
    const allUsers = await query(`SELECT username FROM users`);
    const response = await Promise.all(
      allUsers.map(async (item) => {
        const { username } = item;
        console.log(`START user=${username} migration started`);
        await migrate.doctor(username);
        console.log(`END user=${username} migration completed`);
      })
    );

    res.send({ status: "completed" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

router.post("/migrate/deleteall", async (req, res, next) => {
  try {
    await query(`DELETE FROM doctor WHERE 1`);
    await query(`DELETE FROM location WHERE 1`);
    await query(`DELETE FROM qualification WHERE 1`);
    await query(`DELETE FROM entries WHERE 1`);

    res.send({ status: "completed" });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

module.exports = router;
