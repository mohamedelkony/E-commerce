import db from '../util/db'
export default class CartModel {
    async item_already_in_cart(product_id: number, user_id: number): Promise<boolean> {
        let sql = `select count(id) as count from carts_items where user_id=$1 and product_id=$2;`
        let { rows } = await db.query(sql, [user_id, product_id])
        let count = rows[0]['count']
        if (count > 0)
            return true
        return false
    }
    async addToCart(product_id: number, user_id: number) {
        let sql = "insert into carts_items(product_id,user_id,quantity) values ($1,$2,1)"
        await db.query(sql, [product_id, user_id])
    }
    async getCart(user_id: number) {
        let sql = "select a.quantity,product_id,product_name,price,url as image_url,product_desc,image_name  from carts_items as a left join inventory as b on a.product_id=b.id left join products_images as c on a.product_id =c.its_product_id where user_id =$1";
        const { rows } = await db.query(sql, [user_id])
        return <any>rows;
    }
    async get_cart_item(user_id: number, product_id) {
        let sql = 'select * from carts_items where user_id=$1 and product_id=$2'
        const { rows } = await db.query(sql, [user_id, product_id])
        return <any>rows[0];
    }
    async removeFromCart(product_id: number, user_id: number) {
        let sql = "delete from carts_items where product_id =$1 and user_id=$2"
        await db.query(sql, [product_id, user_id])
    }
    async clearCart(user_id: number) {
        let sql = "delete from carts_items where user_id=$1"
        await db.query(sql, [user_id])
    }
    async increase_cart_item_qunatity(product_id: number, user_id: number) {
        let sql = `
       update carts_items 
       set quantity =quantity+1
       where  product_id=$1 and user_id=$2
       `;
        await db.query(sql, [product_id, user_id])

        let sql2 = 'select quantity from carts_items where user_id=$1 and product_id=$2;'
        const { rows } = await db.query(sql2, [user_id, product_id])
        return rows[0]['quantity']
    }
    async decrease_cart_item_qunatity(product_id: number, user_id: number) {
        let sql =
            ` update carts_items
            set quantity = case when quantity>1 then quantity-1 else 1 end 
             where  product_id=$1 and user_id=$2`
        await db.query(sql, [product_id, user_id])

        let sql2 = 'select quantity from carts_items where user_id=$1 and product_id=$2;'
        const { rows } = await db.query(sql2, [user_id, product_id])
        return rows[0]['quantity']
    }
}