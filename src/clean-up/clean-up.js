const fs = require('fs');

module.exports = (server, path) => {
  const callback = (code) => {
    try {
      server.close();
      fs.unlinkSync(path);
    } catch (err) {
      console.log(err);
    }

    console.log('App is shutting down');
    process.exit(code);
  };

  process.on('SIGINT', callback);
  process.on('SIGTERM', callback);
};
