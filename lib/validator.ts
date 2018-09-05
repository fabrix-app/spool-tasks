import * as joi from 'joi'
import { tasksConfig } from './schemas'

export const Validator = {

  // Validate Tasks Config
  validateTasksConfig (config) {
    return new Promise((resolve, reject) => {
      joi.validate(config, tasksConfig, (err, value) => {
        if (err) {
          return reject(new TypeError('config.tasks: ' + err))
        }
        return resolve(value)
      })
    })
  }
}
