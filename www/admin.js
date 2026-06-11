const adminStore = window.JuAvilaStore;

const collections = {
  promotion: {
    key: "promotions",
    listId: "promotions-list",
    title: (item) => item.title,
    subtitle: (item) => `${item.badge} | ${item.type} | Valido ate ${item.expires}`,
  },
  partner: {
    key: "partners",
    listId: "partners-list",
    title: (item) => item.name,
    subtitle: (item) => `${item.kind} | ${item.benefit}`,
  },
  event: {
    key: "events",
    listId: "events-list",
    title: (item) => item.title,
    subtitle: (item) => `${item.date}${item.featured ? " | Destaque" : ""}`,
  },
};

function renderAdmin() {
  const data = adminStore.load();
  renderStats(data);
  renderUsers(data.users);
  renderCollection("promotion", data.promotions);
  renderCollection("partner", data.partners);
  renderCollection("event", data.events);
}

function renderStats(data) {
  document.querySelector("#stat-users").textContent = data.users.length;
  document.querySelector("#stat-promotions").textContent = data.promotions.length;
  document.querySelector("#stat-partners").textContent = data.partners.length;
  document.querySelector("#stat-events").textContent = data.events.length;
}

function renderUsers(users) {
  const tbody = document.querySelector("#users-table");
  tbody.innerHTML = users
    .map(
      (user) => `
        <tr>
          <td>${adminStore.escapeHTML(user.name)}</td>
          <td><strong>${adminStore.escapeHTML(user.phone)}</strong></td>
          <td>${adminStore.escapeHTML(user.email || "-")}</td>
          <td>${adminStore.escapeHTML(user.city || "-")}</td>
          <td>${adminStore.escapeHTML(user.points || 0)}</td>
          <td>${formatDate(user.createdAt)}</td>
        </tr>
      `,
    )
    .join("");
}

function renderCollection(type, items) {
  const config = collections[type];
  const list = document.querySelector(`#${config.listId}`);
  list.innerHTML = items
    .map(
      (item) => `
        <article class="admin-list-item ${item.active === false ? "inactive" : ""}">
          <div>
            <strong>${adminStore.escapeHTML(config.title(item))}</strong>
            <span>${adminStore.escapeHTML(config.subtitle(item))}</span>
          </div>
          <div class="admin-item-actions">
            <button type="button" class="mini-action ghost" data-edit="${type}" data-id="${adminStore.escapeHTML(item.id)}">Editar</button>
            <button type="button" class="mini-action ghost" data-toggle="${type}" data-id="${adminStore.escapeHTML(item.id)}">
              ${item.active === false ? "Ativar" : "Ocultar"}
            </button>
            <button type="button" class="mini-action danger" data-delete="${type}" data-id="${adminStore.escapeHTML(item.id)}">Excluir</button>
          </div>
        </article>
      `,
    )
    .join("");
}

function readForm(type, form) {
  const formData = new FormData(form);
  const base = {
    id: String(formData.get("id") || ""),
    active: formData.get("active") === "on",
  };

  if (type === "promotion") {
    return {
      ...base,
      title: String(formData.get("title") || "").trim(),
      type: String(formData.get("type") || "Descontos"),
      badge: String(formData.get("badge") || "").trim(),
      expires: String(formData.get("expires") || "").trim(),
      desc: String(formData.get("desc") || "").trim(),
    };
  }

  if (type === "partner") {
    return {
      ...base,
      name: String(formData.get("name") || "").trim(),
      kind: String(formData.get("kind") || "").trim(),
      benefit: String(formData.get("benefit") || "").trim(),
      distance: String(formData.get("distance") || "").trim(),
    };
  }

  return {
    ...base,
    title: String(formData.get("title") || "").trim(),
    date: String(formData.get("date") || "").trim(),
    desc: String(formData.get("desc") || "").trim(),
    featured: formData.get("featured") === "on",
  };
}

function fillForm(type, item) {
  const form = document.querySelector(`[data-form="${type}"]`);
  Object.entries(item).forEach(([key, value]) => {
    const field = form.elements[key];
    if (!field) return;
    if (field.type === "checkbox") {
      field.checked = Boolean(value);
    } else {
      field.value = value ?? "";
    }
  });
  form.scrollIntoView({ behavior: "smooth", block: "center" });
}

function clearForm(type) {
  const form = document.querySelector(`[data-form="${type}"]`);
  form.reset();
  form.elements.id.value = "";
  if (form.elements.active) {
    form.elements.active.checked = true;
  }
}

function toggleItem(type, id) {
  const config = collections[type];
  const data = adminStore.load();
  const item = data[config.key].find((current) => current.id === id);
  if (!item) return;
  item.active = item.active === false;
  adminStore.save(data);
  renderAdmin();
}

function editItem(type, id) {
  const config = collections[type];
  const item = adminStore.load()[config.key].find((current) => current.id === id);
  if (item) fillForm(type, item);
}

function deleteItem(type, id) {
  const config = collections[type];
  const ok = confirm("Excluir este item do app?");
  if (!ok) return;
  adminStore.remove(config.key, id);
  renderAdmin();
}

function exportData() {
  const data = JSON.stringify(adminStore.load(), null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `juavila-clube-dados-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

function formatDate(value) {
  if (!value) return "-";
  return new Date(value).toLocaleDateString("pt-BR");
}

function wireAdmin() {
  document.querySelectorAll("[data-form]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const type = form.dataset.form;
      const config = collections[type];
      adminStore.upsert(config.key, readForm(type, form));
      clearForm(type);
      renderAdmin();
    });
  });

  document.addEventListener("click", (event) => {
    const target = event.target.closest("button");
    if (!target) return;

    if (target.dataset.edit) {
      editItem(target.dataset.edit, target.dataset.id);
    }
    if (target.dataset.toggle) {
      toggleItem(target.dataset.toggle, target.dataset.id);
    }
    if (target.dataset.delete) {
      deleteItem(target.dataset.delete, target.dataset.id);
    }
    if (target.dataset.clearForm) {
      clearForm(target.dataset.clearForm);
    }
    if (target.dataset.adminAction === "export") {
      exportData();
    }
    if (target.dataset.adminAction === "reset") {
      if (confirm("Reiniciar usuarios, promocoes, parceiros e eventos do demo?")) {
        adminStore.reset();
        renderAdmin();
      }
    }
  });
}

wireAdmin();
renderAdmin();
