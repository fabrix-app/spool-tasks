# spool-tasks

[![Gitter][gitter-image]][gitter-url]
[![NPM version][npm-image]][npm-url]
[![Build Status][ci-image]][ci-url]
[![Test Coverage][coverage-image]][coverage-url]
[![Dependency Status][daviddm-image]][daviddm-url]
[![Follow @FabrixApp on Twitter][twitter-image]][twitter-url]

Task Handler for Fabrix
 - RabbitMQ

## Install
```sh
$ npm install @fabrix/spool-tasks --save
```

### Configure Task Settings

```js
// config/tasks.ts
export const tasks = {

  /**
   * Define worker profiles. Each worker of a given type listens for the
   * "tasks" defined in its profile below. The task names represent a Task
   * defined in api.services.tasks. Note that 'memoryBound' and 'cpuBound' are
   * arbitrary names.
   */
  profiles: {
    memoryBound: [ 'hiMemoryTask1' ],
    cpuBound: [ 'VideoEncoder', 'hiCpuTask2' ]
  },

  /**
   * Set RabbitMQ connection info
   */
  connection: {
    exchange: process.env.TASKER_EXCHANGE, // optional, defaults to `tasker-work-x`
    workQueueName: process.env.TASKER_WORK_QUEUE, // optional, defaults to `tasker-work-q`
    interruptQueueName: process.env.TASKER_INTERRUPT_QUEUE, // optional, defaults to `tasker-interrupt-q`

    /**
     * The RabbitMQ connection information.
     * See: https://www.rabbitmq.com/uri-spec.html
     */
     host: process.env.TASKER_RMQ_HOST,
     user: process.env.TASKER_RMQ_USER,
     pass: process.env.TASKER_RMQ_PASS,
     port: process.env.TASKER_RMQ_PORT,
     vhost: process.env.TASKER_RMQ_VHOST

     /**
     * Connection information could also be passed via uri
     */
     uri: process.env.TASKER_RMQ_URI

     /**
      * Additional, optional connection options (default values shown)
      */
      heartbeat: 30,
      timeout:, // this is the connection timeout (in milliseconds, per connection attempt), and there is no default
      failAFter: 60, // limits how long rabbot will attempt to connect (in seconds, across all connection attempts). Defaults to 60
      retryLimit: 3, // limits number of consecutive failed attempts

  },

  /**
   * Set worker to subscribe to tasks in the matching profile (tasker.profiles).
   * If process.env.WORKER does not match a profile, the application will not subscribe to any tasks
   */
  worker: process.env.WORKER
}
```

### Configure `worker` Environment

```js
// config/env/worker.ts
import { TasksSpool } from '@fabrix/spool-tasks'
export const worker = {
  main: {

    /**
     * Only load the spools needed by the workers
     */
    spools: [
     TasksSpool
    ]
  }
}
```

If the worker profiles each require more granular environment configurations,
create `worker-cpuBound`, `worker-memoryBound`, etc. environments.

### Include tasks in the app object
Create a directory `api/tasks`.  Any task definitions will be created as classes in this directory.
Create  `api/tasks/index.ts` to export all of the tasks.
Include this directory in `api/index.ts`.  Here is an example:
```js
// api/index.ts

import * as tasks from './tasks'
export { tasks }
```

## Usage

Define tasks in `api.tasks`.  Tasks are run by a worker processes.

```js
// api/tasks/VideoEncoder.ts

import { Task } from '@fabrix/spool-tasks'
export class VideoEncoder extends Task {

  /**
   * "message" is the message from RabbitMQ, and contains all the information
   * the worker needs to do its job. By default, sets this.message and this.app.
   *
   * @param message.body.videoFormat
   * @param message.body.videoBuffer
   */
  constructor (app, message) {
    super(app, message)
  }

  /**
   * Do work here. When the work is finished (the Promise is resolved), send
   * "ack" to the worker queue. You must override this method.
   *
   * @return Promise
   */
  run () {
    return doWork(this.message)
  }

  /**
   * This is a listener which is invoked when the worker is interrupted (specifically,
   * an interrupt is a particular type of message that instructs this worker to
   * stop).
   */
  interrupt () {
    this.log.warn('only encoded', this.currentIndex, 'out of', this.totalItems, 'frames')
  }

  /**
   * Perform any necessary cleanup, close connections, etc. This method will be
   * invoked regardless of whether the worker completed successfully or not.
   * @return Promise
   */
  finalize () {
    return doCleanup(this.message)
  }
}
```


To start a task, publish a message via the `app.tasker` interface: 
```
const taskId = app.tasker.publish('VideoEncoder', { vidoeUrl: 'http://...' }
```

To interrupt a task in progress, use the `taskId` that is returned from app.tasker.publish(..):
```
app.tasker.cancel('VideoEncoder', taskId)
```



## Deployment

An example [Procfile](https://devcenter.heroku.com/articles/procfile) may look like:

```
web: npm start
memoryBound: NODE_ENV=worker WORKER=memoryBound npm start
cpuBound: NODE_ENV=worker WORKER=cpuBound npm start
```



[npm-image]: https://img.shields.io/npm/v/@fabrix/spool-tasks.svg?style=flat-square
[npm-url]: https://npmjs.org/package/@fabrix/spool-tasks
[ci-image]: https://img.shields.io/circleci/project/github/fabrix-app/spool-tasks/master.svg
[ci-url]: https://circleci.com/gh/fabrix-app/spool-tasks/tree/master
[daviddm-image]: http://img.shields.io/david/fabrix-app/spool-tasks.svg?style=flat-square
[daviddm-url]: https://david-dm.org/fabrix-app/spool-tasks
[gitter-image]: http://img.shields.io/badge/+%20GITTER-JOIN%20CHAT%20%E2%86%92-1DCE73.svg?style=flat-square
[gitter-url]: https://gitter.im/fabrix-app/fabrix
[twitter-image]: https://img.shields.io/twitter/follow/FabrixApp.svg?style=social
[twitter-url]: https://twitter.com/FabrixApp
[coverage-image]: https://img.shields.io/codeclimate/coverage/github/fabrix-app/spool-tasks.svg?style=flat-square
[coverage-url]: https://codeclimate.com/github/fabrix-app/spool-tasks/coverage
