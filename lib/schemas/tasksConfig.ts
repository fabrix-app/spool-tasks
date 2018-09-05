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
  exchange_name: joi.string(),
  connection: joi.object().keys({
    exchange: joi.string(),
    work_queue_name: joi.string(),
    interrupt_queue_name: joi.string(),
    host: joi.string(),
    user: joi.string(),
    pass: joi.string(),
    port: joi.number(),
    vhost: joi.string(),
    uri: joi.string(),
    heartbeat: joi.number(),
    timeout: joi.number().allow(null),
    failAfter: joi.number(),
    retryLimit: joi.number()
  })
})
