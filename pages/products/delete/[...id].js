import Layout from "@/components/Layout";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function DeleteProductPage(){
    const [productInfo,setProductInfo] = useState()// State lưu thông tin sản phẩm
    const router = useRouter()// Khởi tạo router để lấy params từ URL
    const {id} = router.query // Lấy id sản phẩm từ URL (vd: /products/delete?id=123)
    useEffect(() => {
        if(!id)
        {
            return;
            
        }
        // Gọi API để lấy thông tin sản phẩm theo id
        axios.get('/api/products?id='+id).then(reponse => {
            setProductInfo(reponse.data)
        });// Chạy lại effect mỗi khi id thay đổi
    }, [id]);
     // Chuyển hướng người dùng về trang danh sách sản phẩm
    function goBack(){
        router.push('/products');

    }
    async function deleteProduct(){
        await axios.delete('/api/products?id='+id) // Chuyển hướng người dùng về trang danh sách sản phẩm
        goBack();// Sau khi xóa xong, quay lại trang danh sách sản phẩm
    }
    return(
        <Layout>
            <h1 className="text-center">Bạn có muốn xóa sản phẩm&nbsp;{productInfo?.title} không ?</h1>
            <div className="flex gap-2 justify-center">
            <button className="btn-red" onClick={deleteProduct}>Yes</button>
            <button className="btn-default" onClick={goBack}>NO</button>
            </div>
            
        </Layout>
    );
}