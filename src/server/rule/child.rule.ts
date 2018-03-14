import { check } from 'express-validator/check'
import { Child } from '../entity/child.entity'

export const ChildRules = {
    forPost: [
      check('firstname').isLength({ min: 3, max: 255 }), 
      check('familyname').isLength({ min: 3, max: 255 })
    ],
    forGetSingle: [
      check('id').isInt({min: 0})
    ],
    forPut: [
      check('id').isInt({min: 0}),
      check('firstname').isLength({ min: 3, max: 255 }), 
      check('familyname').isLength({ min: 3, max: 255 })
    ],
    forDeleteSingle: [
      check('id').isInt({min: 0})
    ],
  }

