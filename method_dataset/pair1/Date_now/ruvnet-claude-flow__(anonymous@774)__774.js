function __method_wrapper__() {
    beforeEach(async () => {
      // Create multiple orders for statistics
      const orderData = [
        {
          user: normalUser._id,
          status: 'delivered',
          paymentStatus: 'completed',
          totalAmount: 150.00,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        },
        {
          user: normalUser._id,
          status: 'delivered',
          paymentStatus: 'completed',
          totalAmount: 200.00,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
        },
        {
          user: adminUser._id,
          status: 'pending',
          paymentStatus: 'pending',
          totalAmount: 100.00,
          createdAt: new Date(), // Today
        },
      ];

      for (const data of orderData) {
        await Order.create({
          ...data,
          orderNumber: `ORD-2024-${Math.floor(Math.random() * 10000)}`,
          items: [
            {
              product: testProducts[0]._id,
              quantity: 1,
              price: testProducts[0].price,
              subtotal: testProducts[0].price,
            },
          ],
          subtotal: data.totalAmount * 0.8,
          tax: data.totalAmount * 0.1,
          shipping: data.totalAmount * 0.1,
          paymentMethod: 'credit_card',
          shippingAddress: {
            name: 'Test User',
            street: '123 Test St',
            city: 'Test City',
            state: 'TC',
            zipCode: '12345',
            country: 'USA',
          },
        });
      }
    });

}
