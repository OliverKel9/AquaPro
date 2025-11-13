import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useRef, useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, } from "react-native";
import { supabase } from "../src/servicos/supabaseClient";

export default function EsqueciSenhaScreen() {
  const [email, setEmail] = useState("");
  const emailRef = useRef<TextInput>(null);
  const router = useRouter();

  const validarEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const redefinirSenha = async () => {
    if (!validarEmail(email)) {
      Alert.alert("Erro", "Digite um e-mail válido.");
      return;
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "https://aquapro-git-main-kelton-oliveiras-projects.vercel.app/", 
      });

      if (error) {
        Alert.alert("Erro", error.message);
      } else {
        Alert.alert(
          "Sucesso",
          "Enviamos um e-mail com instruções para redefinir sua senha."
        );
        setEmail("");
        router.push("/login");
      }
    } catch (err) {
      console.error(err);
      Alert.alert("Erro", "Algo deu errado, tente novamente.");
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">

          <View style={styles.cabecalho}>
            <Ionicons name="mail-outline" size={48} />
            <Text style={styles.titulo}>Recuperar Senha</Text>
            <Text style={styles.subtitulo}>Digite seu e-mail para receber o link de redefinição</Text>
          </View>

          <View style={styles.corpo}>
            <TextInput ref={emailRef} style={styles.input} placeholder="Digite seu e-mail" placeholderTextColor="#8A8A8A" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" autoComplete="email" returnKeyType="send" onSubmitEditing={redefinirSenha}/>
          </View>

          <View style={styles.botoes}>
            <TouchableOpacity style={styles.botaoVoltar} onPress={() => router.push("/login")}>
              <Text style={styles.botaoVoltarTexto}>Voltar ao Login</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.botaoReset} onPress={redefinirSenha}>
              <Text style={styles.botaoResetTexto}>Enviar link</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 24,
    backgroundColor: "#F4F9FF",
  },
  cabecalho: {
    alignItems: "center",
    marginBottom: 18,
    gap: 8 as any,
  },
  titulo: {
    fontSize: 28,
    fontWeight: "700",
    color: "#0B5AA2",
  },
  subtitulo: {
    fontSize: 14,
    color: "#5A6573",
    textAlign: "center",
    marginTop: 4,
  },
  corpo: {
    marginTop: 14,
  },

  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#CBD5E1",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 48,
    fontSize: 16,
  },
  botoes: {
    marginTop: 22,
    gap: 12 as any,
  },
  botaoVoltar: {
    backgroundColor: "#E5E7EB",
    borderRadius: 12,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
  },
  botaoVoltarTexto: {
    color: "#111827",
    fontWeight: "600",
    fontSize: 16,
  },
  botaoReset: {
    backgroundColor:"#0B5AA2",
    borderRadius:12,
    width:"100%",
    height:48,
    alignItems:"center",
    justifyContent:"center",
    marginTop:2,
  },
  botaoResetTexto: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});
