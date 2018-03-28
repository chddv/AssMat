import { check } from 'express-validator/check'
import { sanitizeBody, sanitize } from 'express-validator/filter'
import { TimeSlot } from '../entity/timeslot.entity'

export const TimeSlotRules = {
    forPost: [ // rules to insert a new TimeSlot
        // first check
        check('childid').isInt({min: 0}), 
        check('startHour').isInt({min: 0}), 
        check('startMinute').isInt({min: 0}), 
        check('endHour').isInt({min: 0}), 
        check('monday').isBoolean(),
        check('tuesday').isBoolean(),
        check('wednesday').isBoolean(),
        check('thursday').isBoolean(),
        check('friday').isBoolean(),
        check('saturday').isBoolean(),
        check('sunday').isBoolean(),
        check('holiday').isBoolean(),
        check('nonworkingday').isBoolean(),
        // then sanetize
        sanitize('childid').toInt(), 
        sanitize('startHour').toInt(),
        sanitize('startMinute').toInt(), 
        sanitize('endHour').toInt(),
        sanitize('endMinute').toInt(), 
        sanitize('monday').toBoolean(),
        sanitize('tuesday').toBoolean(),
        sanitize('wednesday').toBoolean(),
        sanitize('thursday').toBoolean(),
        sanitize('friday').toBoolean(),
        sanitize('saturday').toBoolean(),
        sanitize('sunday').toBoolean(),
        sanitize('holiday').toBoolean(),
        sanitize('nonworkingday').toBoolean(),
    ],
    forGetSingle: [
      check('id').isInt({min: 0}),
      sanitize('id').toInt(), 
    ],
    /*forPut: [
      check('id').isInt({min: 0}),
      check('firstname').isLength({ min: 3, max: 255 }), 
      check('familyname').isLength({ min: 3, max: 255 })
    ],*/
    forDeleteSingle: [
      check('id').isInt({min: 0}),
      sanitize('id').toInt(),
    ],
  }
