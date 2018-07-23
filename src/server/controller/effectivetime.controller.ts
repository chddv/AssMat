
import {getConnection} from "typeorm";
import { Router, RequestHandler, Response, Request, Express } from 'express';  
import { validationResult } from 'express-validator/check'
import {Child} from "../entity/child.entity";
import {TimeSlot} from "../entity/timeslot.entity";
import {EffectiveTime} from "../entity/effectivetime.entity";

import moment = require("moment-timezone");

export class EffectiveTimeController { 

    /*
    static GetEffectiveTimeForADay(req: Request, res: Response, next : Function)
    {
        let effectiveTimeRepository = getConnection().getRepository(EffectiveTime);
        let effectiveTimes = effectiveTimeRepository.find({ where: { day: req.query.day }, relations:["child"]});
        console.log("EffectiveTimes from the db: ", effectiveTimes);
        res.json(effectiveTimes);       
    } */
    
    static async GetEffectiveTimeForAWeek(req: Request, res: Response, next : Function)
    {
        // recuperation des enfants
        const childrenQuery = getConnection().createQueryBuilder()
                                            .select("child")
                                            .from("child", "child")
                                            .leftJoinAndSelect("child.timeslots", "timeslot");
        //console.log(childrenQuery.getSql());
        let children = <Child[]> await childrenQuery.getMany();

        console.log("req.query.day = " + req.query.day);
        let tzName: string = moment.tz.names()[4]; //req.query.timezone]; // timezone index 459 is Europe/Paris
        let dtQueryDay: moment.Moment = moment.tz(req.query.day, tzName);
        console.log("tzName=", tzName);
        //console.log(moment.tz.names());
        console.log("dtQueryDay=", dtQueryDay.format());
        console.log("dtQueryDay=", dtQueryDay.zoneAbbr());
        /*
        let dtQueryDay: Date = new Date(req.query.day); 
        dtQueryDay.setToMidnight();
        let dtMonday: Date = dtQueryDay.getMonday();
        let dtSunday: Date = dtQueryDay.getSunday();
        dtSunday.addDays(1);

        console.log("dtQueryDay=", dtQueryDay);
        console.log("dtMonday=", dtMonday);
        console.log("dtSunday=", dtSunday);

        let dtDay = dtMonday.clone();
        while (dtDay < dtSunday)
        {
            console.log("dtDay=", dtDay);
            await EffectiveTimeController.BuildEffectiveTimeForADay(dtDay, children);            
            dtDay.addDays(1);
        }
        
        const effectiveTimesQuery = getConnection().createQueryBuilder()
                                            .select("effectivetime")
                                            .from("EffectiveTime", "effectivetime")
                                            .leftJoinAndSelect("effectivetime.child", "child")
                                            .where("dtstart >= :dtStart AND dtend < :dtEnd", { dtStart: dtMonday, dtEnd: dtSunday })
                                            .orderBy("dtstart, child");
        console.log(effectiveTimesQuery.getSql());                                   
        */
        let effectiveTimes = "blabla";//await effectiveTimesQuery.getMany();
        //console.log("EffectiveTimes from the db: ", effectiveTimes);         
        res.json(effectiveTimes);  
             
    }

    static async ClearEffectiveTimeForADay(dtDay: Date)
    {
        let dtEnd = dtDay.clone();
        dtEnd.addDays(1);
        await getConnection().createQueryBuilder()
                             .delete()
                             .from(EffectiveTime)
                             .where("dtstart >= :dtDay AND dtend < :dtEnd", { dtDay: dtDay, dtEnd: dtEnd })
                             .execute();
    }


    static async BuildEffectiveTimeForADayAChild(_dtDay: Date, _oChild: Child, _oTimes: EffectiveTime[])
    {
        //_oTimes.length = 0; // vide la tableau
        // ** creation des timeslot temporaires
        let times: EffectiveTime[] = [];
        for (let i = 0; i < _oChild.timeslots.length; i++)
        {
            let oTimeSlot: TimeSlot = _oChild.timeslots[i];
            if(oTimeSlot.isValidFor(_dtDay))
            {
                let dtStart: Date = _dtDay.clone();
                dtStart.setHours(oTimeSlot.startHour, oTimeSlot.startMinute,0,0);
                let dtEnd: Date = _dtDay.clone();
                dtEnd.setHours(oTimeSlot.endHour, oTimeSlot.endMinute,0,0);
                let aTime: EffectiveTime = new EffectiveTime(dtStart, dtEnd, _oChild);
                times.push(aTime);
            }           
        }

        // ** optimisation du timeslots
        if(times.length > 0) 
        {
            // trie par heure de debut
            times.sort((t1, t2) => EffectiveTime.sortByHourTime(t1, t2));
            // puis modification ou ajout des tranches horaires final
            _oTimes.push(times[0]);
            let currentTime = _oTimes[0];
            for (let i = 1; i < times.length; i++)
            {
                let aTime: EffectiveTime = times[i];
                if(aTime.isStrictAfter(currentTime)) // si on est strictement apres , on ajoute une nouvelle tranche
                {
                    _oTimes.push(aTime);
                    currentTime = aTime;
                }   
                else // sinon, on modifie la tranche courrante
                {
                    if(aTime.isAfter(currentTime)) // si la tranche horaire fini apres la courrante
                    {
                        currentTime.dtend.setHours(aTime.dtend.getUTCHours(), aTime.dtend.getUTCMinutes());
                    }
                }       
            }
        }
        //console.log("BuildEffectiveTimeForADayAChild - ", _oTimes); 
    }

    static async BuildEffectiveTimeForADay(_dtDay: Date, _children: Child[])
    {
        console.log("BuildEffectiveTimeForADay - ", _dtDay); 
        // on efface les palge de temps du jour donné
        await EffectiveTimeController.ClearEffectiveTimeForADay(_dtDay);
        // recuperation de la liste des enfants
        let timesRepository = getConnection().getRepository(EffectiveTime);        
        // constrution du temps passé de chaque enfant 
        let times: EffectiveTime[] = [];        
        for (let i = 0; i < _children.length ; i++)
        {
            // construit les plage horaires
            await EffectiveTimeController.BuildEffectiveTimeForADayAChild(_dtDay, _children[i], times);
        }
        if (times.length > 0)
        {  
            // remplit la base de données
            const timesQuery = getConnection().createQueryBuilder()
                            .insert()
                            .into(EffectiveTime)
                            .values(times);
            console.log(timesQuery.getSql());
            timesQuery.execute();
        }
    }

} 