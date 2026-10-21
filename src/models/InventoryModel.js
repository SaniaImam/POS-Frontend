export default class InventoryModel {
    constructor(
        itemId = 0,
        itemCode = "",
        itemName = "",
        categoryName = "",
        quantityOnHand = 0,
        reorderLevel = 0,
        averageCost = 0,
        lastUpdated = null,
        status = ""
    ) {
        this.itemId = itemId;
        this.itemCode = itemCode;
        this.itemName = itemName;
        this.categoryName = categoryName;
        this.quantityOnHand = quantityOnHand;
        this.reorderLevel = reorderLevel;
        this.averageCost = averageCost;
        this.lastUpdated = lastUpdated;
        this.status = status;
    }
}
