import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native';

type TrevoTrocaProps = {
  quantidade?: number;
  onPress?: () => void;
};

export default function TrevoTroca({ quantidade, onPress }: TrevoTrocaProps) {
  const [local, setLocal] = React.useState<number>(quantidade ?? 0);

  React.useEffect(() => {
    // se quantidade foi passada via prop, use-a; caso contrário tente ler do localStorage
    if (typeof quantidade === 'number') {
      setLocal(quantidade);
    } else {
      try {
        const t = localStorage.getItem('trevos');
        setLocal(t ? parseInt(t, 10) : 0);
      } catch (e) {
        setLocal(0);
      }
    }

    const handleStorage = (ev: StorageEvent) => {
      if (ev.key === 'trevos') {
        setLocal(ev.newValue ? parseInt(ev.newValue, 10) : 0);
      }
    };
    window.addEventListener('storage', handleStorage as any);
    return () => window.removeEventListener('storage', handleStorage as any);
  }, [quantidade]);

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <Image source={require('../assets/images/trevo.png')} style={styles.icon} />
      <Text style={styles.text}>{local}</Text>
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