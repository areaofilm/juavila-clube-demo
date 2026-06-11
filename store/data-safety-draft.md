# Rascunho - Segurança dos Dados Google Play

Este rascunho precisa ser validado conforme a implementação real do app e do backend.

## Coleta de dados prevista

Dados pessoais:

- Nome.
- Telefone.
- E-mail.
- Cidade.

Atividade no app:

- Cupons ativados.
- Pontuação.
- Participação em eventos.
- Histórico de benefícios.

Identificadores:

- ID interno da participante.
- Token de autenticação.

## Finalidades previstas

- Gerenciamento de conta.
- Operação do clube de vantagens.
- Validação de cupons e QR Code.
- Comunicação sobre benefícios e eventos.
- Prevenção de fraude.
- Suporte ao usuário.

## Compartilhamento previsto

Possível compartilhamento limitado com:

- JuAvila Selaria, para validação de cadastro, pontos e compras.
- Parceiros selecionados, apenas quando necessário para validar uma vantagem.
- Provedor de autenticação, banco de dados, hospedagem e notificações.

## Segurança

Antes da publicação oficial:

- Usar HTTPS em toda API.
- Proteger tokens de autenticação.
- Evitar salvar senhas em texto puro.
- Permitir exclusão/correção de dados.
- Documentar prazo de retenção.

## Respostas prováveis no formulário

- O app coleta ou compartilha dados do usuário? Sim, se houver cadastro real.
- Todos os dados são criptografados em trânsito? Sim, se API HTTPS for usada.
- Usuário pode solicitar exclusão dos dados? Deve ser Sim antes de publicar.
- App se compromete com políticas familiares? Provavelmente Não, se público-alvo for adulto.

## Pendências

- Definir backend real.
- Definir provedor de login.
- Definir canal oficial para exclusão de conta.
- Confirmar se haverá notificações push.
- Confirmar se haverá analytics ou publicidade.
