import { mongooseConnect } from "@/lib/mongoose";
import {Order} from "@/model/Order";

export default async function handler(req, res) {
    if (req.method === "GET") {
        try {
            await mongooseConnect();
            const orders = await Order.find()
            .populate('line_items.productId') // Populate để lấy thông tin sản phẩm
        .sort({ createdAt: -1 });

            res.status(200).json(orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            res.status(500).json({ error: "Failed to fetch orders" });
        }
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}