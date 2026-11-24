# Atualização de 24/11/2026

## 1. Sincronização segura (perda de dados)
- **Indicador no topo**: "✓ Salvo", "● Salvando…", "⚠ Não sincronizado" ou "⚠ Sem conexão".
  Tocar no aviso tenta enviar de novo na hora.
- **Falhas deixam de ser silenciosas**: se o envio falhar, as alterações ficam marcadas como
  pendentes e o app tenta de novo sozinho (3 s, 10 s, 30 s, depois a cada 60 s), ao voltar a
  internet e ao reabrir o app.
- **Conflito entre dispositivos**: antes de enviar, o app confere se outro aparelho salvou
  algo mais novo. Se sim, pergunta qual versão manter e **baixa um backup da versão
  descartada**. Ao voltar para o app, traz automaticamente alterações feitas em outro aparelho
  (se não houver nada pendente aqui).
- **Sair da conta** não perde mais alterações: o app envia antes de sair e, se não conseguir,
  avisa. Sessão expirada não apaga mais dados não enviados.
- **Abre offline**: com sessão salva, o app abre e funciona com os dados do aparelho.

## 2. Importação de dados
Passa a validar o arquivo e completar campos que faltam (backups antigos não quebram mais
as telas). Os dados anteriores ficam guardados em `cavernaPreImportBackup` (localStorage).

## 3. Segurança
- IDs e campos numéricos vindos da nuvem ou de arquivos importados são higienizados
  (antes iam direto para atributos `onclick`/HTML).
- supabase-js fixado na versão 2.119.0 (antes: `@2`, qualquer versão futura).

## 4. Performance
- `index.html`: 640 KB → ~180 KB (imagens movidas para `assets/*.webp`, de 469 KB para 27 KB).
- As abas pesadas (Físico, Treino, Finanças) só são desenhadas quando estão abertas.

## 5. PWA e notificações
- Ícones criados (`icon-180/192/512.png`) e declarados no manifest; o `icon-192.png` que o
  service worker pedia e não existia agora existe.
- Service worker com cache: o app e a biblioteca do Supabase abrem sem internet. Dados e
  login continuam indo direto para o Supabase (nunca ficam em cache).
- Documentação consolidada (LEIA-ME e README não se contradizem mais).

## Como testar depois de publicar
1. Abra o app: o selo deve mostrar "✓ Salvo".
2. Marque um hábito: "● Salvando…" e logo "✓ Salvo". Confira no segundo aparelho.
3. Ative o modo avião, marque um hábito: "⚠ Sem conexão". Desative: deve virar "✓ Salvo".
4. Instale como app e abra em modo avião: a tela deve abrir.

## Fora do escopo desta atualização (sugestões)
- Trocar os 13 `alert()` e 13 `confirm()` por avisos no estilo do app.
- Acessibilidade (textos alternativos, foco por teclado).
- Mesclar dados de dois aparelhos item a item (hoje o usuário escolhe uma versão).
- Conferir RLS e funções no Supabase (`docs/SUPABASE_CHECKLIST.md`).
