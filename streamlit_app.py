from __future__ import annotations

import os
import base64
from datetime import datetime
from pathlib import Path
from typing import Any

import pandas as pd
import streamlit as st
from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    MetaData,
    String,
    Table,
    Text,
    create_engine,
    func,
    select,
    text,
)
from sqlalchemy.engine import Engine


ROOT = Path(__file__).parent

st.set_page_config(
    page_title="Clube Cavalagada do Batom",
    page_icon=str(ROOT / "assets" / "icon-192.png"),
    layout="wide",
    initial_sidebar_state="expanded",
)

HERO_B64 = base64.b64encode((ROOT / "assets" / "ideia-de-app.png").read_bytes()).decode("ascii")

st.markdown(
    """
    <style>
      :root {
        --ink:#1b1411; --coffee:#4a3022; --rose:#d83e72; --gold:#d9a64a;
        --paper:#fff8ef; --sand:#f5d8bd;
      }
      .stApp {
        background:
          radial-gradient(circle at 12% 8%, rgba(216,62,114,.22), transparent 26rem),
          linear-gradient(135deg, #1b1411, #3a211a 48%, #120d0b);
        color: var(--paper);
      }
      [data-testid="stSidebar"] {
        background: #17120f;
      }
      .hero {
        min-height: 340px;
        display: grid;
        align-content: end;
        padding: 34px;
        border-radius: 14px;
        background:
          linear-gradient(90deg, rgba(18,12,9,.86), rgba(18,12,9,.18)),
          url("data:image/png;base64,IMAGE_PLACEHOLDER") center / cover;
        box-shadow: 0 24px 60px rgba(0,0,0,.3);
      }
      .hero h1 {
        max-width: 720px;
        margin: 0;
        font-family: Georgia, serif;
        font-size: clamp(38px, 6vw, 76px);
        line-height: .92;
        letter-spacing: 0;
        color: var(--paper);
      }
      .hero p {
        max-width: 680px;
        color: rgba(255,248,239,.82);
        font-size: 18px;
      }
      .metric-card, .app-card, .admin-card {
        padding: 18px;
        border-radius: 10px;
        background: rgba(255,248,239,.94);
        color: var(--ink);
        border: 1px solid rgba(255,248,239,.18);
        box-shadow: 0 18px 36px rgba(0,0,0,.16);
      }
      .metric-card strong {
        display:block;
        color: var(--rose);
        font-size: 34px;
      }
      .metric-card span {
        color: var(--coffee);
        font-weight: 800;
        text-transform: uppercase;
        font-size: 12px;
        letter-spacing: .08em;
      }
      .wallet {
        padding: 24px;
        border-radius: 16px;
        background:
          linear-gradient(135deg, rgba(17,10,8,.94), rgba(57,34,25,.92)),
          url("data:image/png;base64,IMAGE_PLACEHOLDER") center / cover;
        color: var(--paper);
        min-height: 430px;
      }
      .wallet-logo {
        width: 96px; height: 96px; display: grid; place-items: center;
        border-radius: 50%; border: 2px solid var(--gold); color: var(--gold);
        background:#15110f; font-family: Georgia, serif; font-size: 22px;
      }
      .qr {
        width: 142px; height: 142px; margin: 18px auto 8px; padding: 10px;
        background:#fff; border-radius: 8px;
      }
      .qr div {
        height:100%;
        background:
          linear-gradient(90deg,#111 12px,transparent 12px 18px,#111 18px 24px,transparent 24px 36px,#111 36px 42px,transparent 42px),
          linear-gradient(#111 12px,transparent 12px 18px,#111 18px 24px,transparent 24px 36px,#111 36px 42px,transparent 42px);
        background-size:42px 42px;
      }
      .pill {
        display:inline-flex; align-items:center; justify-content:center;
        min-height:34px; padding:0 12px; border-radius:999px;
        color:#fff; background:var(--rose); font-weight:800; font-size:13px;
      }
      .soft-note { color: rgba(27,20,17,.68); }
    </style>
    """.replace("IMAGE_PLACEHOLDER", HERO_B64),
    unsafe_allow_html=True,
)


