from __future__ import annotations

import base64
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components


ROOT = Path(__file__).parent


st.set_page_config(
    page_title="JuAvila Clube",
    page_icon="assets/icon-192.png",
    layout="wide",
    initial_sidebar_state="collapsed",
)


def read_text(path: str) -> str:
    return (ROOT / path).read_text(encoding="utf-8")


def data_uri(path: str) -> str:
    file_path = ROOT / path
    mime = "image/png"
    encoded = base64.b64encode(file_path.read_bytes()).decode("ascii")
    return f"data:{mime};base64,{encoded}"


def body_from_html(html: str) -> str:
    start = html.find("<body>")
    end = html.rfind("</body>")
    if start == -1 or end == -1:
        return html
    return html[start + len("<body>") : end]


def build_document(page: str) -> str:
    css = read_text("styles.css")
    data_js = read_text("data.js")
    app_js = read_text("app.js") if page == "app" else ""
    admin_js = read_text("admin.js") if page == "admin" else ""
    html_file = "index.html" if page == "app" else "admin.html"
    body = body_from_html(read_text(html_file))

    image = data_uri("assets/ideia-de-app.png")
    icon = data_uri("assets/icon-192.png")
    body = body.replace("./assets/ideia-de-app.png", image)
    body = body.replace("./admin.html", "#admin")
    body = body.replace("./index.html", "#app")
    body = body.replace("./privacy.html", "#privacy")
    body = body.replace("./terms.html", "#terms")
    body = body.replace("./store/release-checklist.md", "#download")

    scripts = f"<script>{data_js}</script>"
    if page == "app":
        scripts += f"<script>{app_js}</script>"
    else:
        scripts += f"<script>{admin_js}</script>"

    return f"""
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="{icon}" />
    <style>{css}</style>
  </head>
  <body>
    {body}
    {scripts}
  </body>
</html>
"""


st.sidebar.title("JuAvila Clube")
view = st.sidebar.radio("Tela", ["Site e app", "Painel administrativo"], label_visibility="collapsed")

if view == "Site e app":
    st.caption("Demo web para instalação sem Play Store. No Streamlit, o botão de instalar funciona como orientação; para PWA real use hospedagem estática com HTTPS.")
    components.html(build_document("app"), height=980, scrolling=True)
else:
    st.caption("Painel administrativo do demo. Em produção, os dados precisam ir para um banco online com login de administrador.")
    components.html(build_document("admin"), height=1120, scrolling=True)
