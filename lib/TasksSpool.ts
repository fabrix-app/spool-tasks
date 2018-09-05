import { ExtensionSpool } from '@fabrix/fabrix/dist/common/spools/extension'
import { Tasks } from './Tasks'
import { Validator } from './validator'

import * as config from './config/index'
import * as pkg from '../package.json'
import * as api  from './api/index'

export class TasksSpool extends ExtensionSpool {
  private _tasker

  constructor(app) {
    super(app, {
      config: config,
      pkg: pkg,
      api: api
    })

    this.extensions = {
      tasker: {
        get: () => {
          return this.tasker
        },
        set: (tasker) => {
          throw new Error('tasker can not be set through FabrixApp, check spool-tasks instead')
        },
        enumerable: true,
        configurable: true
      }
    }
  }

  get tasker () {
    return this._tasker
  }

  set tasker(tasker) {
    this._tasker = tasker
  }

  /**
   * Validate Configuration
   */
  async validate () {
    // const requiredSpools = ['express', 'sequelize', 'router']
    // const spools = Object.keys(this.app.spools)
    //
    // if (!spools.some(v => requiredSpools.indexOf(v) >= 0)) {
    //   return Promise.reject(new Error(`spool-tasks requires spools: ${ requiredSpools.join(', ') }!`))
    // }

    if (!this.app.config.get('tasks')) {
      return Promise.reject(new Error('No configuration found at config.tasks!'))
    }

    return Promise.all([
      Validator.validateTasksConfig(this.app.config.get('tasks'))
    ])
  }

  /**
   * Adds Routes, Policies, and Agenda
   */
  async configure () {

    return Promise.all([
      Tasks.configure(this.app),
      Tasks.buildTasker(this.app),
      Tasks.copyDefaults(this.app)
    ])
  }

  /**
   * TODO document method
   */
  async initialize () {
    return Promise.all([
      Tasks.addTasks(this.app)
    ])
  }

  /**
   * clear subscriptions
   */
  async unload() {
    return Promise.all([
      Tasks.shutdownTasker(this.app)
    ])
  }
}
