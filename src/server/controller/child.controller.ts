
import {createConnection} from "typeorm";
<<<<<<< HEAD
import { Router, RequestHandler, Response, Request, Express } from 'express';  
import { validationResult } from 'express-validator/check'
import { APIResult } from './APIResult';
=======
import { Router, RequestHandler, Response, Next, Request, Express } from 'express';  
import { BodyParser } from 'body-parser';  

>>>>>>> 3c6865542d40729eee1971bee41d5d53ba4e43d4
import {Child} from "../entity/child.entity";



export class ChildController {


    static GetChildren(req: Request, res: Response, next : Function)
    {
        createConnection().then(async connection => {
            let childRepository = connection.getRepository(Child);
            let children = await childRepository.find();
            console.log("All Children from the db: ", children);
            let result = new APIResult(0, "",children);
            res.json(result);
      
        }).catch(error => console.log(error));       
    }
    
<<<<<<< HEAD
    /// POST : Need Header : Content-Type: application/json
    /// Body : JSON { "familyname":"dugas", "firstname":"toto"}

    static PostChild(req: Request, res: Response)
    {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(422).json(errors.array())
        
        var oChild = new Child();
        oChild.familyname = req.body.familyname;
        oChild.firstname = req.body.firstname;
        res.json(oChild);
=======
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
>>>>>>> 3c6865542d40729eee1971bee41d5d53ba4e43d4
    }

    // DELETE, PUT (update)

}