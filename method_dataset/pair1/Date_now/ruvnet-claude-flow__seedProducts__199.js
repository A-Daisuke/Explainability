async function seedProducts() {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/rest-api-advanced');
    
    console.log('Connected to MongoDB');
    
    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');
    
    // Create admin user if not exists
    let adminUser = await User.findOne({ email: 'admin@example.com' });
    if (!adminUser) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      adminUser = await User.create({
        email: 'admin@example.com',
        password: hashedPassword,
        name: 'Admin User',
        role: 'admin',
        isEmailVerified: true,
      });
      console.log('Created admin user');
    }
    
    // Create products
    const products = [];
    let totalProducts = 0;
    
    for (const template of productTemplates) {
      for (const productData of template.products) {
        // Generate multiple variants for some products
        const baseProduct = {
          ...productData,
          category: template.category,
          subcategory: productData.subcategory || template.category,
          sku: `SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
          inventory: {
            quantity: Math.floor(Math.random() * 100) + 20,
            trackInventory: true,
            allowBackorder: Math.random() > 0.8,
            lowStockThreshold: 10,
          },
          images: [
            {
              url: `https://picsum.photos/seed/${productData.name}/800/800`,
              alt: productData.name,
              isMain: true,
            },
            {
              url: `https://picsum.photos/seed/${productData.name}-2/800/800`,
              alt: `${productData.name} - View 2`,
              position: 1,
            },
            {
              url: `https://picsum.photos/seed/${productData.name}-3/800/800`,
              alt: `${productData.name} - View 3`,
              position: 2,
            },
          ],
          featured: Math.random() > 0.7,
          status: 'active',
          visibility: 'visible',
          vendor: adminUser._id,
          // Add some initial reviews
          reviews: generateRandomReviews(),
        };
        
        // Calculate rating statistics
        if (baseProduct.reviews.length > 0) {
          const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          let totalRating = 0;
          
          baseProduct.reviews.forEach(review => {
            distribution[review.rating]++;
            totalRating += review.rating;
          });
          
          baseProduct.rating = {
            average: totalRating / baseProduct.reviews.length,
            count: baseProduct.reviews.length,
            distribution,
          };
        }
        
        products.push(baseProduct);
        totalProducts++;
      }
    }
    
    // Insert all products
    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${totalProducts} products`);
    
    // Create relationships between products
    for (let i = 0; i < createdProducts.length; i++) {
      const product = createdProducts[i];
      const relatedProducts = [];
      
      // Find products in same category
      const sameCategory = createdProducts.filter(
        p => p.category === product.category && p._id.toString() !== product._id.toString()
      );
      
      // Add 3-5 related products
      const numRelated = Math.min(sameCategory.length, Math.floor(Math.random() * 3) + 3);
      for (let j = 0; j < numRelated; j++) {
        const randomIndex = Math.floor(Math.random() * sameCategory.length);
        const relatedProduct = sameCategory[randomIndex];
        if (!relatedProducts.includes(relatedProduct._id)) {
          relatedProducts.push(relatedProduct._id);
        }
      }
      
      product.relatedProducts = relatedProducts;
      await product.save();
    }
    
    console.log('Added related products relationships');
    
    // Display summary
    const summary = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgPrice: { $avg: '$price' },
          totalInventory: { $sum: '$inventory.quantity' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    
    console.log('\nProduct Summary by Category:');
    console.table(summary.map(s => ({
      Category: s._id,
      Count: s.count,
      'Avg Price': `$${s.avgPrice.toFixed(2)}`,
      'Total Inventory': s.totalInventory,
    })));
    
    console.log('\nSeeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}
