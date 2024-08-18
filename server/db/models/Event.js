const mongoose = require('mongoose');
const eventSchema = new mongoose.Schema({
   Id: {
      type: String,
      required: true,
      unique: true,
   },
   Subject: {
      type: String,
      required: true,
   },
   Location: {
      type: String,
   },
   StartTime: {
      type: String,
      required: true,
   },
   EndTime: {
      type: String,
      required: true,
   },
   CategoryColor: {
      type: String,
   },
   Description: {
      type: String,
   },
});

module.exports = mongoose.model('Event', eventSchema);
