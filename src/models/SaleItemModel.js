export default class SaleItemModel {
    constructor(
        itemId = 0,
        itemCode = "",
        itemName = "",
        quantity = 0,
        unitPrice = 0
    ) {
        this.itemId = itemId;
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
    }
}
