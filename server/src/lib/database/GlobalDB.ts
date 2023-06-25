type MongoDBType = import('./MongoDBDatabase').default;

function GetGlobalDB() {
  return (global as any).db as MongoDBType;
}

export default GetGlobalDB;
