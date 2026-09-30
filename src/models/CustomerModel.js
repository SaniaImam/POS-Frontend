export class CustomerModel {
    constructor(
        id = 0,
        customerCode = "",
        name = "",
        phone = "",
        email = ""
    ) {
        this.id = id;
        this.customerCode = customerCode;
        this.name = name;
        this.phone = phone;
        this.email = email;
    }
}