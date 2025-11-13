import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, KeyboardAvoidingView, Modal, Platform, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Button, Card, Snackbar, Text, TextInput } from "react-native-paper";
import { supabase } from "../../src/servicos/supabaseClient";

export default function Home() {
    const [modalPagamento, setModalPagamento] = useState (false);
    const [modalAgendamento, setModalAgendamento] = useState (false);
    const [mensagem, setMensagem] = useState("");
    const router = useRouter();

    async function sair(){
        const {error} = await supabase.auth.signOut();
        if (error){Alert.alert("Erro ao sair: " + error.message);
        } else {router.replace("/login");
        }
    }

    //estados para o formulário de pagamento e agendamento
    const [pagamento, setPagamento] = useState({
        nome: "",
        valor: "",
        status: "",
    });

    const [agendamento, setAgendamento] = useState({
        nome: "",
        tipo_servico: "",
        data: "",
        hora: "",
    });

    const salvarPagamento = async () => {
        const {error} = await supabase.from("pagamentos").insert([pagamento]);
        if (error) setMensagem("Erro ao salvar pagamento");
        else{
            setMensagem("Pagamento registrado com sucesso!");
            setModalPagamento(false);
            setPagamento({nome: "", valor: "", status: ""});
        }
    };

    const salvarAgendamento = async () => {
        const {error} = await supabase.from("agendamentos").insert([agendamento]);
        if (error) setMensagem("Erro ao salvar agendamento");
        else{
            setMensagem("Agendamento registrado com sucesso!");
            setModalAgendamento(false);
            setAgendamento(({nome: "", tipo_servico: "", data: "", hora: ""}));
        }
    };

    return (
        
        <View style= {styles.container}>

            <View style={styles.botaoTopo}>
                <TouchableOpacity style={styles.botaoTrocarSenha}onPress={() => router.push("/home/alterarSenha")}>
                    <Text style={styles.textoTrocarSenhaESair}>Alterar Senha</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.botaoSair} onPress={sair}>
                    <Text style={styles.textoTrocarSenhaESair}>Sair</Text>
                </TouchableOpacity>
            </View>

            <Text style= {styles.titulo}>Bem-vindo! </Text>

            <View style={styles.cardsContainer}>
                <Card style={styles.cardInfo}>
                    <Card.Content>
                        <TouchableOpacity onPress={() => router.push("/home/clientes")}>
                            <Text style={styles.cardTitulo}>Clientes</Text>
                        </TouchableOpacity>
                    </Card.Content>
                </Card>

                <Card style={styles.cardInfo}>
                    <Card.Content>
                        <TouchableOpacity onPress={() => router.push("/home/pagamentos")}>
                            <Text style={styles.cardTitulo}>pagamentos</Text>
                        </TouchableOpacity>
                    </Card.Content>
                </Card>

                <Card style={styles.cardInfo}>
                    <Card.Content>
                        <TouchableOpacity onPress={() =>router.push("/home/agendamentos")}>
                            <Text style={styles.cardTitulo}>Agendamentos</Text>
                        </TouchableOpacity>
                    </Card.Content>
                </Card>
            </View>

            <Card style= {styles.card}>
                <Card.Content>
                    <Button mode="contained" onPress={() => setModalPagamento(true)} style={styles.botao} buttonColor="#0B5AA2">Registrar Pagamento</Button> 
                    {/* "() => é um arrow funcion, colocando ele depois do onPress, significa que ele vai indicar o que fazer depois de apertão o botão"*/}
                    {/*tanto o Card quanto o Button vem da bibliotexa react-native-paper*/}

                    <Button mode="contained" onPress={() => setModalAgendamento(true)} style={styles.botao} buttonColor="#0B5AA2">Adicionar Agendamento</Button>
                </Card.Content>
            </Card>

            {/*Modal pagamento*/}
            <Modal visible={modalPagamento} animationType="slide">
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}>
                    <ScrollView contentContainerStyle={styles.modalContainer}>

                        <Text style={styles.modalTitulo}>Registrar Pagamento</Text>

                        <TextInput label="Nome do cLiente" value={pagamento.nome} onChangeText={(texto) => setPagamento({...pagamento, nome: texto})} style={styles.input}/>
                        <TextInput label="Valor" keyboardType="numeric" value={pagamento.valor} onChangeText={(texto) => setPagamento({...pagamento, valor: texto})} style={styles.input}/>
                        <TextInput label="Status (pago/pendente)" value={pagamento.status} onChangeText={(texto) => setPagamento({...pagamento, status: texto})} style={styles.input}/>

                        <Button mode="contained" onPress={salvarPagamento} style={styles.botao} buttonColor="#0B5AA2">Salvar</Button>
                        <Button mode="contained" onPress={()=>setModalPagamento(false)} style={styles.botaoVoltar} buttonColor="#0B5AA2">Voltar</Button>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>

            {/*Modal agendamento*/}
            <Modal visible={modalAgendamento} animationType="slide">
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}>
                    <ScrollView contentContainerStyle={styles.modalContainer}>
                        <Text style={styles .modalTitulo}>Adicionar Agendmento</Text>

                        <TextInput label="Nome do cliente" value={agendamento.nome} onChangeText={(text) => setAgendamento({...agendamento, nome: text})} style={styles.input}/>
                        <TextInput label="Tipo de serviço" value={agendamento.tipo_servico} onChangeText={(texto) => setAgendamento({...agendamento, tipo_servico: texto})} style={styles.input}/>
                        <TextInput label="Data" placeholder="DD/MM/AAAA" value={agendamento.data} onChangeText={(texto) => setAgendamento({...agendamento, data: texto})} style={styles.input}/>
                        <TextInput label="Hora" placeholder="HH:MM" value={agendamento.hora} onChangeText={(texto) => setAgendamento({...agendamento, hora: texto})} style={styles.input}/>

                        <Button mode="contained" onPress={salvarAgendamento} style={styles.botao} buttonColor="#0B5AA2">Agendar</Button>
                        <Button mode="contained" onPress={()=>setModalAgendamento(false)} style={styles.botaoVoltar} buttonColor="#0B5AA2">Voltar</Button>
                    </ScrollView>
                </KeyboardAvoidingView>
            </Modal>

            {/*Snackbar*/}
            <Snackbar visible={!!mensagem} onDismiss={() => setMensagem("")} duration={2400}>
                {mensagem}
            </Snackbar>
            
        </View>
    );
}

