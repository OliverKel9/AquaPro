import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, } from "react-native";
import { supabase } from "../../src/servicos/supabaseClient";


export default function Cadastro(){
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const[telefone, setTelefone] = useState("");
    const[senha, setSenha] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const validarEmail = (email: string) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // são padrões usados para buscar, validar ou substituir textos.
        return regex.test(email);
    }

    const cadastro = async ()=>{
        if(!nome || !email || !telefone || !senha){
            Alert.alert("Erro", "Preencha todos os campos.");
            return;
        }
        if (!validarEmail(email)){
            Alert.alert("Erro", "E-mail inválido");
            return;
        }
        
        try{
            setLoading(true);

            const { data, error } = await supabase.auth.signUp({
                email: email.trim(),
                password: senha.trim(), // trim() serve para remover espaços em branco no início e no fim da string
            });

            if (error) {
                console.error("Erro no signup:", error.message);
                Alert.alert("Erro", error.message);
                return;
            }

                if(data.user?.id) {
                    console.log("Tentanto inserir perfil para usuário:", data.user.id);
                    const {error: insertError} = await supabase
                    .from("usuarios_perfil")
                    .insert([{
                        user_id: data.user.id,
                        nome_completo:nome,
                        telefone:telefone,
                        flag_alterar_senha:false,
                    }])
                    .single();

                    if (insertError) {
                        console.error("Erro detalhado na inserção:", insertError);
                        throw insertError;
                    }
                }

            Alert.alert("Cadastro realizado!", "Verifique seu e-mail para confirmar sua conta.");

            setNome("");
            setEmail("");
            setTelefone("");
            setSenha("");
        } catch (error: any) {
            Alert.alert("erro no cadastro", error.message);
        } finally {
            setLoading(false);
        }
    };

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <KeyboardAvoidingView style={{flex:1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView contentContainerStyle={styles.areaScroll} keyboardShouldPersistTaps="handled">
                    <Text style={styles.logo}>AquaPro</Text>
                    <Text style={styles.titulo}>Cadastre-se</Text>

                    <TextInput style={styles.input} placeholder="Nome Completo" placeholderTextColor="#8A8A8A" value={nome} onChangeText={setNome} returnKeyType="next"/>
                    <TextInput style={styles.input} placeholder="E-mail" placeholderTextColor="#8A8A8A" keyboardType="email-address" value={email} onChangeText={setEmail} returnKeyType="next"/>
                    <TextInput style={styles.input} placeholder="Telefone" placeholderTextColor="#8A8A8A" keyboardType="phone-pad" value={telefone} onChangeText={setTelefone} returnKeyType="next"/>
                    <TextInput style={styles.input} placeholder="Senha" placeholderTextColor="#8A8A8A" secureTextEntry value={senha} onChangeText={setSenha} returnKeyType="done"/>

                    <TouchableOpacity style={[styles.botao, loading && styles.botaoDesabilitado]} onPress={cadastro} disabled={loading}>
                        <Text style={styles.textoBotao}>{loading ?"Cadastrando..." : "Cadastrar"}</Text>

                    </TouchableOpacity>

                    <Text style={styles.loginTexto}>Já tem conta? {" "}</Text>
                    <Text style={styles.link} onPress={() => router.push("/login")}>Entrar</Text>

                </ScrollView>

            </KeyboardAvoidingView>

        </TouchableWithoutFeedback>
    );

}

const styles = StyleSheet.create({

    areaScroll:{
        flexGrow:1,
        justifyContent:"center",
        alignItems:"center",
        paddingHorizontal:21,
        paddingVertical:26,
        backgroundColor:"#F4F9FF",
    },
    logo:{
        fontSize:30,
        fontWeight:"bold",
        marginBottom:12,
        color:"#2563EB",
    },
    titulo:{
        fontSize:24,
        color:"#374151",
        marginBottom:21,
    },
    input:{
        width:"100%",
        backgroundColor:"#fff",
        padding:12,
        borderRadius:8,
        marginBottom:12,
        borderWidth:1,
        borderColor:"#d1d5db",
    },
    botao:{
        backgroundColor:"#2563EB",
        padding:15,
        borderRadius:9,
        alignItems:"center",
        width:"100%",
    },
    
    botaoDesabilitado: {
        backgroundColor:"#93C5FD",
        opacity:0.6,
    },
    textoBotao:{
        color:"#fff",
        fontWeight:"bold",
        fontSize:14,
    },
    loginTexto:{
        marginTop:16,
        fontSize:14,
        color:"#374151",
    },
    link:{
        color:"#2563EB",
        fontWeight:"bold",
    }
        
});