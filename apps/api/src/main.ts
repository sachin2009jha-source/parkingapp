import { NestFactory } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { AppModule, ObserveInstrument } from './app.module.js'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    instrument: ObserveInstrument,
  })

  app.enableCors()

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  )
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Parking App API')
    .setDescription('Parking App REST API')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig)

  SwaggerModule.setup('/', app, swaggerDocument)

  await app.listen(process.env.PORT ?? 3000)
}

await bootstrap()
