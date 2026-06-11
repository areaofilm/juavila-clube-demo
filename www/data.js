(function () {
  const STORAGE_KEY = "juavilaClubeDataV2";
  const SESSION_KEY = "juavilaCurrentUserId";

  const defaultData = {
    users: [
      {
        id: "user-maria",
        name: "Maria Aparecida",
        phone: "(31) 99999-0048",
        email: "maria@email.com",
        city: "Ponte Nova",
        points: 250,
        createdAt: "2026-06-11T10:00:00.000Z",
      },
    ],
    promotions: [
      {
        id: "selaria-10",
        type: "Descontos",
        badge: "10%",
        title: "10% de desconto em toda loja",
        desc: "Valido para compras presenciais na JuAvila Selaria.",
        expires: "30/06/2026",
        active: true,
      },
      {
        id: "agro-5",
        type: "Parceiros",
        badge: "5%",
        title: "5% de desconto para acompanhantes",
        desc: "Beneficio para convidadas em parceiros selecionados.",
        expires: "20/06/2026",
        active: true,
      },
      {
        id: "brinde",
        type: "Cupons",
        badge: "Brinde",
        title: "Brinde exclusivo na Cavalagada",
        desc: "Retire seu mimo no check-in do proximo encontro.",
        expires: "10/06/2026",
        active: true,
      },
    ],
    partners: [
      {
        id: "juavila-selaria",
        name: "JuAvila Selaria",
        kind: "Selaria",
        benefit: "10% em compras selecionadas",
        distance: "Loja oficial",
        active: true,
      },
      {
        id: "sabor-campo",
        name: "Restaurante Sabor do Campo",
        kind: "Restaurante",
        benefit: "10% de desconto",
        distance: "1,2 km",
        active: true,
      },
      {
        id: "campo-forte",
        name: "Agropecuaria Campo Forte",
        kind: "Agro",
        benefit: "5% em suplementos",
        distance: "2,8 km",
        active: true,
      },
    ],
    events: [
      {
        id: "cavalagada-batom",
        title: "Cavalagada do Batom",
        date: "15 jun | 2026",
        desc: "Encontro oficial com rota guiada, brinde e beneficios no check-in.",
        featured: true,
        active: true,
      },
      {
        id: "encontro-patroas",
        title: "Encontro das Patroas",
        date: "10/06/2026",
        desc: "Roda de conversa, sorteios e descontos especiais.",
        featured: false,
        active: true,
      },
      {
        id: "cavalagada-beneficente",
        title: "Cavalagada Beneficente",
        date: "20/06/2026",
        desc: "Evento solidario com pontuacao extra para participantes.",
        featured: false,
        active: true,
      },
    ],
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function load() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      save(defaultData);
      return clone(defaultData);
    }

    try {
      const parsed = JSON.parse(saved);
      return {
        users: parsed.users || [],
        promotions: parsed.promotions || [],
        partners: parsed.partners || [],
        events: parsed.events || [],
      };
    } catch {
      save(defaultData);
      return clone(defaultData);
    }
  }

  function save(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return clone(data);
  }

  function uid(prefix) {
    return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function addUser(input) {
    const data = load();
    const user = {
      id: uid("user"),
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email.trim(),
      city: input.city.trim(),
      points: 250,
      createdAt: new Date().toISOString(),
    };
    data.users.unshift(user);
    save(data);
    localStorage.setItem(SESSION_KEY, user.id);
    return user;
  }

  function setCurrentUser(id) {
    localStorage.setItem(SESSION_KEY, id);
  }

  function getCurrentUser() {
    const data = load();
    const id = localStorage.getItem(SESSION_KEY);
    return data.users.find((user) => user.id === id) || data.users[0] || null;
  }

  function upsert(collection, item) {
    const data = load();
    const list = data[collection] || [];
    const normalized = { ...item, active: item.active !== false };

    if (normalized.id) {
      const index = list.findIndex((current) => current.id === normalized.id);
      if (index >= 0) {
        list[index] = { ...list[index], ...normalized };
      } else {
        list.unshift(normalized);
      }
    } else {
      list.unshift({ ...normalized, id: uid(collection) });
    }

    data[collection] = list;
    return save(data);
  }

  function remove(collection, id) {
    const data = load();
    data[collection] = (data[collection] || []).filter((item) => item.id !== id);
    return save(data);
  }

  function reset() {
    localStorage.removeItem(SESSION_KEY);
    return save(defaultData);
  }

  function escapeHTML(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  window.JuAvilaStore = {
    addUser,
    clone,
    defaultData: clone(defaultData),
    escapeHTML,
    getCurrentUser,
    load,
    remove,
    reset,
    save,
    setCurrentUser,
    upsert,
  };
})();
