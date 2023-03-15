import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import { AuthModule } from './modules/auth/auth.module';

export const swagger = async (app: INestApplication) => {
  const options = new DocumentBuilder()
    .setTitle('Gamify-Operator')
    .setDescription(
      'API Documentation \
      \nNOTE: The API with (LOCK) symbol can be used only after providing token in (Authorize).',
    )
    .setVersion('1.0')
    .addBearerAuth({ type: 'apiKey', name: 'x-access-token', in: 'header' })
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    deepScanRoutes: true,
    include: [AuthModule],
  });
  SwaggerModule.setup('api', app, document, {
    customSiteTitle: 'Operator API',
    explorer: false,
  });
};
