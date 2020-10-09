module.exports = function Cart (oldCart) {
    this.items = oldCart.items || {}
    this.totalQuantity = oldCart.totalQuantity || 0
    this.totalPrice = oldCart.totalPrice || 0

    this.addToCart = function (item, id) {
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

    this.reduceByOne = (id) => {
        this.items[id].quantity--
        this.items[id].price -= this.items[id].item.price
        this.totalQuantity--
        this.totalPrice -= this.items[id].item.price

        if (this.items[id].quantity <= 0) {
            delete this.items[id]
        }
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