// Estilos
const styles = StyleSheet.create({
    
    container: {
        flex:1,
        justifyContent:"center",
        padding:20,
        backgroundColor:"#f5f5f5",
    },
    botaoTopo:{
        flexDirection:"row",
        justifyContent:"flex-end",
        marginBottom:40,
        padding:15,
    },
    botaoTrocarSenha:{
        backgroundColor: "#0B5AA2",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginLeft: 8,
    },
    botaoSair:{
        backgroundColor: "#C62828",
        borderRadius: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        marginLeft: 8,
    },
    textoTrocarSenhaESair:{
        color: "#fff",
        fontWeight: "bold",
        fontSize: 14,
    },

    titulo: {
        fontSize:22,
        fontWeight:"bold",
        textAlign:"center",
        marginBottom:20,
    },
    cardsContainer:{
        marginBottom:25,
    },
    cardInfo:{
        marginBottom:15,
        borderRadius:10,
        backgroundColor:"#fdf8ff"
    },
    cardTitulo:{
        textAlign:"center",
        fontSize:18,
        fontWeight:"bold",
        color:"#0B5AA2",
        marginBottom:6,
    },
    botaoCard:{
    
    },
    card: {
        padding:20,
        borderRadius:10,
    },
    botao: {
        marginTop:9
    },
    botaoVoltar:{
        marginTop:10,

    },
    modalContainer:{
        padding:20,
        flexGrow:1,
        justifyContent:"center",
    },
    modalTitulo:{
        fontSize:20,
        fontWeight:"bold",
        textAlign:"center",
        marginBottom:20,
    },
    input:{
        marginBottom:14,
    },

});