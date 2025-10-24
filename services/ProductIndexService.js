require('../models/Category');
require('../models/Brand');
const Product = require('../models/Product');
const client = require('../config/ElasticSearchConfig');
const INDEX = 'products';

async function recreateProductIndex() {
  const exists = await client.indices.exists({ index: INDEX });
  if (exists) {
    console.log('🗑️ Deleting old index...');
    await client.indices.delete({ index: INDEX });
  }

  console.log('🆕 Creating new index...');
  await client.indices.create({
    index: INDEX,
    body: {
      settings: {
        analysis: {
          filter: {
            autocomplete_filter: { type: 'edge_ngram', min_gram: 2, max_gram: 10 }
          },
          analyzer: {
            autocomplete: {
              type: 'custom',
              tokenizer: 'standard',
              filter: ['lowercase', 'autocomplete_filter']
            }
          }
        }
      },
      mappings: {
        properties: {
          title: { type: 'text', analyzer: 'autocomplete', search_analyzer: 'standard' },
          description: { type: 'text' },
          price: { type: 'double' },
          discountPercentage: { type: 'double' },
          category: { type: 'keyword' },
          brand: { type: 'keyword' },
          stockQuantity: { type: 'integer' },
          thumbnail: { type: 'keyword' },
          images: { type: 'keyword' },
          viewCount: { type: 'integer' },
          saleCount: { type: 'integer' },
          isDeleted: { type: 'boolean' },
        },
      },
    },
  });

  console.log('✅ Index created successfully');
}

async function reindexProducts() {
  console.log('📌 Reindexing products from MongoDB...');
  const products = await Product.find({ isDeleted: false })
    .populate('brand', 'name')
    .populate('category', 'name')
    .lean();

  if (!products || products.length === 0) {
    console.warn('⚠️ No products found to index.');
    return;
  }

  const bulkOps = [];
  for (const doc of products) {
    bulkOps.push({ index: { _index: INDEX, _id: doc._id.toString() } });
    bulkOps.push({
      title: doc.title,
      description: doc.description,
      price: doc.price,
      discountPercentage: doc.discountPercentage,
      category: doc.category?.name || '',
      brand: doc.brand?.name || '',
      stockQuantity: doc.stockQuantity,
      thumbnail: doc.thumbnail,
      images: doc.images,
      viewCount: doc.viewCount,
      saleCount: doc.saleCount,
      isDeleted: doc.isDeleted,
    });
  }

  console.log(`📦 Indexing ${bulkOps.length / 2} documents...`);
  await client.bulk({ refresh: true, body: bulkOps });

  console.log('🎉 Reindex done! Total:', products.length);
}

async function recreateAndReindex() {
  await recreateProductIndex();
  await reindexProducts();
}

module.exports = { recreateProductIndex, reindexProducts, recreateAndReindex, INDEX };
