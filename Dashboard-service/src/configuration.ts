import dotenv from 'dotenv';

dotenv.config();

const getEnvVariable = (key: string, defaultValue: string): string => {
  const value = process.env[key];
  if (!value) {
    console.warn(`Environment variable ${key} is not set. Using default value: ${defaultValue}`);
    return defaultValue;
  }
  return value;
};

const config = {
  influxdb: {
    url: getEnvVariable('INFLUXDB_URL', 'http://localhost:8086'),
    token: getEnvVariable('INFLUXDB_TOKEN', 'I8qPVnEyudv__zt_txtId-G4Wb0bIiUMfQETSVr6ZqR-xE421mVku7zSVkUFRtFQ0F2SNFJ2I5mgxIYPTlDdkQ=='),
    org: getEnvVariable('INFLUXDB_ORG', 'IOT3'),
    bucket: getEnvVariable('INFLUXDB_BUCKET', 'IOT3'),
  },
};

export default config;
