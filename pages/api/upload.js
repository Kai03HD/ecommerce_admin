import multiparty from 'multiparty'
import cloudinary from 'cloudinary'
import fs from 'fs'
import { mongooseConnect } from '@/lib/mongoose'
import { isAdminRequest } from './auth/[...nextauth]'

export const config = {
  api: { bodyParser: false },
}
// Cấu hình Cloudinary với thông tin từ biến môi trường (.env)
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_KEY_SECRET,
})
// Hàm handler xử lý yêu cầu upload ảnh
export default async function handler(req, res) {
  await mongooseConnect()
    // Kiểm tra quyền admin (nếu không phải thì return luôn)
  const sessionCheck = await isAdminRequest(req, res)
  if (!sessionCheck) return
 // Tạo form mới để xử lý multipart/form-data (ảnh)
  const form = new multiparty.Form()
 // Chuyển phần đọc form sang Promise để dễ dùng await
  const { fields, files } = await new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err) // Nếu lỗi, reject promise
      resolve({ fields, files })// Trả lại fields và files khi parse thành công
    })
  })
  // Tạo mảng để lưu lại các link ảnh sau khi upload lên Cloudinary
  const uploadedLinks = []
  // Lặp qua từng file được upload
  for (const file of files.file) {
    // Upload ảnh lên Cloudinary, trong folder ecommerce_uploads
    const result = await cloudinary.v2.uploader.upload(file.path, {
      folder: 'ecommerce_uploads',
    })
    // Lưu link ảnh vào mảng
    uploadedLinks.push(result.secure_url)
  }

  return res.json({ links: uploadedLinks })
}
