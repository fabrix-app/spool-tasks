// 'use strict'
//
// const assert = require('assert')
// const FabrixApp = require('@fabrix/fabrix').FabrixApp
// const RouterSpool = require('@fabrix/spool-router').RouterSpool
// const TasksSpool = require('../../../dist/TasksSpool').TasksSpool
// const archetype = require('../../../dist/archetype/config/tasks').tasks
//
// describe('Archetype', () => {
//   let app
//   before(() => {
//     app = new FabrixApp({
//       config: {
//         main: {
//           spools: [
//             RouterSpool,
//             TasksSpool
//           ]
//         },
//         routes: {},
//         tasks: archetype
//       },
//       api: {},
//       pkg: {}
//     })
//
//     return app.start().catch(app.stop)
//   })
//
//   describe('#archetype should work', () => {
//     it('should have route cors set to true', () => {
//       assert(app.spools['tasks'])
//     })
//   })
//
//   after(() => {
//     app.stop()
//   })
// })
