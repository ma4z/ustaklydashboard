const express = require('express');
const session = require('express-session');
const fs = require('fs');
const passport = require('passport');
const ejs = require('ejs');
const path = require('path');
const axios = require('axios');
const ipaddr = require('ipaddr.js');
const requestIp = require('request-ip');
const ascii = fs.readFileSync('./function/ascii.txt', 'utf8'); 
require('dotenv').config();

const app = express();
const expressWs = require('express-ws')(app);

const { db } = require('./function/db');

const init = async () => {
  if (process.env.ADMIN_USERS) {
    const admins = process.env.ADMIN_USERS.split(',');
    admins.forEach(admin => db.set(`admin-${admin}`, true));
  } else {
    console.warn('No admin users defined. Skipping admin user creation.');
  }

  try {
    const response = await axios.get(`${process.env.SKYPORT_URL}/api/name`, {
      headers: { 'x-api-key': process.env.SKYPORT_KEY }
    });
  } catch (error) {
    console.error('Error fetching Skyport name:', error);
  }

  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, '/resources'));

  app.use(session({
    secret: process.env.SESSION_SECRET || 'default_secret',
    resave: false,
    saveUninitialized: true
  }));

  app.use(passport.initialize());
  app.use(passport.session());

  app.use(requestIp.mw());

  app.use(async (req, res, next) => {
    const ipAddress = req.clientIp;

    if (!ipaddr.isValid(ipAddress)) {
      console.error(`Invalid IP Address: ${ipAddress}`);
      return res.status(400).json('Invalid IP address format.');
    }

    const userIp = ipaddr.process(ipAddress).toString();
    const proxycheckKey = process.env.PROXYCHECK_KEY;

    try {
      const proxyResponse = await axios.get(`http://proxycheck.io/v2/${userIp}?key=${proxycheckKey}`);
      const proxyData = proxyResponse.data;

      if (proxyData[userIp] && proxyData[userIp].proxy === 'yes') {
        return res.status(403).json('Proxy/VPN detected. Please turn it off to continue.');
      }
    } catch (error) {
      console.error('Error checking proxy:', error);
      return res.status(500).json('Error checking proxy.');
    }

    next();
  });

  const asciiFilePath = path.join(__dirname, 'ascii.txt');

  // Read the file asynchronously
  fs.readFile(asciiFilePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading the ASCII art file:', err);
          return;
      }
      console.error(data);
  });
  console.warn('Ustakly is Started')


  const allRoutes = fs.readdirSync('./app');
  allRoutes.forEach(routeFile => {
    const route = require(`./app/${routeFile}`);
    expressWs.applyTo(route);
    app.use('/', route);
  });
  app.use(express.static(path.join(__dirname, 'public')));

  const port = process.env.APP_PORT || 3000;
  app.listen(port, () => {
    console.log(`${process.env.APP_NAME} has been started on ${process.env.APP_URL || `http://localhost:${port}`}!`);
  });
};

init().catch(err => {
  console.error('Failed to start the application:', err);
});
