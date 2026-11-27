# Atualização de 27/11/2026 (sincronização, segurança, performance, PWA e interface)

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
- Textos alternativos (`alt`) nas imagens.
- Mesclar dados de dois aparelhos item a item (hoje o usuário escolhe uma versão).
- Conferir RLS e funções no Supabase (`docs/SUPABASE_CHECKLIST.md`).

## 6. Interface (celular)
- **Menu inferior de uma linha só**: Hoje, Hábitos, Treinos, Corpo e **Mais**. O "Mais" abre uma
  folha com Mentor, Finanças, Biblioteca, Gratidão, Falhas, Configurações (e Administração, quando
  liberada) e "Sair da conta". Antes eram 10 botões em duas linhas (116 px); agora são 64 px.
  O texto "LIFE MANAGEMENT SYSTEM" que ficava por cima dos botões e o rótulo "Configurações"
  cortado deixaram de existir.
- **Cabeçalho enxuto**: no celular fica só a marca e o selo de sincronização. **Exportar/Importar
  dados** foram para Configurações → Dados; "Sair" fica no cabeçalho (computador) e na folha "Mais".
- **Tela Hoje**: cartão de boas-vindas compacto, atalhos repetidos escondidos (o menu já faz isso)
  e barra de progresso do dia. Os compromissos aparecem logo na primeira tela.
- **Hábitos**: a linha inteira é tocável (não só a caixinha), a caixa de marcar é maior (28 px) e
  roxa quando concluída, com um leve destaque ao marcar. Só o título é riscado ao concluir.
- **Margens do iPhone**: `viewport-fit=cover` adicionado, o que ativa as áreas seguras
  (barra inferior acima do indicador de início, laterais em modo paisagem).
- **Acessibilidade**: contorno visível de foco para teclado, textos de apoio de 10 px → 12 px,
  folha "Mais" com Esc para fechar e foco preso dentro dela.

Computador: sem mudanças visuais, exceto Exportar/Importar agora em Configurações.

## 7. Sequência de dias e mapa de constância (tela Hoje)
- **Selo "🔥 N dias seguidos"** no cartão de boas-vindas e um cartão **Constância** com: dias
  seguidos, melhor sequência, % de hábitos cumpridos nos últimos 30 dias e um mapa de 30 dias.
  Toque (ou clique) num dia para ver "quantos de quantos hábitos". No celular o cartão fica logo
  abaixo dos compromissos; no computador, ao lado da hidratação.
- **Regras da sequência**
  - Um dia conta quando **todos** os hábitos programados para ele foram cumpridos.
  - **Hoje incompleto não quebra** a sequência; se você completar hoje, ela soma +1.
  - Dias sem nenhum hábito programado (ex.: só existem hábitos semanais de outro dia) são ignorados.
  - Hábitos pausados não são exigidos. Hábitos semanais só contam nos dias escolhidos.
  - Um dia sem nenhum registro, ou com hábitos faltando, quebra a sequência.
- **Cores do mapa**: vazio (antes do 1º registro ou sem hábitos), escuro (nada feito), roxos
  (parcial) e roxo brilhante (dia completo). O dia de hoje tem contorno dourado.
- **Data de criação dos hábitos (`createdAt`)**: para que ignorar um hábito custe a sequência (e
  um hábito novo não "apague" dias antigos), cada hábito passa a guardar quando foi criado. Hábitos
  antigos recebem a data do primeiro check deles (ou a data de hoje, se nunca foram marcados).
  Isso é gravado **uma vez**, no primeiro acesso após a atualização, e sincroniza com a conta.
- Limitação: o histórico é calculado com os hábitos de hoje. Se você mudar os dias de um hábito
  semanal, os dias passados passam a ser avaliados pela regra nova.

## Ainda de fora (próxima rodada)
- Consolidar o CSS (hoje com regras repetidas em camadas) nas variáveis de cor/tamanho.
- Trocar `alert()`/`confirm()` por avisos no estilo do app.
