const state = {
  loggedIn: false,
  screen: "home",
  filter: "Todas",
  points: 250,
  redeemed: new Set(),
};

const store = window.JuAvilaStore;
let deferredInstallPrompt = null;

const coupons = [
  {
    id: "selaria-10",
    type: "Descontos",
    badge: "10%",
    title: "10% de desconto em toda loja",
    desc: "Válido para compras presenciais na JuAvila Selaria.",
    expires: "30/06/2026",
  },
  {
    id: "agro-5",
    type: "Parceiros",
    badge: "5%",
    title: "5% de desconto para acompanhantes",
    desc: "Benefício para convidadas em parceiros selecionados.",
    expires: "20/06/2026",
  },
  {
    id: "brinde",
    type: "Cupons",
    badge: "Brinde",
    title: "Brinde exclusivo na Cavalagada",
    desc: "Retire seu mimo no check-in do próximo encontro.",
    expires: "10/06/2026",
  },
  {
    id: "restaurante",
    type: "Descontos",
    badge: "10%",
    title: "Restaurante Sabor do Campo",
    desc: "Desconto no almoco para participantes do clube.",
    expires: "20/06/2026",
  },
];

const partners = [
  { name: "JuAvila Selaria", kind: "Selaria", benefit: "10% em compras selecionadas", distance: "Loja oficial" },
  { name: "Restaurante Sabor do Campo", kind: "Restaurante", benefit: "10% de desconto", distance: "1,2 km" },
  { name: "Agropecuaria Campo Forte", kind: "Agro", benefit: "5% em suplementos", distance: "2,8 km" },
  { name: "Beleza & Cia", kind: "Salao", benefit: "15% em maquiagem", distance: "3,1 km" },
];

const events = [
  {
    title: "Cavalagada do Batom",
    date: "15 jun | 2026",
    desc: "Encontro oficial com rota guiada, brinde e benefícios no check-in.",
    featured: true,
  },
  {
    title: "Encontro das Patroas",
    date: "10/06/2026",
    desc: "Roda de conversa, sorteios e descontos especiais.",
  },
  {
    title: "Cavalagada Beneficente",
    date: "20/06/2026",
    desc: "Evento solidário com pontuação extra para participantes.",
  },
];

const history = [
  { label: "Compra JuAvila Selaria", value: "+40 pts" },
  { label: "Check-in Cavalagada", value: "+80 pts" },
  { label: "Cupom Beleza & Cia", value: "15% off" },
];

const app = document.querySelector("#app");
const statusBar = document.querySelector(".phone-status");
const allowedScreens = new Set(["home", "register", "wallet", "benefits", "partners", "events", "profile"]);

hydrateFromUrl();
registerServiceWorker();
wireInstallPrompt();

