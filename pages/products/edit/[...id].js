import Layout from "@/components/Layout";
import ProductForm from "@/components/ProductForm";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function EditProductPage(){
    const [productInfo,setProductInfo] = useState(null)// Khai báo state để lưu thông tin sản phẩm
    const router = useRouter() // Sử dụng router để lấy tham số id từ URL
    const {id} = router.query // Lấy id sản phẩm từ URL
    useEffect(() => {// useEffect sẽ chạy khi id thay đổi (tức là khi trang tải xong và có id)
        if(!id)
        {
            return; // Nếu không có id, thoát khỏi useEffect
            
        }
        axios.get('/api/products?id='+id).then(reponse => {
            setProductInfo(reponse.data)// Lưu thông tin sản phẩm vào state
        });
    }, [id])// Chỉ chạy lại khi id thay đổi
    return (
        <Layout>
            <h1>Chỉnh Sửa Mặt Hàng</h1>
            {productInfo && (
                 <ProductForm {...productInfo} />
            )}
           
        </Layout>
    )
}