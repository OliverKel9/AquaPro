import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Alert, Keyboard, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View, } from "react-native";
import { supabase } from "../../src/servicos/supabaseClient";


export default function TelaLogin() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const emailRef = useRef<TextInput>(null); //referência direta ao campo <TextInput> (pra focar, limpar, etc.)
    const senhaRef = useRef<TextInput>(null);
    const router = useRouter();

    const limparCampos = () => {
        setEmail("");
        setSenha("");
        emailRef.current?.focus();
    };
    
    const validarEmail = (email: string) =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

    const entrarNoSistema = async () =>{
        if (!validarEmail(email)) 
            return Alert.alert("Erro", "Email inválido");
        if (!senha) 
            return Alert.alert("Erro", "Senha inválida");

        const {error} = await supabase.auth.signInWithPassword({
            email,
            password: senha,
        });

        if (error) Alert.alert("Erro no login", error.message);
        else router.replace("/home");
    };

    return(
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Ionicons name="water-outline" size={48} color="#0B5AA2"/>
                    <Text style={styles.titulo}>AquaPro</Text>
                    <Text style={styles.subTitulo}>Acesse sua conta</Text>

                    <TextInput ref={emailRef} style={styles.input} placeholder="E-mail" value={email} placeholderTextColor="#b0b3b9ff" onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" returnKeyType="next" onSubmitEditing={() => senhaRef.current?.focus()}/>
                    
                    <View style={styles.senhaContainer}>
                        <TextInput ref={senhaRef} style={styles.inputSenha} placeholder="Senha" placeholderTextColor="#b0b3b9ff" value={senha} onChangeText={setSenha} secureTextEntry={!mostrarSenha} />
                        <TouchableOpacity onPress={() => setMostrarSenha(!mostrarSenha)} style={styles.olhoBotao}>
                            <Ionicons name={mostrarSenha ? "eye-off" : "eye"} size={22} color="#4A5568"/>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.limpar} onPress={limparCampos}>
                        <Text style={styles .textoLimpar}>Limpar</Text>
                    </TouchableOpacity>

                    <View style={styles.botoes}>
                        <TouchableOpacity style={styles.botaoCadastrar} onPress={() => router.push("/criar_usuario")}>
                            <Text style={styles .textoBotaoCadastrar}>Cadastrar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.botaoEsqueciSenha} onPress={() => router.push("/esqueci_senha")}>
                            <Text style={styles.textoBotaoEsqueciSenha}>Esqueci Senha</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles .botaoEntrar} onPress={entrarNoSistema}>
                        <Text style={styles .textoBotaoEntrar}>Entrar</Text>
                    </TouchableOpacity>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({

    container: {
        flexGrow:1,
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:"#F4F9FF",
        padding:24,
    },

    titulo: {
        fontSize:26,
        fontWeight:"700",
        color:"#0B5AA2",
        marginTop:8,
    },

    subTitulo: {
        fontSize:16,
        color:"#475569",
        marginTop:4,
    },

    input: {
        width:"100%",
        backgroundColor:"#fff",
        borderColor:"#CBD5E1",
        borderWidth:1,
        borderRadius:12,
        paddingHorizontal:14,
        height:48,
        marginTop:10,
    },

    senhaContainer: {
        flexDirection:"row",
        alignItems:"center",
        backgroundColor:"#fff",
        borderColor:"#CBD5E1",
        borderWidth:1,
        borderRadius:12,
        paddingRight:8,
        height:48,
        marginTop:10,
    },

    inputSenha: {
        flex:1,
        paddingHorizontal:14,
    },

    olhoBotao: {
        padding:8,
    },

    limpar:{
        marginTop:13,
        alignSelf:"flex-start",
        marginLeft:7,
    },
    
    textoLimpar:{
        color:"#2f343dff",
        fontWeight:"700",
        fontSize:15,
    },

    botoes:{
        flexDirection: "row",   //coloca os elementos lado a lado
        justifyContent: "space-between",
        marginTop:10,
    },

    botaoEsqueciSenha:{
        backgroundColor:"#E5E7EB",
        borderRadius:12,
        height:48,
        alignItems: "center",
        justifyContent:"center",
        marginTop:14,
        flex: 1,              
        marginHorizontal: 5,
    },

    textoBotaoEsqueciSenha:{
        color:"#111827",
        fontWeight:"700",
        fontSize:16,
    },

    botaoCadastrar: {
        backgroundColor:"#E5E7EB",
        borderRadius:12,
        height:48,
        alignItems: "center",
        justifyContent:"center",
        marginTop:14,
        flex: 1,                //faz os dois terem o mesmo tamanho
        marginHorizontal: 5,    //espaço entre os botões
    },

    textoBotaoCadastrar: {
        color:"#111827",
        fontWeight:"700",
        fontSize:16,
    },

    botaoEntrar: {
        backgroundColor:"#0B5AA2",
        borderRadius:12,
        width:"100%",
        height:48,
        alignItems:"center",
        justifyContent:"center",
        marginTop:14,
    },

    textoBotaoEntrar: {
        color:"#fff",
        fontWeight:"700",
        fontSize:16,
    },
})