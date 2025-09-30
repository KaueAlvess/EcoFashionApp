import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from '../../components/Toast';

export default function SignupScreen() {
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [toast, setToast] = useState<{ message: string; type?: 'success' | 'error' } | null>(null);

  // Função para lidar com o cadastro
  const handleSignup = async () => {
    if (senha !== confirmarSenha) {
      setToast({ message: 'As senhas não coincidem!', type: 'error' });
      setTimeout(() => setToast(null), 2000);
      return;
    }
    try {
      const response = await fetch('http://localhost:3001/api/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, email, senha }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setToast({ message: 'Cadastro realizado com sucesso!', type: 'success' });
        setTimeout(() => {
          setToast(null);
          router.push('/');
        }, 1200);
      } else {
        setToast({ message: data.error || 'Erro ao cadastrar.', type: 'error' });
        setTimeout(() => setToast(null), 2000);
      }
    } catch (error) {
  setToast({ message: 'Erro de conexão com o servidor.', type: 'error' });
  setTimeout(() => setToast(null), 2000);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5', justifyContent: 'center' }}>
      {toast ? <Toast message={toast.message} type={toast.type} /> : null}
      {/* Logo e título */}
      <View style={styles.logoContainer}>
        <Image
          source={require('@/assets/images/logo.png')}
          style={styles.logoSignup}
          resizeMode="contain"
        />
        <Text style={styles.logoTitleSignup}>Ecofashion</Text>
        <Text style={styles.slogan}>CADASTRO</Text>
      </View>

      {/* Card de cadastro */}
      <View style={styles.signupCard}>
        {/* Campo de nome */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>👤</Text>
          <TextInput
            style={styles.input}
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
          />
        </View>
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
        {/* Campo de confirmação de senha */}
        <View style={styles.inputContainer}>
          <Text style={styles.inputIcon}>🔒</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirmar Senha"
            value={confirmarSenha}
            onChangeText={setConfirmarSenha}
            secureTextEntry
          />
        </View>
        {/* Botão de cadastro */}
        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
      {/* Anotação: Página de cadastro criada conforme solicitado */}
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
    marginBottom: 24,
    marginTop: 32,
  },
  logoSignup: {
    width: 120,
    height: 120,
    marginBottom: 8,
    borderRadius: 16,
    backgroundColor: '#EDE7D4',
  },
  logoTitleSignup: {
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
  signupCard: {
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
  signupButton: {
    backgroundColor: '#00C853',
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 60,
    marginTop: 8,
    marginBottom: 8,
  },
  signupButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  // Anotação: Estilos criados para tela de cadastro
});
