const Product = require("../models/Product")
const { INDEX } = require("../services/ProductIndexService");
const client = require("../config/ElasticSearchConfig");

exports.create = async (req, res) => {
    try {
        const created = new Product(req.body)
        await created.save()
        // thêm document vào Elasticsearch
        await client.index({
            index: INDEX,
            id: created._id.toString(),
            body: {
                title: created.title,
                description: created.description,
                price: created.price,
                discountPercentage: created.discountPercentage,
                category: created.category?.name || '',
                brand: created.brand?.name || '',
                stockQuantity: created.stockQuantity,
                thumbnail: created.thumbnail,
                images: created.images,
                viewCount: created.viewCount,
                saleCount: created.saleCount,
                isDeleted: created.isDeleted,
            },
            refresh: true
        });

        console.log("✅ Indexed new product into Elasticsearch");

        return res.status(200).json("Create product success");
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Error adding product, please trying again later' })
    }
}

exports.getAll = async (req, res) => {
    try {
        const filter = {}
        const sort = {}
        let skip = 0
        let limit = 0

        // Filter theo brand
        if (req.query.brand) {
            filter.brand = { $in: req.query.brand }
        }

        // Filter theo category
        if (req.query.category) {
            filter.category = { $in: req.query.category }
        }

        // Filter cho user (chỉ hiển thị sản phẩm chưa bị xóa)
        if (req.query.user) {
            filter['isDeleted'] = false
        }

        // Filter theo các tiêu chí đặc biệt
        if (req.query.feature) {
            switch (req.query.feature) {
                case 'newest':
                    // Sản phẩm mới nhất (sắp xếp theo createdAt giảm dần)
                    sort.createdAt = -1
                    break
                case 'best-selling':
                    // Sản phẩm bán chạy nhất (sắp xếp theo saleCount giảm dần)
                    sort.saleCount = -1
                    break
                case 'most-viewed':
                    // Sản phẩm được xem nhiều nhất (sắp xếp theo viewCount giảm dần)
                    sort.viewCount = -1
                    break
                case 'highest-discount':
                    // Sản phẩm có khuyến mãi cao nhất (sắp xếp theo discountPercentage giảm dần)
                    sort.discountPercentage = -1
                    break
            }
        }

        // Sắp xếp tùy chỉnh
        if (req.query.sort && !req.query.feature) {
            sort[req.query.sort] = req.query.order ? req.query.order === 'asc' ? 1 : -1 : 1
        }

        // Phân trang
        if (req.query.page && req.query.limit) {
            const pageSize = req.query.limit
            const page = req.query.page

            skip = pageSize * (page - 1)
            limit = pageSize
        }

        // Đếm tổng số documents và lấy kết quả
        const totalDocs = await Product.find(filter).sort(sort).populate("brand").countDocuments().exec()
        const results = await Product.find(filter).sort(sort).populate("brand").skip(skip).limit(limit).exec()

        res.set("X-Total-Count", totalDocs)

        res.status(200).json(results)

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error fetching products, please try again later' })
    }
};

exports.getById = async (req, res) => {
    try {
        const { id } = req.params
        const result = await Product.findById(id).populate("brand").populate("category")

        // Tăng view count khi người dùng xem sản phẩm
        if (result && !result.isDeleted) {
            await Product.findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
        }

        res.status(200).json(result)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error getting product details, please try again later' })
    }
}

exports.updateById = async (req, res) => {
    try {
        const { id } = req.params;

        // Update MongoDB
        const updatedProduct = await Product.findByIdAndUpdate(id, req.body, { new: true })
            .populate("brand", "name")
            .populate("category", "name");

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Sync update Elasticsearch
        await client.index({
            index: INDEX,
            id: updatedProduct._id.toString(),
            body: {
                title: updatedProduct.title,
                description: updatedProduct.description,
                price: updatedProduct.price,
                discountPercentage: updatedProduct.discountPercentage,
                category: updatedProduct.category?.name || '',
                brand: updatedProduct.brand?.name || '',
                stockQuantity: updatedProduct.stockQuantity,
                thumbnail: updatedProduct.thumbnail,
                images: updatedProduct.images,
                viewCount: updatedProduct.viewCount,
                saleCount: updatedProduct.saleCount,
                isDeleted: updatedProduct.isDeleted,
            },
            refresh: true,
        });

        console.log("✅ Updated product in Elasticsearch");

        res.status(200).json({ message: "Update product success" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating product, please try again later" });
    }
};


exports.undeleteById = async (req, res) => {
    try {
        const { id } = req.params
        const unDeleted = await Product.findByIdAndUpdate(id, { isDeleted: false }, { new: true }).populate('brand')
        res.status(200).json(unDeleted)
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Error restoring product, please try again later' })
    }
}

exports.deleteById = async (req, res) => {
    try {
        const { id } = req.params;

        // Delete document in Elasticsearch first
        try {
            await client.delete({
                index: INDEX,
                id: id.toString(),
            });
            console.log("🗑️ Deleted product from Elasticsearch");
        } catch (err) {
            console.warn("⚠️ Elasticsearch delete warning (maybe not exist):", err.meta?.body?.error?.reason || err.message);
        }

        // Soft delete MongoDB
        const deletedProduct = await Product.findByIdAndUpdate(
            id,
            { isDeleted: true },
            { new: true }
        ).populate("brand", "name");

        if (!deletedProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(deletedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting product, please try again later" });
    }
};

exports.searchProduct = async (req, res) => {
    try {
        const { request } = req.query;
        if (!request || request.trim() === "") {
            return res.status(400).json({ message: "request param is required" });
        }

        const queryText = request.trim();
        console.log("🔎 Searching:", queryText);

        let esQuery;

        if (queryText.length <= 2) {
            // Truy vấn ngắn: autocomplete, match chữ cái hoặc cụm nhỏ
            esQuery = {
                bool: {
                    should: [
                        { wildcard: { title: `*${queryText.toLowerCase()}*` } },
                        { match_phrase_prefix: { title: queryText } },
                    ],
                    must_not: [
                        { term: { isDeleted: true } } // Ẩn product đã xóa
                    ]
                },
            };
        } else {
            // Truy vấn dài: chỉ match chính xác "từ chứa Iphone"
            esQuery = {
                bool: {
                    should: [
                        {
                            match_phrase: {
                                title: {
                                    query: queryText,
                                    slop: 1, // cho phép khoảng cách 1 từ (ví dụ: "i phone" ~ "iphone")
                                },
                            },
                        },
                        {
                            match: {
                                title: {
                                    query: queryText,
                                    fuzziness: 0, // tắt fuzziness để không khớp sai
                                    operator: "and",
                                },
                            },
                        },
                    ],
                    minimum_should_match: 1, // ít nhất 1 điều kiện phải khớp
                    must_not: [
                        { term: { isDeleted: true } } // Ẩn product đã xóa
                    ]
                },
            };
        }

        const result = await client.search({
            index: INDEX,
            body: {
                query: esQuery,
                size: 20,
            },
        });

        const hits = result?.hits?.hits || result?.body?.hits?.hits || [];

        const mappedResults = hits.map((hit) => ({
            id: hit._id,
            score: hit._score,
            ...hit._source,
        }));

        if (hits.length === 0) {
            console.warn("⚠️ No search results found for:", queryText);
        }

        return res.status(200).json({
            EC: 0,
            EM: "Search success",
            DT: mappedResults,
        });
    } catch (error) {
        console.error("❌ Search error:", error);
        return res.status(500).json({
            EC: -1,
            EM: "Error searching product",
            DT: [],
        });
    }
};
