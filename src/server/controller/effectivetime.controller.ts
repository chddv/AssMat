
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
        dtQueryDay.setToMidnight();
        let dtMonday: Date = dtQueryDay.getMonday();
        let dtSunday: Date = dtQueryDay.getSunday();

        console.log("dtQueryDay=", dtQueryDay);
        console.log("dtMonday=", dtMonday);
        console.log("dtSunday=", dtSunday);

        let dtDay = dtMonday.clone();
        while (dtDay <= dtSunday)
        {
            console.log("dtDay=", dtDay);
            EffectiveTimeController.BuildEffectiveTimeForADay(dtDay);
            
            dtDay.addDays(1);
        }
        
        let timesRepository = getConnection().getRepository(EffectiveTime);
        let effectiveTimes = await timesRepository.createQueryBuilder("effectivetime").select()
                                             .leftJoinAndSelect("effectivetime.child", "child")
                                             .where("startDate >= :dtStart AND endDate <= :dtEnd", { dtStart: dtMonday, dtEnd: dtSunday })
                                             .orderBy("dtStart, child")
                                             .getMany();
        console.log("EffectiveTimes from the db: ", effectiveTimes);         
        res.json(effectiveTimes);       
    }

    static ClearEffectiveTimeForADay(dtDay: Date)
    {
        let timesRepository = getConnection().getRepository(EffectiveTime);
        timesRepository.createQueryBuilder().delete().from(EffectiveTime).execute();// .where("day = :day", { day: dtDay }).execute();
    }


    static BuildEffectiveTimeForADayAChild(_dtDay: Date, _oChild: Child, _oTimes: EffectiveTime[])
    {
        //_oTimes.length = 0; // vide la tableau
        // ** creation des timeslot temporaires
        console.log("BuildEffectiveTimeForADayAChild - ",_dtDay, _oChild.id);

        let times: EffectiveTime[] = [];
        for (let i = 0; i < _oChild.timeslots.length; i++)
        {
            let oTimeSlot: TimeSlot = _oChild.timeslots[i];
            console.log("BuildEffectiveTimeForADayAChild - TimeSlot[",i);
            if(oTimeSlot.isValidFor(_dtDay))
            {
                let dtStart: Date = _dtDay.clone();
                dtStart.setUTCHours(oTimeSlot.startHour, oTimeSlot.startMinute,0,0);
                let dtEnd: Date = _dtDay.clone();
                dtEnd.setUTCHours(oTimeSlot.endHour, oTimeSlot.endMinute,0,0);
                let aTime: EffectiveTime = new EffectiveTime(dtStart, dtEnd, _oChild);
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
                    if(aTime.isAfter(currentTime)) // si la tranche horaire fini apres la courrante
                    {
                        currentTime.endDate.setUTCHours(aTime.endDate.getUTCHours(), aTime.endDate.getUTCMinutes());
                    }
                }       
            }
        }
    }

    static async BuildEffectiveTimeForADay(dtDay: Date)
    {
        console.log("BuildEffectiveTimeForADay - ", dtDay); 

        // recuperation de la liste des enfants
        let timesRepository = getConnection().getRepository(EffectiveTime);
        let childRepository = getConnection().getRepository(Child);
        let children = await childRepository.find({ relations:["timeslots"]});
        // on efface les palge de temps du jour donné
        this.ClearEffectiveTimeForADay(dtDay);
        // constrution du temps passé de chaque enfant       
        for (let i = 0; i < children.length; i++)
        {
            let etimes: EffectiveTime[] = [];            
            // construit les plage horaires
            this.BuildEffectiveTimeForADayAChild(dtDay, children[i], etimes);
            console.log("NbTimeSlotz: ", etimes.length);
            
            // remplit la base de données
            for (let j = 0; j < etimes.length; j++)
            {
                timesRepository.insert(etimes[j]);
            }
        }
    }

} 