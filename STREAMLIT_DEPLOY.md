# Deploy no Streamlit Cloud

Repositorio:

```text
https://github.com/areaofilm/juavila-clube-demo
```

## Como publicar

1. Acesse `https://share.streamlit.io/`.
2. Clique em `New app`.
3. Escolha o repositorio `areaofilm/juavila-clube-demo`.
4. Branch: `main`.
5. Main file path: `streamlit_app.py`.
6. Clique em `Deploy`.

## Arquivos que o Streamlit usa

- `streamlit_app.py`: entrada principal do Streamlit.
- `requirements.txt`: dependencias Python.
- `.streamlit/config.toml`: tema e static serving.
- `index.html`, `admin.html`, `styles.css`, `app.js`, `admin.js`, `data.js`: app e painel embutidos no Streamlit.

## Observacao importante

No Streamlit, o app funciona como demo/vitrine dentro de um componente HTML.
Para instalacao PWA real pelo celular, use uma hospedagem estatica com HTTPS, como Netlify, Vercel ou GitHub Pages, pois o `manifest.json` e o `service-worker.js` precisam operar na raiz publica do site.
