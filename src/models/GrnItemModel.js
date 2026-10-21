export default class GrnItemModel {
    constructor(
        itemId = 0,
        itemCode = "",
        itemName = "",
        quantity = 0,
        receivedQuantity = 0,
        pendingQuantity = 0,
        receivingQuantity = ""
    ) {
        this.itemId = itemId;
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.quantity = quantity;
        this.receivedQuantity = receivedQuantity;
        this.pendingQuantity = pendingQuantity;
        this.receivingQuantity = receivingQuantity;
    }
}
