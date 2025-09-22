import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import TrevoTroca from '../../components/TrevoTroca';

export default function SobreNosScreen() {
  const handleDownloadApp = () => {
    Alert.alert('Essa função ainda está em desenvolvimento.', 'Em breve estará disponível!');
  };

  const quantidadeTrevos = 5;
  return (
    <View style={{ flex: 1 }}>
      <TrevoTroca quantidade={quantidadeTrevos} />
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Sobre Nós</Text>
        <Text style={styles.paragraph}>
          Aqui você terá acesso à nossa história, ter um entendimento do nosso objetivo e conduta.
        </Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EcoFashion</Text>
          <Text style={styles.paragraph}>
            Somos uma instituição de roupas, com um diferencial que é doar e recompensar os usuários.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como doar no nosso app?</Text>
          <Text style={styles.paragraph}>
            Para doar você precisa ir na área de "Doar" e seguir as instruções contidas na página. É preciso preencher as partes de requisitos de doações para prosseguir.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Como adquirir nossos produtos?</Text>
          <Text style={styles.paragraph}>
            Para adquirir nossos produtos você precisa baixar nosso App.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Conheça Pesquisadores de Moda Sustentável</Text>
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <Image
                source={require('../../assets/images/Kate.jpg')}
                style={styles.cardImage}
              />
              <Text style={styles.cardTitle}>Kate Fletcher</Text>
              <Text style={styles.cardText}>
                Especialista em moda pós-industrial e desenvolvimento local. Defende uma moda mais consciente e conectada ao meio ambiente.
              </Text>
            </View>
            <View style={styles.card}>
              <Image
                source={{ uri: 'https://images.squarespace-cdn.com/content/v1/591218e0f7e0abcf6ce40add/1516477076045-5MHBVIDGLDIM4OKPOLTB/Professor+Hazel+Clark+-+new+blue+teal.jpg' }}
                style={styles.cardImage}
              />
              <Text style={styles.cardTitle}>Hazel Clark</Text>
              <Text style={styles.cardText}>
                Trabalha com consumo duradouro e design responsável, explorando novos modelos de consumo na indústria da moda.
              </Text>
            </View>
          </View>
        </View>
        <Text style={styles.footer}>&copy; EcoFashion - Moda Sustentável</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2E7D32',
    textAlign: 'center',
  },
  paragraph: {
    fontSize: 16,
    color: '#444',
    marginBottom: 12,
    textAlign: 'center',
  },
  section: {
    marginTop: 16,
    width: '100%',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#388E3C',
    marginBottom: 8,
    textAlign: 'center',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
    flexWrap: 'wrap',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    width: 180,
    marginBottom: 12,
    elevation: 2,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 14,
    color: '#444',
    textAlign: 'center',
  },
  downloadSection: {
    marginTop: 24,
    alignItems: 'center',
    width: '100%',
  },
  downloadButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 24,
    marginTop: 8,
    marginBottom: 8,
  },
  downloadButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  downloadImage: {
    width: 120,
    height: 120,
    marginTop: 8,
    borderRadius: 16,
  },
  footer: {
    marginTop: 32,
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
});