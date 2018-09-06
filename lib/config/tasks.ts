/**
 * Tasks Configuration
 *
 * @see {@link http://
 */
export const tasks = {
  prefix: null,
  live_mode: true,
  auto_save: false,
  profile: process.env.TASKS_PROFILE || null,
  enabled: true,
  auto_queue: true,
  connection: {
    // optional, defaults to `tasks-work-x`
    exchange: process.env.TASKS_EXCHANGE || null,
    // optional, defaults to `tasks-work-q`
    work_queue_name: process.env.TASKS_WORK_QUEUE || null,
    // optional, defaults to `tasks-interrupt-q`
    interrupt_queue_name: process.env.TASKS_INTERRUPT_QUEUE || null,

    /**
     * The RabbitMQ connection information.
     * See: https://www.rabbitmq.com/uri-spec.html
     */
    host: process.env.TASKS_RMQ_HOST || null,
    user: process.env.TASKS_RMQ_USER || null,
    pass: process.env.TASKS_RMQ_PASS || null,
    port: process.env.TASKS_RMQ_PORT || null,
    vhost: process.env.TASKS_RMQ_VHOST || null,

    /**
     * Connection information could also be passed via uri
     */
    uri: process.env.TASKS_RMQ_URI || null,

    /**
     * Additional, optional connection options (default values shown)
     */
    heartbeat: 30,
    timeout: null, // this is the connection timeout (in milliseconds, per connection attempt), and there is no default
    failAfter: 60, // limits how long rabbot will attempt to connect (in seconds, across all connection attempts). Defaults to 60
    retryLimit: 3, // limits number of consecutive failed attempts
  },
  profiles: {}
}
