import { check } from 'express-validator/check'
import { sanitizeBody, sanitize } from 'express-validator/filter'
import { TimeSlot } from '../entity/timeslot.entity'

export const EffectiveTimeRules = {
    forGetWeek: [
        check('day').isISO8601(), // format date in ISO Standard
        sanitize('day').toString(), //toDate(), no more present
        check('timezone').isInt(),
        sanitize('timezone').toInt(),
    ]
}