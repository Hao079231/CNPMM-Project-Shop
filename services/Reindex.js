require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const { recreateAndReindex } = require('./ProductIndexService');

(async () => {
  try {
    console.log("🔌 Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");

    console.log("Running Elasticsearch reindex...");
    await recreateAndReindex();

    fs.writeFileSync("./.es_initialized", "done");
    console.log("✅ Elasticsearch reindex completed");

    await mongoose.disconnect();
  } catch (error) {
    console.error("❌ Reindex failed:", error);
  }
})();
