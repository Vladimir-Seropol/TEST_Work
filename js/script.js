
const cargoList = [];
  // Функция для обновления отображения таблицы
  function updateCargoTable() {
    const filterStatus = document.querySelector("#filterStatus").value;
    const tableBody = document.querySelector("#cargoTable tbody");
    tableBody.innerHTML = ""; 
  
    cargoList.forEach(cargo => {
      if (filterStatus && cargo.status !== filterStatus) return;
  
      const row = document.createElement("tr");
  
      row.innerHTML = `
        <td>${cargo.id}</td>
        <td>${cargo.name}</td>
        <td><span class="badge ${getStatusClass(cargo.status)}">${cargo.status}</span></td>
        <td>${cargo.origin}</td>
        <td>${cargo.destination}</td>
        <td>${cargo.departureDate}</td>
        <td>
          <select class="form-select status-select" data-id="${cargo.id}">
            <option value="Ожидает отправки" ${cargo.status === "Ожидает отправки" ? "selected" : ""}>Ожидает отправки</option>
            <option value="В пути" ${cargo.status === "В пути" ? "selected" : ""}>В пути</option>
            <option value="Доставлен" ${cargo.status === "Доставлен" ? "selected" : ""}>Доставлен</option>
          </select>
        </td>
      `;
      
      tableBody.appendChild(row);
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
    
    const id = "CARGO" + String(cargoList.length + 1).padStart(3, '0');
    const newCargo = { id, name, status, origin, destination, departureDate };
    
    cargoList.push(newCargo);
    document.querySelector("#addCargoForm").reset(); 
    updateCargoTable(); 
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
  
  // Обработчики событий
  document.querySelector("#addCargoForm").addEventListener("submit", addCargo);
  document.querySelector("#cargoTable").addEventListener("change", (event) => {
    if (event.target.classList.contains("status-select")) {
      changeStatus(event);
    }
  });
  document.querySelector("#filterStatus").addEventListener("change", updateCargoTable);
  
 
  updateCargoTable();
  