import storage from '@/utils/storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { Animated, Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from '../components/Toast';

export default function LoginScreen() { // Renomeado para LoginScreen
  const router = useRouter();
  const [email, setEmail] = React.useState("");
  const [senha, setSenha] = React.useState("");
  // admin fields
  const [adminUser, setAdminUser] = React.useState("");
  const [adminSenha, setAdminSenha] = React.useState("");
  const [toast, setToast] = React.useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const [loginError, setLoginError] = React.useState<string | null>(null);
  const [adminError, setAdminError] = React.useState<string | null>(null);

  const loginErrorAnim = React.useRef(new Animated.Value(0));
  const adminErrorAnim = React.useRef(new Animated.Value(0));

  const showLoginError = (msg: string) => {
    setLoginError(msg);
    Animated.timing(loginErrorAnim.current, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  };
  const clearLoginError = () => {
    Animated.timing(loginErrorAnim.current, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => setLoginError(null));
  };

  const showAdminError = (msg: string) => {
    setAdminError(msg);
    Animated.timing(adminErrorAnim.current, { toValue: 1, duration: 220, useNativeDriver: true }).start();
  };
  const clearAdminError = () => {
    Animated.timing(adminErrorAnim.current, { toValue: 0, duration: 180, useNativeDriver: true }).start(() => setAdminError(null));
  };

  // Função para lidar com o login
  const API_ROOT = 'http://localhost:3001/api';

  const handleLogin = async () => {
    if (!email || !senha) {
      showLoginError('Preencha email e senha.');
      setToast({ message: 'Preencha email e senha.', type: 'error' });
      setTimeout(() => setToast(null), 1500);
      return;
    }
    try {
      const response = await fetch(`${API_ROOT}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, senha }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        // store user id in cross-platform storage
        try { await storage.setItem('idUsuario', data.usuario.id.toString()); } catch (e) { /* fallback ignored */ }
        clearLoginError();
        setToast({ message: 'Login realizado com sucesso!', type: 'success' });
        setTimeout(() => {
          setToast(null);
          router.push('/roupas');
        }, 900);
      } else {
        const msg = data.error || 'Email ou senha incorretos.';
        showLoginError(msg);
        setToast({ message: msg, type: 'error' });
        setTimeout(() => setToast(null), 2000);
      }
    } catch (error) {
      const msg = 'Erro de conexão com o servidor.';
      showLoginError(msg);
      setToast({ message: msg, type: 'error' });
      setTimeout(() => setToast(null), 2000);
    }
  };

  const handleAdminLogin = async () => {
    if (!adminUser || !adminSenha) {
      showAdminError('Preencha usuário e senha do admin.');
      setToast({ message: 'Preencha usuário e senha do admin.', type: 'error' });
      setTimeout(() => setToast(null), 1500);
      return;
    }
    try {
      const response = await fetch(`${API_ROOT}/admin-login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user: adminUser, senha: adminSenha }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
        try {
          await storage.setItem('adminId', data.usuario.id.toString());
          await storage.setItem('isAdmin', 'true');
          await storage.setItem('isAdminAuthenticated', 'true');
        } catch (e) {}
        clearAdminError();
        setToast({ message: 'Login de administrador OK', type: 'success' });
        setTimeout(() => {
          setToast(null);
          router.push('/administracao');
        }, 700);
      } else {
        const msg = data.error || 'Usuário ou senha admin incorretos.';
        showAdminError(msg);
        setToast({ message: msg, type: 'error' });
        setTimeout(() => setToast(null), 2000);
      }
    } catch (e) {
      const msg = 'Erro de conexão com o servidor.';
      showAdminError(msg);
      setToast({ message: msg, type: 'error' });
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
      {/* Back button (top-left) to provide consistent navigation */}
      <View style={{ position: 'absolute', top: Platform.OS === 'web' ? 12 : 6, left: 12, zIndex: 999 }} pointerEvents="box-none">
        <TouchableOpacity onPress={() => { try { router.back(); } catch (e) { try { router.replace('/'); } catch {} } }} style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 8 }} accessibilityLabel="Voltar">
          <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>←</Text>
        </TouchableOpacity>
      </View>
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
        <Text style={styles.welcome}>Bem-vindo</Text>
      </View>

      {/* Two-column area: user login + admin login (stacks on narrow screens) */}
      <View style={styles.cardWrapper}>
        <View style={styles.loginCard}>
          <Text style={styles.cardTitle}>Entrar como usuário</Text>
          <Text style={styles.cardSubtitle}>Acesse sua conta para trocar e doar roupas</Text>
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
          {loginError ? (
            <Animated.Text style={[styles.errorText, { opacity: loginErrorAnim.current }]}>{loginError}</Animated.Text>
          ) : null}
          {/* Botão de login */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.85}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>
          {/* Links de cadastro (moved) */}
        </View>

        <View style={styles.adminCard}>
          <Text style={styles.cardTitleAdmin}>Área de administração</Text>
          <Text style={styles.cardSubtitleSmall}>Acesso restrito — apenas administradores</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput
              style={styles.input}
              placeholder="Usuário ou email"
              value={adminUser}
              onChangeText={setAdminUser}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={adminSenha}
              onChangeText={setAdminSenha}
              secureTextEntry
            />
          </View>
          {adminError ? (
            <Animated.Text style={[styles.errorText, { opacity: adminErrorAnim.current }]}>{adminError}</Animated.Text>
          ) : null}
          <TouchableOpacity style={styles.adminButtonPrimary} onPress={handleAdminLogin} activeOpacity={0.85}>
            <Text style={styles.adminButtonText}>Entrar como admin</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Centralized signup area */}
      <View style={styles.signupCenter}>
        <Text style={styles.signupText}>Não tem uma conta?</Text>
        <TouchableOpacity onPress={handleSignup}>
          <Text style={styles.signupLink}>Criar uma conta</Text>
        </TouchableOpacity>
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
  welcome: {
    fontSize: 14,
    color: '#4a4a4a',
    marginTop: 6,
    textAlign: 'center',
    maxWidth: 320,
  },
  loginCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginHorizontal: 24,
    width: Platform.OS === 'web' ? '46%' : '88%',
    maxWidth: 420,
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
    width: '100%',
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
    backgroundColor: '#2E7D32',
    borderRadius: 28,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginTop: 12,
    marginBottom: 8,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#2E7D32',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
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
  adminLink: {
    color: '#888',
    textDecorationLine: 'underline',
    fontSize: 13,
  },
  cardWrapper: {
    flexDirection: Platform.OS === 'web' ? 'row' : 'column',
    justifyContent: Platform.OS === 'web' ? 'space-between' : 'center',
    alignItems: Platform.OS === 'web' ? 'flex-start' : 'center',
    marginHorizontal: 16,
    paddingVertical: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 6,
    color: '#233d20',
    alignSelf: Platform.OS === 'web' ? 'flex-start' : 'center',
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
    alignSelf: Platform.OS === 'web' ? 'flex-start' : 'center',
  },
  cardTitleAdmin: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
    color: '#7b1f1f',
    alignSelf: Platform.OS === 'web' ? 'flex-start' : 'center',
  },
  cardSubtitleSmall: {
    fontSize: 12,
    color: '#777',
    marginBottom: 10,
    alignSelf: Platform.OS === 'web' ? 'flex-start' : 'center',
  },
  adminCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    width: Platform.OS === 'web' ? '46%' : '88%',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#f1dede',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  adminButtonPrimary: {
    backgroundColor: '#B71C1C',
    borderRadius: 22,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginTop: 8,
    width: '100%',
    alignItems: 'center',
  },
  signupCenter: {
    marginTop: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#b00020',
    fontSize: 13,
    marginTop: 6,
    alignSelf: 'flex-start',
  },
  // Anotação: Estilos criados para tela de login conforme print
});