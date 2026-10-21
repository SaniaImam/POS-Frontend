import { useNavigate } from "react-router-dom";

import "../../styles/Purchase.css";

import PurchaseForm from "../../components/Purchase/PurchaseForm";

import { addPurchase } from "../../services/PurchaseService";

import {
    showSuccessAlert,
    showErrorAlert
} from "../../utils/sweetAlert";

const NewPurchase = () => {
    const navigate = useNavigate();

    const handleSubmit = async (formData) => {
        try {
            const data = await addPurchase(formData);

            await showSuccessAlert(`Purchase ${data.purchaseNo} added successfully.`);

            navigate("/purchases");
        } catch (error) {
            showErrorAlert(error.message);
        }
    };

    return (
        <div className="purchases-page">

            <div className="purchases-header">
                <div>
                    <h1>New Purchase</h1>
                    <p>Stock increases once the goods are received through GRN.</p>
                </div>

                <button onClick={() => navigate("/purchases")}>
                    Purchase List
                </button>
            </div>

            <PurchaseForm
                onSubmit={handleSubmit}
                onCancel={() => navigate("/purchases")}
            />

        </div>
    );
};

export default NewPurchase;
