const express = require('express');
const users = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const User = require('../models/User');
users.use(cors());

process.env.SECRET_KEY = 'secret';

users.post('/signup', async (req, res) => {
  try {
    const today = new Date();
    const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      createdAt: today
    };

    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (!user) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      userData.password = hashedPassword;

      const createdUser = await User.create(userData);
      let token = jwt.sign(createdUser.dataValues, process.env.SECRET_KEY, {
        expiresIn: 1440
      });
      res.json({ token });
    } else {
      res.json({ error: 'User already exists' });
    }
  } catch (err) {
    res.send('error: ' + err);
  }
});

users.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({
      where: {
        email: req.body.email
      }
    });

    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
          expiresIn: 1440
        });
        res.json({ token });
      } else {
        res.send('Wrong Password!');
      }
    } else {
      res.status(400).json({ error: 'User does not exist' });
    }
  } catch (err) {
    res.status(400).json({ error: err });
  }
});


module.exports = users;
