import CustomerForm from "../../components/Customer/CustomerForm.jsx";
import "../../styles/CustomerModal.css";


function CustomerModal({
    customer,
    onClose,
    onCustomerAdded
}) {

    return (
        <div className="customer-modal-overlay">

            <div className="customer-modal">

                <button
                    className="customer-modal-close"
                    onClick={onClose}
                >
                    ×
                </button>

                <CustomerForm
                    customer={customer}
                    onClose={onClose}
                    onCustomerAdded={onCustomerAdded}
                />

            </div>

        </div>
    );
}

export default CustomerModal;