"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class CartModel {
    constructor(connector) {
        this.conn = connector.connection;
    }
    async addToCart(product_id, user_id) {
        let sql = "insert into cart_item(product_id,user_id) values (?,?)";
        await this.conn.execute(sql, [product_id, user_id]);
    }
    async getCart(user_id) {
        let sql = "select product_id,product_name,price,url as image_url,product_desc,image_name  from cart_item as a left join inventory as b on a.product_id=b.id left join products_images as c on a.product_id =c.its_product_id where user_id =?";
        const [res] = await this.conn.execute(sql, [user_id.toString()]);
        return res;
    }
    async removeFromCart(product_id, user_id) {
        let sql = "delete from cart_item where product_id =? and user_id=?";
        await this.conn.execute(sql, [product_id, user_id]);
    }
}
exports.default = CartModel;