# Banco de dados ORIUM — PostgreSQL / Supabase Lite na VPS

O banco de dados e os serviços do ecossistema Supabase rodam **100% auto-hospedados na própria VPS** via Docker Compose:

- **Banco de Dados:** Container `orium-db` (PostgreSQL 15)
- **API REST:** Container `orium-rest` (PostgREST)
- **Autenticação:** Container `orium-auth` (GoTrue)
- **Armazenamento de Fotos:** Container `orium-storage` (Storage API no disco NVMe)
- **Gateway:** Container `orium-kong` (Porta 8000 interna / `/supabase` externa)

## Arquivos de Schema e Migrations

- `schema_completo.sql` — Schema consolidado e atualizado de todas as tabelas e enums.
- `grants.sql` — Permissões de acesso aos esquemas `public` e `storage`.
- `migrations/` — Histórico de migrações aplicadas no banco da VPS.

## Como aplicar novas migrações no banco da VPS

Você pode aplicar qualquer arquivo SQL diretamente no container `orium-db` na VPS usando o script auxiliar:

```powershell
powershell -ExecutionPolicy Bypass -File scripts\run_remote_sql.ps1 -SqlFile caminho/do/arquivo.sql
```

Ou diretamente via SSH no servidor:
```bash
docker exec -i orium-db psql -U postgres -d postgres < caminho/do/arquivo.sql
```
