function generateRandomReviews() {
  const reviews = [];
  const numReviews = Math.floor(Math.random() * 10) + 2; // 2-12 reviews
  
  const reviewTemplates = [
    { rating: 5, comments: ['Excellent product!', 'Highly recommended!', 'Perfect, exactly what I needed.', 'Outstanding quality!'] },
    { rating: 4, comments: ['Very good product.', 'Great value for money.', 'Happy with my purchase.', 'Good quality overall.'] },
    { rating: 3, comments: ['Decent product.', 'Average quality.', 'It\'s okay.', 'Could be better.'] },
    { rating: 2, comments: ['Not satisfied.', 'Below expectations.', 'Quality issues.', 'Disappointed.'] },
    { rating: 1, comments: ['Poor quality.', 'Do not recommend.', 'Waste of money.', 'Very disappointed.'] },
  ];
  
  const userNames = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Williams', 'David Brown', 'Emma Davis', 'Chris Wilson', 'Lisa Anderson'];
  
  for (let i = 0; i < numReviews; i++) {
    // Bias towards positive reviews
    const ratingBias = Math.random();
    let rating;
    if (ratingBias < 0.6) rating = 5;
    else if (ratingBias < 0.8) rating = 4;
    else if (ratingBias < 0.9) rating = 3;
    else if (ratingBias < 0.95) rating = 2;
    else rating = 1;
    
    const template = reviewTemplates.find(t => t.rating === rating);
    const comment = template.comments[Math.floor(Math.random() * template.comments.length)];
    
    reviews.push({
      user: mongoose.Types.ObjectId(), // Fake user ID for seeding
      rating,
      comment,
      isVerifiedPurchase: Math.random() > 0.3,
      helpful: {
        yes: Math.floor(Math.random() * 20),
        no: Math.floor(Math.random() * 5),
      },
      createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Random date within last 90 days
    });
  }
  
  return reviews;
}
