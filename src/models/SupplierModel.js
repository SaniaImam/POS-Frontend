export default class SupplierModel {
    constructor(
        id = 0,
        supplierCode = "",
        name = "",
        contactPerson = "",
        phone = "",
        email = "",
        address = ""
    ) {
        this.id = id;
        this.supplierCode = supplierCode;
        this.name = name;
        this.contactPerson = contactPerson;
        this.phone = phone;
        this.email = email;
        this.address = address;
    }
}
