const Product = require('../models/Product');
const Category = require('../models/Category');
const APIFeatures = require('../utils/apiFeatures');

// @desc    Get all products with filtering, search, sorting & pagination
// @route   GET /api/v1/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const resPerPage = Number(req.query.limit) || 12;

    // Resolve category if slug is passed instead of ObjectId
    if (req.query.category && !req.query.category.match(/^[0-9a-fA-F]{24}$/) && req.query.category !== 'all') {
      const cat = await Category.findOne({ slug: req.query.category });
      if (cat) {
        req.query.category = cat._id.toString();
      }
    }

    // Total products matching query without pagination
    const countFeatures = new APIFeatures(Product.find({ isActive: true }), req.query)
      .search()
      .filter();
    const filteredProductsCount = await countFeatures.query.countDocuments();

    // Query with sorting and pagination
    const apiFeatures = new APIFeatures(Product.find({ isActive: true }).populate('category', 'name slug'), req.query)
      .search()
      .filter()
      .sort()
      .paginate(resPerPage);

    const products = await apiFeatures.query;

    res.status(200).json({
      success: true,
      data: {
        products,
        pagination: {
          totalProducts: filteredProductsCount,
          currentPage: Number(req.query.page) || 1,
          totalPages: Math.ceil(filteredProductsCount / resPerPage) || 1,
          limit: resPerPage
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured products
// @route   GET /api/v1/products/featured
// @access  Public
const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug')
      .limit(8);

    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single product by ID or Slug
// @route   GET /api/v1/products/:idOrSlug
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;
    const isObjectId = idOrSlug.match(/^[0-9a-fA-F]{24}$/);

    const product = isObjectId
      ? await Product.findById(idOrSlug).populate('category', 'name slug')
      : await Product.findOne({ slug: idOrSlug, isActive: true }).populate('category', 'name slug');

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product
// @route   POST /api/v1/products
// @access  Private/Admin
const createProduct = async (req, res, next) => {
  try {
    const { title, description, price, discountPrice, stock, sku, category, images, isFeatured } = req.body;

    if (!title || !description || price === undefined || stock === undefined || !category) {
      res.status(400);
      throw new Error('Please provide title, description, price, stock, and category');
    }

    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '') + '-' + Math.floor(1000 + Math.random() * 9000);

    const generatedSku = sku || 'SP-' + Math.random().toString(36).substring(2, 8).toUpperCase();

    const product = await Product.create({
      title,
      slug,
      description,
      price: Number(price),
      discountPrice: discountPrice ? Number(discountPrice) : 0,
      stock: Number(stock),
      sku: generatedSku,
      category,
      images: images && images.length > 0 ? images : [{ url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', altText: title }],
      isFeatured: isFeatured || false
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an existing product
// @route   PUT /api/v1/products/:id
// @access  Private/Admin
const updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).populate('category', 'name slug');

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a product
// @route   DELETE /api/v1/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload product image file
// @route   POST /api/v1/products/upload
// @access  Private/Admin
const uploadProductImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      throw new Error('No image file provided');
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully',
      url: imageUrl
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage
};

