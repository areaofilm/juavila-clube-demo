# Clube Cavalagada do Batom

Aplicação web do clube de vantagens da JuAvila Selaria, com cadastro de participantes, carteirinha, cupons, parceiros, eventos e painel administrativo. A versão Streamlit usa banco PostgreSQL da Neon via `DATABASE_URL`.

Repositorio:

```text
https://github.com/areaofilm/juavila-clube-demo
```

## Como abrir o site

Com o servidor local ligado, acesse:

```text
http://127.0.0.1:4173
```

## Rodar a versão profissional Streamlit

```powershell
pip install -r requirements.txt
streamlit run streamlit_app.py
```

Para usar Neon, configure:

```toml
DATABASE_URL = "postgresql://USUARIO:SENHA@HOST.neon.tech/NOME_DO_BANCO?sslmode=require"
ADMIN_PASSWORD = "uma-senha-forte"
```

No Streamlit Cloud esses valores entram em `Advanced settings > Secrets`.

Painel administrativo:

```text
http://127.0.0.1:4173/admin.html
```

Para testar exatamente a versão que será empacotada no Android:

```powershell
npm run serve:www
```

Também dá para abrir telas específicas:

```text
http://127.0.0.1:4173?screen=wallet
http://127.0.0.1:4173?screen=benefits
http://127.0.0.1:4173?screen=partners
http://127.0.0.1:4173?screen=events
http://127.0.0.1:4173?screen=profile
```

## O que o demo já simula

- Login e criação de conta.
- Cadastro com nome, telefone, e-mail e cidade.
- Carteirinha digital com QR Code visual.
- Vantagens e cupons com filtros.
- Parceiros com benefícios.
- Eventos e reserva de participação.
- Perfil com pontos, histórico e atalhos.
- Painel administrativo com usuários e telefones.
- Edição de promoções, parceiros e eventos pelo site.
- Manifesto inicial de PWA.
- Cache offline básico com service worker.
- Ícones de app em PNG.
- Política de privacidade e termos de uso em HTML.
- Configuração inicial para empacotar com Capacitor.

## O que a versão Streamlit já faz com banco

- Cria automaticamente tabelas no Neon/PostgreSQL.
- Salva usuários com telefone, e-mail, cidade e pontuação.
- Exibe carteirinha e pontuação.
- Lista vantagens, parceiros e eventos ativos.
- Registra uso de cupom e participação em evento somando pontos.
- Protege o painel admin por senha.
- Admin cria, edita, ativa/desativa e exclui promoções, parceiros e eventos.
- Admin visualiza todos os usuários cadastrados.

## Instalação sem Play Store

O botão "Instalar app no celular" usa o recurso PWA do navegador. Em alguns celulares o navegador mostra o prompt automaticamente; em outros, o usuário deve abrir o menu do Chrome/Edge e tocar em "Adicionar à tela inicial" ou "Instalar app".

Para distribuir APK fora da Play Store futuramente, será necessário gerar um `.apk` assinado. O fluxo atual está preparado primeiro para PWA, que é mais simples e não depende da aprovação da loja.

## Arquivos importantes

- `store/play-store-listing.md`: textos iniciais para cadastro na Play Store.
- `store/data-safety-draft.md`: rascunho para a seção Segurança dos dados.
- `store/release-checklist.md`: checklist técnico e comercial de publicação.
- `capacitor.config.json`: configuração inicial do app Android.
- `package.json`: scripts para iniciar o fluxo Capacitor.
- `www/`: cópia limpa dos arquivos públicos que entram no pacote Android.
- `scripts/sync-www.cmd`: sincroniza os arquivos públicos para `www/`.
- `admin.html`: painel administrativo do demo.
- `data.js`: camada de dados local compartilhada entre app e admin.

## Próximos passos para virar produto oficial

- Cadastro real de clientes e autenticação.
- Banco de dados de cupons, parceiros, eventos e pontuação.
- QR Code real com validação no caixa.
- Painel administrativo para JuAvila gerenciar vantagens.
- Revisão jurídica e publicação da política de privacidade/termos em URL oficial.
- Empacotamento Android via Capacitor ou desenvolvimento nativo/React Native para publicação na Play Store.

## Fluxo Android sugerido

Depois de instalar Node.js LTS, Android Studio e SDK API 35 ou superior:

```powershell
npm install
npm run sync:www
npx cap add android
npx cap sync android
npx cap open android
```

No Android Studio, gere o Android App Bundle (`.aab`) em `Build > Generate Signed Bundle / APK`.
