import React, { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from "react-native";
import { Button, Card, Snackbar, Text, TextInput } from "react-native-paper";
import { supabase } from "../../../src/servicos/supabaseClient";

export default function PagamentosScreen() {
  const [pagamentos, setPagamentos] = useState<any[]>([]);
  const [cliente, setCliente] = useState("");
  const [valor, setValor] = useState("");
  const [status, setStatus] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [editando, setEditando] = useState<string | null>(null);

  async function carregarPagamentos() {
    try {
      const { data, error } = await supabase
        .from("pagamentos")
        .select("*")
        .order("data_pagamento", { ascending: false });
      
      if (error) {
        console.error("Erro ao carregar pagamentos:", error);
        setMensagem("Erro ao carregar pagamentos");
        return;
      }
      
      setPagamentos(data || []);
    } catch (err) {
      console.error("Catch carregarPagamentos:", err);
      setMensagem("Erro inesperado ao carregar");
    }
  }

  async function salvarPagamento() {
    if (!cliente || !valor || !status) {
      setMensagem("Preencha todos os campos!");
      return;
    }

    const valorNumerico = parseFloat(valor);
    if (isNaN(valorNumerico)) {
      setMensagem("Valor inválido!");
      return;
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    let clienteId = cliente.trim();

    try {
      if (!uuidRegex.test(clienteId)) {
        const { data: found, error: findErr } = await supabase
          .from("clientes")
          .select("id")
          .eq("nome", clienteId)
          .maybeSingle();

        if (findErr) {
          console.error("Erro ao buscar cliente:", findErr);
          setMensagem("Erro ao buscar cliente");
          return;
        }

        if (found && found.id) {
          clienteId = found.id;
        } else {
          setMensagem("Cliente não encontrado");
          return;
        }
      }

      if (editando) {
        const { error } = await supabase
          .from("pagamentos")
          .update({ cliente: clienteId, valor: valorNumerico, status })
          .eq("id", editando);
        
        if (error) {
          console.error("Erro ao atualizar:", error);
          setMensagem("Erro ao atualizar pagamento: " + error.message);
          return;
        }
        
        setMensagem("Pagamento atualizado!");
      } else {
        const { error } = await supabase
          .from("pagamentos")
          .insert([{ cliente: clienteId, valor: valorNumerico, status }]);
        
        if (error) {
          console.error("Erro ao inserir:", error);
          setMensagem("Erro ao salvar pagamento: " + error.message);
          return;
        }
        
        setMensagem("Pagamento salvo!");
      }

      setCliente("");
      setValor("");
      setStatus("");
      setEditando(null);
      carregarPagamentos();
    } catch (err) {
      console.error("Catch salvarPagamento:", err);
      setMensagem("Erro inesperado");
    }
  }

  async function excluirPagamento(id: string) {
    try {
      const { error } = await supabase.from("pagamentos").delete().eq("id", id);
      
      if (error) {
        console.error("Erro ao excluir:", error);
        setMensagem("Erro ao excluir pagamento");
        return;
      }
      
      setMensagem("Pagamento excluído!");
      carregarPagamentos();
    } catch (err) {
      console.error("Catch excluirPagamento:", err);
      setMensagem("Erro inesperado");
    }
  }

  useEffect(() => {
    carregarPagamentos();
  }, []);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.titulo}>Gerenciar Pagamentos</Text>

        <TextInput
          label="Cliente"
          value={cliente}
          onChangeText={setCliente}
          style={styles.input}
          // Aqui futuramente vai ser implementar na busca clientes cadastrados
        />
        <TextInput
          label="Valor"
          value={valor}
          onChangeText={setValor}
          keyboardType="numeric"
          style={styles.input}
        />
        <TextInput
          label="Status (Pago / Pendente)"
          value={status}
          onChangeText={setStatus}
          style={styles.input}
        />

        <Button mode="contained" onPress={salvarPagamento}>
          {editando ? "Atualizar" : "Salvar"}
        </Button>

        <View style={{ marginTop: 20 }}>
          {pagamentos.map((p) => (
            <Card key={p.id} style={styles.card}>
              <Card.Content>
                <Text style={styles.cardTitle}>{p.cliente}</Text>
                <Text>Valor: R$ {p.valor}</Text>
                <Text>Status: {p.status}</Text>
                <Text>Data: {new Date(p.data_pagamento).toLocaleDateString()}</Text>
              </Card.Content>
              <Card.Actions style={styles.cardButtons}>
                <Button onPress={() => {
                  setCliente(p.cliente);
                  setValor(p.valor.toString());
                  setStatus(p.status);
                  setEditando(p.id);
                }}>Editar</Button>
                <Button onPress={() => excluirPagamento(p.id)} textColor="red">Excluir</Button>
              </Card.Actions>
            </Card>
          ))}
        </View>

        <Snackbar visible={!!mensagem} onDismiss={() => setMensagem("")} duration={2500}>
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
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "white",
  },
  card: {
    marginBottom: 10,
    borderRadius: 10,
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
  },
  cardButtons: {
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
});
