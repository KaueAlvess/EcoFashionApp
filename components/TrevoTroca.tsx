import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

type TrevoTrocaProps = {
  quantidade: number;
  onPress?: () => void;
};

export default function TrevoTroca({ quantidade, onPress }: TrevoTrocaProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={require('../assets/images/trevo.png')} style={styles.icon} />
      <Text style={styles.text}>{quantidade}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    position: 'absolute',
    top: 12,
    left: 12,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 2,
    zIndex: 10,
  },
  icon: {
    width: 28,
    height: 28,
    marginRight: 6,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2E7D32',
  },
});