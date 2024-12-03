// Добавляем обработчики событий на заголовки таблицы для сортировки
document.querySelectorAll("#cargoTable th").forEach((header, index) => {
    header.addEventListener("click", () => {
      const isNumeric = header.classList.contains("numeric");  // Для числовых столбцов добавляем класс .numeric
      sortTableByColumn(index, isNumeric);
    });
});

// Обработчики событий
document.querySelector("#addCargoForm").addEventListener("submit", addCargo);
document.querySelector("#cargoTable").addEventListener("change", (event) => {
  if (event.target.classList.contains("status-select")) {
    changeStatus(event);
  }
});
document.querySelector("#filterStatus").addEventListener("change", updateCargoTable);

// Инициализация таблицы с грузами
updateCargoTable();
