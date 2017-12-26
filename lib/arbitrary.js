const assert = require('assert')
const forEach = require('lodash.foreach')

module.exports = (key) => {
  return app => {
    add(app, key)
  }
}

const NAME = 'arbitrary'

function add (app, key) {
  const config = app.config[NAME]
  assert(config, `arbitrary: ${config} is required on config`)

  forEach(config, (config, name) => {
    if (!config[key]) {
      return
    }

    const {
      create,
      ...others
    } = config

    assert(create, `create method is required for singleton config`)

    // Really tricky things,
    // because egg has too much conventions that we could not extend that
    const singleConfig = others
    const hasConfig = name in app.config
    const originalConfig = app.config[name]

    app.config[name] = singleConfig
    app.addSingleton(name, create)

    if (!hasConfig) {
      delete app.config[name]
      return
    }

    app.config[name] = originalConfig
  })
}