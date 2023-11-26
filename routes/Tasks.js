const express = require('express');
const tasks = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');

const Task = require('../models/Task');

tasks.use(cors());

process.env.SECRET_KEY = 'secret';

tasks.get('/tasks', (req, res, next) => {
  if (req.headers['authorization']) {
    const { id: decodedId } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    Task.findAll({
      where: {
        user_id: decodedId
      }
    })
      .then(tasks => {
        res.json(tasks);
      })
      .catch(err => {
        res.send(`error: ${err}`);
      });
  } else {
    res.json({ status: 'failed', message: 'Token not passed!' });
    console.log('Token Not Passed');
  }
});

tasks.get('/task/:id', (req, res, next) => {
  if (req.headers['authorization']) {
    Task.findOne({
      where: {
        id: req.params.id
      }
    })
      .then(task => {
        if (task) {
          res.json(task);
        } else {
          res.send('Task does not exist');
        }
      })
      .catch(err => {
        res.send(`error: ${err}`);
      });
  } else {
    res.json({ status: 'failed', message: 'Token not passed!' });
    console.log('Token Not Passed');
  }
});

tasks.post('/task', (req, res, next) => {
  if (req.headers['authorization']) {
    if (!req.body.name && !req.body.status) {
      res.status(400);
      res.json({
        error: 'Bad Data'
      });
    } else {
      const { id: decodedId } = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
      const user_id = decodedId;
      req.body.user_id = user_id;
      console.log('req-body', req.body);
      Task.create(req.body)
        .then(data => {
          res.send(data);
        })
        .catch(err => {
          res.json(`error: ${err}`);
        });
    }
  } else {
    res.json({ status: 'failed', message: 'Token not passed!' });
    console.log('Token Not Passed');
  }
});

tasks.delete('/task/:id', async (req, res, next) => {
    try {
      if (req.headers['authorization']) {
        const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
        console.log("user_decoded_id",decoded.id);
        const task = await Task.findOne({
          where: {
            user_id: decoded.id,
            id: req.params.id
          }
        });
  
        if (task) {
          await Task.destroy({
            where: {
              id: req.params.id
            }
          });
          res.json({ status: 'Task Deleted!' });
        } else {
          res.json({ status: 'failed', message: 'Task not found' });
        }
      } else {
        res.json({ status: 'failed', message: 'Token not passed!' });
        console.log('Token Not Passed');
      }
    } catch (err) {
      res.json({ status: 'failed', message: 'Error deleting task', error: err.message });
      console.log("Token Not Passed");
    }
  });
  
  
  tasks.put('/task/:id', async (req, res, next) => {
    try {
      if (req.headers['authorization']) {
        if (!req.body.name && !req.body.status && !req.body.description && !req.body.updatedAt) {
          res.status(400);
          res.json({
            error: 'Bad Data'
          });
        } else {
          const decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
          console.log("user_decoded_id", decoded.id);
          const task = await Task.findOne({
            where: {
              user_id: decoded.id,
              id: req.params.id
            }
          });
  
          if (task) {
            await Task.update(
              { name: req.body.name, status: req.body.status, description: req.body.description, updatedAt: req.body.updatedAt },
              { where: { id: req.params.id } }
            );
            res.json({ status: 'success', message: 'Task Updated!' });
          } else {
            res.json({ status: 'failed', message: 'Task not found' });
          }
        }
      } else {
        res.json({ status: 'failed', message: 'Token not passed!' });
        console.log('Token Not Passed');
      }
    } catch (err) {
      res.json({ status: 'failed', message: 'Error updating task', error: err.message });
    }
  });
  

module.exports = tasks;
