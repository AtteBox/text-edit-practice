import { Table } from "dynamodb-toolbox/table";
import { Entity } from "dynamodb-toolbox/entity";
import { item } from 'dynamodb-toolbox/schema/item'
import { string } from 'dynamodb-toolbox/schema/string'
import { number } from 'dynamodb-toolbox/schema/number'
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { get } from "http";

const dynamoDBClient = new DynamoDBClient();

const documentClient = DynamoDBDocumentClient.from(dynamoDBClient);

export const HighScoresTable = new Table({
  documentClient,
  name: getDynamoTableName(),
  partitionKey: {
    name: "entityType",
    type: "string",
  },
  sortKey: {
    name: "entityId",
    type: "string",
  },indexes: {
    gameHistoryHashsumIndex: {
      type: 'local',
      sortKey: { name: 'gameHistoryHashsum', type: 'string' }
    }
  }
});

export const HighScore = new Entity({
  table: HighScoresTable,
  name: "HighScore",
  schema: item({
    entityType: string().enum('highscore').key(),
    entityId: string().key(),
    username: string(),
    score: number().key(),
    date: number(),
    gameHistoryHashsum: string(),
  }),
});

function getDynamoTableName() {
  const instanceIdentifier = process.env.INSTANCE_IDENTIFIER;
  if (!instanceIdentifier) {
    throw new Error("Environment variable INSTANCE_IDENTIFIER is not set.");
  }
  return `Typoterminator-HighScore-Table__${process.env.INSTANCE_IDENTIFIER}`;
}
