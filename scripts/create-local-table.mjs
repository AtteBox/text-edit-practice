// Creates the highscore table in DynamoDB Local. Safe to run repeatedly.
// Keep the table definition in sync with infra/infra.yaml.
//
// Usage: node scripts/create-local-table.mjs <instanceIdentifier> [endpoint]
import {
  CreateTableCommand,
  DynamoDBClient,
  ResourceInUseException,
} from "@aws-sdk/client-dynamodb";

async function createLocalTable(
  instanceIdentifier,
  endpoint = "http://localhost:8000",
) {
  const client = new DynamoDBClient({
    endpoint,
    region: "local",
    credentials: { accessKeyId: "local", secretAccessKey: "local" },
  });
  const tableName = `Typoterminator-HighScore-Table__${instanceIdentifier}`;
  const throughput = { ReadCapacityUnits: 5, WriteCapacityUnits: 5 };
  try {
    await client.send(
      new CreateTableCommand({
        TableName: tableName,
        ProvisionedThroughput: throughput,
        AttributeDefinitions: [
          { AttributeName: "entityType", AttributeType: "S" },
          { AttributeName: "entityId", AttributeType: "S" },
          { AttributeName: "gameHistoryHashsum", AttributeType: "S" },
        ],
        KeySchema: [
          { AttributeName: "entityType", KeyType: "HASH" },
          { AttributeName: "entityId", KeyType: "RANGE" },
        ],
        GlobalSecondaryIndexes: [
          {
            IndexName: "gameHistoryHashsumIndex",
            KeySchema: [
              { AttributeName: "entityType", KeyType: "HASH" },
              { AttributeName: "gameHistoryHashsum", KeyType: "RANGE" },
            ],
            Projection: { ProjectionType: "ALL" },
            ProvisionedThroughput: throughput,
          },
        ],
      }),
    );
    console.log(`Created table ${tableName} at ${endpoint}`);
  } catch (error) {
    if (!(error instanceof ResourceInUseException)) throw error;
    console.log(`Table ${tableName} already exists at ${endpoint}`);
  } finally {
    client.destroy();
  }
}

const [instanceIdentifier, endpoint] = process.argv.slice(2);
if (!instanceIdentifier) {
  console.error(
    "Usage: node scripts/create-local-table.mjs <instanceIdentifier> [endpoint]",
  );
  process.exit(1);
}
await createLocalTable(instanceIdentifier, endpoint);
