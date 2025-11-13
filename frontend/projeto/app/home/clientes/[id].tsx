import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, View } from "react-native";
import { Button, Card } from "react-native-paper";
import { supabase } from "../../../src/servicos/supabaseClient";

export default function ClienteDetalhes() {
  const { id } = useLocalSearchParams(); // pega o id da URL
  const router = useRouter();
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      buscarCliente();
    }
  }, [id]);

  const buscarCliente = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      Alert.alert("Erro", error.message);
    } else {
      setCliente(data);
    }
    setLoading(false);
  };

  const excluirCliente = async () => {
    Alert.alert(
      "Confirmar exclusão",
      "Deseja realmente excluir este cliente?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from("clientes")
              .delete()
              .eq("id", id);

            if (error) {
              Alert.alert("Erro", error.message);
            } else {
              Alert.alert("Sucesso", "Cliente excluído!");
              router.back(); // volta para a lista
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!cliente) {
    return (
      <View style={styles.center}>
        <Text>Cliente não encontrado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Card style={styles.card}>
        <Card.Title title={cliente.nome} subtitle={cliente.tipo_piscina} />
        <Card.Content>
          <Text style={styles.label}>📞 Telefone: {cliente.telefone}</Text>
          <Text style={styles.label}>📧 Email: {cliente.email}</Text>
          <Text style={styles.label}>🏠 Endereço: {cliente.endereco}</Text>
          <Text style={styles.label}>📝 Observações: {cliente.observacoes}</Text>
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        style={styles.button}
        onPress={() => Alert.alert("Em breve", "Função de editar ainda não implementada.")}
      >
        Editar Cliente
      </Button>

      <Button
        mode="contained"
        style={[styles.button, { backgroundColor: "red" }]}
        onPress={excluirCliente}
      >
        Excluir Cliente
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  card: {
    marginBottom: 20,
  },
  button: {
    marginTop: 10,
  },
  label: {
    marginBottom: 5,
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
