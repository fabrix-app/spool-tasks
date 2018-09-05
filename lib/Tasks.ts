import { FabrixApp } from '@fabrix/fabrix'
import { clone } from 'lodash'
import { Utils } from './utils'
import { Client } from './Client'

// RabbitMQ TODO make this a generic instead of hardcode
const rabbit = require('rabbot')
// automatically nack exceptions in handlers
rabbit.nackOnError()

export const Tasks = {

  /**
   * configure - Configure the Engine
   * @param app
   */
  configure: (app) => {
    return
  },

  /**
   * copyDefaults - Copies the default configuration so that it can be restored later
   * @param app
   * @returns {Promise.<{}>}
   */
  copyDefaults: (app: FabrixApp) => {
    app.config.set('tasksDefaults', clone(app.config.get('tasks')))
    return Promise.resolve({})
  },

  /**
   * Build Tasker
   */
  buildTasker: (app: FabrixApp) => {
    let taskerConfig = app.config.get('tasks')

    if (taskerConfig.enabled === false) {
      return Promise.resolve()
    }

    const profileName = app.config.get('tasks.profile')
    const profile = Utils.getWorkerProfile(profileName, taskerConfig)
    taskerConfig = Utils.configureExchangesAndQueues(profile, taskerConfig)

    app.spools.tasks.tasker = new Client(app, rabbit, taskerConfig.exchangeName)

    return Utils.registerTasks(profile, app, rabbit)
  },

  /**
   * Add Tasks to Rabbit
   */
  addTasks: (app: FabrixApp) => {
    let taskerConfig = app.config.get('tasks')

    if (taskerConfig.enabled === false) {
      return Promise.resolve()
    }

    rabbit.configure(taskerConfig)
    return Promise.resolve()
  },

  /**
   * Shutdown Tasker
   */
  shutdownTasker: (app: FabrixApp) => {
    let taskerConfig = app.config.get('tasks')

    if (taskerConfig.enabled === false) {
      return Promise.resolve()
    }

    return Promise.resolve(rabbit.shutdown())
  }
}
