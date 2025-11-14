import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet } from "react-native";
import { Button, Card, Snackbar, Text, TextInput } from "react-native-paper";
import { supabase } from "../../../src/servicos/supabaseClient";

export default function AgendamentosScreen() {
  const [agendamentos, setAgendamentos] = useState<any[]>([]);
  const [cliente, setCliente] = useState("");
  const [servico, setServico] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [visivel, setVisivel] = useState(false);

  //executa ações quando o componente renderiza ou muda
  useEffect(() => {
    carregarAgendamentos();
  }, []);

  async function carregarAgendamentos() {
    const { data, error } = await supabase.from("agendamentos").select("*, clientes(nome)").order("id", { ascending: false });
    if (error) {
      console.error(error);
      setMensagem("Erro ao carregar agendamentos");
      setVisivel(true);
    } else {
      setAgendamentos(data || []);
    }
  }

    async function salvarAgendamento() {
    if (!cliente || !servico || !data || !hora) {
      setMensagem("Preencha todos os campos");
      setVisivel(true);
      return;
    }

    // regex para validar UUID
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let clienteId = cliente.trim();

    try {
      if (!uuidRegex.test(clienteId)) {
        // procura cliente existente pelo nome
        const { data: found, error: findErr } = await supabase
          .from("clientes")
          .select("id")
          .eq("nome", clienteId)
          .maybeSingle();

        if (findErr) {
          console.error("Erro ao buscar cliente:", findErr);
          setMensagem("Erro ao buscar cliente");
          setVisivel(true);
          return;
        }

        if (found && found.id) {
          clienteId = found.id;
        } else {
          setMensagem("Cliente não encontrado");
          setVisivel(true);
          return; 
        }
      }

      const { error } = await supabase
        .from("agendamentos")
        .insert([{ cliente_id: clienteId, servico, data, hora }]);

      if (error) {
        console.error(error);
        setMensagem("Erro ao salvar");
        setVisivel(true);
      } else {
        setMensagem("Agendamento salvo com sucesso!");
        setVisivel(true);
        setCliente("");
        setServico("");
        setData("");
        setHora("");
        carregarAgendamentos();
      }
    } catch (err) {
      console.error("Erro salvarAgendamento:", err);
      setMensagem("Erro inesperado");
      setVisivel(true);
    }
  }

  async function excluirAgendamento(id: number) {
    const { error } = await supabase.from("agendamentos").delete().eq("id", id); //eq = equal (igual a)
    if (error) {
      console.error(error);
      setMensagem("Erro ao excluir");
      setVisivel(true);
    } else {
      setMensagem("Agendamento excluído!");
      setVisivel(true);
      carregarAgendamentos();
    }
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}> Agendamentos</Text>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput label="Cliente" value={cliente} onChangeText={setCliente} style={styles.input}/>

            <TextInput label="Serviço" value={servico} onChangeText={setServico} style={styles.input}/>

            <TextInput label="Data" placeholder="DD/MM/AAAA" value={data} onChangeText={setData} style={styles.input}/>

            <TextInput label="Hora" placeholder="HH:MM" value={hora} onChangeText={setHora} style={styles.input}/>

            <Button mode="contained" onPress={salvarAgendamento}>
              Salvar Agendamento
            </Button>
          </Card.Content>
        </Card>

        <Text style={styles.subtitulo}>Agendamentos Cadastrados</Text>

        {agendamentos.length === 0 ? (
          <Text style={{ textAlign: "center", marginTop: 10 }}>Nenhum agendamento ainda</Text>
        ) : (agendamentos.map((item) => (
              <Card key={item.id} style={styles.item}>
                <Card.Content>
                  <Text style={styles.texto}> Cliente: {item.clientes?.nome ?? item.cliente ?? "—"}</Text>
                  <Text style={styles.texto}> Serviço: {item.servico}</Text>
                  <Text style={styles.texto}> Data: {item.data}</Text>
                  <Text style={styles.texto}> Hora: {item.hora}</Text>
                  <Button mode="outlined" onPress={() => excluirAgendamento(item.id)} style={styles.botaoExcluir} textColor="#d9534f">
                    Excluir
                  </Button>
                </Card.Content>
              </Card>
          ))
        )}

        <Snackbar visible={visivel} onDismiss={() => setVisivel(false)} duration={2500}>
          {mensagem}
        </Snackbar>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#F4F9FF",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  subtitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  card: {
    marginBottom: 20,
    borderRadius: 12,
  },
  input: {
    marginBottom: 10,
    backgroundColor: "white",
  },
  item: {
    marginBottom: 10,
    borderRadius: 10,
  },
  texto: {
    marginBottom: 4,
  },
  botaoExcluir: {
    marginTop: 8,
    borderColor: "#d9534f",
  },
});
