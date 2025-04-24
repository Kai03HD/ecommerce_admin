
import { mongooseConnect } from "@/lib/mongoose";
import { Product } from "@/model/Product";
import mongoose from "mongoose";
import { authOp, isAdminRequest } from "./auth/[...nextauth]";
export default async function handle(req, res) {
    const {method} = req; // Lấy phương thức HTTP từ request
    await mongooseConnect();// Kết nối MongoDB trước khi xử lý request
    // const session = await getServerSession(req,res,authOp)
    //     console.log(session)
    const sessionCheck = await isAdminRequest(req, res);
    if (!sessionCheck) return;
     // Xử lý phương thức GET (Lấy dữ liệu)
    if (method === 'GET')
    {
        if (req.query?.id)
        {
            // Nếu có tham số id, tìm sản phẩm theo id và trả về
            res.json(await Product.findOne({_id:req.query.id}))
        }
        else{
             // Nếu không có id, trả về danh sách tất cả sản phẩm
            res.json(await Product.find())
        }
    }


    // Xử lý phương thức POST (Tạo mới sản phẩm)
    if (method === 'POST') {
        const {title,description,price,images,category,properties} = req.body;// Lấy dữ liệu từ request body
        const productDoc = await Product.create({ // Tạo sản phẩm mới trong DB
            title,description,price,images,category,properties,// Trả về sản phẩm vừa tạo
        })
        
        res.json(productDoc)
    }
     // Xử lý phương thức PUT (Cập nhật sản phẩm)
    if (method === 'PUT') {
        const {title,description,price,images,category,properties, _id} = req.body;// Lấy dữ liệu cần cập nhật
        await Product.updateOne({_id}, {title,description,price,images,category,properties}) // Cập nhật sản phẩm theo _id
        res.json(true)// Trả về kết quả thành công
    }
    // Xử lý phương thức DELETE (Xóa sản phẩm)
    if (method === 'DELETE'){
        if (req.query?.id){
            await Product.deleteOne({_id:req.query?.id})// Xóa sản phẩm theo _id
            res.json(true)// Trả về kết quả thành công
        }
    }

  }