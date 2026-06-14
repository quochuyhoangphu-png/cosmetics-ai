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
    imageUrl: 'https://media.hcdn.vn/catalog/product/k
