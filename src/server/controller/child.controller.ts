
import {createConnection} from "typeorm";
import { Router, RequestHandler, Response, Next, Request, Express } from 'express';  
import { BodyParser } from 'body-parser';  

import {Child} from "../entity/child.entity";


export class ChildController {


    static GetChildren(req: Request, res: Response, next : Function)
    {
        createConnection().then(async connection => {
            /*
            let aChild = new Child();
            aChild.familyname = "Dugas";
            aChild.firstname = "Christophe"
      
            
      
            await childRepository.save(aChild);
            console.log("aChild has been saved");
            */
            let childRepository = connection.getRepository(Child);
            let children = await childRepository.find();
            console.log("All Children from the db: ", children);
            res.json(children);
      
        }).catch(error => console.log(error));       
    }
    
    static PostChild(req: Request, res: Response)
    {
        if (req.
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
    }

    // DELETE, PUT (update)

}