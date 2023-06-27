const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');
const routes = require('./routes/routes');

const { PORT = 3000 } = process.env;

mongoose
  .connect('mongodb://127.0.0.1:27017/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
    // eslint-disable-next-line
    console.log('Connected to BD');
  })
  .catch((err) => {
    // eslint-disable-next-line
    console.log('Fail connected to BD');
    // eslint-disable-next-line
    console.log(err.message);
  });

const app = express();

// app.use((req, res, next) => {
//   req.user = {
//     _id: '249180734c899be0396963fd',
//   };

//   next();
// });

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());

app.use(routes);

app.listen(PORT, () => {
  // eslint-disable-next-line
  console.log(`App listening on port ${PORT}`);
});
