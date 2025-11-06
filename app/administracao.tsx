import storage from '@/utils/storage';
import React from 'react';
import { ActivityIndicator, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from '../components/Toast';

export default function AdministracaoScreen() {
  const [user, setUser] = React.useState('');
  const [pass, setPass] = React.useState('');
  const [toast, setToast] = React.useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
  const [doacoes, setDoacoes] = React.useState<Array<any>>([]);
  const [loadingDoacoes, setLoadingDoacoes] = React.useState(false);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const v = await storage.getItem('isAdminAuthenticated');
        if (!mounted) return;
        setIsAdmin(v === 'true');
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false; };
  }, []);

  // fetch doacoes when admin view active
  React.useEffect(() => {
    let mounted = true;
    async function load() {
      if (!isAdmin) return;
      setLoadingDoacoes(true);
      try {
        const resp = await fetch('http://localhost:3001/api/doacoes');
        const data = await resp.json();
        if (resp.ok && data.success) {
          if (!mounted) return;
          setDoacoes(data.doacoes || []);
        }
      } catch (e) {
        // ignore
      } finally {
        if (mounted) setLoadingDoacoes(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, [isAdmin]);

  const handleLogin = () => {
    // Authenticate against backend admin endpoint
    (async () => {
      if (!user || !pass) {
        setToast({ message: 'Preencha usuário e senha.', type: 'error' });
        setTimeout(() => setToast(null), 1600);
        return;
      }
      try {
        const resp = await fetch('http://localhost:3001/api/admin-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user, senha: pass }),
        });
        const data = await resp.json();
        if (resp.ok && data.success) {
          try { await storage.setItem('isAdminAuthenticated', 'true'); } catch (e) {}
          setIsAdmin(true);
          setUser('');
          setPass('');
          setToast({ message: 'Login de administrador realizado!', type: 'success' });
          setTimeout(() => setToast(null), 1200);
        } else {
          setToast({ message: data.error || 'Usuário ou senha incorretos.', type: 'error' });
          setTimeout(() => setToast(null), 2000);
        }
      } catch (e) {
        setToast({ message: 'Erro de conexão com o servidor.', type: 'error' });
        setTimeout(() => setToast(null), 2000);
      }
    })();
  };

  const handleLogout = () => {
    (async () => {
      try { await storage.removeItem('isAdminAuthenticated'); } catch (e) {}
      setIsAdmin(false);
    })();
  };

  const handleRemove = async (id: number) => {
    try {
      const resp = await fetch(`http://localhost:3001/api/doacao/${id}`, { method: 'DELETE' });
      const data = await resp.json();
      if (resp.ok && data.success) {
        setDoacoes(prev => prev.filter(d => d.id !== id));
        setToast({ message: 'Doação removida', type: 'success' });
      } else {
        setToast({ message: data.error || 'Erro ao remover', type: 'error' });
      }
    } catch (e) {
      setToast({ message: 'Erro de conexão', type: 'error' });
    }
    setTimeout(() => setToast(null), 1600);
  };

  if (!isAdmin) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F5F5F5', justifyContent: 'center' }}>
        {toast ? <Toast message={toast.message} type={toast.type} /> : null}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/images/logo.png')}
            style={styles.logoLogin}
            resizeMode="contain"
          />
          <Text style={styles.logoTitleLogin}>Ecofashion</Text>
          <Text style={styles.slogan}>LOGIN DE ADMINISTRADOR</Text>
        </View>

        <View style={styles.loginCard}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>👤</Text>
            <TextInput
              style={styles.input}
              placeholder="Usuário"
              value={user}
              onChangeText={setUser}
              autoCapitalize="none"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput
              style={styles.input}
              placeholder="Senha"
              value={pass}
              onChangeText={setPass}
              secureTextEntry
            />
          </View>
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Entrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <View style={styles.container}>
        <Text style={styles.title}>Administração — Painel</Text>
        <Text style={{ marginBottom: 12 }}>Área restrita: apenas administradores podem acessar.</Text>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutBtnText}>Sair</Text>
        </TouchableOpacity>
      </View>
      <View style={{ flex: 1, padding: 12 }}>
        {loadingDoacoes ? (
          <ActivityIndicator size="large" color="#2E7D32" />
        ) : (
          <ScrollView contentContainerStyle={{ padding: 8 }}>
            {doacoes.length === 0 && <Text>Nenhuma doação encontrada.</Text>}
            {doacoes.map((d) => (
              <View key={d.id} style={{ backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12, alignItems: 'center' }}>
                {d.fotoUrl ? (
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  <Image source={{ uri: d.fotoUrl }} style={{ width: 220, height: 160, borderRadius: 8, marginBottom: 8 }} />
                ) : null}
                <Text style={{ fontWeight: 'bold' }}>{d.descricao || 'Sem descrição'}</Text>
                <Text style={{ color: '#666' }}>Destino: {d.destino}</Text>
                <Text style={{ color: '#666' }}>Estado: {d.estado}</Text>
                <TouchableOpacity style={{ marginTop: 8, backgroundColor: '#B71C1C', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 }} onPress={() => handleRemove(d.id)}>
                  <Text style={{ color: '#fff', fontWeight: '700' }}>Remover</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Copied styles from user login (app/index.tsx) to match appearance
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
    backgroundColor: '#EDE7D4',
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
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, backgroundColor: '#F5F5F5' },
  title: { fontSize: 24, fontWeight: 'bold', color: '#2E7D32', marginBottom: 8 },
  logoutBtn: { backgroundColor: '#C62828', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12 },
  logoutBtnText: { color: '#fff', fontWeight: 'bold' },
});
