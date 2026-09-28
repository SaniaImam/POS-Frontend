import Swal from "sweetalert2";

const alertConfig = {
    customClass: {
        popup: "pos-alert",
        title: "pos-alert-title",
        htmlContainer: "pos-alert-text",
        confirmButton: "pos-alert-button",
        cancelButton: "pos-alert-cancel"
    },
    buttonsStyling: false
};

export const showSuccessAlert = (message) => {
    return Swal.fire({
        ...alertConfig,
        icon: "success",
        title: "Success",
        text: message,
        confirmButtonText: "OK"
    });
};

export const showErrorAlert = (message) => {
    return Swal.fire({
        ...alertConfig,
        icon: "error",
        title: "Something went wrong",
        text: message,
        confirmButtonText: "OK"
    });
};

export const showConfirmAlert = (message) => {
    return Swal.fire({
        ...alertConfig,
        icon: "warning",
        title: "Are you sure?",
        text: message,
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel"
    });
};
