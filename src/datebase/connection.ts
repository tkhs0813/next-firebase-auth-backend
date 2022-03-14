import { Connection, createConnection, getConnectionOptions } from "typeorm";

export const connection = async (): Promise<Connection> => {
  try {
    const connectionOptions = await getConnectionOptions();
    const connection = await createConnection(connectionOptions);
    return connection;
  } catch (error) {
    console.log("Database Connectivity Error", error);
    throw new Error(error);
  }
};
