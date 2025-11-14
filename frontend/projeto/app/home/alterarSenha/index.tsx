import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../../../src/servicos/supabaseClient";

export default function AlterarSenha() {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [flagAlterar, setFlagAlterar] = useState(false);
  const router = useRouter();
  
  useEffect(() => {
    verificarFlag();
  }, []);

  async function verificarFlag() {
    const { data: user } = await supabase.auth.getUser();

    if (!user?.user) {
      Alert.alert("Erro", "Usuário não encontrado.");
      return;
    }

    const { data, error } = await supabase
      .from("usuarios_perfil")
      .select("flag_alterar_senha")
      .eq("user_id", user.user.id)
      .single();

    if (error) {
      Alert.alert("Erro", error.message);
      return;
    }

    setFlagAlterar(data.flag_alterar_senha);
  }

  async function alterarSenha() {
      if (senhaAtual.trim() === novaSenha.trim()) {
          Alert.alert("Erro", "A nova senha deve ser diferente da senha atual!");
          return;
      }

      if (novaSenha !== confirmarSenha) {
          Alert.alert("Erro", "As senhas não conferem!");
          return;
      }

      try {
          const { data: userData, error: userError } = await supabase.auth.getUser();

          if (userError || !userData?.user?.email) {
              Alert.alert("Erro", "Não foi possível obter o usuário autenticado.");
              return;
          }

          // reautentica o usuário
          const { error: signInError } = await supabase.auth.signInWithPassword({
              email: userData.user.email,
              password: senhaAtual,
          });

          if (signInError) {
              Alert.alert("Erro", "Senha atual incorreta!");
              return;
          }

          //atualiza para a nova senha
          const { error: updateError } = await supabase.auth.updateUser({
              password: novaSenha,
          });

          if (updateError) {
              Alert.alert("Erro", "Erro ao atualizar a senha: " + updateError.message);
              return;
          }

          const userId = userData.user.id;
          const { error: flagError } = await supabase
              .from("usuarios_perfil")
              .update({ flag_alterar_senha: false })
              .eq("user_id", userId);

          if (flagError) {
              console.error("Erro ao atualizar flag:", flagError);
          }

          Alert.alert("Sucesso", "Senha alterada com sucesso!");
          setSenhaAtual("");
          setNovaSenha("");
          setConfirmarSenha("");
          router.push("/home");
      } catch (err) {
          const errorMsg = err instanceof Error ? err.message : JSON.stringify(err);
          Alert.alert("Erro", errorMsg);
      }
}

  return (
    <View style={styles.container}>
      {flagAlterar ? (
        <>
          <Text style={styles.titulo}>Alterar Senha</Text>

          <TextInput placeholder="Senha Atual" secureTextEntry style={styles.input}value={senhaAtual} onChangeText={setSenhaAtual}/>

          <TextInput placeholder="Nova Senha" secureTextEntry style={styles.input} value={novaSenha} onChangeText={setNovaSenha}/>

          <TextInput placeholder="Confirmar Nova Senha" secureTextEntry style={styles.input} value={confirmarSenha} onChangeText={setConfirmarSenha}/>

          <TouchableOpacity style={styles.botao} onPress={alterarSenha}>
            <Text style={styles.textoBotao}>Salvar</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.textoInfo}>Você não precisa alterar a senha agora.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
  botao: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  textoInfo: {
    fontSize: 16,
    color: "#555",
  },
});
