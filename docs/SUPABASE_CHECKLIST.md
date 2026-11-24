# Checklist do Supabase (somente leitura)

Cole cada consulta no **SQL Editor** do Supabase. Todas apenas **leem** informações; nenhuma altera dados.

## 1. As tabelas têm RLS ligado?
```sql
select tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and (tablename like 'caverna%' or tablename = 'mentor_messages');
```
Esperado: `rowsecurity = true` em todas.

## 2. Quais políticas existem?
```sql
select tablename, policyname, cmd, roles, qual, with_check
from pg_policies
where schemaname = 'public'
  and (tablename like 'caverna%' or tablename = 'mentor_messages')
order by tablename, cmd;
```
Esperado em `caverna_data`, `caverna_push_subscriptions` e `mentor_messages`: políticas que
limitam leitura/escrita a `auth.uid() = user_id`. Se alguma política usar `true` sem filtro,
qualquer usuário logado poderia ver dados de outros.

## 3. `caverna_admins` pode ser alterada por usuários comuns?
Confira no resultado da consulta 2 que **não há** política de INSERT/UPDATE/DELETE para
`authenticated` em `caverna_admins`.

## 4. Existe gatilho alterando `updated_at`?
```sql
select event_object_table as tabela, trigger_name, action_statement
from information_schema.triggers
where event_object_schema = 'public'
  and (event_object_table like 'caverna%' or event_object_table = 'mentor_messages');
```
(O app já lida com isso: ele lê de volta o `updated_at` gravado pelo servidor.)

## 5. Cron e funções
- Em **Integrations → Cron**: confirme o job que chama `caverna-push-reminders` (a cada minuto).
- Em **Edge Functions**: confirme `caverna-push-reminders`, `caverna-mentor` e `caverna_admins`.
- Em **Edge Functions → Secrets**: confirme que existem as chaves VAPID e de IA (veja só os
  **nomes**; nunca copie os valores para o GitHub).
- A função `caverna_admins` deve **validar no servidor** se quem chama é admin
  (consultando `caverna_admins` com o token do usuário). Esconder a aba no front não protege.
