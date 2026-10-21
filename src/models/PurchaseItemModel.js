export default class PurchaseItemModel {
    constructor(
        itemId = "",
        itemCode = "",
        itemName = "",
        quantity = "",
        unitCost = "",
        receivedQuantity = 0
    ) {
        this.itemId = itemId;
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.quantity = quantity;
        this.unitCost = unitCost;
        this.receivedQuantity = receivedQuantity;
    }
}
