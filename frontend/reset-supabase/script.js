const SUPABASE_URL = "https://ekgcdtwesrobueaybpft.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZ2NkdHdlc3JvYnVlYXlicGZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczODk0MzgsImV4cCI6MjA3Mjk2NTQzOH0.ovcIGCDk0mJj1RhP3hpa54FYmOdmBVuHlZ0v3FaGHLo";

// Criar cliente Supabase
const client = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Pegar o token enviado pelo Supabase via URL (hash)
const hash = window.location.hash;
const params = new URLSearchParams(hash.substring(1));
const access_token = params.get("access_token");
const refresh_token = params.get("refresh_token");

async function initSession() {
  if (access_token && refresh_token) {
    await client.auth.setSession({ access_token, refresh_token });
  }
}
initSession();

// Listener do formulário
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
    const { error } = await client.auth.updateUser({ password });

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
