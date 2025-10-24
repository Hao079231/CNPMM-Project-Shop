const { Client } = require('@elastic/elasticsearch');
require('dotenv').config();

const client = new Client({
  node: process.env.ELASTICSEARCH_URL,
  auth: {
    apiKey: process.env.ELASTICSEARCH_API_KEY,
  },
});

(async () => {
  try {
    await client.ping();
    console.log("✅ Connected to Elasticsearch Cloud");
  } catch (err) {
    console.error("❌ Elasticsearch connection error:", err);
  }
})();

module.exports = client;
