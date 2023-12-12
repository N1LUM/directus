require("dotenv").config();
const fetch = require("cross-fetch");

const path = require("path");
const fs = require("fs");

const SNAPSHOTS_DIR = "./snapshots";

async function main() {
  const token = await getToken();
  console.log("token is", token);
  const lastSnapshotFilename = "snapshot.latest.json";
  const snapshotFile = path.join(SNAPSHOTS_DIR, lastSnapshotFilename);
  if (!fs.existsSync(snapshotFile)) {
    throw "latest snapshot file does not exists!";
  }
  const snapshot = fs.readFileSync(snapshotFile, "utf8");
  const diff = await getDiff(snapshot, token.access_token);
  if (diff) {
    await applyDiff(diff, token.access_token);
    console.log("diff applied");
  } else {
    console.log("no diff found");
  }
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

async function getDiff(snapshot, token) {
  const { PUBLIC_URL } = process.env;
  const URL = `${PUBLIC_URL}/schema/diff?access_token=${token}`;

  const { data } = await fetch(URL, {
    method: "POST",
    body: snapshot,
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((r) => r.json())
    .catch((e) => ({
      data: undefined,
    }));
  return data;
}

async function applyDiff(diff, token) {
  const { PUBLIC_URL } = process.env;
  const URL = `${PUBLIC_URL}/schema/apply?access_token=${token}`;

  await fetch(URL, {
    method: "POST",
    body: JSON.stringify(diff),
    headers: {
      "Content-Type": "application/json",
    },
  });
}
