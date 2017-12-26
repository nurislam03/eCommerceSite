
module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {}; /* if oldCart is undefined/not exist make it empty object. */
    this.totalQty = oldCart.totalQty || 0;  /* if oldCart is undefined/not assign value  0 */
    this.totalPrice = oldCart.totalPrice || 0;  /* if oldCart is undefined/not exist assign value  0 */

    this.add = function(item, id) {
        var storedItem = this.items[id];
        if(!storedItem) {
            storedItem = this.items[id] = {item: item, qty: 0, price: 0 };
        }
        storedItem.qty++;
        storedItem.price = storedItem.item.price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.item.price;
    }

    this.generateArray = function() {
        var arr = [];
        for(var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    }
};
