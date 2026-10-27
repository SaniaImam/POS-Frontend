export default class GrnModel {
    constructor(
        id = 0,
        grnNo = "",
        purchaseId = "",
        purchaseNo = "",
        supplierName = "",
        grnDate = "",
        notes = "",
        itemCount = 0,
        totalQuantity = 0,
        items = []
    ) {
        this.id = id;
        this.grnNo = grnNo;
        this.purchaseId = purchaseId;
        this.purchaseNo = purchaseNo;
        this.supplierName = supplierName;
        this.grnDate = grnDate;
        this.notes = notes;
        this.itemCount = itemCount;
        this.totalQuantity = totalQuantity;
        this.items = items;
    }
}
