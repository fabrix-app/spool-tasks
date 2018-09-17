import { FabrixApp } from '@fabrix/fabrix'
import { FabrixGeneric } from '@fabrix/fabrix/dist/common'
import * as uuid from 'uuid'

export class Client extends FabrixGeneric {
  public messenger
  public exchange_name
  public active_tasks

  constructor (app: FabrixApp, messenger, exchangeName) {
    super(app)

    this.messenger = messenger
    this.exchange_name = exchangeName
    this.active_tasks = new Map()
  }

  /**
   * Publish
   */
  async publish (routingKey, data) {
    const taskId = uuid.v1()
    data.taskId = taskId

    return this.messenger.publish(this.exchange_name, routingKey, data)
      .then(() => {
        return taskId
      })
  }

  /**
   * Cancel Tasks
   */
  async cancel (typeName, taskId) {
    this.app.log.info('cancelling type', typeName, taskId, this.exchange_name)

    return this.messenger.publish(this.exchange_name, `${typeName}.interrupt`, { taskId })
      .then((result) => {
        return result
      })
      .catch(err => {
        this.app.log.error(err)
        return err
      })
  }

}
