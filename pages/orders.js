import Layout from "@/components/Layout";
import axios from "axios";
import {useEffect, useState} from "react";

export default function OrderPage(){
    const [orders,setOrders] = useState([]);
      // Khởi tạo state `orders` với giá trị mặc định là một mảng rỗng ([]).
    // `setOrders` là hàm dùng để cập nhật giá trị của `orders`
    useEffect(() => {
         // `useEffect` được gọi sau khi component được render.
    // Trong trường hợp này, nó được dùng để gọi API và lấy dữ liệu đơn hàng.
      axios.get('/api/orders').then(response => {
         // Gửi yêu cầu GET đến endpoint `/api/orders` để lấy danh sách các đơn hàng.
        setOrders(response.data);
      });
    }, []);
    return(
        <Layout>
            <h2>Order</h2>
            <table className="basic">
                <thead>
                    <tr>
                       <th>Date</th>
                       <th>Paid</th>
                        <th>Recipient</th>
                       <th>Products</th>
                    </tr>
                </thead>
                <tbody>
                {orders.length > 0 && orders.map(order => (
         <tr key={order._id}>
         <td>{(new Date(order.createdAt)).toLocaleString()}</td>
         {/* Hiển thị trạng thái thanh toán: 
             - Nếu `order.paid` là `true`, thêm class `text-green-600` để hiển thị màu xanh lá.
             - Nếu `order.paid` là `false`, thêm class `text-red-600` để hiển thị màu đỏ. */}
         <td className={order.paid ? 'text-green-600' : 'text-red-600'}>
           {order.paid ? 'YES' : 'NO'}
         </td>
         <td>
           {order.name}<br />
           {order.email}<br />
           {order.city} {order.streetAddress}
         </td>
         <td>
  {order.line_items.map((l, index) => (

    // Duyệt qua danh sách `line_items` của đơn hàng
    <div key={index}>
      {l.productId?.title || 'Unknown Product'} x {l.quantity}

    </div>
  ))}
</td>
       </tr>
        ))}
                </tbody>
            </table>
        </Layout>
        
    )
}