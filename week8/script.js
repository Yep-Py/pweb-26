const initialMembers = [
  { type: "Mahasiswa", identity: "231001", name: "Andi Pratama", program: "Informatika", email: "andi@mail.com", phone: "08123456789", address: "" },
  { type: "Mahasiswa", identity: "231002", name: "Siti Aisyah", program: "Sistem Informasi", email: "siti@mail.com", phone: "08123456789", address: "" },
  { type: "Mahasiswa", identity: "231003", name: "Budi Santoso", program: "Teknik Komputer", email: "budi@mail.com", phone: "08123456789", address: "" },
  { type: "Mahasiswa", identity: "231004", name: "Nina Marlina", program: "Manajemen", email: "nina@mail.com", phone: "08123456789", address: "" },
  { type: "Mahasiswa", identity: "231005", name: "Rizky Pratama", program: "Informatika", email: "rizky@mail.com", phone: "08123456789", address: "" }
];

const memberStorageKey = "libraryreg-members";

function getMembers() {
  try {
    const storedMembers = JSON.parse(localStorage.getItem(memberStorageKey));
    return Array.isArray(storedMembers) ? storedMembers : initialMembers;
  } catch {
    return initialMembers;
  }
}

function saveMembers(members) {
  localStorage.setItem(memberStorageKey, JSON.stringify(members));
}

function renderMembers() {
  const tableBody = document.querySelector("#memberRows");
  if (!tableBody) return;

  tableBody.replaceChildren();
  getMembers().forEach((member) => {
    const row = document.createElement("tr");
    [member.type, member.identity, member.name, member.program, member.email, member.phone].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = value || "—";
      row.append(cell);
    });

    const actions = document.createElement("td");
    const actionGroup = document.createElement("div");
    actionGroup.className = "member-actions";
    const editButton = document.createElement("button");
    editButton.className = "btn edit-button";
    editButton.type = "button";
    editButton.dataset.edit = member.identity;
    editButton.textContent = "✏️";
    const deleteButton = document.createElement("button");
    deleteButton.className = "btn delete-button";
    deleteButton.type = "button";
    deleteButton.dataset.delete = member.identity;
    deleteButton.textContent = "🗑️";
    actionGroup.append(editButton, deleteButton);
    actions.append(actionGroup);
    row.append(actions);
    tableBody.append(row);
  });
}

const memberForm = document.querySelector("[data-member-form]");

if (memberForm) {
  renderMembers();

  memberForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(memberForm);
    const member = Object.fromEntries(formData.entries());
    const originalIdentity = member.originalIdentity;
    delete member.originalIdentity;
    const members = getMembers();

    if (originalIdentity) {
      const index = members.findIndex((item) => item.identity === originalIdentity);
      if (index >= 0) members[index] = member;
    } else {
      members.push(member);
    }

    saveMembers(members);
    memberForm.reset();
    memberForm.elements.originalIdentity.value = "";
    memberForm.querySelector("[data-cancel-edit]").classList.add("d-none");
    renderMembers();
  });

  memberForm.querySelector("[data-cancel-edit]").addEventListener("click", () => {
    memberForm.reset();
    memberForm.elements.originalIdentity.value = "";
    memberForm.querySelector("[data-cancel-edit]").classList.add("d-none");
  });

  document.querySelector("#memberRows").addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-edit]");
    const deleteButton = event.target.closest("[data-delete]");
    const members = getMembers();

    if (editButton) {
      const identity = editButton.dataset.edit;
      const member = members.find((item) => item.identity === identity);
      if (!member) return;
      Object.entries(member).forEach(([key, value]) => {
        if (memberForm.elements[key]) memberForm.elements[key].value = value;
      });
      memberForm.elements.originalIdentity.value = identity;
      memberForm.querySelector("[data-cancel-edit]").classList.remove("d-none");
      memberForm.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    if (deleteButton) {
      const identity = deleteButton.dataset.delete;
      const updatedMembers = members.filter((item) => item.identity !== identity);
      saveMembers(updatedMembers);
      renderMembers();
    }
  });
}

document.querySelector("[data-register-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const registration = Object.fromEntries(new FormData(event.currentTarget).entries());
  const members = getMembers();
  members.push({ ...registration, identity: registration.identity, address: registration.address });
  saveMembers(members);
  event.currentTarget.reset();
});

document.querySelector("[data-login-form]")?.addEventListener("submit", (event) => {
  event.preventDefault();
});
