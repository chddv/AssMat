import * as express from 'express';
import * as path from 'path';
import {createConnection} from "typeorm";
import {ChildController} from "./controller/child.controller";

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
  createConnection().then(async connection => {

    
      let aChild = new Child();
      aChild.familyname = "Dugas";
      aChild.firstname = "Christophe"

      let childRepository = connection.getRepository(Child);

      await childRepository.save(aChild);
      console.log("aChild has been saved");

      let someChilds = await childRepository.find();
      console.log("All photos from the db: ", someChilds);

  }).catch(error => console.log(error));
*/
  }
  // Configure Express middleware.
  private middleware(): void {
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