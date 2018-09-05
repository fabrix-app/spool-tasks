/* eslint new-cap: [0]*/
'use strict'

const _ = require('lodash')
const smokesignals = require('smokesignals')
const fs = require('fs')
const Task = require('../../dist/index').Task
const SequelizeResolver = require('@fabrix/spool-sequelize').SequelizeResolver

const App = {
  api: {
    tasks: {
      TestTask: require('./TestTask'),
      TestTask2: require('./TestTask2'),
      TestTask3: require('./TestTask3'),
      OtherTestTask: require('./OtherTestTask'),
      ErrorTestTask: require('./ErrorTestTask'),
      MultiAckTest: require('./MultiAckTest')
    }
  },
  pkg: {
    name: 'spool-tasks-test',
    version: '1.0.0'
  },
  config: {
    stores: {
      sequelize: {
        orm: 'sequelize',
        database: 'Sequelize',
        host: '127.0.0.1',
        dialect: 'postgres',
        migrate: 'drop'
      }
    },
    models: {
      defaultStore: 'sequelize',
      migrate: 'drop'
    },
    routes: {},
    main: {
      spools: [
        require('@fabrix/spool-router').RouterSpool,
        require('@fabrix/spool-sequelize').SequelizeSpool,
        require('@fabrix/spool-express').ExpressSpool,
        require('../../dist/index').TasksSpool
      ]
    },
    policies: {},
    log: {
      logger: new smokesignals.Logger('debug')
    },
    web: {
      express: require('express'),
      middlewares: {
        order: [
          'static',
          'addMethods',
          'cookieParser',
          'session',
          'bodyParser',
          'methodOverride',
          'router',
          'www',
          '404',
          '500'
        ],
        static: require('express').static('test/static')
      }
    },
    // Generics
    generics: {},
    // Tasks
    tasks: {
      live_mode: true,
      auto_save: false,
      profile: 'testProfile',
      // enabled: true,
      auto_queue: true,
      profiles: {
        testProfile: [
          'TestTask',
          'TestTask2',
          'TestTask3',
          'ErrorTestTask',
          'MultiAckTest'
        ],
        otherProfile: [
          'OtherTestTask'
        ]
      },
      connection: {
      //   exchange: process.env.TASK_EXCHANGE, // optional, defaults to `tasks-work-x`
      //   work_queue_name: process.env.TASK_WORK_QUEUE, // optional, defaults to `tasks-work-q`
      //   interrupt_queue_name: process.env.TASK_INTERRUPT_QUEUE, // optional, defaults to `tasks-interrupt-q`
      //
      //   /**
      //    * The RabbitMQ connection information.
      //    * See: https://www.rabbitmq.com/uri-spec.html
      //    */
      //   // host: process.env.TASK_RMQ_HOST,
      //   // user: process.env.TASK_RMQ_USER,
      //   // pass: process.env.TASK_RMQ_PASS,
      //   // port: process.env.TASK_RMQ_PORT,
      //   // vhost: process.env.TASK_RMQ_VHOST,
      //
      //   /**
      //    * Connection information could also be passed via uri
      //    */
      //   uri: process.env.RMQ_URI || 'amqp://',

        /**
         * Additional, optional connection options (default values shown)
         */
        heartbeat: 30,
        timeout: null, // this is the connection timeout (in milliseconds, per connection attempt), and there is no default
        failAfter: 60, // limits how long rabbot will attempt to connect (in seconds, across all connection attempts). Defaults to 60
        retryLimit: 3 // limits number of consecutive failed attempts
      }
    }
  }
}

_.defaultsDeep(App, smokesignals.FailsafeConfig)
module.exports = App
