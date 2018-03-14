
import {getConnection} from "typeorm";
import { Router, RequestHandler, Response, Request, Express } from 'express';  
import { validationResult } from 'express-validator/check'
import { APIResult } from './APIResult';
import {Child} from "../entity/child.entity";



export class ChildController { 


    static async GetChildren(req: Request, res: Response, next : Function)
    {
        let childRepository = getConnection().getRepository(Child);
        let children = await childRepository.find();
        console.log("All Children from the db: ", children);
        let result = new APIResult(0, "",children);
        console.log("Result the db: ", result);
        res.json(result);       
    }
    
    static async GetChild(req: Request, res: Response, next : Function)
    {
        let childRepository = getConnection().getRepository(Child);
        let child = await childRepository.findOneById(req.query.id);
        console.log("id = " + req.query.id);
        console.log("A Child from the db: ", child);
        let result = new APIResult(0, "", child);
        console.log("Result the db: ", result);
        res.json(result);       
    }

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
        console.log("PostChild = " + oChild);
        let childRepository = getConnection().getRepository(Child);
        childRepository.insert(oChild);
        res.json(oChild);
    }

    static DeleteChild(req: Request, res: Response)
    {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(422).json(errors.array())
        
        var oChild = new Child();
        oChild.id = req.body.id;
        console.log("DeleteChild = " + oChild);
        let childRepository = getConnection().getRepository(Child);
        childRepository.deleteById(oChild.id);
        res.json(oChild);
    }

    static PutChild(req: Request, res: Response)
    {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(422).json(errors.array())
        
        var oChild = new Child();
        oChild.id = req.body.id;
        oChild.familyname = req.body.familyname;
        oChild.firstname = req.body.firstname;        
        console.log("PutChild = " + oChild);
        let childRepository = getConnection().getRepository(Child);
        childRepository.updateById(oChild.id, oChild);
        res.json(oChild);
    }

}