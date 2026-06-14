/**
 * Auto Seed Helper - Tự động nạp dữ liệu mẫu khi khởi động nếu DB trống
 */
const Product = require('../models/Product');
const Ingredient = require('../models/Ingredient');

const initialProducts = [
  {
    name: 'COSRX AHA/BHA Clarifying Treatment Toner',
    brand: 'COSRX',
    category: 'toner',
    skinTypes: ['oily', 'combination', 'dry'],
    description: 'Nước hoa hồng nhẹ nhàng làm sạch tế bào chết dư thừa, cân bằng pH và ngăn ngừa sự hình thành mụn đầu đen, mụn đầu trắng.',
    keyIngredients: ['Salicylic Acid', 'Glycolic Acid'],
    priceRange: '250k-350k',
    imageUrl: 'https://media.hcdn.vn/catalog/product/n/u/nuoc-hoa-hong-cosrx-tay-te-bao-chet-hoa-hoc-150ml-1-1681723522_img_380x380_f08811_fit_center.jpg',
    suitableForAcne: true,
    suitableForOily: true,
    routineStep: 2,
    routineInstructions: 'Xịt hoặc đổ ra bông tẩy trang rồi nhẹ nhàng lau đều khắp mặt (tránh vùng mắt) ngay sau bước rửa mặt.'
  },
  {
    name: "Paula's Choice 2% BHA Liquid Exfoliant",
    brand: "Paula's Choice",
    category: 'toner',
    skinTypes: ['oily', 'combination'],
    description: 'Dung dịch tẩy tế bào chết hóa học mạnh mẽ giúp thu nhỏ lỗ chân lông, làm mịn bề mặt da và giảm mụn ẩn hiệu quả.',
    keyIngredients: ['Salicylic Acid', 'Green Tea Extract'],
    priceRange: '800k-900k',
    imageUrl: 'https://media.hcdn.vn/catalog/product/d/u/dung-dich-loai-bo-te-bao-chet-paula-s-choice-2-bha-118ml-01_img_380x380_f08811_fit_center.jpg',
    suitableForAcne: true,
    suitableForOily: true,
    routineStep: 2,
    routineInstructions: 'Dùng tay hoặc bông tẩy trang thoa đều toàn mặt, tập trung vào vùng chữ T. Bắt đầu dùng 2-3 lần/tuần.'
  },
  {
    name: 'Some By Mi AHA-BHA-PHA 30 Days Miracle Toner',
    brand: 'Some By Mi',
    category: 'toner',
    skinTypes: ['oily', 'acne-prone'],
    description: 'Nước hoa hồng tràm trà hỗ trợ giảm mụn viêm, làm sạch sâu và kháng khuẩn tốt cho da đang bị mụn sưng đỏ.',
    keyIngredients: ['AHA', 'BHA', 'PHA', 'Tea Tree'],
    priceRange: '200k-300k',
    imageUrl: 'https://media.hcdn.vn/catalog/product/n/u/nuoc-hoa-hong-some-by-mi-danh-cho-da-mun-150ml-3_img_380x380_f08811_fit_center.jpg',
    suitableForAcne: true,
    suitableForOily: true,
    routineStep: 2,
    routineInstructions: 'Thấm ra bông tẩy trang và lau nhẹ nhàng trên da, đặc biệt là các vùng da bị mụn viêm.'
  },
  {
    name: 'La Roche-Posay Effaclar Duo (+)',
    brand: 'La Roche-Posay',
    category: 'serum',
    skinTypes: ['oily', 'combination'],
    description: 'Kem trị mụn ngừa thâm, thông thoáng lỗ chân lông và làm giảm sự xuất hiện của các vết mụn mới hiệu quả.',
    keyIngredients: ['Niacinamide', 'Salicylic Acid', 'Zinc PCA'],
    priceRange: '350k-500k',
    imageUrl: 'https://media.hcdn.vn/catalog/product/k/e/kem-duong-giam-mun-ngua-vet-tham-la-roche-posay-40ml-3_img_380x380_f08811_fit_center.jpg',
    suitableForAcne: true,
    suitableForOily: true,
    routineStep: 3,
    routineInstructions: 'Thoa một lớp mỏng lên vùng da bị mụn sau bước rửa mặt và cân bằng da vào buổi sáng và/hoặc tối.'
  },
  {
    name: 'The Ordinary Niacinamide 10% + Zinc 1%',
    brand: 'The Ordinary',
    category: 'serum',
    skinTypes: ['oily', 'combination', 'normal'],
    description: 'Tinh chất kiềm dầu, thu nhỏ lỗ chân lông và làm sáng đều màu da, mờ thâm do mụn để lại.',
    keyIngredients: ['Niacinamide 10%', 'Zinc PCA 1%'],
    priceRange: '200k-300k',
    imageUrl: 'https://media.hcdn.vn/catalog/product/t/i/tinh-chat-the-ordinary-giam-mun-ngua-tham-thu-nho-lo-chan-long-30ml-01_img_380x380_f08811_fit_center.jpg',
    suitableForAcne: true,
    suitableForOily: true,
    routineStep: 3,
    routineInstructions: 'Thoa vài giọt lên toàn bộ khuôn mặt vào buổi sáng và tối trước kem dưỡng ẩm.'
  },
  {
    name: "Kiehl's Clearly Corrective Dark Spot Solution",
    brand: "Kiehl's",
    category: 'serum',
    skinTypes: ['dry', 'combination', 'normal'],
    description: 'Tinh chất làm sáng da, mờ thâm nám và thâm mụn mạnh mẽ với dẫn xuất Vitamin C an toàn.',
    keyIngredients: ['Activated C', 'Salicylic Acid'],
    priceRange: '1500k-2000k',
    imageUrl: 'https://media.hcdn.vn/catalog/product/s/e/serum-kiehl-s-lam-sang-da-mo-tham-mun-30ml-2-1678255959_img_380x380_f08811_fit_center.jpg',
    suitableForAcne: false,
    suitableForOily: false,
    routineStep: 3,
    routineInstructions: 'Nhỏ 2-3 giọt tinh chất ra tay, vỗ đều lên mặt. Dùng được cả sáng và tối.'
  },
  {
    name: 'Skin1004 Centella Blemish Cream',
    brand: 'Skin1004',
    category: 'moisturizer',
    skinTypes: ['oily', 'combination', 'dry', 'normal'],
    description: 'Kem dưỡng chiết xuất từ rau má giúp làm dịu da nhạy cảm, giảm thâm đỏ và phục hồi vết thương do mụn để lại.',
    keyIngredients: ['Centella Asiatica'],
    priceRange: '200k-300k',
    imageUrl: 'https://media.hcdn.vn/catalog/product/k/e/kem-duong-skin1004-chiet-xuat-rau-ma-giam-mun-phuc-hoi-da-75ml-1-1680514109_img_380x380_f08811_fit_center.jpg',
    suitableForAcne: true,
    suitableForOily: true,
    routineStep: 4,
    routineInstructions: 'Dùng như bước dưỡng khóa ẩm cuối cùng. Chấm hoặc thoa đều một lượng vừa đủ lên vùng da bị tổn thương hoặc toàn bộ khuôn mặt.'
  },
  {
    name: 'Neutrogena Hydro Boost Water Gel',
    brand: 'Neutrogena',
    category: 'moisturizer',
    skinTypes: ['oily', 'combination'],
    description: 'Kem dưỡng dạng gel siêu nhẹ, cấp nước tức thì mà không gây nhờn rít hay bít tắc lỗ chân lông.',
    keyIngredients: ['Hyaluronic Acid'],
    priceRange: '300k-400k',
    imageUrl: 'https://media.hcdn.vn/catalog/product/k/e/kem-duong-am-neutrogena-danh-cho-da-dau-50g-0_img_380x380_f08811_fit_center.jpg',
    suitableForAcne: true,
    suitableForOily: true,
    routineStep: 4,
    routineInstructions: 'Thoa đều đặn mỗi sáng và tối sau các bước tinh chất. Vỗ nhẹ để gel thấm hoàn toàn.'
  },
  {
    name: 'Clinique Dramatically Different Moisturizing Gel',
    brand: 'Clinique',
    category: 'moisturizer',
    skinTypes: ['oily', 'combination'],
    description: 'Kem dưỡng dạng thạch vàng huyền thoại, giúp cân bằng lượng nước và dầu trên da, củng cố hàng rào bảo vệ da.',
    keyIngredients: ['Hyaluronic Acid', 'Glycerin'],
    priceRange: '1000k-1200k',
    imageUrl: 'https://media.hcdn.vn/catalog/product/k/e/kem-duong-am-clinique-danh-cho-da-dau-hon-hop-dau-125ml-4_img_380x380_f08811_fit_center.jpg',
    suitableForAcne: false,
    suitableForOily: true,
    routineStep: 4,
    routineInstructions: 'Dùng 2 lần/ngày sáng và tối. Lấy 1-2 pump thoa đều khắp mặt và cổ.'
  }
];

