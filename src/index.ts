import 'reflect-metadata'
import { Server } from './Server'
import { ConfigService } from './services/ConfigService'
import { FlowService } from './services/FlowService'
import { ProjectService } from './services/ProjectService'
import { serviceContainer } from './services/ServiceContainer'
import { SubscriptionService } from './services/SubscriptionService'
import { logger } from './utils/logger'

async function start() {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const config = require('../app.config')

    const configService = serviceContainer.register('configService', new ConfigService(config))
    const projectService = serviceContainer.register('projectService', new ProjectService())

    await projectService.initialize()

    serviceContainer.register('subscriptionService', new SubscriptionService())
    serviceContainer.register('flowService', new FlowService())

    const server = new Server(configService.data.server.port)
    server.start()
  } catch (e) {
    logger.error('bootstrap.config', { error: e.message })
  }
}

start()
