import { SSM } from '@aws-sdk/client-ssm';

const ssm = new SSM({
    region: 'us-east-1'
});

const getParameter = async (paramName: string) => {
  const response = await ssm.getParameter({ Name: paramName })
  return response.Parameter?.Value;
};

export const awsConfigFactoryNew = async () => ({
  DB_HOST: await getParameter('MainDatabaseHost'),
  DB_PORT: parseInt(await getParameter('MainDatabasePort')),
  DB_USERNAME: await getParameter('MainDatabaseUser'),
  DB_PASSWORD: await getParameter('MainDatabasePassword'),
  DB_DATABASE: await getParameter('MainDatabaseName'),
});