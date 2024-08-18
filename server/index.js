const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');

require('./db/mongoose');
const Event = require('./db/models/Event');
const insertData = require('./data/insertDataToDb');

const port = process.env.PORT || 3002;

app.use(express.json());
app.use(cors());
// app.use(cors(corsOptions));

//insert data to db
// insertData();

app.get('/events', async function (req, res) {
   try {
      const allEvents = await Event.find({});
      return res.send(allEvents);
   } catch (e) {
      return res.status(500).send();
   }
});

app.post('/event/update', async function (req, res) {
   try {
      const { Id, Subject, Location, StartTime, EndTime, Description, CategoryColor } = req.body;

      const dbEvent = await Event.find({
         Id: { $in: Id },
      });
      // add new event otherwise update existing event
      if (!dbEvent.length) {
         const newEvent = await Event(req.body).save();
         res.status(200).send({ newEvent });
      } else {
         dbEvent[0].Subject = Subject;
         dbEvent[0].Location = Location;
         dbEvent[0].StartTime = StartTime;
         dbEvent[0].EndTime = EndTime;
         dbEvent[0].Description = Description;
         dbEvent[0].CategoryColor = CategoryColor;

         const updateEventInDB = await dbEvent[0].save();
         res.status(200).send({ updateEventInDB });
      }
   } catch (e) {
      res.status(500).send();
   }
});

// in case of delete event
// app.post('/event/delete', async function (req, res) {
//    try {
//       const { id } = req.body;
//       await Event.delete({
//          Id: { $in: id },
//       });
//       res.status(200).send({ msg: 'deleted selected event' });
//    } catch (e) {
//       res.status(500).send();
//    }
// });

//deploy to heroku
app.use(express.static(path.join(__dirname, '../client/build')));
app.get('/*', (req, res) => {
   res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

const server = app.listen(port, () => {
   console.log(`Listening on ${port}`);
});

// run websocket
require('./ws/websocket')(server);