metadata = MetaData()

users = Table(
    "club_users",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("name", String(160), nullable=False),
    Column("phone", String(40), nullable=False),
    Column("email", String(180), nullable=True),
    Column("city", String(120), nullable=True),
    Column("points", Integer, nullable=False, default=250),
    Column("created_at", DateTime, nullable=False, default=datetime.utcnow),
)

promotions = Table(
    "club_promotions",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("title", String(180), nullable=False),
    Column("type", String(40), nullable=False, default="Descontos"),
    Column("badge", String(40), nullable=False),
    Column("description", Text, nullable=False),
    Column("expires", String(40), nullable=False),
    Column("active", Boolean, nullable=False, default=True),
    Column("created_at", DateTime, nullable=False, default=datetime.utcnow),
)

partners = Table(
    "club_partners",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("name", String(180), nullable=False),
    Column("kind", String(80), nullable=False),
    Column("benefit", String(220), nullable=False),
    Column("location", String(120), nullable=True),
    Column("active", Boolean, nullable=False, default=True),
    Column("created_at", DateTime, nullable=False, default=datetime.utcnow),
)

events = Table(
    "club_events",
    metadata,
    Column("id", Integer, primary_key=True, autoincrement=True),
    Column("title", String(180), nullable=False),
    Column("event_date", String(80), nullable=False),
    Column("description", Text, nullable=False),
    Column("featured", Boolean, nullable=False, default=False),
    Column("active", Boolean, nullable=False, default=True),
    Column("created_at", DateTime, nullable=False, default=datetime.utcnow),
)


def get_database_url() -> str:
    try:
        url = st.secrets.get("DATABASE_URL", "")
    except Exception:
        url = ""
    url = url or os.environ.get("DATABASE_URL", "")

    if not url:
        return f"sqlite:///{ROOT / 'juavila_local.db'}"

    if url.startswith("postgres://"):
        return url.replace("postgres://", "postgresql+psycopg2://", 1)
    if url.startswith("postgresql://"):
        return url.replace("postgresql://", "postgresql+psycopg2://", 1)
    return url


@st.cache_resource
def get_engine() -> Engine:
    database_url = get_database_url()
    return create_engine(database_url, pool_pre_ping=True)


def init_db() -> None:
    engine = get_engine()
    metadata.create_all(engine)
    seed_defaults()


def seed_defaults() -> None:
    engine = get_engine()
    with engine.begin() as conn:
        total = conn.execute(select(func.count()).select_from(promotions)).scalar_one()
        if total == 0:
            conn.execute(
                promotions.insert(),
                [
                    {
                        "title": "10% de desconto em toda loja",
                        "type": "Descontos",
                        "badge": "10%",
                        "description": "Valido para compras presenciais na JuAvila Selaria.",
                        "expires": "30/06/2026",
                        "active": True,
                    },
                    {
                        "title": "Brinde exclusivo na Cavalagada",
                        "type": "Cupons",
                        "badge": "Brinde",
                        "description": "Retire seu mimo no check-in do proximo encontro.",
                        "expires": "10/06/2026",
                        "active": True,
                    },
                ],
            )

        total = conn.execute(select(func.count()).select_from(partners)).scalar_one()
        if total == 0:
            conn.execute(
                partners.insert(),
                [
                    {
                        "name": "JuAvila Selaria",
                        "kind": "Selaria",
                        "benefit": "10% em compras selecionadas",
                        "location": "Loja oficial",
                        "active": True,
                    },
                    {
                        "name": "Restaurante Sabor do Campo",
                        "kind": "Restaurante",
                        "benefit": "10% de desconto",
                        "location": "1,2 km",
                        "active": True,
                    },
                ],
            )

        total = conn.execute(select(func.count()).select_from(events)).scalar_one()
        if total == 0:
            conn.execute(
                events.insert(),
                [
                    {
                        "title": "Cavalagada do Batom",
                        "event_date": "15 jun | 2026",
                        "description": "Encontro oficial com rota guiada, brinde e beneficios no check-in.",
                        "featured": True,
                        "active": True,
                    }
                ],
            )


