require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const pool = require('./modules/pool.js');

const PORT = process.env.PORT || 5000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('server/public'));

app.get('/tasks', (req, res) => {
    console.log('GET /tasks request received!');
    let sqlText = 'SELECT * FROM tasks;';

    pool.query(sqlText)
        .then((dbRes) => {
            console.log('db READ /tasks success:', dbRes.rows);
            let tasks = dbRes.rows;
            res.send(tasks)
        })
        .catch((dbErr) => {
            console.log('db READ /tasks error:', dbErr);
            res.sendStatus(500);
        })
})

app.post('/tasks', (req, res) => {
    console.log('POST /tasks request received:', req.body);

    let taskName = req.body.taskName;

    try {
        validateTaskName(taskName);
    } catch (err) {
        console.log('Invalid task:', err.message);
        res.status(400).send(err.message);
        return;
    }

    let isComplete = false;

    let sqlText = `
    INSERT INTO tasks
      ("task_name", "is_complete")
      VALUES
      ($1, $2);
  `;
    let sqlValues = [taskName, isComplete]

    pool.query(sqlText, sqlValues)
        .then((dbRes) => {
            console.log('db CREATE /tasks/:id success:', dbRes);
            res.sendStatus(201);
        })
        .catch((dbErr) => {
            console.log('db CREATE /tasks error:', dbErr);
            res.sendStatus(500);
        })
})


function validateTaskName(taskName) {

    console.log('Validating task name:', taskName);

    console.log('Validating task name length:', taskName.length);


    if (taskName.length === 0) {
        console.log("too short");;
        throw new Error("Task Description is blank.");
    } else if (taskName.length > 250) {
        console.log("too long");
        throw new Error("Task Description is too long, it must be less than 250 characters.");
    }
}

app.delete('/tasks/:id', (req, res) => {
    console.log('DELETE /tasks request received:', req.params);
    let theIdToDelete = req.params.id;

    let sqlText = `
      DELETE FROM "tasks"
        WHERE "uuid"=$1;
    `
    let sqlValues = [theIdToDelete]

    pool.query(sqlText, sqlValues)
        .then((dbRes) => {
            console.log('db DELETE /tasks/:id success:', dbRes);
            res.sendStatus(204);
        })
        .catch((dbErr) => {
            console.log('db DELETE /tasks error:', dbErr);
            res.sendStatus(500);
        })
})

app.put('/creatures/:id', (req, res) => {
    console.log('PUT /tasks request received:', req.params);
    let theIdToUpdate = req.params.id;

    let newType = req.body.type;

    let sqlText = `
      UPDATE "tasks"
        SET "is_complete" = NOT "is_complete"
        WHERE "uuid"=$1;
    `
    let sqlValues = [theIdToUpdate];

    pool.query(sqlText, sqlValues)
        .then((dbRes) => {
            console.log('db UPDATE /tasks/:id success:', dbRes);
            res.sendStatus(200);
        })
        .catch((dbErr) => {
            console.log('db UPDATE /tasks/:id error:', dbErr);
            res.sendStatus(500);
        })


})

app.listen(PORT, function () {
    console.log(`You started the server! It is running on port ${PORT}.`);
})
