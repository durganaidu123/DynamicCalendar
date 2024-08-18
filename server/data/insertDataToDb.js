const data = require('./data');
const Event = require('../db/models/Event');

module.exports = () => {
   data.scheduleData.map(async (event) => {
      await new Event(event).save();
   });
};
