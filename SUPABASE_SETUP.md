# 🗄️ Configuração do Supabase

Este documento explica como configurar o banco de dados Supabase para o aplicativo Safe Care Companion.

## 📋 Pré-requisitos

1. Uma conta no [Supabase](https://supabase.com)
2. Um projeto criado no Supabase
3. As variáveis de ambiente configuradas no arquivo `.env`:
   ```
   EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase
   EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
   ```

## 🚀 Aplicando as Migrations

As migrations estão localizadas na pasta `supabase/migrations/`. Execute-as na seguinte ordem:

### 1. Acesse o SQL Editor no Supabase

1. Vá para o seu projeto no Supabase Dashboard
2. Clique em "SQL Editor" no menu lateral
3. Clique em "New query"

### 2. Execute as migrations na ordem:

#### Migration 1: Family Members
```sql
-- Execute o conteúdo do arquivo: supabase/migrations/20250101120000_create_family_members.sql
```

#### Migration 2: Patients
```sql
-- Execute o conteúdo do arquivo: supabase/migrations/20250101120001_create_patients.sql
```

#### Migration 3: Medications
```sql
-- Execute o conteúdo do arquivo: supabase/migrations/20250101120002_create_medications.sql
```

#### Migration 4: Appointments
```sql
-- Execute o conteúdo do arquivo: supabase/migrations/20250101120003_create_appointments.sql
```

#### Migration 5: Documents
```sql
-- Execute o conteúdo do arquivo: supabase/migrations/20250101120004_create_documents.sql
```

### 3. Verificar as tabelas criadas

Após executar todas as migrations, você deve ter as seguintes tabelas:

- ✅ `family_members` - Membros da família
- ✅ `patients` - Pacientes
- ✅ `medications` - Medicamentos
- ✅ `appointments` - Consultas médicas
- ✅ `documents` - Documentos e exames
- ✅ `profiles` - Perfis de usuário

#### Migration 6: Profiles
```sql
-- Execute o conteúdo do arquivo: supabase/migrations/20250117170000_create_profiles.sql
```

#### Migration 7: Storage (Avatars)
```sql
-- Execute o conteúdo do arquivo: supabase/migrations/20250117170500_create_storage_bucket.sql
```

#### Migration 8: Invite Code Lookup
```sql
-- Execute o conteúdo do arquivo: supabase/migrations/20250117171000_fix_invite_lookup.sql
```

## 🔒 Row Level Security (RLS)

Todas as tabelas têm Row Level Security (RLS) habilitado, garantindo que:

- Usuários só podem ver seus próprios dados
- Usuários só podem criar registros associados ao seu `user_id`
- Usuários só podem atualizar/deletar seus próprios registros

## 📝 Estrutura das Tabelas

### `patients`
- Armazena informações dos pacientes
- Campos: `id`, `user_id`, `name`, `birth_date`, `gender`, `phone`, `email`, `address`, `created_at`, `updated_at`

### `medications`
- Armazena prescrições de medicamentos
- Campos: `id`, `user_id`, `patient_id`, `name`, `dosage`, `frequency`, `start_date`, `end_date`, `notes`, `created_at`, `updated_at`

### `appointments`
- Armazena consultas médicas
- Campos: `id`, `user_id`, `patient_id`, `specialty`, `doctor`, `date`, `location`, `notes`, `status` (scheduled/completed/cancelled), `created_at`, `updated_at`

### `documents`
- Armazena documentos e exames médicos
- Campos: `id`, `user_id`, `patient_id`, `title`, `type`, `date`, `file_url`, `notes`, `created_at`, `updated_at`

### `family_members`
- Armazena membros da família
- Campos: `id`, `user_id`, `name`, `relationship`, `avatar_url`, `created_at`

## 🧪 Testando

Após aplicar as migrations:

1. Faça login no aplicativo
2. Crie uma conta se ainda não tiver
3. Tente adicionar dados em cada seção do app
4. Verifique se os dados aparecem corretamente

## ⚠️ Troubleshooting

### Erro: "relation does not exist"
- Certifique-se de que executou todas as migrations na ordem correta
- Verifique se está no schema correto (`public`)

### Erro: "permission denied"
- Verifique se o RLS está configurado corretamente
- Certifique-se de que o usuário está autenticado

### Dados não aparecem
- Verifique se o `user_id` está sendo preenchido corretamente
- Verifique as políticas RLS na tabela

## 📚 Recursos

- [Documentação do Supabase](https://supabase.com/docs)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Editor](https://supabase.com/docs/guides/database/tables)

