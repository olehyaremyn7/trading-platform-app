module.exports = function Wish (oldWish) {
    this.items = oldWish.items || {}
    this.totalQuantity = oldWish.totalQuantity || 0
    this.totalPrice = oldWish.totalPrice || 0

    this.addToWish = function (item, id) {
        let storeItem = this.items[id]

        if (!storeItem) {
            storeItem = this.items[id] = {
                item: item,
                quantity: 0,
                price: 0
            }
        }

        storeItem.quantity++
        storeItem.price = storeItem.item.price * storeItem.quantity
        this.totalQuantity++
        this.totalPrice += storeItem.item.price
    }

    this.removeItem = (id) => {
        this.totalQuantity -= this.items[id].quantity
        this.totalPrice -= this.items[id].price
        delete this.items[id]
    }

    this.generateArray = function () {
        let arr = []
        for (let id in this.items) {
            arr.push(this.items[id])
        }
        return arr
    }
}
