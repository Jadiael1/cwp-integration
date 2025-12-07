import { Logger, INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '@modules/app.module';
import { ExceptionLoggerFilter } from '@filters/exception-logger.filter';
import { urlencoded } from 'body-parser';

const port = process.env.PORT || 8080;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(urlencoded({ extended: true }));
  app.useGlobalFilters(new ExceptionLoggerFilter());
  app.setGlobalPrefix('/api/v1');
  startSwagger(app);

  await app.listen(port);
  Logger.log(
    `Server running on ${await app.getUrl()} - ${process.env.NODE_ENV ?? 'unknown'}`,
    `Bootstrap`,
  );
}

function startSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle(`CWP Integration`)
    .setDescription(
      `CWP Integration | ${process.env.NODE_ENV} <br><br><a href='/api/v1/queues' target='_blank'>Queues</a><br>`,
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/', app, document);
}

bootstrap().catch((err) => {
  Logger.error(err, 'Bootstrap');
  process.exit(1);
});
