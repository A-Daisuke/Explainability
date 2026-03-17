function __method_wrapper__() {
  static async generateInvoicePDF(orderId) {
    // In a real application, this would generate an actual PDF
    const order = await Order.findById(orderId)
      .populate('user', 'name email phone address')
      .populate('items.product', 'name sku');
    
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }
    
    // For now, return invoice data that would be used to generate PDF
    return {
      invoiceNumber: `INV-${order.orderNumber}`,
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      order: {
        number: order.orderNumber,
        date: order.createdAt,
      },
      customer: {
        name: order.user.name,
        email: order.user.email,
        phone: order.user.phone,
        billingAddress: order.billingAddress,
      },
      items: order.items,
      totals: {
        subtotal: order.subtotal,
        tax: order.taxAmount,
        shipping: order.shippingAmount,
        discount: order.discountAmount,
        total: order.totalAmount,
      },
      payment: {
        method: order.payment.method,
        status: order.payment.status,
      },
    };
  }

}
