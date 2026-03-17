function __method_wrapper__() {
productSchema.pre('save', function(next) {
  if (this.isModified('name')) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    
    // Add timestamp to ensure uniqueness
    this.slug = `${this.slug}-${Date.now()}`;
  }
  
  // Ensure main image
  if (this.images.length > 0 && !this.images.some(img => img.isMain)) {
    this.images[0].isMain = true;
  }
  
  next();
});

}
