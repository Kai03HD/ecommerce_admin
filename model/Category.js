import  {model, models, Schema} from "mongoose";
import mongoose from 'mongoose';
const CategorySchema = new Schema({
  name: {type:String,required:true},  // Thuộc tính tên danh mục, kiểu chuỗi, bắt buộc phải có
  parent: {type: Schema.Types.ObjectId, ref:'Category'},// Tham chiếu đến danh mục cha (nếu có), kiểu ObjectId, liên kết tới model 'Category'
  properties: [{type: Object}]// Mảng các thuộc tính, mỗi phần tử là một object (ví dụ: { name: "Color", values: ["Red", "Blue"] })
 
});

export const Category = models?.Category || model('Category', CategorySchema);