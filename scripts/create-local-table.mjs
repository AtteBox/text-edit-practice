// Creates the highscore tables in DynamoDB Local. Safe to run repeatedly.
// Keep the table definition in sync with infra/infra.yaml.
//
// Usage: node scripts/create-local-table.mjs [--recreate] <instanceIdentifier>...
//
// The endpoint is read from DYNAMODB_ENDPOINT, loaded from the .env files the
// same way Next.js does (NODE_ENV=test loads .env.test, otherwise
// .env.development). If it is empty, a real AWS table is used and nothing is
// done.
import nextEnv from "@next/env";
import {
  CreateTableCommand,
  DeleteTableCommand,
  DynamoDBClient,
  ListTablesCommand,
  ResourceInUseException,
  ResourceNotFoundException,
} from "@aws-sdk/client-dynamodb";

nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "test");

const args = process.argv.slice(2);
const recreate = args.includes("--recreate");
const instanceIdentifiers = args.filter((arg) => arg !== "--recreate");
if (instanceIdentifiers.length === 0) {
  console.error(
    "Usage: node scripts/create-local-table.mjs [--recreate] <instanceIdentifier>...",
  );
  process.exit(1);
}

const endpoint = process.env.DYNAMODB_ENDPOINT;
if (!endpoint) {
  console.log("DYNAMODB_ENDPOINT is not set, skipping local table setup");
  process.exit(0);
}

const client = new DynamoDBClient({
  endpoint,
  region: "local",
  credentials: { accessKeyId: "local", secretAccessKey: "local" },
});

try {
  await waitUntilReachable();
  for (const instanceIdentifier of instanceIdentifiers) {
    await createTable(`Typoterminator-HighScore-Table__${instanceIdentifier}`);
  }
} finally {
  client.destroy();
}

// DynamoDB Local may still be starting up (e.g. as a CI service container)
async function waitUntilReachable(timeoutMs = 30_000) {
  const deadline = Date.now() + timeoutMs;
  for (;;) {
    try {
      await client.send(new ListTablesCommand({}));
      return;
    } catch (error) {
      if (Date.now() > deadline) {
        throw new Error(`DynamoDB Local is not reachable at ${endpoint}`, {
          cause: error,
        });
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}

async function createTable(tableName) {
  if (recreate) {
    try {
      await client.send(new DeleteTableCommand({ TableName: tableName }));
    } catch (error) {
      if (!(error instanceof ResourceNotFoundException)) throw error;
    }
  }
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
  }
}