def fetch_all(table: Table, active_only: bool = False) -> list[dict[str, Any]]:
    stmt = select(table).order_by(table.c.id.desc())
    if active_only and "active" in table.c:
        stmt = stmt.where(table.c.active.is_(True))
    with get_engine().begin() as conn:
        return [dict(row._mapping) for row in conn.execute(stmt)]


def fetch_user(user_id: int) -> dict[str, Any] | None:
    with get_engine().begin() as conn:
        row = conn.execute(select(users).where(users.c.id == user_id)).first()
    return dict(row._mapping) if row else None


def create_user(name: str, phone: str, email: str, city: str) -> int:
    with get_engine().begin() as conn:
        result = conn.execute(
            users.insert().values(
                name=name.strip(),
                phone=phone.strip(),
                email=email.strip() or None,
                city=city.strip() or None,
                points=250,
                created_at=datetime.utcnow(),
            )
        )
        return int(result.inserted_primary_key[0])


def update_points(user_id: int, delta: int) -> None:
    with get_engine().begin() as conn:
        conn.execute(
            users.update()
            .where(users.c.id == user_id)
            .values(points=users.c.points + delta)
        )


def upsert(table: Table, values: dict[str, Any], item_id: int | None = None) -> None:
    values = {**values, "created_at": values.get("created_at", datetime.utcnow())}
    with get_engine().begin() as conn:
        if item_id:
            values.pop("created_at", None)
            conn.execute(table.update().where(table.c.id == item_id).values(**values))
        else:
            conn.execute(table.insert().values(**values))


def delete_item(table: Table, item_id: int) -> None:
    with get_engine().begin() as conn:
        conn.execute(table.delete().where(table.c.id == item_id))


def dataframe(table: Table) -> pd.DataFrame:
    return pd.DataFrame(fetch_all(table))


