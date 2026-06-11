# Checklist para Publicar na Play Store

## Base técnica

- [x] Protótipo navegável.
- [x] Manifesto PWA.
- [x] Ícones 192, 512 e maskable.
- [x] Service worker básico para cache offline.
- [x] Política de privacidade em HTML.
- [x] Termos de uso em HTML.
- [x] Configuração inicial do Capacitor.
- [ ] Instalar Node.js LTS.
- [ ] Instalar Android Studio atual.
- [ ] Instalar Android SDK com API 35 ou superior.
- [ ] Rodar `npm install`.
- [ ] Rodar `npx cap add android`.
- [ ] Rodar `npx cap sync android`.
- [ ] Abrir Android Studio e gerar Android App Bundle `.aab`.

## Requisitos Google Play

- [ ] Conta de desenvolvedor Google Play.
- [ ] App novo mirando Android 15/API 35 ou superior.
- [ ] Play App Signing configurado.
- [ ] Política de privacidade publicada em URL pública.
- [ ] Formulário de Segurança dos dados preenchido.
- [ ] Classificação indicativa preenchida.
- [ ] Público-alvo e conteúdo definidos.
- [ ] Dados de contato do desenvolvedor preenchidos.
- [ ] Screenshots da loja preparados.
- [ ] Ícone de alta resolução preparado.
- [ ] Feature graphic preparada.
- [ ] Release interna testada antes da produção.

## Produto real

- [ ] Autenticação real.
- [ ] Banco de dados de participantes.
- [ ] Painel administrativo para cupons, parceiros, eventos e pontos.
- [ ] QR Code real e validação no caixa.
- [ ] Regras comerciais de pontos e recompensas.
- [ ] Canal de suporte.
- [ ] Canal de exclusão de conta/dados.
- [ ] Revisão jurídica de política e termos.

## Fontes oficiais úteis

- Target API level: https://developer.android.com/google/play/requirements/target-sdk
- Assinatura de app: https://developer.android.com/studio/publish/app-signing
- Play App Signing: https://support.google.com/googleplay/android-developer/answer/9842756
- Segurança dos dados: https://support.google.com/googleplay/android-developer/answer/10787469
- Criar e configurar app: https://support.google.com/googleplay/android-developer/answer/9859152
- Capacitor Android: https://capacitorjs.com/docs/android
- Capacitor Google Play: https://capacitorjs.com/docs/android/deploying-to-google-play
