import * as express from 'express';
import {json, urlencoded, raw, text } from 'body-parser';

import * as path from 'path';
import {createConnection} from "typeorm";
import {ChildController} from "./controller/child.controller";
import {ChildRules} from "./rule/child.rule"
import {TimeSlotController} from "./controller/timeslot.controller";
import {TimeSlotRules} from "./rule/timeslot.rule"
import {EffectiveTimeController} from "./controller/effectivetime.controller";
import {EffectiveTimeRules} from "./rule/effectivetime.rule"

// Creates and configures an ExpressJS web server. 
class App {
  // ref to Express instance
  public express: express.Application;
  //Run configuration methods on the Express instance. 
  constructor() {
    this.express = express();
    this.middleware();
    this.routes();
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
    // route child
    router.get('/api/children', ChildController.GetChildren);
    router.get('/api/child', ChildRules['forGetSingle'], ChildController.GetChild);
    router.post('/api/children', ChildRules['forPost'], ChildController.PostChild);
    router.put('/api/child', ChildRules['forPut'], ChildController.PutChild);
    router.delete('/api/child', ChildRules['forDeleteSingle'], ChildController.DeleteChild);
    // route timeslot
    router.get('/api/timeslot', TimeSlotRules['forGetSingle'], TimeSlotController.GetTimeSlot);
    router.post('/api/timeslot', TimeSlotRules['forPost'], TimeSlotController.PostTimeSlot);
    router.put('/api/timeslot', TimeSlotRules['forPut'], TimeSlotController.PutTimeSlot);
    router.delete('/api/timeslot', TimeSlotRules['forDeleteSingle'], TimeSlotController.DeleteTimeSlot);
    // route effectivetimeslot (planning)
    router.get('/api/effectivetime', EffectiveTimeRules['forGetWeek'], EffectiveTimeController.GetEffectiveTimeForAWeek);

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