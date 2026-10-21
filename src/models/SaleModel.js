export default class SaleModel {
    constructor(
        id = 0,
        saleNo = "",
        saleDate = "",
        customerId = null,
        customerName = "",
        itemCount = 0,
        subTotal = 0,
        discount = 0,
        totalAmount = 0,
        paymentMethod = "",
        items = []
    ) {
        this.id = id;
        this.saleNo = saleNo;
        this.saleDate = saleDate;
        this.customerId = customerId;
        this.customerName = customerName;
        this.itemCount = itemCount;
        this.subTotal = subTotal;
        this.discount = discount;
        this.totalAmount = totalAmount;
        this.paymentMethod = paymentMethod;
        this.items = items;
    }
}
