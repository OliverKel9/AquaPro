// app/home/novo_cliente.tsx
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, ScrollView, StyleSheet } from "react-native";
import { Button, Text, TextInput } from "react-native-paper";
import { supabase } from "../../../src/servicos/supabaseClient";

export default function NovoCliente() {
  const router = useRouter();

  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [tipoPiscina, setTipoPiscina] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const salvarCliente = async () => {
    if (!nome || !telefone) {
      Alert.alert("Erro", "Nome e telefone são obrigatórios.");
      return;
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const { error } = await supabase.from("clientes").insert([
        {
          nome,
          endereco,
          telefone,
          email,
          tipo_piscina: tipoPiscina,
          observacoes,
          user_id: user.id,
        },
      ]);

      if (error) {
        console.error(error);
        Alert.alert("Erro", "Não foi possível salvar o cliente.");
      } else {
        Alert.alert("Sucesso", "Cliente cadastrado!");
        router.push("/home"); // volta para Home
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro inesperado", "Tente novamente.");
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      <Text style={styles.title}>Novo Cliente</Text>

      <TextInput label="Nome" value={nome} onChangeText={setNome} style={styles.input} />
      <TextInput label="Endereço" value={endereco} onChangeText={setEndereco} style={styles.input} />
      <TextInput label="Telefone" value={telefone} onChangeText={setTelefone} style={styles.input} keyboardType="phone-pad" />
      <TextInput label="E-mail" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <TextInput label="Tipo de Piscina" value={tipoPiscina} onChangeText={setTipoPiscina} style={styles.input} />
      <TextInput label="Observações" value={observacoes} onChangeText={setObservacoes} style={styles.input} multiline />

      <Button mode="contained" onPress={salvarCliente} style={styles.button}>
        Salvar Cliente
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F9FF",
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    marginBottom: 12,
    backgroundColor: "white",
  },
  button: {
    marginTop: 20,
    padding: 6,
  },
});
