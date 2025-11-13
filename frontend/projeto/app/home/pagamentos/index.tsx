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
    const { data, error } = await supabase.from("pagamentos").select("*").order("data_pagamento", { ascending: false });
    if (!error && data) setPagamentos(data);
  }

  async function salvarPagamento() {
    if (!cliente || !valor || !status) {
      setMensagem("Preencha todos os campos!");
      return;
    }

    if (editando) {
      await supabase.from("pagamentos").update({ cliente, valor, status }).eq("id", editando);
      setMensagem("Pagamento atualizado!");
    } else {
      await supabase.from("pagamentos").insert([{ cliente, valor, status }]);
      setMensagem("Pagamento salvo!");
    }

    setCliente("");
    setValor("");
    setStatus("");
    setEditando(null);
    carregarPagamentos();
  }

  async function excluirPagamento(id: string) {
    await supabase.from("pagamentos").delete().eq("id", id);
    setMensagem("Pagamento excluído!");
    carregarPagamentos();
  }

  useEffect(() => {
    carregarPagamentos();
  }, []);

  useEffect(() => {
  async function limparPagamentosAntigos() {
    const { data, error } = await supabase
      .from("pagamentos")
      .delete()
      .lt("data", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // lt = less than (menor que) Date.now (data atual) - 30 dias (convertido em ms) new date converte em data legível e toISOString converte para o formato aceito pelo supabase.
      .neq("status", "Pendente"); // só apaga se não for pendente

    if (error) console.error("Erro ao limpar pagamentos antigos:", error);
  }

  limparPagamentosAntigos();
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
