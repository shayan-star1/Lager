const equipmentListEl = document.getElementById("equipmentList");
const equipmentNameInput = document.getElementById("equipmentName");
const searchInput = document.getElementById("search");
const totalCountEl = document.getElementById("totalCount");
const availableCountEl = document.getElementById("availableCount");
const rentedCountEl = document.getElementById("rentedCount");
const messageBox = document.getElementById("messageBox");

let equipmentData = JSON.parse(localStorage.getItem("equipmentData")) || [];

function showMessage(message, type = "success") {
  messageBox.textContent = message;
  messageBox.className = `message ${type}`;
  messageBox.style.display = "block";
  setTimeout(() => (messageBox.style.display = "none"), 3000);
}

function renderStats() {
  const total = equipmentData.length;
  const available = equipmentData.filter((item) => item.status === "tilgjengelig").length;
  const rented = total - available;

  totalCountEl.textContent = total;
  availableCountEl.textContent = available;
  rentedCountEl.textContent = rented;
}

function renderEquipmentList(filter = "") {
  equipmentListEl.innerHTML = "";

  const filteredData = equipmentData.filter((item) =>
    item.name.toLowerCase().includes(filter.toLowerCase())
  );

  filteredData.forEach((item, index) => {
    const listItem = document.createElement("li");
    listItem.className = "equipment-card";

    const imageUrl = item.image || "defaultImage.jpg"; 

    listItem.innerHTML = `
      <img style="width: 100px; height: 100px" src="${imageUrl}" alt="Equipment Image">
      <span>${item.name} (${item.status})</span>
      <div class="equipment-actions">
        <button class="btn btn-status ${item.status === "utleid" ? "utleid" : ""} ${item.status === "utilgjengelig" ? "utilgjengelig" : ""}" onclick="toggleStatus(${index})">
          ${item.status === "tilgjengelig" ? "Marker som Utleid" : "Marker som Tilgjengelig"}
        </button>
        <button class="btn btn-delete" onclick="deleteEquipment(${index})">Slett</button>
      </div>
    `;

    equipmentListEl.appendChild(listItem);
  });

  renderStats();
}

function addEquipment() {
  const name = equipmentNameInput.value.trim();

  if (!name) {
    showMessage("Vennligst skriv inn et gyldig navn!", "error");
    return;
  }

  if (equipmentData.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
    showMessage("Utstyret eksisterer allerede!", "error");
    return;
  }

  const selectedFile = document.getElementById("fileType").files[0];

  let imageUrl = "defaultImage.jpg"; 

  if (selectedFile) {
    imageUrl = URL.createObjectURL(selectedFile); 
  }

  equipmentData.push({ name, status: "tilgjengelig", image: imageUrl });
  saveToLocalStorage();
  renderEquipmentList();
  showMessage("Utstyr lagt til!");
  equipmentNameInput.value = "";
  document.getElementById("fileType").value = ""; 
}

function toggleStatus(index) {
  equipmentData[index].status =
    equipmentData[index].status === "tilgjengelig" ? "utleid" : "tilgjengelig";
  saveToLocalStorage();
  renderEquipmentList();
//   showMessage("Status oppdatert!");
}

function deleteEquipment(index) {
  equipmentData.splice(index, 1);
  saveToLocalStorage();
  renderEquipmentList();
  showMessage("Utstyr slettet!");
}

function saveToLocalStorage() {
  localStorage.setItem("equipmentData", JSON.stringify(equipmentData));
}

// Event listeners
document.getElementById("addButton").addEventListener("click", addEquipment);
searchInput.addEventListener("input", (e) => renderEquipmentList(e.target.value));

// Initial rendering
renderEquipmentList();