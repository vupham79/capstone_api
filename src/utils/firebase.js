const { Storage } = require("@google-cloud/storage");

const storage = new Storage({
  keyFilename: "./src/utils/service_account.json"
});

export { storage };
