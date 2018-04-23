import {getConnection} from "typeorm";
import { Router, RequestHandler, Response, Request, Express } from 'express';  
import { validationResult } from 'express-validator/check'

import {Child} from "../entity/child.entity";
import {TimeSlot} from "../entity/timeslot.entity";

import {EffectiveTimeController} from "../controller/effectivetime.controller";

export class TimeSlotController { 
    
    static async GetTimeSlot(req: Request, res: Response, next : Function)
    {
        let timeslotRepository = getConnection().getRepository(TimeSlot);
        let timeslot = await timeslotRepository.findOneById(req.query.id);
        console.log("id = " + req.query.id);
        console.log("A TimeSlot from the db: ", timeslot);
        res.json(timeslot);       
    }

    /// POST : Need Header : Content-Type: application/json
    /// { "childid":"10", "startHour":"8", "startMinute":"30", "endHour":"18", "endMinute":"30", "monday":"true", "tuesday":"false","wednesday":"true", "thursday":"false", "friday":"true","saturday":"false", "sunday":"true", "holiday":"false","nonworkingday":"true" }  

    static async PostTimeSlot(req: Request, res: Response)
    {
        console.log("PostTimeSlot Start ");
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(422).json(errors.array())
        
        // find child who own the timeslot
        let childRepository = getConnection().getRepository(Child);
        let child = await childRepository.findOneById(req.body.childid);
        console.log("Find Child =  " + req.body.childid);
        if (child) {
            console.log("Found Child ");
            var oTimeslot = new TimeSlot();
            oTimeslot = req.body; //TODO: not sure of what happen ...           
            oTimeslot.child = child;
            console.log("TimeSlot =  " + JSON.stringify(oTimeslot));
            let timeslotRepository = getConnection().getRepository(TimeSlot);
            timeslotRepository.insert(oTimeslot);
            res.json(oTimeslot);
        }
        else        
        {
            console.log("Not Found Child ");
            res.status(422).json("Enfant non déterminé");
        }
        
    }

    static DeleteTimeSlot(req: Request, res: Response)
    {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(422).json(errors.array())
        
        var oTimeSlot = new TimeSlot();
        oTimeSlot.id = req.query.id;
        console.log("DeleteTimeSlot = " + oTimeSlot.id);
        let timeslotRepository = getConnection().getRepository(TimeSlot);
        timeslotRepository.deleteById(oTimeSlot.id);
        res.json(oTimeSlot);
    }

    static PutTimeSlot(req: Request, res: Response)
    {
        const errors = validationResult(req)
        if (!errors.isEmpty())
            return res.status(422).json(errors.array())
        
        var oTimeslot = new TimeSlot();
        oTimeslot = req.body; //TODO: not sure of what happen ...                
        console.log("PuttimeSlot = " + oTimeslot);
        let timeslotRepository = getConnection().getRepository(TimeSlot);
        timeslotRepository.updateById(oTimeslot.id, oTimeslot);
        res.json(oTimeslot);
    }

}