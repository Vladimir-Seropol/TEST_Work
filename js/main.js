import { updateCargoTable } from './cargoTable.js'; 
import { showErrorMessage } from './utils.js';
import { sortTableByColumn, updateSortArrows } from './cargoTable.js';

// Загружаем cargoList из localStorage, если данные существуют
export let cargoList = JSON.parse(localStorage.getItem("cargoList")) || [];

// Функция для удаления груза
export function deleteCargo(cargoId) {
    cargoList = cargoList.filter(cargo => cargo.id !== cargoId);  
    saveCargoList(cargoList); 
    updateCargoTable(cargoList); 
}

// Функция для изменения статуса груза
export function changeStatus(event) {
    const cargoId = event.target.getAttribute("data-id");
    const newStatus = event.target.value;

    const cargo = cargoList.find(item => item.id === cargoId);
    if (cargo) {
        if (newStatus === "Доставлен" && new Date(cargo.departureDate) > new Date()) {
            showErrorMessage("Невозможно изменить статус на 'Доставлен', если дата отправления в будущем.");
            return;
        }

        cargo.status = newStatus;

        
        if (newStatus === "Доставлен") {
            cargo.deliveryDate = new Date().toISOString().split("T")[0];
        }

        saveCargoList(cargoList); 
        updateCargoTable(cargoList); 
    }
}

// Функция для добавления нового груза
export function addCargo(event) {
    event.preventDefault();

    const name = document.querySelector("#name").value;
    const origin = document.querySelector("#origin").value;
    const destination = document.querySelector("#destination").value;
    const departureDate = document.querySelector("#departureDate").value;

    if (!name || !origin || !destination || !departureDate) {
        showErrorMessage("Пожалуйста, заполните все поля.");
        return;
    }

    const status = "Ожидает отправки";
    const currentDate = new Date().toISOString().split("T")[0];
    const randomOrderNumber = Math.floor(Math.random() * 900) + 100;
    const id = `${randomOrderNumber}-${currentDate}`;

    const newCargo = { id, name, status, origin, destination, departureDate };

    cargoList.push(newCargo); 
    saveCargoList(cargoList); 
    document.querySelector("#addCargoForm").reset();
    updateCargoTable(cargoList); 
}

// Функция для сохранения cargoList в localStorage
function saveCargoList(cargoList) {
    localStorage.setItem("cargoList", JSON.stringify(cargoList)); 
}

// Инициализация событий на странице
document.addEventListener("DOMContentLoaded", () => {
    updateCargoTable(cargoList); 

    // Добавляем обработчики событий на заголовки таблицы для сортировки
    document.querySelectorAll("#cargoTable th").forEach((header, index) => {
        header.addEventListener("click", () => {
            const isNumeric = header.classList.contains("numeric");  
            sortTableByColumn(index, isNumeric, cargoList);  
            updateSortArrows();
        });
    });

    // Обработчики событий
    document.querySelector("#addCargoForm").addEventListener("submit", (event) => {
        addCargo(event); 
    });

    document.querySelector("#cargoTable").addEventListener("change", (event) => {
        if (event.target.classList.contains("status-select")) {
            changeStatus(event); 
        }
    });

    document.querySelector("#filterStatus").addEventListener("change", () => {
        updateCargoTable(cargoList);  
    });

    // Инициализация таблицы с грузами
    updateCargoTable(cargoList);  
});