const initialIngredients = [
  { name: 'Niacinamide', inciName: 'Niacinamide', category: 'active', function: 'Kiềm dầu, giảm viêm, làm sáng da, mờ thâm mụn', minConcentration: 2.0, maxConcentration: 10.0, suitableZones: ['tzone', 'uzone'], contraindications: [], legalMaxPercent: 10.0, benefits: 'Giúp điều tiết dầu thừa ở vùng T-Zone và phục hồi độ sáng tự nhiên cho vùng U-Zone mà không gây kích ứng.' },
  { name: 'Salicylic Acid (BHA)', inciName: 'Salicylic Acid', category: 'active', function: 'Tiêu sừng, làm sạch sâu lỗ chân lông, ngăn ngừa mụn', minConcentration: 0.5, maxConcentration: 2.0, suitableZones: ['tzone'], contraindications: [], legalMaxPercent: 2.0, benefits: 'Tan trong dầu, len lỏi sâu vào lỗ chân lông vùng T-Zone.' },
  { name: 'Azelaic Acid', inciName: 'Azelaic Acid', category: 'active', function: 'Kháng khuẩn, giảm thâm đỏ sau mụn, giảm viêm', minConcentration: 5.0, maxConcentration: 15.0, suitableZones: ['tzone'], contraindications: [], legalMaxPercent: 15.0, benefits: 'Kháng viêm mạnh mẽ, điều trị tại chỗ các đốm mụn viêm đỏ ở vùng chữ T.' },
  { name: 'Centella Asiatica', inciName: 'Centella Asiatica Extract', category: 'active', function: 'Phục hồi da, làm dịu kích ứng, thúc đẩy tái tạo tế bào', minConcentration: 0.5, maxConcentration: 5.0, suitableZones: ['uzone'], contraindications: [], legalMaxPercent: 10.0, benefits: 'Cực kỳ êm dịu, giúp làm dịu và phục hồi vùng U-Zone.' },
  { name: 'Ceramide NP', inciName: 'Ceramide NP', category: 'active', function: 'Phục hồi và củng cố hàng rào lipid bảo vệ da, giữ ẩm sâu', minConcentration: 0.5, maxConcentration: 3.0, suitableZones: ['uzone'], contraindications: [], legalMaxPercent: 5.0, benefits: 'Liên kết chặt chẽ các tế bào biểu bì vùng U-Zone để giảm thiểu sự mất nước qua da.' },
  { name: 'Hyaluronic Acid', inciName: 'Sodium Hyaluronate', category: 'active', function: 'Cấp nước sâu, tăng độ đàn hồi, giữ cho da mịn màng', minConcentration: 0.1, maxConcentration: 2.0, suitableZones: ['uzone'], contraindications: [], legalMaxPercent: 2.0, benefits: 'Thu hút và ngậm lượng nước gấp 1000 lần trọng lượng của nó.' },
  { name: 'Tea Tree Oil', inciName: 'Melaleuca Alternifolia Leaf Oil', category: 'active', function: 'Kháng khuẩn tự nhiên, xẹp mụn sưng đỏ', minConcentration: 1.0, maxConcentration: 5.0, suitableZones: ['tzone'], contraindications: [], legalMaxPercent: 5.0, benefits: 'Trị mụn tại chỗ nhanh chóng cho vùng T-Zone nhờ đặc tính kháng khuẩn vượt trội.' },
  { name: 'Zinc PCA', inciName: 'Zinc PCA', category: 'active', function: 'Kiểm soát dầu nhờn dư thừa, kháng viêm, se lỗ chân lông', minConcentration: 0.1, maxConcentration: 1.0, suitableZones: ['tzone'], contraindications: [], legalMaxPercent: 1.0, benefits: 'Hạn chế đáng kể hoạt động của tuyến bã nhờn đang hoạt động quá mức tại vùng chữ T.' }
];

async function autoSeed() {
  try {
    const productCount = await Product.count();
    const ingredientCount = await Ingredient.count();
    if (productCount === 0) {
      console.log('🌱 Auto-seeding 9 commercial products...');
      await Product.bulkCreate(initialProducts);
      console.log('✅ Products seeded successfully.');
    }
    if (ingredientCount === 0) {
      console.log('🌱 Auto-seeding 8 active ingredients...');
      await Ingredient.bulkCreate(initialIngredients);
      console.log('✅ Ingredients seeded successfully.');
    }
  } catch (error) {
    console.error('❌ Auto-seed error:', error.message);
  }
}

module.exports = autoSeed;
