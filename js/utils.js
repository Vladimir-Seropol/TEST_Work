// utils.js
export function showErrorMessage(message) {
    const errorMessageElement = document.querySelector("#errorMessage");
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = "block";

    setTimeout(() => {
        errorMessageElement.style.display = "none";
    }, 5000);
}

export function getStatusClass(status) {
    switch (status) {
        case "Ожидает отправки":
            return "bg-warning";
        case "В пути":
            return "bg-primary"; 
        case "Доставлен":
            return "bg-success"; 
        default:
            return "";
    }
}
