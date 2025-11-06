import { useRouter } from 'expo-router';
import React from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from '../components/Toast';

export default function LoginScreen() { // Renomeado para LoginScreen
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  const [toast, setToast] = React.useState<{ message: string; type?: 'success' | 'error' } | null>(null);

  // Função para lidar com o login
  const handleLogin = async () => {
    if (!email || !senha) {
      alert('Preencha email e senha.');
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        localStorage.setItem('idUsuario', data.usuario.id.toString());
        setToast({ message: 'Login realizado com sucesso!', type: 'success' });
        setTimeout(() => {
          setToast(null);
          router.push('/roupas');
        }, 1200);
      } else {
        setToast({ message: data.error || 'Email ou senha incorretos.', type: 'error' });
        setTimeout(() => setToast(null), 2000);
      }
    } catch (error) {
  setToast({ message: 'Erro de conexão com o servidor.', type: 'error' });
  setTimeout(() => setToast(null), 2000);
    }
  };

  // Função para o botão 'Criar uma conta'
  const handleSignup = () => {
    // Redireciona para a página de cadastro
    router.push('/signup');
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5', justifyContent: 'center' }}>
      {toast ? <Toast message={toast.message} type={toast.type} /> : null}
      {/* Logo e título */}
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logoLogin}
          resizeMode="contain"
        />
        <Text style={styles.logoTitleLogin}>Ecofashion</Text>
        <Text style={styles.slogan}>MODA SUSTENTÁVEL</Text>
      </View>

      {/* Card de login */}
      <View style={styles.loginCard}>
        {/* Campo de email */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>📧</Text>
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        {/* Campo de senha */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            secureTextEntry
          />
        </View>
        {/* Botão de login */}
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        {/* Links de cadastro */}
        <View style={styles.signupLinks}>
          <Text style={styles.signupText}>Não tem uma conta?</Text>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupLink}>Criar uma conta</Text>
          </TouchableOpacity>
          {/* Anotação: Função handleSignup adicionada para o botão de cadastro */}
        </View>
        {/* Botão para logar como administrador */}
        <View style={{ marginTop: 12 }}>
          <TouchableOpacity style={styles.adminButton} onPress={() => router.push('/administracao')}>
            <Text style={styles.adminButtonText}>Logar como administrador</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Anotação: Layout modificado para tela de login conforme print enviado */}
    </View>
  );
}

const styles = StyleSheet.create({
  // Estilos para tela de login
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 32,
  },
  logoLogin: {
    width: 120,
    height: 120,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: '#EDE7D4', // fundo bege para destacar a logo
  },
  logoTitleLogin: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 2,
  },
  slogan: {
    fontSize: 18,
    color: '#C62828',
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 1,
  },
  loginCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F3F3',
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    width: 260,
    height: 44,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 8,
    color: '#888',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#444',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 10,
  },
  forgotPasswordText: {
    color: '#2E7D32',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  loginButton: {
    backgroundColor: '#00C853',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 60,
    marginTop: 8,
    marginBottom: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  signupLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  signupText: {
    fontSize: 14,
    color: '#888',
    marginRight: 4,
  },
  signupLink: {
    fontSize: 14,
    color: '#2E7D32',
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
  adminButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignSelf: 'center',
  },
  adminButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  // Anotação: Estilos criados para tela de login conforme print
});