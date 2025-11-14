// app/home/clientes/index.tsx
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { supabase } from "../../../src/servicos/supabaseClient";

export default function Clientes() {
  const [clientes, setClientes] = useState<any[]>([]);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const router = useRouter();

  useEffect(() => {
    carregarClientes();
  }, []);

  async function carregarClientes() {
    setCarregando(true);

    const { data, error } = await supabase
      .from("clientes")
      .select("id, nome, telefone")
      .order("nome", { ascending: true });

    if (error) {
      console.log("Erro ao carregar clientes:", error);
    } else {
      setClientes(data || []);
    }

    setCarregando(false);
  }

  // Filtragem pela busca
  const clientesFiltrados = clientes.filter(
    (c) =>
      c.nome.toLowerCase().includes(busca.toLowerCase()) ||
      c.telefone.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.push("/home/clientes/novo_cliente")}>
        <Text style={{ fontSize: 18, color: "blue", marginBottom: 16 }}>+ Novo Cliente</Text>
      </TouchableOpacity>

      <TextInput style={styles.input} placeholder="Buscar cliente por nome ou telefone" value={busca} onChangeText={setBusca}/>

      {carregando ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={clientesFiltrados}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`../home/clientes/${item.id}`)} // página de detalhes
            >
              <Card style={styles.card}>
                <Card.Content>
                  <Text style={styles.nome}>{item.nome}</Text>
                  <Text style={styles.telefone}>{item.telefone}</Text>
                </Card.Content>
              </Card>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  card: {
    marginBottom: 12,
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
  },
  telefone: {
    fontSize: 16,
    color: "#555",
  },
});
