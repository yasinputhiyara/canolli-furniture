import Product from "../../models/Product.js";

// @desc  Get reviews for a product
// @route GET /api/v1/products/:id/reviews
export const getProductReviews = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id)
      .select("reviews ratings name")
      .populate("reviews.user", "name");

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    res.json({
      reviews: product.reviews,
      ratings: product.ratings,
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Add a review to a product
// @route POST /api/v1/products/:id/reviews
// @access Protected
export const addProductReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || rating < 1 || rating > 5) {
      res.status(400);
      throw new Error("Rating must be between 1 and 5");
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    // Check if user already reviewed
    const alreadyReviewed = product.reviews.find(
      (r) => r.user?.toString() === req.user._id.toString()
    );
    if (alreadyReviewed) {
      res.status(400);
      throw new Error("You have already reviewed this product");
    }

    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment: comment || "",
      createdAt: new Date(),
    };

    product.reviews.push(review);

    // Recalculate average rating
    const total = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.ratings = {
      average: parseFloat((total / product.reviews.length).toFixed(1)),
      count: product.reviews.length,
    };

    await product.save();

    res.status(201).json({ message: "Review added successfully", ratings: product.ratings });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete own review
// @route DELETE /api/v1/products/:id/reviews/:reviewId
// @access Protected
export const deleteProductReview = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const review = product.reviews.id(req.params.reviewId);
    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    if (review.user?.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Not authorised to delete this review");
    }

    review.deleteOne();

    // Recalculate
    if (product.reviews.length > 0) {
      const total = product.reviews.reduce((acc, r) => acc + r.rating, 0);
      product.ratings = {
        average: parseFloat((total / product.reviews.length).toFixed(1)),
        count: product.reviews.length,
      };
    } else {
      product.ratings = { average: 0, count: 0 };
    }

    await product.save();
    res.json({ message: "Review deleted" });
  } catch (err) {
    next(err);
  }
};
