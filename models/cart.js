
module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {}; /* if oldCart is undefined/not exist make it empty object. */
    this.totalQty = oldCart.totalQty || 0;  /* if oldCart is undefined/not assign value  0 */
    this.totalPrice = oldCart.totalPrice || 0;  /* if oldCart is undefined/not exist assign value  0 */

    /* add item into the cart */
    this.add = function(item, id) {
        var storedItem = this.items[id];
        if(!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0 };
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    };

    /* Reduce item by one */
    this.reduceByOne = function(id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].item.price;
        this.totalQty--;
        this.totalPrice -= this.items[id].item.price;

        if(this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    this.removeItem = function(id) {
        this.totalQty -= this.items[id].qty;
        this.totalPrice -= this.items[id].price;
        delete this.items[id];
    };

    this.generateArray = function() {
        var arr = [];
        for(var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
};
