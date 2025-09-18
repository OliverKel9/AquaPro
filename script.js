// Substitua pelos dados do seu projeto Supabase
const SUPABASE_URL = "https://SEU-PROJETO.supabase.co";
const SUPABASE_KEY = "SEU-ANON-KEY";

const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.getElementById("reset-form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  const message = document.getElementById("message");

  if (password !== confirmPassword) {
    message.textContent = "As senhas não coincidem!";
    message.style.color = "red";
    return;
  }

  try {
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      message.textContent = "Erro: " + error.message;
      message.style.color = "red";
    } else {
      message.textContent = "Senha redefinida com sucesso! 🎉";
      message.style.color = "green";
    }
  } catch (err) {
    message.textContent = "Erro inesperado: " + err.message;
    message.style.color = "red";
  }
});