import { AppDataSource } from './db/index';
import { Product } from './entities/product.entity';
import { createWriteStream } from 'fs';
import { join } from 'path';
// csv header
// sku,name,description,category,price,image

const categories = [
  1, // mobiles
  2, // monitor
  3, // laptops
  4, // tablets
  5, // gaming computers
  6, // accessories
];

const productImagesByCategory: { [key: number]: string[] } = {
  1: [
    'https://amsprod.blob.core.windows.net/assets/a5b9b89c-ba44-4afb-9035-eaee28767699_400_400.png',
    'https://microless.com/cdn/products/02158e7fd12d63334e5e21e8276c540a-hi.jpg',
    'https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/plp-x/phones/winter-2024-new-product-launch/phones-new/images/all-phones/all-huawei-nova-y72.png',
    'https://consumer.huawei.com/content/dam/huawei-cbg-site/common/mkt/plp-x/phones/winter-2024-new-product-launch/phones-new/images/all-phones/all-huawei-mate-x3.png',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRRMbL8UGCIS6PzGUI2k2v0rNanpbq868FAqg&s',
  ],
  2: [
    'https://m.media-amazon.com/images/I/81F6CeKEkzL._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/71Y+D6LiODL._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/717DJQ2or6L.jpg',
    'https://images.philips.com/is/image/philipsconsumer/3de73978f3a44b028eedb01f00dbbe5d',
    'https://www.awd-it.co.uk/media/catalog/product/x/g/xg22va.jpg',
  ],
  3: [
    'https://images.unsplash.com/photo-1558864559-ed673ba3610b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZGVsbHxlbnwwfHwwfHx8MA%3D%3D',
    'https://www.hp.com/ca-en/shop/Html/Merch/Images/c08505208_500x367.jpg',
    'https://m.media-amazon.com/images/I/71dP5ll6V-L._AC_UF1000,1000_QL80_.jpg',
    'https://m.media-amazon.com/images/I/81bc8mA3nKL._AC_UF1000,1000_QL80_.jpg',
    'https://uaedubai-bucket.s3.me-central-1.amazonaws.com/wp-content/uploads/2024/06/HP-OMEN-16t-Gaming-Laptop_uaedubai.ae_3.gif',
  ],
  4: [
    'https://m.media-amazon.com/images/I/61FUEXIELzL._AC_UF1000,1000_QL80_.jpg',
    'https://images-cdn.ubuy.co.id/64c6221783bbd74f26794919-lenovo-tab-m10-plus-3rd-gen-10-tablet.jpg',
    'https://m.media-amazon.com/images/I/71-hJGtkLWL.jpg',
    'https://images-cdn.ubuy.co.in/633b51122af1ce605a57ae50-10-1.jpg',
    'https://image.made-in-china.com/202f0j00RMHcLnUFaaoQ/2K-Octa-Core-Tablet-PC-RAM-8GB-ROM-256GB-Flat-Computer-Dual-SIM-10-9-Inch.jpg',
  ],
  5: [
    'https://m.media-amazon.com/images/I/81jhBeNlXcL.jpg',
    'https://pisces.bbystatic.com/image2/BestBuy_US/images/products/6544/6544421_sd.jpg;maxHeight=640;maxWidth=550;format=webp',
    'https://assets.corsair.com/image/upload/f_auto,q_auto/products/Systems/i7600/gallery/VENGEANCE_i7600_01.png',
    'https://images-cdn.ubuy.co.in/64f45682c6e13a6a3064d0ec-viprtech-gaming-pc-computer-desktop.jpg',
    'https://m.media-amazon.com/images/I/81IzGxm6ZQL.jpg',
  ],
  6: [
    'https://m.media-amazon.com/images/I/61eYIZCU3EL._AC_UF1000,1000_QL80_.jpg',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS_fKIibp4yWY7fvyT5a498kr7E1njaIxEJ_w&s',
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS-5qNizLBZeQQoio1mPI0R3DhgBVuqQCRijQ&s',
    'https://m.media-amazon.com/images/I/51aVdvZyiBL.jpg',
    'https://m.media-amazon.com/images/I/71Ez1VpSRNL._AC_UF1000,1000_QL80_.jpg',
  ],
};

const itemName: {
  [key: number]: string[];
} = {
  1: [
    'Samsung S23',
    'iPhone 14 Pro',
    'iPhone 16 Pro Max',
    'Huawei X30',
    'Oppo 2024',
    'Xiaomi Redmi Note 12',
    'OnePlus Nord CE 3 Lite',
    'Google Pixel 8',
    'Sony Xperia 1 V',
    'Vivo X90 Pro',
  ],
  2: [
    'Gaming Monitor',
    '24" Curved',
    '28" OLED',
    'QLED Gaming Monitor',
    'Samsung Curved Screen',
    'LG UltraGear 32"',
    'ASUS TUF Gaming 27"',
    'Dell UltraSharp 4K',
    'BenQ EyeCare 24"',
    'Acer Predator X34',
  ],
  3: [
    'Asus ROG',
    'DELL Latitude',
    'HP Laptop',
    'Windows Surface',
    'MacBook',
    'Lenovo ThinkPad X1',
    'Acer Swift 3',
    'Samsung Galaxy Book3',
    'MSI Prestige 14',
    'Google Pixelbook Go',
  ],
  4: [
    'iPad',
    'Samsung Tablet',
    '9 Inch Tablet',
    'Lenovo Tab P12',
    'Huawei MediaPad T5',
    'Amazon Fire HD 10',
    'Microsoft Surface Pro 8',
    'ASUS ZenPad 10',
    'Realme Pad X',
    'Nokia T20',
  ],
  5: [
    'Corsair Vengeance',
    'Alienware Aurora R15',
    'HP Omen 45L',
    'MSI Infinite X',
    'Lenovo Legion T7',
    'CyberPowerPC Gamer Xtreme',
    'iBUYPOWER Trace MR',
    'NZXT Streaming PC',
    'Dell G5 Gaming',
    'Razer Tomahawk',
  ],
  6: [
    'Adjustable Phone Stand',
    'Gaming Mouse',
    'Mechanical Keyboard',
    'Laptop Backpack',
    'Noise-Cancelling Headphones',
    'Portable Charger 20,000mAh',
    'Webcam 1080p HD',
    'USB-C Hub 8-in-1',
    'Ergonomic Office Chair',
    'Bluetooth Speaker',
  ],
};

