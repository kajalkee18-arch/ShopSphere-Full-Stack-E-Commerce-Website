class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search() {
    if (this.queryString.keyword) {
      const keyword = {
        $or: [
          { title: { $regex: this.queryString.keyword, $options: 'i' } },
          { description: { $regex: this.queryString.keyword, $options: 'i' } }
        ]
      };
      this.query = this.query.find(keyword);
    }
    return this;
  }

  filter() {
    const queryCopy = { ...this.queryString };
    const removeFields = ['keyword', 'page', 'limit', 'sort'];
    removeFields.forEach((key) => delete queryCopy[key]);

    // Handle minPrice and maxPrice
    const priceFilter = {};
    if (queryCopy.minPrice !== undefined) {
      priceFilter.$gte = Number(queryCopy.minPrice);
      delete queryCopy.minPrice;
    }
    if (queryCopy.maxPrice !== undefined) {
      priceFilter.$lte = Number(queryCopy.maxPrice);
      delete queryCopy.maxPrice;
    }
    if (Object.keys(priceFilter).length > 0) {
      queryCopy.price = priceFilter;
    }

    // Handle rating filter
    if (queryCopy.rating) {
      queryCopy.ratingsAverage = { $gte: Number(queryCopy.rating) };
      delete queryCopy.rating;
    }

    // Handle category filter
    if (queryCopy.category && queryCopy.category !== 'all') {
      // category can be ID or slug
      queryCopy.category = queryCopy.category;
    } else if (queryCopy.category === 'all') {
      delete queryCopy.category;
    }

    this.query = this.query.find(queryCopy);
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      let sortBy = '-createdAt';
      if (this.queryString.sort === 'price_asc') sortBy = 'price';
      else if (this.queryString.sort === 'price_desc') sortBy = '-price';
      else if (this.queryString.sort === 'rating_desc') sortBy = '-ratingsAverage';
      else if (this.queryString.sort === 'newest') sortBy = '-createdAt';
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }
    return this;
  }

  paginate(resPerPage = 12) {
    const currentPage = Number(this.queryString.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;

