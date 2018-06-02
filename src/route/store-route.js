'use strict';

const logger = require('../lib/logger');
const Store = require('../model/store');
const storage = require('../lib/storage');

module.exports = function routeStore(router) {
  router.post('/api/v1/store', (req, res) => {
    logger.log(logger.INFO, 'STORE-ROUTE |  POST /api/v1/store');
    try {
      const newStore = new Store(req.body.title, req.body.content);
      storage.create('Store', newStore)
        .then((store) => {
          res.writeHead(201, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(store));
          res.end();
          return undefined;
        });
    } catch (err) {
      logger.log(logger.ERROR, `STORE-ROUTE | There was a bad request ${err}`);
      res.writeHead(400, { 'Content-Type': 'text/plain' });
      res.write('Bad request');
      res.end();
      return undefined;
    }
    return undefined;
  });
  router.get('/api/v1/store', (req, res) => {
    if (req.url.query.id) {
      storage.fetchOne('Store', req.url.query.id)
        .then((item) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(item));
          res.end();
          return undefined;
        })
        .catch((err) => {
          logger.log(logger.ERROR, err, JSON.stringify(err));
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write('Resource not found');
          res.end();
          return undefined;
        });
    } else {
      storage.fetchAll('Stores')
        .then((item) => {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.write(JSON.stringify(item));
          res.end();
          return undefined;
        })
        .catch((err) => {
          logger.log(logger.ERROR, err, JSON.stringify(err));
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.write('Resource not found');
          res.end();
          return undefined;
        });
    }
  }); 
  router.delete('/api/v1/store', (req, res) => {
    storage.delete('Store', req.url.query.id)
      .then(() => {
        res.writeHead(204, { 'Content-Type': 'text/plain' });
        res.write('No content in the body');
        res.end();
        return undefined;
      })
      .catch((err) => {
        logger.log(logger.ERROR, err, JSON.stringify(err));
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.write('Resource not found');
        res.end();
        return undefined;
      });
    return undefined;
  });
};