const descriptions: { [key: number]: string[] } = {
  1: [
    'Latest smartphone with cutting-edge technology.',
    'Flagship mobile with stunning camera and battery life.',
    'Budget-friendly smartphone with essential features.',
    'A phone for every occasion, sleek and powerful.',
    'High-performance smartphone for multitasking.',
  ],
  2: [
    'High-resolution gaming monitor with fast refresh rates.',
    'Curved monitor for immersive viewing experience.',
    'OLED monitor with incredible color accuracy.',
    'Gaming QLED monitor with high contrast ratio.',
    'Top-tier curved screen for work and play.',
  ],
  3: [
    'Powerful gaming laptop with the latest GPU.',
    'Professional laptop for work and productivity.',
    'Portable and lightweight laptop with long battery life.',
    'Touchscreen laptop for creative professionals.',
    'Stylish and powerful laptop for everyday use.',
  ],
  4: [
    'Lightweight tablet with high-resolution display.',
    'Powerful tablet for entertainment and productivity.',
    'Compact tablet for everyday use.',
    'Tablet designed for on-the-go professionals.',
    'Sleek and affordable tablet with modern features.',
  ],
  5: [
    'High-end gaming rig with customizable RGB.',
    'Prebuilt gaming desktop with top-tier performance.',
    'Gaming computer designed for serious gamers.',
    'Powerful PC for immersive gaming and VR.',
    'Customizable gaming station with extreme specs.',
  ],
  6: [
    'Sturdy mobile holder with adjustable angles.',
    'Gaming mouse for precision and comfort.',
    'Ergonomic keyboard with customizable keys.',
    'Durable backpack for carrying laptops and accessories.',
    'High-quality headphones with noise cancellation.',
  ],
};

const pricesByCategory: { [key: number]: number[] } = {
  1: [499, 699, 899, 1099, 1299], // Mobiles
  2: [149, 249, 349, 449, 549], // Monitors
  3: [599, 899, 1299, 1499, 1999], // Laptops
  4: [199, 299, 399, 499, 699], // Tablets
  5: [999, 1499, 1999, 2499, 2999], // Gaming Computers
  6: [29, 49, 79, 99, 149], // Accessories
};

const generateCsv = async (rowsNum: number) => {
  // Get last SKU
  let appDataSource = await AppDataSource.initialize();
  let productRepo = appDataSource.getRepository(Product);
  const product = await productRepo
    .createQueryBuilder('product')
    .select(['product.id', 'product.sku'])
    .orderBy('CAST(SUBSTRING(product.sku FROM 3) AS INTEGER)', 'DESC') // PostgreSQL syntax for substring
    .getOne();
  let startingSku = 0;
  if (product) {
    startingSku = parseInt(product.sku.substring(2));
  }

  return new Promise((resolve, reject) => {
    // Define file path
    let filePath = join(__dirname, 'products_list.csv');
    // Create write stream
    const writeStream = createWriteStream(filePath, { flags: 'w' });

    writeStream.on('open', (err) => {
      console.log('stream opened');

      // Write the header
      writeStream.write('sku,name,description,categoryId,price,image\n');

      for (let i = 0; i < rowsNum; i++) {
        let category = Math.floor(Math.random() * 6) + 1;

        // sku,name,description,category,price,image
        let row = [
          `'${formatSku(++startingSku)}'`,
          `'${itemName[category][Math.floor(Math.random() * itemName[category].length)]}'`,
          `'${descriptions[category][Math.floor(Math.random() * descriptions[category].length)]}'`,
          category,
          pricesByCategory[category][Math.floor(Math.random() * pricesByCategory[category].length)],
          `'${productImagesByCategory[category][Math.floor(Math.random() * productImagesByCategory[category].length)]}'`,
        ];
        // Write the row to the CSV
        writeStream.write(row.join(',') + '\n');
      }

      // End the write stream
      writeStream.end();
    });

    writeStream.on('error', (err) => {
      console.error('Error writing to file:', err);
      reject(err);
    });

    writeStream.on('finish', () => {
      console.log('CSV file created successfully:', filePath);
      resolve(filePath);
    });
  });
};

/**
 * Given an integer between 1 and 999999
 * returns the SKU format ITXXXXXX
 * @param number
 * @returns string
 */
const formatSku = (number: number): string => {
  if (number < 1 || number > 999999) {
    throw new Error('Number must be between 1 and 999999');
  }
  return `IT${number.toString().padStart(6, '0')}`;
};

// Read the variable from command-line arguments
let rowsNum = parseInt(process.argv[2]);

if (isNaN(rowsNum) || rowsNum <= 0) {
  rowsNum = 100;
}

generateCsv(rowsNum)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Error generating CSV:', err);
    process.exit(1);
  });