function icon(name) {
  const paths = {
    "award": '<circle cx="12" cy="8" r="6"/><path d="M15.5 13 17 22l-5-3-5 3 1.5-9"/>',
    "badge-check": '<path d="m9 12 2 2 4-5"/><path d="M12 2 9.5 4.5 6 4l-.5 3.5L3 10l2.5 2.5L6 16l3.5-.5L12 18l2.5-2.5L18 16l.5-3.5L21 10l-2.5-2.5L18 4l-3.5.5Z"/>',
    "bell": '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
    "calendar-days": '<path d="M8 2v4M16 2v4M3 10h18"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01M16 18h.01"/>',
    "calendar-heart": '<path d="M8 2v4M16 2v4M3 10h18"/><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M12 18s-3-1.7-3-3.7A1.8 1.8 0 0 1 12 13a1.8 1.8 0 0 1 3 1.3c0 2-3 3.7-3 3.7Z"/>',
    "gift": '<path d="M20 12v10H4V12M2 7h20v5H2zM12 22V7"/><path d="M12 7H7.5A2.5 2.5 0 1 1 12 4.5M12 7h4.5A2.5 2.5 0 1 0 12 4.5"/>',
    "heart": '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z"/>',
    "log-in": '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><path d="m10 17 5-5-5-5M15 12H3"/>',
    "log-out": '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="m16 17 5-5-5-5M21 12H9"/>',
    "map-pin": '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
    "rotate-ccw": '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    "shopping-bag": '<path d="M6 7h12l-1 14H7L6 7Z"/><path d="M9 7a3 3 0 0 1 6 0"/>',
    "smartphone": '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 18h2"/>',
    "sparkles": '<path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6Z"/><path d="M5 3v4M3 5h4M19 17v4M17 19h4"/>',
    "star": '<path d="m12 2 3 6 6.5.9-4.7 4.6 1.1 6.5-5.9-3.1L6.1 20l1.1-6.5L2.5 8.9 9 8Z"/>',
    "store": '<path d="M4 10h16l-1-6H5Z"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/><path d="M4 10a2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0 2 2 0 0 0 4 0"/>',
    "ticket-percent": '<path d="M3 9a3 3 0 0 0 0 6v3h18v-3a3 3 0 0 0 0-6V6H3Z"/><path d="m9 15 6-6M9 9h.01M15 15h.01"/>',
    "user-plus": '<path d="M15 19a6 6 0 0 0-12 0"/><circle cx="9" cy="7" r="4"/><path d="M19 8v6M16 11h6"/>',
    "user-round": '<circle cx="12" cy="8" r="5"/><path d="M20 21a8 8 0 0 0-16 0"/>',
  };
  const body = paths[name] || paths.star;
  return `<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
}

function render() {
  const darkStatus = false;
  statusBar.classList.toggle("dark", darkStatus);

  if (state.screen === "register") {
    app.innerHTML = renderRegister();
  } else if (!state.loggedIn || state.screen === "home") {
    app.innerHTML = renderWelcome();
  } else {
    app.innerHTML = `
      <section class="screen ${state.screen === "profile" ? "dark" : ""}">
        ${renderHeader()}
        <div class="screen-body">
          ${renderScreen()}
        </div>
        ${renderNav()}
        <div class="toast" id="toast"></div>
      </section>
    `;
  }

  wireEvents();
  refreshIcons();
}

function hydrateFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const screen = params.get("screen");
  if (screen && allowedScreens.has(screen) && screen !== "home") {
    state.loggedIn = true;
    state.screen = screen;
  }
}

function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./service-worker.js").catch(() => {});
    });
  }
}

function wireInstallPrompt() {
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
  });
}

function getCurrentUser() {
  return store.getCurrentUser() || {
    id: "guest",
    name: "Maria Aparecida",
    phone: "(31) 99999-0048",
    email: "maria@email.com",
    city: "Ponte Nova",
    points: state.points,
    createdAt: "2026-06-11T10:00:00.000Z",
  };
}

function getPromotions() {
  return store.load().promotions.filter((item) => item.active !== false);
}

function getPartners() {
  return store.load().partners.filter((item) => item.active !== false);
}

function getEvents() {
  return store.load().events.filter((item) => item.active !== false);
}

function addPoints(delta) {
  const user = getCurrentUser();
  const data = store.load();
  const index = data.users.findIndex((item) => item.id === user.id);
  state.points = (user.points || state.points) + delta;
  if (index >= 0) {
    data.users[index].points = state.points;
    store.save(data);
  }
}

function renderWelcome() {
  return `
    <section class="hero-screen">
      <div class="hero-content">
        <div class="mark">JuAvila<small>SELARIA</small></div>
        <h1 class="hero-title">Clube de <span>Vantagens</span></h1>
        <p class="hero-copy">Benefícios exclusivos para quem faz parte da Cavalagada do Batom.</p>
      </div>
      <div class="hero-actions">
        <button class="primary-action" type="button" data-action="login">
          ${icon("log-in")}
          Entrar
        </button>
        <button class="outline-action" type="button" data-action="create">
          ${icon("user-plus")}
          Criar conta
        </button>
      </div>
    </section>
  `;
}

function renderRegister() {
  return `
    <section class="screen">
      <div class="screen-body register-body">
        <button class="mini-action ghost" type="button" data-action="back-home">Voltar</button>
        <div class="register-card">
          <p class="section-kicker">Cadastro do clube</p>
          <h2>Crie sua carteirinha</h2>
          <p>Preencha os dados para o admin visualizar seu contato no painel.</p>
          <form class="register-form" data-register-form>
            <label>
              Nome completo
              <input name="name" required placeholder="Maria Aparecida" />
            </label>
            <label>
              Telefone / WhatsApp
              <input name="phone" required inputmode="tel" placeholder="(31) 99999-0000" />
            </label>
            <label>
              E-mail
              <input name="email" type="email" placeholder="voce@email.com" />
            </label>
            <label>
              Cidade
              <input name="city" placeholder="Ponte Nova" />
            </label>
            <button class="primary-action" type="button" data-action="register-submit">
              ${icon("badge-check")}
              Finalizar cadastro
            </button>
          </form>
        </div>
      </div>
      <div class="toast" id="toast"></div>
    </section>
  `;
}

function renderHeader() {
  if (state.screen === "profile") {
    return "";
  }

  const titles = {
    wallet: ["Minha carteirinha", "Apresente na loja e valide seus benefícios"],
    benefits: ["Vantagens", "Cupons e benefícios ativos para você"],
    partners: ["Parceiros", "Locais com descontos exclusivos"],
    events: ["Eventos", "Cavalagadas, encontros e novidades"],
  };
  const [title, subtitle] = titles[state.screen] || titles.wallet;

  return `
    <header class="app-header compact">
      <div class="title-row">
        <div>
          <p class="header-kicker">Clube Cavalagada do Batom</p>
          <h2>${title}</h2>
          <p class="meta">${subtitle}</p>
        </div>
        <button class="icon-button" type="button" data-action="notify" aria-label="Notificações">
          ${icon("bell")}
        </button>
      </div>
    </header>
  `;
}

function renderScreen() {
  const screens = {
    wallet: renderWalletDynamic,
    benefits: renderBenefitsDynamic,
    partners: renderPartnersDynamic,
    events: renderEventsDynamic,
    profile: renderProfileDynamic,
  };
  return screens[state.screen]?.() || renderWallet();
}

function renderWallet() {
  return `
    <div class="content-stack">
      <article class="wallet-card">
        <div class="wallet-logo">JuAvila</div>
        <p class="section-kicker">Clube Cavalagada do Batom</p>
        <h3>Maria Aparecida</h3>
        <p class="member-number">Membro n. 0048 | Desde 05/05/2024</p>
        <div class="qr-box" aria-label="QR Code da carteirinha">
          <div class="qr-pattern"></div>
        </div>
        <p class="wallet-note">Apresente este QR Code no caixa e aproveite suas vantagens.</p>
      </article>

      <section class="info-band">
        <div class="icon-pill gold">${icon("star")}</div>
        <div>
          <strong>${state.points} pontos disponíveis</strong>
          <p>Faltam 100 pontos para liberar um cupom especial de aniversário do clube.</p>
        </div>
      </section>

      <section class="soft-card">
        <strong>Próxima vantagem sugerida</strong>
        <p>Use seu desconto de 10% em produtos selecionados da JuAvila Selaria ate 30/06/2026.</p>
      </section>
    </div>
  `;
}

function renderBenefits() {
  const filters = ["Todas", "Descontos", "Cupons", "Parceiros"];
  const visible = state.filter === "Todas" ? coupons : coupons.filter((coupon) => coupon.type === state.filter);

  return `
    <div class="content-stack">
      <div class="tabs" role="tablist" aria-label="Filtros de vantagens">
        ${filters
          .map(
            (filter) => `
              <button class="tab-chip ${state.filter === filter ? "active" : ""}" type="button" data-filter="${filter}">
                ${filter}
              </button>
            `,
          )
          .join("")}
      </div>
      ${visible.map(renderCoupon).join("")}
    </div>
  `;
}

function renderCoupon(coupon) {
  const redeemed = state.redeemed.has(coupon.id);

  return `
    <article class="coupon-card">
      <div class="coupon-row">
        <div class="discount-badge">${coupon.badge}<span>${coupon.badge.includes("%") ? "OFF" : ""}</span></div>
        <div class="coupon-info">
          <h3>${coupon.title}</h3>
          <p>${coupon.desc}</p>
          <p class="partner-meta">${icon("calendar-days")} Válido até ${coupon.expires}</p>
        </div>
        <button class="mini-action ${redeemed ? "ghost" : ""}" type="button" data-action="redeem" data-id="${coupon.id}">
          ${redeemed ? "Usado" : "Usar"}
        </button>
      </div>
    </article>
  `;
}

function renderPartners() {
  return `
    <div class="content-stack">
      ${partners
        .map(
          (partner) => `
            <article class="partner-card">
              <div class="partner-row">
                <div class="partner-thumb">${partner.kind}</div>
                <div class="partner-info">
                  <h3>${partner.name}</h3>
                  <p>${partner.benefit}</p>
                  <span class="partner-meta">${icon("map-pin")} ${partner.distance}</span>
                </div>
                <button class="mini-action ghost" type="button" data-action="partner" data-name="${partner.name}">
                  Ver
                </button>
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderEvents() {
  const [featured, ...others] = events;

  return `
    <div class="content-stack">
      <article class="event-card featured">
        <div class="featured-content">
          <span class="event-date">${icon("calendar-heart")} ${featured.date}</span>
          <h3>${featured.title}</h3>
          <p>${featured.desc}</p>
          <button class="primary-action" type="button" data-action="join-event">
            ${icon("heart")}
            Quero participar
          </button>
        </div>
      </article>

      <h3 class="section-title">Próximos eventos</h3>
      ${others
        .map(
          (event) => `
            <article class="event-card">
              <div class="event-row">
                <div class="event-thumb">Evento</div>
                <div class="event-info">
                  <h3>${event.title}</h3>
                  <p>${event.desc}</p>
                  <span class="partner-meta">${icon("calendar-days")} ${event.date}</span>
                </div>
              </div>
            </article>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderProfile() {
  return `
    <div class="content-stack">
      <article class="profile-card profile-main">
        <div class="avatar">MA</div>
        <h3>Maria Aparecida</h3>
        <p>Participante desde 05/05/2024</p>
      </article>

      <section class="points-card">
        <div class="points-row">
          <div>
            <p class="header-kicker">Pontuação</p>
            <strong>${state.points}</strong>
          </div>
          <div class="icon-pill gold">${icon("award")}</div>
        </div>
        <div class="progress-track"><div class="progress-fill" style="--progress: 72%"></div></div>
        <p>Complete 350 pontos para desbloquear recompensas especiais.</p>
      </section>

      <article class="profile-card">
        <div class="profile-list">
          ${profileItem("user-round", "Meus dados", "Editar")}
          ${profileItem("shopping-bag", "Histórico de compras", "3 itens")}
          ${profileItem("ticket-percent", "Meus cupons", `${state.redeemed.size} usados`)}
          ${profileItem("bell", "Notificações", "Ativas")}
          ${profileItem("user-plus", "Indique uma amiga", "+50 pts")}
          ${profileItem("log-out", "Sair", "")}
        </div>
      </article>

      <article class="history-card profile-card">
        <h3 class="section-title">Últimas movimentações</h3>
        ${history
          .map(
            (item) => `
              <div class="history-row">
                <span>${icon("sparkles")} ${item.label}</span>
                <strong>${item.value}</strong>
              </div>
            `,
          )
          .join("")}
      </article>
    </div>
  `;
}

function profileItem(itemIcon, label, value) {
  return `
    <button class="profile-row" type="button" data-action="profile-item" data-label="${label}">
      <span>${icon(itemIcon)} ${label}</span>
      <strong>${value}</strong>
    </button>
  `;
}

function renderWalletDynamic() {
  const user = getCurrentUser();
  const memberNumber = String(user.id).slice(-4).toUpperCase().padStart(4, "0");
  const memberSince = new Date(user.createdAt || Date.now()).toLocaleDateString("pt-BR");

  return `
    <div class="content-stack">
      <article class="wallet-card">
        <div class="wallet-logo">JuAvila</div>
        <p class="section-kicker">Clube Cavalagada do Batom</p>
        <h3>${store.escapeHTML(user.name)}</h3>
        <p class="member-number">Membro n. ${memberNumber} | Desde ${memberSince}</p>
        <div class="qr-box" aria-label="QR Code da carteirinha">
          <div class="qr-pattern"></div>
        </div>
        <p class="wallet-note">Apresente este QR Code no caixa e aproveite suas vantagens.</p>
      </article>

      <section class="info-band">
        <div class="icon-pill gold">${icon("star")}</div>
        <div>
          <strong>${user.points || state.points} pontos disponiveis</strong>
          <p>Telefone cadastrado: ${store.escapeHTML(user.phone)}.</p>
        </div>
      </section>

      <section class="soft-card">
        <strong>Atualizado pelo painel administrativo</strong>
        <p>Promocoes, parceiros e eventos cadastrados pelo site aparecem automaticamente aqui.</p>
      </section>
    </div>
  `;
}

function renderBenefitsDynamic() {
  const filters = ["Todas", "Descontos", "Cupons", "Parceiros"];
  const promotions = getPromotions();
  const visible = state.filter === "Todas" ? promotions : promotions.filter((coupon) => coupon.type === state.filter);

  return `
    <div class="content-stack">
      <div class="tabs" role="tablist" aria-label="Filtros de vantagens">
        ${filters
          .map(
            (filter) => `
              <button class="tab-chip ${state.filter === filter ? "active" : ""}" type="button" data-filter="${filter}">
                ${filter}
              </button>
            `,
          )
          .join("")}
      </div>
      ${visible.length ? visible.map(renderCouponDynamic).join("") : renderEmptyState("Nenhuma promocao ativa nesta categoria.")}
    </div>
  `;
}

function renderCouponDynamic(coupon) {
  const redeemed = state.redeemed.has(coupon.id);

  return `
    <article class="coupon-card">
      <div class="coupon-row">
        <div class="discount-badge">${store.escapeHTML(coupon.badge)}<span>${String(coupon.badge).includes("%") ? "OFF" : ""}</span></div>
        <div class="coupon-info">
          <h3>${store.escapeHTML(coupon.title)}</h3>
          <p>${store.escapeHTML(coupon.desc)}</p>
          <p class="partner-meta">${icon("calendar-days")} Valido ate ${store.escapeHTML(coupon.expires)}</p>
        </div>
        <button class="mini-action ${redeemed ? "ghost" : ""}" type="button" data-action="redeem" data-id="${store.escapeHTML(coupon.id)}">
          ${redeemed ? "Usado" : "Usar"}
        </button>
      </div>
    </article>
  `;
}

function renderPartnersDynamic() {
  const visible = getPartners();

  return `
    <div class="content-stack">
      ${visible.length ? visible
        .map(
          (partner) => `
            <article class="partner-card">
              <div class="partner-row">
                <div class="partner-thumb">${store.escapeHTML(partner.kind || "Parceiro")}</div>
                <div class="partner-info">
                  <h3>${store.escapeHTML(partner.name)}</h3>
                  <p>${store.escapeHTML(partner.benefit)}</p>
                  <span class="partner-meta">${icon("map-pin")} ${store.escapeHTML(partner.distance || "Disponivel")}</span>
                </div>
                <button class="mini-action ghost" type="button" data-action="partner" data-name="${store.escapeHTML(partner.name)}">
                  Ver
                </button>
              </div>
            </article>
          `,
        )
        .join("") : renderEmptyState("Nenhum parceiro ativo no momento.")}
    </div>
  `;
}

function renderEventsDynamic() {
  const visible = getEvents();
  const featured = visible.find((event) => event.featured) || visible[0];
  const others = visible.filter((event) => event.id !== featured?.id);

  if (!featured) {
    return `<div class="content-stack">${renderEmptyState("Nenhum evento ativo no momento.")}</div>`;
  }

  return `
    <div class="content-stack">
      <article class="event-card featured">
        <div class="featured-content">
          <span class="event-date">${icon("calendar-heart")} ${store.escapeHTML(featured.date)}</span>
          <h3>${store.escapeHTML(featured.title)}</h3>
          <p>${store.escapeHTML(featured.desc)}</p>
          <button class="primary-action" type="button" data-action="join-event">
            ${icon("heart")}
            Quero participar
          </button>
        </div>
      </article>

      <h3 class="section-title">Proximos eventos</h3>
      ${others.length ? others
        .map(
          (event) => `
            <article class="event-card">
              <div class="event-row">
                <div class="event-thumb">Evento</div>
                <div class="event-info">
                  <h3>${store.escapeHTML(event.title)}</h3>
                  <p>${store.escapeHTML(event.desc)}</p>
                  <span class="partner-meta">${icon("calendar-days")} ${store.escapeHTML(event.date)}</span>
                </div>
              </div>
            </article>
          `,
        )
        .join("") : renderEmptyState("Sem outros eventos cadastrados.")}
    </div>
  `;
}

function renderProfileDynamic() {
  const user = getCurrentUser();

  return `
    <div class="content-stack">
      <article class="profile-card profile-main">
        <div class="avatar">${getInitials(user.name)}</div>
        <h3>${store.escapeHTML(user.name)}</h3>
        <p>${store.escapeHTML(user.phone)} | ${store.escapeHTML(user.city || "Cidade nao informada")}</p>
      </article>

      <section class="points-card">
        <div class="points-row">
          <div>
            <p class="header-kicker">Pontuacao</p>
            <strong>${user.points || state.points}</strong>
          </div>
          <div class="icon-pill gold">${icon("award")}</div>
        </div>
        <div class="progress-track"><div class="progress-fill" style="--progress: 72%"></div></div>
        <p>Complete 350 pontos para desbloquear recompensas especiais.</p>
      </section>

      <article class="profile-card">
        <div class="profile-list">
          ${profileItem("user-round", "Meus dados", store.escapeHTML(user.email || "Editar"))}
          ${profileItem("shopping-bag", "Historico de compras", "3 itens")}
          ${profileItem("ticket-percent", "Meus cupons", `${state.redeemed.size} usados`)}
          ${profileItem("bell", "Notificacoes", "Ativas")}
          ${profileItem("user-plus", "Indique uma amiga", "+50 pts")}
          ${profileItem("log-out", "Sair", "")}
        </div>
      </article>

      <article class="history-card profile-card">
        <h3 class="section-title">Ultimas movimentacoes</h3>
        ${history
          .map(
            (item) => `
              <div class="history-row">
                <span>${icon("sparkles")} ${item.label}</span>
                <strong>${item.value}</strong>
              </div>
            `,
          )
          .join("")}
      </article>
    </div>
  `;
}

function renderEmptyState(message) {
  return `
    <section class="soft-card">
      <strong>${store.escapeHTML(message)}</strong>
      <p>Use o painel administrativo para publicar novos conteudos no app.</p>
    </section>
  `;
}

function getInitials(name) {
  return String(name || "Cliente")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function renderNav() {
  const navItems = [
    ["wallet", "badge-check", "Carteira"],
    ["benefits", "gift", "Vantagens"],
    ["partners", "store", "Parceiros"],
    ["events", "calendar-heart", "Eventos"],
    ["profile", "user-round", "Perfil"],
  ];

  return `
    <nav class="bottom-nav" aria-label="Navegacao principal">
      ${navItems
        .map(
          ([screen, itemIcon, label]) => `
            <button class="nav-button ${state.screen === screen ? "active" : ""}" type="button" data-screen="${screen}">
              ${icon(itemIcon)}
              <span>${label}</span>
            </button>
          `,
        )
        .join("")}
    </nav>
  `;
}

function wireEvents() {
  document.querySelectorAll("[data-screen]").forEach((button) => {
    button.addEventListener("click", () => {
      state.screen = button.dataset.screen;
      render();
    });
  });

  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      render();
    });
  });

  document.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => handleAction(button));
  });

  document.querySelectorAll("[data-demo-action]").forEach((button) => {
    button.addEventListener("click", () => handleDemoAction(button.dataset.demoAction));
  });

  document.querySelectorAll("[data-install-app]").forEach((button) => {
    button.addEventListener("click", () => installApp());
  });
}

function handleAction(button) {
  const action = button.dataset.action;

  if (action === "create") {
    state.screen = "register";
    render();
    return;
  }

  if (action === "back-home") {
    state.screen = "home";
    render();
    return;
  }

  if (action === "register-submit") {
    const form = button.closest("[data-register-form]");
    const formData = new FormData(form);
    const name = String(formData.get("name") || "").trim();
    const phone = String(formData.get("phone") || "").trim();
    if (!name || !phone) {
      showToast("Informe nome e telefone para concluir o cadastro.");
      return;
    }
    const user = store.addUser({
      name,
      phone,
      email: String(formData.get("email") || "").trim(),
      city: String(formData.get("city") || "").trim(),
    });
    state.points = user.points;
    state.loggedIn = true;
    state.screen = "wallet";
    render();
    setTimeout(() => showToast("Cadastro salvo. O admin ja consegue ver seu telefone."), 50);
    return;
  }

  if (action === "login") {
    const user = store.getCurrentUser() || store.load().users[0];
    if (user) {
      store.setCurrentUser(user.id);
      state.points = user.points || 250;
    }
    state.loggedIn = true;
    state.screen = "wallet";
    render();
    return;
  }

  if (action === "redeem") {
    const id = button.dataset.id;
    if (!state.redeemed.has(id)) {
      state.redeemed.add(id);
      addPoints(10);
      render();
      showToast("Cupom ativado. +10 pontos adicionados na sua conta.");
    } else {
      showToast("Este cupom ja foi usado nesta demo.");
    }
    return;
  }

  if (action === "join-event") {
    addPoints(25);
    render();
    showToast("Presença reservada. Você ganhou 25 pontos de pré-check-in.");
    return;
  }

  if (action === "partner") {
    showToast(`Abrindo detalhes de ${button.dataset.name}.`);
    return;
  }

  if (action === "notify") {
    showToast("Você tem 2 novidades e 1 desconto quase expirando.");
    return;
  }

  if (action === "profile-item") {
    showToast(`${button.dataset.label} ficaria conectado ao cadastro real.`);
  }
}

async function installApp() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    deferredInstallPrompt = null;
    return;
  }
  alert("Para instalar: no Chrome/Edge do celular, abra o menu do navegador e toque em 'Adicionar a tela inicial' ou 'Instalar app'.");
}

function handleDemoAction(action) {
  if (action === "reset") {
    store.reset();
    state.loggedIn = false;
    state.screen = "home";
    state.filter = "Todas";
    state.points = 250;
    state.redeemed = new Set();
    render();
    return;
  }

  if (action === "install") {
    state.loggedIn = true;
    state.screen = "wallet";
    render();
    setTimeout(() => showToast("PWA pronta para evoluir para Android/Play Store."), 50);
  }
}

function showToast(message) {
  const toast = document.querySelector("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("show"), 2600);
}

function refreshIcons() {
  return true;
}

render();
