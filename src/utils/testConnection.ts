import config from '../config';
import * as db from '../utils/db';

const processEnv = config.env;

export function getTestDatabaseConnection() {
  const dbConfig = {
    client: 'mssql',
    connection: { ...config.database[processEnv] }
  };

  return db.createInstance(dbConfig);
}
