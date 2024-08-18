const { Server } = require('socket.io');
const Event = require('../db/models/Event');

module.exports = (server) => {
   const io = new Server(server, {
      cors: {
         origin: '*',
         methods: ['GET', 'POST'],
         credentials: true,
      },
   });
   io.on('connection', (socket) => {
      console.log(`User Connected: ${socket.id}`);

      socket.on('update_object', async (data) => {
         data && (Object.keys(data)[0] === 'newEvent' || Object.keys(data)[0] === 'updateEventInDB')
            ? socket.broadcast.emit('object_updated', await Event.find({}))
            : socket.broadcast.emit('object_updated', { message: 'something went wrong' });
      });

      socket.on('disconnect', () => {
         console.log('User Disconnected', socket.id);
      });
   });
};
