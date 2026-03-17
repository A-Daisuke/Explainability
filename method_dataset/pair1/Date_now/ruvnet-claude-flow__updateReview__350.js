function __method_wrapper__() {
productSchema.methods.updateReview = async function(userId, rating, comment, images) {
  const review = this.reviews.find(r => r.user.toString() === userId.toString());
  if (!review) {
    throw new Error('Review not found');
  }
  
  review.rating = rating;
  review.comment = comment;
  if (images) review.images = images;
  review.updatedAt = Date.now();
  
  await this.updateRatingStats();
  
  return this.save();
};

}
