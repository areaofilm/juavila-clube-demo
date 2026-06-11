# Deploy no Streamlit Cloud

Repositorio:

```text
https://github.com/areaofilm/juavila-clube-demo
```

Site publico para instalar o app:

```text
https://areaofilm.github.io/juavila-clube-demo/
```

## Como publicar

1. Acesse `https://share.streamlit.io/`.
2. Clique em `New app`.
3. Escolha o repositorio `areaofilm/juavila-clube-demo`.
4. Branch: `main`.
5. Main file path: `streamlit_app.py`.
6. Antes de clicar em `Deploy`, abra `Advanced settings` e cole os Secrets abaixo.
7. Clique em `Deploy`.

## Secrets obrigatorios para producao

No painel de Secrets do Streamlit Cloud:

```toml
DATABASE_URL = "postgresql://USUARIO:SENHA@HOST.neon.tech/NOME_DO_BANCO?sslmode=require"
ADMIN_PASSWORD = "uma-senha-forte-do-admin"
```

Use a connection string da Neon. O app cria automaticamente as tabelas:

- `club_users`
- `club_promotions`
- `club_partners`
- `club_events`

Se `DATABASE_URL` nao existir, o app entra em modo SQLite local apenas para teste.

## Se aparecer erro `sqlalchemy.exc.OperationalError`

Esse erro quase sempre e conexao com a Neon. Confira:

- O Secret esta em `Manage app > Settings > Secrets`.
- O nome e exatamente `DATABASE_URL`.
- A URL esta entre aspas.
- A URL termina com `?sslmode=require`.
- Voce copiou a connection string completa da Neon.
- Se a senha tiver caracteres como `@`, `#`, `%`, `/` ou `:`, prefira copiar a string pronta diretamente do painel da Neon.

Depois de corrigir, clique em `Reboot app`.

## Arquivos que o Streamlit usa

- `streamlit_app.py`: entrada principal do Streamlit, com app, painel admin e banco.
- `requirements.txt`: dependencias Python.
- `.streamlit/config.toml`: tema e static serving.
- `.streamlit/secrets.example.toml`: modelo de secrets, sem credenciais reais.

## Observacao importante

Esta versao Streamlit e funcional com banco Neon. Para instalacao PWA real pelo celular,
use tambem uma hospedagem estatica com HTTPS, como Netlify, Vercel ou GitHub Pages,
pois o `manifest.json` e o `service-worker.js` precisam operar na raiz publica do site.
