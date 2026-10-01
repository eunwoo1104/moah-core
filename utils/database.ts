import knex from "knex";
import "server-only";

import type {
  MediaTable,
  NodeTable,
  SessionTable,
  TagTable,
  UserTable,
} from "@/utils/types";

const connection = knex({
  client: "mysql2",
  connection: {
    host: process.env.MARIADB_HOST || "localhost",
    port: Number(process.env.MARIADB_PORT) || 3306,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE || "moah_core",
  },
});

export const database = {
  user: () => connection<UserTable>("user"),
  session: () => connection<SessionTable>("session"),
  node: () => connection<NodeTable>("node"),
  media: () => connection<MediaTable>("media"),
  tag: () => connection<TagTable>("tag"),
};

export default connection;
