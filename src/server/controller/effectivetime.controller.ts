
import {getConnection} from "typeorm";
import { Router, RequestHandler, Response, Request, Express } from 'express';  
import { validationResult } from 'express-validator/check'
import {Child} from "../entity/child.entity";
import {TimeSlot} from "../entity/timeslot.entity";
import {EffectiveTime} from "../entity/effectivetime.entity";

export class EffectiveTimeController { 


    static async GetEffectiveTimeForADay(req: Request, res: Response, next : Function)
    {
        let effectiveTimeRepository = getConnection().getRepository(EffectiveTime);
        let effectiveTimes = await effectiveTimeRepository.find({ where: { day: req.query.day }, relations:["child"]});
        console.log("EffectiveTimes from the db: ", effectiveTimes);
        res.json(effectiveTimes);       
    }
    
    static async GetEffectiveTimeForAWeek(req: Request, res: Response, next : Function)
    {
 
        let dtQueryDay: Date = new Date(req.query.day); 
        //dtQueryDay.setHours(0, 0, 0, 0);
        let dtMonday: Date = dtQueryDay.getMonday();
        let dtSunday: Date = dtQueryDay.getSunday();

        console.log("dtQueryDay=", dtQueryDay);
        console.log("dtMonday=", dtMonday);
        console.log("dtSunday=", dtSunday);


        let dtDay = new Date(dtMonday.getTime());
        while (dtDay <= dtSunday)
        {
            console.log("dtDay=", dtDay);
            EffectiveTimeController.BuildEffectiveTimeForADay(dtDay);
            
            dtDay.addDays(1);
        }
        
        let timesRepository = getConnection().getRepository(EffectiveTime);
        let effectiveTimes = timesRepository.createQueryBuilder("effectivetime").select()
                                             .leftJoinAndSelect("effectivetime.child", "child")
                                             .where("day >= :dtStart AND day <= :dtEnd", { dtStart: dtMonday, dtEnd: dtSunday })
                                             .orderBy("day, child")
                                             .getMany();
        console.log("EffectiveTimes from the db: ", effectiveTimes);
        res.json(effectiveTimes);       
    }

    static async ClearEffectiveTimeForADay(dtDay: Date)
    {
        let timesRepository = getConnection().getRepository(EffectiveTime);
        timesRepository.createQueryBuilder().delete().from(EffectiveTime).where("day = :day", { day: dtDay }).execute();
    }


    static async BuildEffectiveTimeForADayAChild(_dtDay: Date, _oChild: Child, _oTimes: EffectiveTime[])
    {
        //_oTimes.length = 0; // vide la tableau
        // ** creation des timeslot temporaires
        var times: EffectiveTime[] = [];
        for (let i = 0; i < _oChild.timeslots.length; i++)
        {
            let oTimeSlot: TimeSlot = _oChild.timeslots[i];
            if(oTimeSlot.isValidFor(_dtDay))
            {
                let aTime: EffectiveTime = new EffectiveTime(oTimeSlot.startHour, oTimeSlot.startMinute,                    
                                                             oTimeSlot.endHour, oTimeSlot.endMinute, _dtDay, _oChild);
                console.log("aTime = ", aTime);
                times.push(aTime);
            }           
        }

        // ** optimisation du timeslots
        console.log("times.length = ", times.length);
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
                    if(aTime.endAfter(currentTime)) // si la tranche horaire fini apres la courrante
                    {
                        currentTime.endHour = aTime.endHour;
                        currentTime.endMinute = aTime.endMinute;
                    }
                }       
            }
        }
    }

    static async BuildEffectiveTimeForADay(dtDay: Date)
    {
        // recuperation de la liste des enfants
        let timesRepository = getConnection().getRepository(EffectiveTime);
        let childRepository = getConnection().getRepository(Child);
        let children = await childRepository.find({ relations:["timeslots"]});
        // on efface les palge de temps du jour donné
        this.ClearEffectiveTimeForADay(dtDay);
        // constrution du temps passé de chaque enfant
        for (let i = 0; i < children.length; i++)
        {
            let times: EffectiveTime[] = [];
            // construit les plage horaires
            this.BuildEffectiveTimeForADayAChild(dtDay, children[i], times);
            // remplit la base de données
            for (let j = 0; i < times.length; i++)
            {
                timesRepository.insert(times[j]);
            }
        }
    }

}