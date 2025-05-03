const { Schema, model, models } = require("mongoose");

const OrderSchema = new Schema({
    line_items: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product' }, // Liên kết với Product model
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
    }],
    name: { type: String, required: true },
    phoneNumber: { type: String, required: true }, // Lưu số điện thoại dưới dạng String
    email: { type: String, required: true, match: /.+\@.+\..+/ }, // Đảm bảo email đúng định dạng
    city: { type: String, required: true },
    streetAddress: { type: String, required: true },
    paid: { type: Boolean, default: false }, // Mặc định chưa thanh toán
}, {
    timestamps: true, // Tự động thêm createdAt và updatedAt
});

export const Order = models?.Order || model('Order', OrderSchema);