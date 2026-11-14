# Vezora — preços configuráveis e profissionais adicionais

## Configuração administrativa
Em Admin > Configurações comerciais, definir:
- Mensalidade normal de renovação (em centavos).
- Preço do primeiro mês (opcional; nulo = mensalidade normal).
- Preço mensal de cada profissional adicional acima de 1.
- Dias de teste para novos cadastros.

O valor mostrado no site é lido da rota pública GET /api/platform/public-settings, sem dados privados.

## Cálculo de assinatura
- Primeiro profissional incluso.
- Primeiro mês via Pix: primeiro mês base + (profissionais - 1) * adicional mensal.
- Renovação via Pix: mensalidade base + (profissionais - 1) * adicional mensal.
- Adição no meio do plano: adicional mensal * fração de tempo restante em relação ao ciclo de até 30 dias, arredondado para cima em centavos.
- Para adicionais calculados abaixo de R$ 1,00, o acesso final de ciclo pode ser concedido sem Pix, apenas quando não houver cartão recorrente autorizado. No cartão, aguardar a renovação.
- Ao renovar, o valor das vagas efetivamente ativas é recalculado.
- Cobranças Pix emitidas anteriormente mantêm valor próprio; mudanças no admin não as reescrevem.

## Integração Mercado Pago
- Pix dos adicionais vai à conta da PLATAFORMA (não à conta OAuth de sinais do estabelecimento).
- Nova vaga aparece como billingPending=true e active=false até confirmação oficial do pagamento.
- Webhook/Pix reconciliation idempotente verifica pagamento e não estende data de vencimento para adicional.
- Assinatura recorrente já autorizada por cartão precisa atualizar o preço no provedor ANTES da ativação de vaga extra. Se o MP negar a atualização, o adicional continua pendente para nova reconciliação.
- Cartão de primeira assinatura com preço promocional diferente é bloqueado: primeiro mês promocional via Pix, depois renovação por cartão.
- Cartão autorizado antes do prazo pago vigente pode gerar nova cobrança; a autorização de novo cartão é bloqueada até os 3 dias finais.

## Execução recomendada
1. Salvar backup/snapshot do MongoDB de produção.
2. Validar backend: npm install, npm run build, npm test.
3. Configurar MongoDB URL no ambiente correto e executar uma vez `npm run db:push` para sincronizar schema/índices.
4. Publicar o backend ANTES do frontend.
5. Publicar o frontend e testar primeira mensalidade, renovação, profissional pendente, Pix proporcional, reconciliação e plano com cartão em ambiente de teste.
6. Conferir webhooks e assinaturas reais controladas antes da liberação comercial.
7. Confirmar que a home mostra valores do admin após propagação do cache (cerca de 30 segundos ou revalidação subsequente).

## Compatibilidade
As contas antigas continuam com os profissionais ativos; o primeiro ciclo alterado captura o número atual sem cobrar retroativamente uma vaga existente. Assinaturas recorrentes antigas não têm valor retroativamente modificado por mudanças globais do preço. A integração de sinais das clientes não é alterada.
