# Caverna — Neon Noir

Aplicação web de hábitos, treino, leitura, finanças e evolução pessoal, publicada no GitHub Pages
(`index.html` na raiz) com Supabase (Auth, banco, Edge Functions e Cron).

## Estrutura
- `index.html` — aplicação (HTML + CSS + JS em um só arquivo).
- `assets/` — imagens do modelo corporal (`.webp`).
- `service-worker.js` — notificações push **e** modo offline (cache do app).
- `manifest.webmanifest`, `icon-*.png` — instalação como app (PWA).
- `caverna-2.0/` — fundação técnica para a evolução futura (ainda não conectada ao banco).
- `docs/SUPABASE_CHECKLIST.md` — consultas somente-leitura para conferir tabelas e permissões.
- `ATUALIZACAO-2026-11-27.md` — o que mudou nesta versão e como testar.
- `README-LEGACY.md` — descrição funcional detalhada da aplicação.

## Publicação
Envie o conteúdo desta pasta para a raiz da branch publicada. Passo a passo em `LEIA-ME.txt`.

## Importante
- Não aplique migrações SQL de `caverna-2.0/` no Supabase de produção.
- Faça backup (Exportar dados) antes de qualquer mudança.
- Ao publicar nova versão, troque `CACHE_VERSION` em `service-worker.js`.
