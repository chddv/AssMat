
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
        let children = <Child[]> await childrenQuery.getMany();
        moment.locale(Child.DefaultLang);
        let dtQueryDay: moment.Moment = moment.tz(req.query.day, Child.DefaultTimeZone);
        let dtMidNight: moment.Moment = dtQueryDay.startOf('day');

        let dtMonday: moment.Moment = dtMidNight.startOf('week');
        let dtSunday: moment.Moment = dtMidNight.clone().endOf('week');

        let dtDay = dtMonday.clone();
        while (dtDay < dtSunday)
        {
            console.log("dtDay=", dtDay.format());
            await EffectiveTimeController.BuildEffectiveTimeForADay(dtDay, children);            
            dtDay.add(1, 'days');
        }
        
        const effectiveTimesQuery = getConnection().createQueryBuilder()
                                            .select("effectivetime")
                                            .from("EffectiveTime", "effectivetime")
                                            .leftJoinAndSelect("effectivetime.child", "child")
                                            .where("dtstart >= :dtStart AND dtend < :dtEnd", { dtStart: dtMonday, dtEnd: dtSunday })
                                            .orderBy("dtstart, child");
        console.log(effectiveTimesQuery.getSql());                                   
        let effectiveTimes = await effectiveTimesQuery.getMany();
        //console.log("EffectiveTimes from the db: ", effectiveTimes);         
        res.json(effectiveTimes);  
             
    }

    static async ClearEffectiveTimeForADay(_dtDay: moment.Moment)
    {
        let dtEnd = _dtDay.clone();
        dtEnd.add(1, 'days');
        await getConnection().createQueryBuilder()
                             .delete()
                             .from(EffectiveTime)
                             .where("dtstart >= :dtDay AND dtend < :dtEnd", { dtDay: _dtDay.toDate(), dtEnd: dtEnd.toDate() })
                             .execute();
    }


    static async BuildEffectiveTimeForADayAChild(_dtDay: moment.Moment, _oChild: Child, _oTimes: EffectiveTime[])
    {
        //_oTimes.length = 0; // vide la tableau
        // ** creation des timeslot temporaires
        let times: EffectiveTime[] = [];
        for (let i = 0; i < _oChild.timeslots.length; i++)
        {
            let oTimeSlot: TimeSlot = _oChild.timeslots[i];
            if(oTimeSlot.isValidForMoment(_dtDay))
            {
                let dtStart: moment.Moment = _dtDay.clone();
                dtStart.set({'hour': oTimeSlot.startHour, 'minute': oTimeSlot.startMinute, 'second':0, 'milisecond':0});
                let dtEnd: moment.Moment = _dtDay.clone();
                dtEnd.set({'hour': oTimeSlot.endHour, 'minute': oTimeSlot.endMinute, 'second':0, 'milisecond':0});
                let aTime: EffectiveTime = new EffectiveTime(dtStart.toDate(), dtEnd.toDate(), _oChild);
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
            let currentTime = times[0];// _oTimes[0];
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
    }

    static async BuildEffectiveTimeForADay(_dtDay: moment.Moment, _children: Child[])
    {
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
            timesQuery.execute();
        }
    }

} 