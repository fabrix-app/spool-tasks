import * as joi from 'joi'

export const tasksConfig = joi.object().keys({
  prefix: joi.string().allow('', null),
  live_mode: joi.boolean().required(),
  auto_save: joi.boolean().required(),
  profile: joi.string().allow(null).required(),
  enabled: joi.boolean(),
  auto_queue: joi.boolean(),
  // profiles: joi.object().pattern(/^/, joi.array().items(joi.string().regex(/(.+)\.(.+)/))),
  profiles: joi.object().pattern(/^/, joi.array().items(joi.string())),
  exchange_name: joi.string().allow(null),
  connection: joi.object().keys({
    exchange: joi.string().allow(null),
    work_queue_name: joi.string().allow(null),
    interrupt_queue_name: joi.string().allow(null),
    host: joi.string().allow(null),
    user: joi.string().allow(null),
    pass: joi.string().allow(null),
    port: joi.number().allow(null),
    vhost: joi.string().allow(null),
    uri: joi.string().allow(null),
    heartbeat: joi.number(),
    timeout: joi.number().allow(null),
    failAfter: joi.number(),
    retryLimit: joi.number()
  }).unknown()
})
