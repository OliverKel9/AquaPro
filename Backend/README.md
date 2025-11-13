# 🧠 Backend - AquaPro

O backend do **AquaPro** foi desenvolvido utilizando o **Supabase**, uma plataforma *Backend as a Service (BaaS)* que oferece autenticação, banco de dados PostgreSQL e regras de segurança (RLS) integradas.

---

## ⚙️ Funcionalidades Principais

- Autenticação e gerenciamento de usuários (cadastro, login e redefinição de senha)
- Perfis de usuários com flag de alteração de senha
- Cadastro de clientes vinculados a usuários autenticados
- Agendamento de serviços (vinculado ao cliente)
- Registro de pagamentos e status
- Políticas de segurança (RLS) para controle de acesso a dados
- Integração direta com o frontend React Native via `supabaseClient.js`

---

## 🗃️ Estrutura do Banco de Dados

### 🧍‍♂️ Tabela: `usuarios_perfil`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| user_id | UUID | Relacionamento com o usuário autenticado (`auth.users.id`) |
| nome_completo | Texto | Nome completo do piscineiro |
| telefone | Texto | Telefone para contato |
| flag_alterar_senha | Boolean | Indica se o usuário precisa alterar a senha |

---

### 👤 Tabela: `clientes`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único |
| user_id | UUID | Usuário dono do cliente (`auth.users.id`) |
| nome | Texto | Nome do cliente |
| endereco | Texto | Endereço da piscina |
| telefone | Texto | Telefone do cliente |
| email | Texto | E-mail de contato |
| tipo_piscina | Texto | Tipo da piscina (fibra, azulejo, etc.) |
| observacoes | Texto | Observações adicionais |
| created_at | Timestamp | Data de criação |

---

### 📅 Tabela: `agendamentos`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único |
| cliente_id | UUID | Referência ao cliente |
| servico | Texto | Serviço a ser realizado |
| data | Date | Data do agendamento |
| hora | Texto | Horário do agendamento |
| created_at | Timestamp | Data de criação |

---

### 💰 Tabela: `pagamentos`
| Coluna | Tipo | Descrição |
|--------|------|-----------|
| id | UUID | Identificador único |
| cliente | UUID | Referência ao cliente |
| valor | Numeric | Valor do pagamento |
| status | Texto | Status (pago, pendente, etc.) |
| data_pagamento | Date | Data do pagamento |

---

## 🔐 Segurança (RLS - Row Level Security)

A **Row Level Security (RLS)** deve estar **ativada** em todas as tabelas relacionadas ao usuário, garantindo que cada usuário só visualize e manipule seus próprios dados.

Exemplo de *policy* para a tabela `clientes`:
```sql
-- Ativar RLS
ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Permitir que cada usuário veja apenas seus próprios clientes
CREATE POLICY "Clientes do usuário autenticado" 
ON clientes 
FOR SELECT 
USING (auth.uid() = user_id);

-- Permitir inserção de novos clientes pelo usuário autenticado
CREATE POLICY "Inserir clientes do próprio usuário"
ON clientes
FOR INSERT
WITH CHECK (auth.uid() = user_id);
