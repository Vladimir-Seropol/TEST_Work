let currentSortColumn = null;
let currentSortDirection = 'asc'; 


// Функция для обновления отображения таблицы
function updateCargoTable() {
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

   
    document.querySelectorAll(".delete-btn").forEach(button => {
        button.addEventListener("click", (event) => {
            const cargoId = event.target.getAttribute("data-id");
            deleteCargo(cargoId);
        });
    });

   
    updateSortArrows();
}

// Функция для сортировки таблицы по выбранному столбцу
function sortTableByColumn(index, isNumeric) {
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



// Функция для удаления груза
function deleteCargo(cargoId) {
    cargoList = cargoList.filter(cargo => cargo.id !== cargoId);
    saveCargoList();
    updateCargoTable();  
}

// Функция для обновления стрелок сортировки в заголовках
function updateSortArrows() {
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


// Функция для изменения статуса груза
function changeStatus(event) {
    const cargoId = event.target.getAttribute("data-id");
    const newStatus = event.target.value;

    const cargo = cargoList.find(item => item.id === cargoId);
    if (cargo) {
        if (newStatus === "Доставлен" && new Date(cargo.departureDate) > new Date()) {
            showErrorMessage("Невозможно изменить статус на 'Доставлен', если дата отправления в будущем.");
            return;
        }

        cargo.status = newStatus;

        // Если статус меняется на "Доставлен", сохраняем текущую дату как дату доставки
        if (newStatus === "Доставлен") {
            cargo.deliveryDate = new Date().toISOString().split("T")[0]; 
        }

        updateCargoTable();
    }
}

// Функция для добавления нового груза
function addCargo(event) {
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
    saveCargoList();
    document.querySelector("#addCargoForm").reset();
    updateCargoTable();
}

function saveCargoList() {
    localStorage.setItem("cargoList", JSON.stringify(cargoList));
}

// Функция для отображения ошибок
function showErrorMessage(message) {
    const errorMessageElement = document.querySelector("#errorMessage");
    errorMessageElement.textContent = message;
    errorMessageElement.style.display = "block";

    setTimeout(() => {
        errorMessageElement.style.display = "none";
    }, 5000);
}

// Функция для получения CSS класса по статусу
function getStatusClass(status) {
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

// Функция для обработки кликов по заголовкам таблицы для сортировки
document.querySelectorAll("#cargoTable th").forEach((header, index) => {
    header.addEventListener("click", () => {
        const isNumeric = header.classList.contains("numeric"); 
        
      
        if (currentSortColumn === index) {
            currentSortDirection = (currentSortDirection === 'asc') ? 'desc' : 'asc';
        } else {
            currentSortColumn = index; 
            currentSortDirection = 'asc';  
        }
        
        sortTableByColumn(index, isNumeric);
        updateSortArrows(index);  
    });
});
updateCargoTable();

// Инициализация таблицы при загрузке страницы
document.addEventListener("DOMContentLoaded", updateCargoTable);
