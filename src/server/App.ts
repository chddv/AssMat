import * as express from 'express';
import {json, urlencoded, raw, text } from 'body-parser';

import * as path from 'path';
import {createConnection} from "typeorm";
import {ChildController} from "./controller/child.controller";
import {ChildRules} from "./rule/child.rule"

// Creates and configures an ExpressJS web server. 
class App {
  // ref to Express instance
  public express: express.Application;
  //Run configuration methods on the Express instance. 
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();

    
/*

*/
  }
  // Configure Express middleware.
  private middleware(): void {
    this.express.use(urlencoded({ extended: true}));
    this.express.use(json());
    this.express.use(raw());
    this.express.use(text());
  }

  // Configure API endpoints.
  private routes(): void {
    
    // public folder (html, js, css...)
    this.express.use('/public', express.static(path.join(__dirname, 'public')));

    /* This is just to get up and running, and to make sure what we've got is
     * working so far. This function will change when we start to add more
     * API endpoints */
    let router = express.Router();
    router.get('/api/children', ChildController.GetChildren);
    router.post('/api/children', ChildRules['forPost'], ChildController.PostChild);

    // placeholder route handler
    router.get('/', (req, res, next) => {
      res.json({
        message: 'Hello World! (by ChDdV)'
      });
    });

    this.express.use('/', router);
  }
}
export default new App().express;