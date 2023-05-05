import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AwsConfig } from './aws.config';
import { ConfigService } from '@nestjs/config';
import { SsmService } from './configs/getSSMConfig';

async function bootstrap() {


  const ssmService = new SsmService();



  const env = await ssmService.loadParameters();

  for (const [key, value] of Object.entries(env)) {
    console.log("key",key)
    console.log("value",value)
    process.env[key] = value;
  }



  const app = await NestFactory.create(AppModule);

  // const awsConfig = app.get(AwsConfig);

  // awsConfig.updates$.subscribe(config => {
  //   console.log('Configuration updated:', config);
  // });

  const configService = app.get(ConfigService);
  const dbHost = configService.get<string>('MainDatabaseHost');
  const dbPort = configService.get<number>('MainDatabasePort');
  const dbUsername = configService.get<string>('MainDatabaseUser');
  const dbPassword = configService.get<string>('MainDatabasePassword');
  const dbName = configService.get<string>('MainDatabaseUser');

  console.log(`DB_HOST = ${dbHost}`);
  console.log(`DB_PORT = ${dbPort}`);
  console.log(`DB_USERNAME = ${dbUsername}`);
  console.log(`DB_PASSWORD = ${dbPassword}`);
  console.log(`DB_DATABASE = ${dbName}`);


  await app.listen(3000);
}
bootstrap();
