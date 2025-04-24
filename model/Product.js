const { default: Products } = require("@/pages/products");

import  {model, Schema, models} from "mongoose";
const ProductSchema = new Schema({
    title: {type:String, required: true},// Tên sản phẩm, bắt buộc phải có
    description: { type: String, default: "" },// Mô tả sản phẩm, không bắt buộc
    price: {type: Number, required: true},// Giá sản phẩm, bắt buộc phải có
    images: [{type: String}]    ,
    category: {type: Schema.Types.ObjectId, ref:'Category'},
    properties: {type: Object},
}, {
    timestamps: true,
  });

// Kiểm tra xem model 'Product' đã tồn tại chưa
// Nếu có rồi thì dùng lại, tránh lỗi khi Next.js hot-reload
export const Product = models.Product || model('Product', ProductSchema);