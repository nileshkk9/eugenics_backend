const express = require('express');
const userService = require('../services/user');
const router = express.Router();
const auth = require('../middleware/auth');
router.post('/user/register', async (req, res, next) => {
  try {
    const token = await userService.addUser(req.body);
    res.send({ success: 'User Registered Successfully', token });
  } catch (error) {
    next(error);
  }
});

router.post('/user/login', async (req, res, next) => {
  try {
    const data = await userService.login(req.body);
    res.send({
      username: data[0].username,
      name: data[0].name,
      token: data[0].auth_token,
    });
  } catch (error) {
    next(error);
  }
});

router.get('/user/me', auth, async (req, res, next) => {
  try {
    const user = { ...req.user };
    delete user.password;
    delete user.auth_token;
    delete user.token;
    delete user.token_expire_time;

    res.send({ user });
  } catch (error) {
    next(error);
  }
});

router.get('/user/all', auth, async (req, res, next) => {
  try {
    const data = await userService.getRegionalUsers(req.user);
    res.send({ data });
  } catch (error) {
    next(error);
  }
});

router.post('/user/password-reset', async (req, res, next) => {
  try {
    const data = await userService.forgotpasswordMailer(req.body.email);
    res.send({ message: 'Recovery Mail Sent Successfully' });
  } catch (error) {
    next(error);
  }
});
router.post('/user/contact-us-mail', async (req, res, next) => {
  try {
    await userService.contactUsMail(req.body);
    res.send({ message: 'Mail Sent Successfully' });
  } catch (error) {
    next(error);
  }
});

router.post('/user/password-reset/:email/:token', async (req, res, next) => {
  try {
    const user = {
      email: req.params.email,
      token: req.params.token,
      password: req.body.password,
    };
    const data = await userService.verifyRecovery(user);
    res.send({ message: 'Password Changed Successfully' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
