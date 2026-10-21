export default class PurchaseModel {
    constructor(
        id = 0,
        purchaseNo = "",
        supplierId = "",
        supplierName = "",
        purchaseDate = "",
        invoiceNo = "",
        remarks = "",
        itemCount = 0,
        totalAmount = 0,
        status = "",
        items = []
    ) {
        this.id = id;
        this.purchaseNo = purchaseNo;
        this.supplierId = supplierId;
        this.supplierName = supplierName;
        this.purchaseDate = purchaseDate;
        this.invoiceNo = invoiceNo;
        this.remarks = remarks;
        this.itemCount = itemCount;
        this.totalAmount = totalAmount;
        this.status = status;
        this.items = items;
    }
}
