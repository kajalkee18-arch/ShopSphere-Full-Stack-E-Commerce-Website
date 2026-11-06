const mongoose = require('mongoose');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Models
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Review = require('./models/Review');
const Order = require('./models/Order');
const Cart = require('./models/Cart');
const Wishlist = require('./models/Wishlist');

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    console.log('[Seeder]: Clearing existing data...');
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();

    console.log('[Seeder]: Creating Users...');
    // Create Admin and Customer accounts
    const adminUser = await User.create({
      name: 'ShopSphere Admin',
      email: 'admin@shopsphere.com',
      password: 'Admin@123',
      role: 'admin',
      phone: '+91 9999900000',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
      addresses: [
        {
          fullName: 'ShopSphere Headquarters',
          street: 'Indiranagar 100ft Road',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560038',
          country: 'India',
          phone: '+91 9999900000',
          isDefault: true
        }
      ]
    });

    const customerUser = await User.create({
      name: 'Aarav Sharma',
      email: 'user@shopsphere.com',
      password: 'User@123',
      role: 'customer',
      phone: '+91 9876543210',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200',
      addresses: [
        {
          fullName: 'Aarav Sharma',
          street: 'Flat 402, Green Glen Layout, Bellandur',
          city: 'Bengaluru',
          state: 'Karnataka',
          postalCode: '560103',
          country: 'India',
          phone: '+91 9876543210',
          isDefault: true
        }
      ]
    });

    console.log('[Seeder]: Creating Categories...');
    const categoriesData = [
      {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Next-generation smartphones, laptops, audio gear, and smart home gadgets.',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=500'
      },
      {
        name: 'Fashion & Apparel',
        slug: 'fashion',
        description: 'Curated premium fashion, luxury streetwear, and timeless wardrobe essentials.',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=500'
      },
      {
        name: 'Home & Kitchen',
        slug: 'home-kitchen',
        description: 'Aesthetic modern furniture, culinary cookware, and ambient home decor.',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=500'
      },
      {
        name: 'Sports & Fitness',
        slug: 'sports-fitness',
        description: 'Performance sportswear, smart workout trackers, and gym essentials.',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=500'
      },
      {
        name: 'Books & Stationery',
        slug: 'books-stationery',
        description: 'Bestselling fiction, business masteries, and artisanal stationery.',
        image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&q=80&w=500'
      }
    ];

    const createdCategories = await Category.insertMany(categoriesData);

    const electronicsCat = createdCategories.find((c) => c.slug === 'electronics')._id;
    const fashionCat = createdCategories.find((c) => c.slug === 'fashion')._id;
    const homeCat = createdCategories.find((c) => c.slug === 'home-kitchen')._id;
    const sportsCat = createdCategories.find((c) => c.slug === 'sports-fitness')._id;
    const booksCat = createdCategories.find((c) => c.slug === 'books-stationery')._id;

    console.log('[Seeder]: Creating Products...');
    const productsData = [
      {
        title: 'Aura Pro Active Noise Cancelling Headphones',
        slug: 'aura-pro-anc-headphones',
        description: 'Studio-grade acoustic audio with industry-leading Active Noise Cancellation (ANC), 40-hour battery life, and plush memory foam earcups.',
        price: 14999,
        discountPrice: 12499,
        stock: 35,
        sku: 'AUD-ANC-001',
        category: electronicsCat,
        images: [
          { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800', altText: 'Front View' },
          { url: 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&q=80&w=800', altText: 'Side View' }
        ],
        ratingsAverage: 4.8,
        numReviews: 42,
        isFeatured: true
      },
      {
        title: 'Sphere Horizon Ultra Smartwatch',
        slug: 'sphere-horizon-smartwatch',
        description: '1.96-inch AMOLED display, real-time heart rate and SpO2 monitoring, GPS tracking, and titanium alloy chassis.',
        price: 8999,
        discountPrice: 6999,
        stock: 18,
        sku: 'WAT-HOR-002',
        category: electronicsCat,
        images: [
          { url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', altText: 'Smartwatch front' },
          { url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=800', altText: 'Wrist preview' }
        ],
        ratingsAverage: 4.7,
        numReviews: 29,
        isFeatured: true
      },
      {
        title: 'Nomad Ergonomic Mechanical Keyboard',
        slug: 'nomad-ergonomic-mechanical-keyboard',
        description: 'Wireless Bluetooth 5.2 and 2.4GHz connectivity, hot-swappable Gateron Pro switches, south-facing RGB, and mac/windows layout toggle.',
        price: 7499,
        discountPrice: 5999,
        stock: 14,
        sku: 'KEY-NOM-003',
        category: electronicsCat,
        images: [
          { url: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&q=80&w=800', altText: 'Top view keyboard' }
        ],
        ratingsAverage: 4.9,
        numReviews: 19,
        isFeatured: true
      },
      {
        title: 'Minimalist Oxford Wool Trench Coat',
        slug: 'minimalist-oxford-wool-trench-coat',
        description: 'Crafted from 100% fine Merino wool. Tailored double-breasted silhouette with storm flap and tortoise-shell buttons.',
        price: 9999,
        discountPrice: 7999,
        stock: 22,
        sku: 'FAS-TRN-004',
        category: fashionCat,
        images: [
          { url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=800', altText: 'Coat front' },
          { url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=800', altText: 'Style model' }
        ],
        ratingsAverage: 4.6,
        numReviews: 15,
        isFeatured: true
      },
      {
        title: 'Urban Heritage Leather Weekender Duffel',
        slug: 'urban-heritage-leather-duffel',
        description: 'Full-grain vegetable-tanned Italian leather with antique brass hardware, shoe compartment, and padded shoulder strap.',
        price: 11499,
        discountPrice: 8999,
        stock: 9,
        sku: 'BAG-DUF-005',
        category: fashionCat,
        images: [
          { url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800', altText: 'Leather bag' }
        ],
        ratingsAverage: 4.9,
        numReviews: 31,
        isFeatured: true
      },
      {
        title: 'Artisan Hand-Poured Soy Scented Candle Set',
        slug: 'artisan-soy-scented-candle-set',
        description: 'Trio of cedarwood & amber, wild fig & cassis, and white tea & sage with crackling natural wood wicks. 50-hour clean burn.',
        price: 2499,
        discountPrice: 1899,
        stock: 45,
        sku: 'HOM-CND-006',
        category: homeCat,
        images: [
          { url: 'https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&q=80&w=800', altText: 'Candle collection' }
        ],
        ratingsAverage: 4.7,
        numReviews: 18,
        isFeatured: false
      },
      {
        title: 'Barista Touch Precision Espresso Machine',
        slug: 'barista-touch-espresso-machine',
        description: '15-bar Italian pressure pump, PID digital temperature control, integrated conical burr grinder, and microfoam steam wand.',
        price: 34999,
        discountPrice: 29999,
        stock: 4, // Low stock test!
        sku: 'KIT-ESP-007',
        category: homeCat,
        images: [
          { url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=800', altText: 'Espresso machine' }
        ],
        ratingsAverage: 4.9,
        numReviews: 53,
        isFeatured: true
      },
      {
        title: 'Pro-Grip Natural Rubber Yoga & Workout Mat',
        slug: 'pro-grip-rubber-yoga-mat',
        description: '6mm high-density natural tree rubber with laser-etched alignment guides. Anti-slip dry and wet grip technology.',
        price: 3499,
        discountPrice: 2699,
        stock: 40,
        sku: 'SPT-YOG-008',
        category: sportsCat,
        images: [
          { url: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?auto=format&fit=crop&q=80&w=800', altText: 'Yoga mat' }
        ],
        ratingsAverage: 4.8,
        numReviews: 24,
        isFeatured: false
      },
      {
        title: 'Titan Hex Rubber Dumbbell Pair (10kg)',
        slug: 'titan-hex-rubber-dumbbell-pair-10kg',
        description: 'Commercial-grade cast iron encased in virgin rubber. Contoured chrome ergonomic knurled handles prevent slipping.',
        price: 4999,
        discountPrice: 3999,
        stock: 15,
        sku: 'SPT-DMB-009',
        category: sportsCat,
        images: [
          { url: 'https://images.unsplash.com/photo-1586401100295-7a8096fd231a?auto=format&fit=crop&q=80&w=800', altText: 'Dumbbells' }
        ],
        ratingsAverage: 4.7,
        numReviews: 12,
        isFeatured: false
      },
      {
        title: 'Atomic Habits & Psychology of Money Collector Boxset',
        slug: 'atomic-habits-psychology-of-money-boxset',
        description: 'Hardcover collector edition of global bestsellers on habit mastery, personal finance, and decision architecture.',
        price: 1899,
        discountPrice: 1499,
        stock: 50,
        sku: 'BOK-BOX-010',
        category: booksCat,
        images: [
          { url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800', altText: 'Hardcover books' }
        ],
        ratingsAverage: 5.0,
        numReviews: 76,
        isFeatured: true
      },
      {
        title: 'Handcrafted Full-Grain Leather Journal',
        slug: 'handcrafted-leather-journal',
        description: 'Refillable 240-page unruled archival parchment paper bound in supple distressed crazy horse leather with wrap tie.',
        price: 1499,
        discountPrice: 1199,
        stock: 30,
        sku: 'STN-JRN-011',
        category: booksCat,
        images: [
          { url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&q=80&w=800', altText: 'Leather notebook' }
        ],
        ratingsAverage: 4.9,
        numReviews: 38,
        isFeatured: false
      },
      {
        title: 'Aerolite Carbon Fiber Carry-On Suitcase',
        slug: 'aerolite-carbon-fiber-suitcase',
        description: 'TSA-approved dual combination lock, whisper-quiet 360-degree Hinomoto spinner wheels, and compression divider system.',
        price: 12999,
        discountPrice: 9999,
        stock: 12,
        sku: 'TRV-LUG-012',
        category: fashionCat,
        images: [
          { url: 'https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?auto=format&fit=crop&q=80&w=800', altText: 'Travel suitcase' }
        ],
        ratingsAverage: 4.8,
        numReviews: 22,
        isFeatured: true
      }
    ];

    const createdProducts = await Product.insertMany(productsData);

    console.log('[Seeder]: Creating Sample Reviews...');
    await Review.create({
      user: customerUser._id,
      product: createdProducts[0]._id,
      rating: 5,
      title: 'Unbelievable Sound Clarity & Comfort!',
      comment: 'The active noise cancellation is practically magic on flights. Battery lasts well over a week with daily commute use.'
    });

    console.log('[Seeder]: Creating Initial COD Order...');
    await Order.create({
      user: customerUser._id,
      orderItems: [
        {
          product: createdProducts[0]._id,
          title: createdProducts[0].title,
          quantity: 1,
          image: createdProducts[0].images[0].url,
          price: createdProducts[0].discountPrice
        }
      ],
      shippingAddress: customerUser.addresses[0],
      paymentMethod: 'COD',
      paymentStatus: 'Pending',
      itemsPrice: createdProducts[0].discountPrice,
      taxPrice: Math.round(createdProducts[0].discountPrice * 0.05),
      shippingPrice: 0,
      totalPrice: createdProducts[0].discountPrice + Math.round(createdProducts[0].discountPrice * 0.05),
      orderStatus: 'Processing',
      isPaid: false
    });

    console.log('----------------------------------------------------');
    console.log('✅ [Seeder]: Database successfully seeded!');
    console.log('   Admin:    admin@shopsphere.com / Admin@123');
    console.log('   Customer: user@shopsphere.com / User@123');
    console.log('   Products: ' + createdProducts.length + ' items created');
    console.log('----------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seeder Error]: ${error.message}`);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Category.deleteMany();
    await Product.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();
    await Cart.deleteMany();
    await Wishlist.deleteMany();
    console.log('🗑️ [Seeder]: All collections cleared from database.');
    process.exit(0);
  } catch (error) {
    console.error(`❌ [Destroy Error]: ${error.message}`);
    process.exit(1);
  }
};

if (process.argv[2] === '-d') {
  destroyData();
} else {
  seedData();
}
