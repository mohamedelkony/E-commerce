import  db from '../util/db';
export default class SearchModel {
    
    async search(product_name: string, from_price: number, to_price: number, product_desc: string) {
        let sql_name = null
        let sql_from_price = null
        let sql_to_price = null
        let sql_desc = null
        let args = []
        if (product_name) {
            args.push(product_name.toLowerCase())
            sql_name = ` product_name like CONCAT('%', $1::text,  '%') `
        } if (from_price) {
            args.push(from_price)
            sql_from_price = ` price >= $${args.length}::numeric`
        }
        if (to_price) {
            args.push(to_price)
            sql_to_price = ` price <= $${args.length} ::numeric`
        }
        if (product_desc) {
            args.push(product_desc.toLowerCase())
            sql_desc = ` product_desc like CONCAT('%', $${args.length}::text,  '%') `
        }
        let sql = 'select a.id as product_id,a.product_name,a.price,a.product_desc,b.url as image_url,b.image_name, a.quantity as quantity from inventory as a left join products_images as b on a.id=b.its_product_id  where '
        sql += [sql_name, sql_from_price, sql_to_price, sql_desc].filter(x => x).join(' and ')
        sql = sql + ' order by product_name limit 25;'

        const {rows} = await db.query(sql, args)
        return rows as any
    }

}