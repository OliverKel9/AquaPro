🛡️ Políticas de Segurança (RLS) – Projeto AquaPro

Este documento descreve todas as Row-Level Security Policies (RLS) configuradas no banco de dados Supabase do projeto AquaPro.
As políticas foram registradas com base nas configurações reais exibidas no painel do Supabase.

📂 1. Tabela pagamentos
Nome da Política	Comando	Role	Descrição
Permite atualização de pagamentos	UPDATE	public	Permite atualizar qualquer registro de pagamento (acesso amplo).
Permite exclusão de pagamentos	DELETE	public	Permite excluir qualquer registro de pagamento (acesso amplo).
Permite inserção de pagamentos	INSERT	public	Permite inserir novos registros de pagamento (acesso amplo).
Permite visualização de pagamentos	SELECT	public	Permite visualizar qualquer pagamento (acesso amplo).
Usuário pode atualizar seus próprios pagamentos	UPDATE	public	Restringe a atualização aos pagamentos pertencentes ao usuário logado.
Usuário pode criar seus próprios pagamentos	INSERT	public	Somente o usuário logado pode criar pagamentos próprios.
Usuário pode deletar seus próprios pagamentos	DELETE	public	Somente o usuário logado pode excluir seus pagamentos.
Usuário pode ver seus próprios pagamentos	SELECT	public	Somente o usuário logado pode visualizar seus pagamentos.

📂 2. Tabela agendamentos
Nome da Política	Comando	Role	Descrição
Inserir agendamento de clientes próprios	INSERT	public	Permite inserir agendamentos pertencentes aos clientes do usuário.
Usuário pode atualizar seus próprios agendamentos	UPDATE	public	Permite atualizar apenas agendamentos criados pelo usuário.
Usuário pode criar seus próprios agendamentos	INSERT	public	Garante que o usuário só crie agendamentos próprios.
Usuário pode deletar seus próprios agendamentos	DELETE	public	O usuário só pode excluir agendamentos dele.
Usuário pode ver seus próprios agendamentos	SELECT	public	O usuário só pode visualizar agendamentos relacionados a ele.
Ver agendamentos dos próprios clientes	SELECT	public	Permite visualizar agendamentos vinculados aos clientes do usuário.

📂 3. Tabela clientes
Nome da Política	Comando	Role	Descrição
Editar clientes do próprio usuário	UPDATE	public	Permite atualizar somente clientes vinculados ao usuário logado.
Excluir clientes do próprio usuário	DELETE	public	Permite excluir somente clientes vinculados ao usuário logado.
Usuário pode atualizar apenas seus próprios dados	UPDATE	public	Restringe a atualização ao próprio registro do usuário.
Usuário pode deletar apenas seus próprios dados	DELETE	public	Restringe exclusão apenas ao registro do usuário.
Usuário pode inserir apenas seus próprios dados	INSERT	public	Permite inserir apenas dados pertencentes ao próprio usuário.
Usuário pode inserir seus clientes	INSERT	public	Permite cadastrar clientes associados ao usuário logado.
Usuário pode ver apenas seus próprios dados	SELECT	public	Restringe visualização ao próprio registro.
Usuário só vê seus clientes	SELECT	public	O usuário vê somente clientes sob sua responsabilidade.

📂 4. Tabela usuarios_perfil
Nome da Política	Comando	Role	Descrição
Permite inserção no perfil	INSERT	public	Permite criar o registro de perfil ao cadastrar usuário.
Permite visualização do próprio perfil	SELECT	public	Usuário pode visualizar apenas o próprio perfil.

📝 Resumo Geral e Implicações de Segurança
✔️ Pontos Fortes
O padrão adotado protege bem os dados: cada usuário só acessa seus próprios registros.

Há separação entre dados pessoais, clientes, pagamentos e agendamentos.

Muitas políticas seguem corretamente o princípio de propriedade dos dados.

📘 Conclusão

Este documento serve como referência oficial das políticas RLS do projeto AquaPro.
Revisões periódicas são recomendadas para garantir segurança, integridade e coerência do acesso aos dados.
