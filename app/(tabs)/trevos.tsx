import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function TrevosScreen() {
  const [trevosDisponiveis, setTrevosDisponiveis] = React.useState(0);
  // Exemplo: trevos usados fixo, pode ser dinâmico depois
  const [trevosUsados] = React.useState(0);

  React.useEffect(() => {
    // Buscar dados do usuário logado (exemplo simples)
    // Aqui você pode usar contexto, AsyncStorage, ou outra forma de obter o email do usuário logado
    const email = localStorage.getItem('email'); // Exemplo para web, ajuste para mobile se necessário
    if (email) {
      fetch(`http://localhost:3001/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha: '' }) // senha vazia só para buscar, ajuste conforme sua lógica
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.usuario) {
            setTrevosDisponiveis(data.usuario.trevos || 0);
          }
        });
    }
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Trevos</Text>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Trevos disponíveis:</Text>
        <Text style={styles.value}>{trevosDisponiveis}</Text>
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.label}>Trevos usados:</Text>
        <Text style={styles.value}>{trevosUsados}</Text>
      </View>
      {/* Anotação: Página de trevos criada para mostrar saldo e uso */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 24,
  },
  infoBox: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    width: 220,
    alignItems: 'center',
    elevation: 2,
  },
  label: {
    fontSize: 18,
    color: '#388E3C',
    marginBottom: 4,
  },
  value: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#009E60',
  },
});
