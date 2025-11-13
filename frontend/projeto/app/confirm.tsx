import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, View } from "react-native";
import { supabase } from "../src/servicos/supabaseClient";

export default function ConfirmarEmail() {
  const { token } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    async function confirmEmail() {
      if (token) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token as string,
          type: 'email',
        });

        if (error) {
          alert("Erro ao confirmar e-mail: " + error.message);
        } else {
          alert("E-mail confirmado!");
          router.replace("/login");
        }
      }
    }

    confirmEmail();
  }, [token]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Confirmando seu e-mail...</Text>
    </View>
  );
}