import { getStatusClass } from './utils.js';
import { deleteCargo } from './main.js';  

export let currentSortColumn = null;
export let currentSortDirection = 'asc';

// Функция для обновления отображения таблицы
export function updateCargoTable(cargoList) {
    const filterStatus = document.querySelector("#filterStatus").value;
    const tableBody = document.querySelector("#cargoTable tbody");
    tableBody.innerHTML = "";

    const sortedCargoList = [...cargoList].sort((a, b) => {
        let compareA = a[currentSortColumn];
        let compareB = b[currentSortColumn];

        if (currentSortColumn === 'departureDate' || currentSortColumn === 'deliveryDate') {
            compareA = new Date(compareA);
            compareB = new Date(compareB);
        }

        if (compareA < compareB) return currentSortDirection === 'asc' ? -1 : 1;
        if (compareA > compareB) return currentSortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    sortedCargoList.forEach(cargo => {
        if (filterStatus && cargo.status !== filterStatus) return;

        const row = document.createElement("tr");

        row.innerHTML = ` 
            <td>${cargo.id}</td>
            <td>${cargo.name}</td>
            <td><span class="badge ${getStatusClass(cargo.status)}">${cargo.status}</span></td>
            <td>${cargo.origin}</td>
            <td>${cargo.destination}</td>
            <td>
              ${cargo.status === "Доставлен" 
                ? `Отправление: ${cargo.departureDate} <br> Доставка: ${cargo.deliveryDate}`
                : `Отправление: ${cargo.departureDate}`}
            </td>
            <td>
              <select class="form-select status-select" data-id="${cargo.id}">
                <option value="Ожидает отправки" ${cargo.status === "Ожидает отправки" ? "selected" : ""}>Ожидает отправки</option>
                <option value="В пути" ${cargo.status === "В пути" ? "selected" : ""}>В пути</option>
                <option value="Доставлен" ${cargo.status === "Доставлен" ? "selected" : ""}>Доставлен</option>
              </select>
              <button class="delete-btn" data-id="${cargo.id}">Удалить</button>
            </td>
        `;

        tableBody.appendChild(row);
    });

    // Добавляем обработчик событий на кнопки удаления
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const cargoId = event.target.getAttribute("data-id");
            deleteCargo(cargoId);  
        });
    });

    updateSortArrows();
}

// Функция для сортировки таблицы по выбранному столбцу
export function sortTableByColumn(index, isNumeric) {
    
    if (currentSortColumn === index) {
        
        currentSortDirection = currentSortDirection === 'asc' ? 'desc' : 'asc';
    } else {
        
        currentSortColumn = index;
        currentSortDirection = 'asc';
    }

    const table = document.querySelector("#cargoTable");
    const rows = Array.from(table.querySelectorAll("tbody tr"));

    rows.sort((rowA, rowB) => {
        const cellA = rowA.cells[index].textContent.trim();
        const cellB = rowB.cells[index].textContent.trim();

        if (isNumeric) {
            const numA = parseFloat(cellA.replace(/[^\d.-]/g, '')); 
            const numB = parseFloat(cellB.replace(/[^\d.-]/g, ''));
            return currentSortDirection === 'asc' ? numA - numB : numB - numA;  
        } else {
            return currentSortDirection === 'asc' ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
        }
    });

    rows.forEach(row => table.querySelector("tbody").appendChild(row));
}

// Функция для обновления стрелок сортировки в заголовках
export function updateSortArrows() {
    const headers = document.querySelectorAll("#cargoTable th");
    headers.forEach((header, index) => {
        const arrow = header.querySelector(".sort-arrow");

        if (!arrow) return;

        arrow.classList.remove('sorted-asc', 'sorted-desc');

        if (index === currentSortColumn) {
            arrow.classList.add(currentSortDirection === 'asc' ? 'sorted-asc' : 'sorted-desc');
        }
    });
}
