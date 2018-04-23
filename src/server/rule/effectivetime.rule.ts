import { check } from 'express-validator/check'
import { sanitizeBody, sanitize } from 'express-validator/filter'
import { TimeSlot } from '../entity/timeslot.entity'

export const EffectiveTimeRules = {
    forGetWeek: [
        check('day').isInt(), // format date in ISO Standard
        sanitize('day').toInt(),
    ]
}