def render_home() -> None:
    st.markdown(
        """
        <div class="hero">
          <p class="pill">App oficial com banco Neon</p>
          <h1>Clube Cavalagada do Batom</h1>
          <p>Cadastro, carteirinha, cupons, parceiros, eventos e painel administrativo persistindo em banco PostgreSQL.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )
    st.write("")
    col1, col2, col3 = st.columns(3)
    col1.markdown('<div class="metric-card"><strong>Neon</strong><span>PostgreSQL</span></div>', unsafe_allow_html=True)
    col2.markdown('<div class="metric-card"><strong>Admin</strong><span>Conteudo ao vivo</span></div>', unsafe_allow_html=True)
    col3.markdown('<div class="metric-card"><strong>PWA</strong><span>Sem Play Store</span></div>', unsafe_allow_html=True)


def render_register() -> None:
    st.subheader("Cadastro da participante")
    with st.form("register_form", clear_on_submit=False):
        name = st.text_input("Nome completo")
        phone = st.text_input("Telefone / WhatsApp")
        email = st.text_input("E-mail")
        city = st.text_input("Cidade")
        submitted = st.form_submit_button("Criar carteirinha", type="primary")

    if submitted:
        if not name.strip() or not phone.strip():
            st.error("Informe nome e telefone.")
            return
        user_id = create_user(name, phone, email, city)
        st.session_state.user_id = user_id
        st.success("Cadastro criado. Sua carteirinha ja esta disponivel.")
        st.rerun()


def render_wallet() -> None:
    user_id = st.session_state.get("user_id")
    if not user_id:
        st.info("Crie seu cadastro para gerar a carteirinha.")
        render_register()
        return

    user = fetch_user(int(user_id))
    if not user:
        st.warning("Cadastro nao encontrado. Crie uma nova carteirinha.")
        st.session_state.pop("user_id", None)
        return

    st.markdown(
        f"""
        <div class="wallet">
          <div class="wallet-logo">JuAvila</div>
          <p>CLUBE CAVALAGADA DO BATOM</p>
          <h2>{user['name']}</h2>
          <p>Membro n. {int(user['id']):04d} | Telefone: {user['phone']}</p>
          <div class="qr"><div></div></div>
          <p style="text-align:center">Apresente este QR Code no caixa e aproveite suas vantagens.</p>
        </div>
        """,
        unsafe_allow_html=True,
    )
    st.write("")
    st.metric("Pontuacao", user["points"])


def render_promotions() -> None:
    st.subheader("Vantagens e cupons")
    items = fetch_all(promotions, active_only=True)
    if not items:
        st.info("Nenhuma promocao ativa no momento.")
        return
    for item in items:
        with st.container(border=True):
            col1, col2 = st.columns([1, 4])
            col1.markdown(f"<div class='pill'>{item['badge']}</div>", unsafe_allow_html=True)
            col2.markdown(f"### {item['title']}")
            col2.write(item["description"])
            col2.caption(f"{item['type']} | Valido ate {item['expires']}")
            if st.session_state.get("user_id") and col2.button("Usar cupom", key=f"redeem_{item['id']}"):
                update_points(int(st.session_state.user_id), 10)
                st.success("Cupom ativado. +10 pontos.")
                st.rerun()


def render_partners() -> None:
    st.subheader("Parceiros")
    items = fetch_all(partners, active_only=True)
    if not items:
        st.info("Nenhum parceiro ativo no momento.")
        return
    for item in items:
        with st.container(border=True):
            st.markdown(f"### {item['name']}")
            st.write(item["benefit"])
            st.caption(f"{item['kind']} | {item.get('location') or 'Localizacao a definir'}")


def render_events() -> None:
    st.subheader("Eventos")
    items = fetch_all(events, active_only=True)
    if not items:
        st.info("Nenhum evento ativo no momento.")
        return
    for item in sorted(items, key=lambda row: not row["featured"]):
        with st.container(border=True):
            if item["featured"]:
                st.markdown("**Destaque principal**")
            st.markdown(f"### {item['title']}")
            st.caption(item["event_date"])
            st.write(item["description"])
            if st.session_state.get("user_id") and st.button("Quero participar", key=f"event_{item['id']}"):
                update_points(int(st.session_state.user_id), 25)
                st.success("Participacao registrada. +25 pontos.")
                st.rerun()


def require_admin() -> bool:
    try:
        expected = st.secrets.get("ADMIN_PASSWORD", "")
    except Exception:
        expected = ""
    expected = expected or os.environ.get("ADMIN_PASSWORD", "admin123")
    if st.session_state.get("admin_ok"):
        return True

    st.subheader("Acesso administrativo")
    password = st.text_input("Senha do admin", type="password")
    if st.button("Entrar", type="primary"):
        if password == expected:
            st.session_state.admin_ok = True
            st.rerun()
        st.error("Senha invalida.")
    if expected == "admin123":
        st.warning("Senha padrao em uso. Defina ADMIN_PASSWORD nos Secrets antes de publicar.")
    return False


def render_admin() -> None:
    if not require_admin():
        return

    st.title("Painel administrativo")
    user_rows = fetch_all(users)
    promotion_rows = fetch_all(promotions)
    partner_rows = fetch_all(partners)
    event_rows = fetch_all(events)

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Usuarios", len(user_rows))
    col2.metric("Promocoes", len(promotion_rows))
    col3.metric("Parceiros", len(partner_rows))
    col4.metric("Eventos", len(event_rows))

    tab_users, tab_promos, tab_partners, tab_events = st.tabs(
        ["Usuarios", "Promocoes", "Parceiros", "Eventos"]
    )

    with tab_users:
        st.dataframe(pd.DataFrame(user_rows), use_container_width=True, hide_index=True)

    with tab_promos:
        render_promotion_admin(promotion_rows)

    with tab_partners:
        render_partner_admin(partner_rows)

    with tab_events:
        render_event_admin(event_rows)


def select_existing(label: str, rows: list[dict[str, Any]]) -> dict[str, Any] | None:
    options = {"Novo": None}
    options.update({f"{row['id']} - {row.get('title') or row.get('name')}": row for row in rows})
    choice = st.selectbox(label, list(options.keys()))
    return options[choice]


def render_promotion_admin(rows: list[dict[str, Any]]) -> None:
    current = select_existing("Editar promocao existente", rows)
    with st.form("promotion_form"):
        title = st.text_input("Titulo", value=current["title"] if current else "")
        promo_type = st.selectbox(
            "Tipo",
            ["Descontos", "Cupons", "Parceiros"],
            index=["Descontos", "Cupons", "Parceiros"].index(current["type"]) if current else 0,
        )
        badge = st.text_input("Selo", value=current["badge"] if current else "")
        expires = st.text_input("Validade", value=current["expires"] if current else "")
        description = st.text_area("Descricao", value=current["description"] if current else "")
        active = st.checkbox("Ativo no app", value=current["active"] if current else True)
        submitted = st.form_submit_button("Salvar promocao", type="primary")
    if submitted:
        upsert(
            promotions,
            {
                "title": title,
                "type": promo_type,
                "badge": badge,
                "expires": expires,
                "description": description,
                "active": active,
            },
            current["id"] if current else None,
        )
        st.success("Promocao salva.")
        st.rerun()
    delete_button(promotions, current, "promotion")
    st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)


def render_partner_admin(rows: list[dict[str, Any]]) -> None:
    current = select_existing("Editar parceiro existente", rows)
    with st.form("partner_form"):
        name = st.text_input("Nome", value=current["name"] if current else "")
        kind = st.text_input("Categoria", value=current["kind"] if current else "")
        benefit = st.text_input("Beneficio", value=current["benefit"] if current else "")
        location = st.text_input("Localizacao", value=current["location"] if current else "")
        active = st.checkbox("Ativo no app", value=current["active"] if current else True)
        submitted = st.form_submit_button("Salvar parceiro", type="primary")
    if submitted:
        upsert(
            partners,
            {"name": name, "kind": kind, "benefit": benefit, "location": location, "active": active},
            current["id"] if current else None,
        )
        st.success("Parceiro salvo.")
        st.rerun()
    delete_button(partners, current, "partner")
    st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)


def render_event_admin(rows: list[dict[str, Any]]) -> None:
    current = select_existing("Editar evento existente", rows)
    with st.form("event_form"):
        title = st.text_input("Titulo", value=current["title"] if current else "")
        event_date = st.text_input("Data", value=current["event_date"] if current else "")
        description = st.text_area("Descricao", value=current["description"] if current else "")
        featured = st.checkbox("Destaque principal", value=current["featured"] if current else False)
        active = st.checkbox("Ativo no app", value=current["active"] if current else True)
        submitted = st.form_submit_button("Salvar evento", type="primary")
    if submitted:
        upsert(
            events,
            {
                "title": title,
                "event_date": event_date,
                "description": description,
                "featured": featured,
                "active": active,
            },
            current["id"] if current else None,
        )
        st.success("Evento salvo.")
        st.rerun()
    delete_button(events, current, "event")
    st.dataframe(pd.DataFrame(rows), use_container_width=True, hide_index=True)


def delete_button(table: Table, current: dict[str, Any] | None, key_prefix: str) -> None:
    if current and st.button("Excluir item selecionado", type="secondary", key=f"delete_{key_prefix}_{current['id']}"):
        delete_item(table, int(current["id"]))
        st.success("Item excluido.")
        st.rerun()


def main() -> None:
    init_db()

    st.sidebar.image(str(ROOT / "assets" / "icon-192.png"), width=90)
    st.sidebar.title("JuAvila Clube")
    page = st.sidebar.radio(
        "Navegacao",
        ["Inicio", "Cadastro", "Carteirinha", "Vantagens", "Parceiros", "Eventos", "Admin"],
    )

    if "postgresql" in get_database_url():
        st.sidebar.success("Conectado ao Neon/PostgreSQL")
    else:
        st.sidebar.warning("Modo local SQLite. Configure DATABASE_URL para usar Neon.")

    if page == "Inicio":
        render_home()
    elif page == "Cadastro":
        render_register()
    elif page == "Carteirinha":
        render_wallet()
    elif page == "Vantagens":
        render_promotions()
    elif page == "Parceiros":
        render_partners()
    elif page == "Eventos":
        render_events()
    else:
        render_admin()


if __name__ == "__main__":
    main()
