module.exports = (_io, socket) => {
    const INACTIVITY_TIMEOUT = 300000;

    let inactivityTimer = setTimeout(() => {
      socket.disconnect();
      console.log(`User ${socket.id} disconnected due to inactivity.`);
    }, INACTIVITY_TIMEOUT);

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  
    socket.onAny(() => {
      clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        socket.disconnect();
        console.log(`User ${socket.id} disconnected due to inactivity.`);
      }, INACTIVITY_TIMEOUT);
    });
  };
  