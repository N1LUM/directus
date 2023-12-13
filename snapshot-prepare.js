require("dotenv").config();
const fetch = require("cross-fetch");
const path = require("path");
const fs = require("fs");

const SNAPSHOTS_DIR = "./snapshots";

async function main() {
  const token = await getToken();
  console.log(token);
  const snapshot = await getSnapshot(token.access_token);
  const lastSnapshotFilename = "snapshot.latest.json";
  const snapshotFile = path.join(SNAPSHOTS_DIR, lastSnapshotFilename);
  if (fs.existsSync(snapshotFile)) {
    const renamedLastSnapshot = path.join(SNAPSHOTS_DIR, `snapshot.${Date.now()}.json`);
    fs.renameSync(snapshotFile, renamedLastSnapshot);
  }
  fs.writeFileSync(snapshotFile, JSON.stringify(snapshot));
  console.log("snapshot saved", lastSnapshotFilename);
}

main();

async function getToken() {
  const { PUBLIC_URL, ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
  const URL = `${PUBLIC_URL}/auth/login`;
  const authBody = {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  };
  const { data } = await fetch(URL, {
    method: "POST",
    body: JSON.stringify(authBody),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((r) => r.json());
  return data;
}

async function getSnapshot(token) {
  const { PUBLIC_URL } = process.env;
  const URL = `${PUBLIC_URL}/schema/snapshot?access_token=${token}`;
  const { data } = await fetch(URL).then((r) => r.json());
  return data;
}
