

export function deleteCargo(cargoId, cargoList, updateCargoTable) {
    cargoList = cargoList.filter(cargo => cargo.id !== cargoId);  // Фильтруем список
    saveCargoList(cargoList); // Сохраняем обновленный список в localStorage
    updateCargoTable(cargoList); // Обновляем таблицу с актуальными данными
}

export function changeStatus(event, cargoList, updateCargoTable) {
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

        saveCargoList(cargoList); // Сохраняем обновленный список
        updateCargoTable(cargoList); // Обновляем таблицу с актуальными данными
    }
}

export function addCargo(event, cargoList, saveCargoList, updateCargoTable) {
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

    // Убедимся, что cargoList передается корректно и является массивом
    if (Array.isArray(cargoList)) {
        cargoList.push(newCargo); // Добавляем новый груз в список
        saveCargoList(cargoList); // Сохраняем обновленный список
        document.querySelector("#addCargoForm").reset();
        updateCargoTable(cargoList); // Обновляем таблицу
    } else {
        console.error('cargoList не является массивом');
    }
}


function saveCargoList(cargoList) {
    localStorage.setItem("cargoList", JSON.stringify(cargoList)); // Сохраняем в localStorage
}
