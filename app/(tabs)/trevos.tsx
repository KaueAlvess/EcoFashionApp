import storage from '@/utils/storage';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Animated, Easing, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Defs, Mask, Rect, Image as SvgImage } from 'react-native-svg';

export default function TrevosScreen() {
  const [trevosDisponiveis, setTrevosDisponiveis] = React.useState<number>(0);
  const [trevosUsados] = React.useState<number>(0);
  const [loading, setLoading] = React.useState<boolean>(false);
  const progressAnim = React.useRef(new Animated.Value(0)).current;

  // tabela de valores padrão para doações (classe de peça -> trevos)
  const tabelaValores: Record<string, number> = {
    'Camiseta (bom estado)': 5,
    'Moletom (bom estado)': 6,
    'Calça/Jeans (bom estado)': 6,
    'Casaco/Jaqueta (bom estado)': 7,
    'Vestido (bom estado)': 6,
    'Blusa (bom estado)': 5,
    'Camiseta (rasgada / ruim)': 2,
    'Peça pequena (acessório)': 1,
  };

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const t = await storage.getItem('trevos');
        if (!mounted) return;
        setTrevosDisponiveis(t ? parseInt(t, 10) : 0);
      } catch (e) {
        if (!mounted) return;
        setTrevosDisponiveis(0);
      }
    })();

    const cb = (k: string, v: string | null) => {
      if (k === 'trevos') setTrevosDisponiveis(v ? parseInt(v, 10) : 0);
    };
    try { storage.addChangeListener(cb); } catch (e) {}

    // also listen for window 'storage' events so manual dispatches update this view immediately
    const onStorage = (ev: StorageEvent) => {
      try {
        if (!ev.key) return;
        if (ev.key === 'trevos') {
          setTrevosDisponiveis(ev.newValue ? parseInt(ev.newValue, 10) : 0);
        }
      } catch (e) {}
    };
    try { window.addEventListener('storage', onStorage as any); } catch (e) {}

    return () => { mounted = false; try { storage.removeChangeListener(cb); } catch (e) {} try { window.removeEventListener('storage', onStorage as any); } catch (e) {} };
  }, []);

  const refreshTrevos = React.useCallback(async () => {
    if (loading) return;
    setLoading(true);
    progressAnim.setValue(0);
    // Animate toward 80% while fetching to feel responsive and "real"
    Animated.timing(progressAnim, { toValue: 80, duration: 900, useNativeDriver: false }).start();
    try {
      // simulate progressive fetch behaviour: if your backend exposes steps, replace this
      const t = await storage.getItem('trevos');
      setTrevosDisponiveis(t ? parseInt(t, 10) : 0);
      // save last update timestamp
      const now = Date.now();
      try { await storage.setItem('trevos_last_update', String(now)); } catch (e) {}
      // animate to completion
      Animated.timing(progressAnim, { toValue: 100, duration: 500, useNativeDriver: false }).start(() => {
        // show success check/confetti briefly
        try { setShowSuccess(true); } catch (e) {}
        setTimeout(() => { setShowSuccess(false); setLoading(false); progressAnim.setValue(0); }, 900);
      });
    } catch (e) {
      // on error, quickly finish and reset
      Animated.timing(progressAnim, { toValue: 100, duration: 300, useNativeDriver: false }).start(() => {
        setTimeout(() => { setLoading(false); progressAnim.setValue(0); }, 300);
      });
    }
  }, [loading, progressAnim]);

  // last update timestamp (read from storage)
  const [lastUpdate, setLastUpdate] = React.useState<number | null>(null);
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const ts = await storage.getItem('trevos_last_update');
        if (!mounted) return;
        setLastUpdate(ts ? parseInt(ts, 10) : null);
      } catch (e) { if (!mounted) return; setLastUpdate(null); }
    })();
    const cb = (k:string, v:string|null) => { if (k === 'trevos_last_update') setLastUpdate(v ? parseInt(v,10) : null); };
    try { storage.addChangeListener && storage.addChangeListener(cb); } catch (e) {}
    return () => { mounted = false; try { storage.removeChangeListener && storage.removeChangeListener(cb); } catch (e) {} };
  }, []);

  // success animation state
  const [showSuccess, setShowSuccess] = React.useState(false);
  const successScale = React.useRef(new Animated.Value(0.6)).current;
  React.useEffect(() => {
    if (showSuccess) {
      successScale.setValue(0.6);
      Animated.spring(successScale, { toValue: 1, friction: 6, useNativeDriver: true }).start();
      // optional: you could trigger a small confetti sequence here
    }
  }, [showSuccess, successScale]);

  // hero shimmer + pulse for number
  const heroPulse = React.useRef(new Animated.Value(1)).current;
  const shimmerX = React.useRef(new Animated.Value(-120)).current;
  React.useEffect(() => {
    // continuous shimmer animation
    Animated.loop(
      Animated.timing(shimmerX, { toValue: 240, duration: 2100, easing: Easing.linear, useNativeDriver: true }),
    ).start();
  }, [shimmerX]);

  // rotate icon + orbit ring animations
  const rotateIcon = React.useRef(new Animated.Value(0)).current;
  const ringSpin = React.useRef(new Animated.Value(0)).current;
  const ringPulse = React.useRef(new Animated.Value(1)).current;
  React.useEffect(() => {
    // continuous slow rotation of the icon
    Animated.loop(
      Animated.timing(rotateIcon, { toValue: 1, duration: 6000, easing: Easing.linear, useNativeDriver: true }),
    ).start();
    // ring spin (faster) and stronger pulse for emphasis
    Animated.loop(
      Animated.parallel([
        Animated.timing(ringSpin, { toValue: 1, duration: 2600, easing: Easing.linear, useNativeDriver: true }),
        Animated.loop(Animated.sequence([
          Animated.timing(ringPulse, { toValue: 1.12, duration: 900, useNativeDriver: true }),
          Animated.timing(ringPulse, { toValue: 1, duration: 900, useNativeDriver: true }),
        ])),
      ]),
    ).start();
  }, [rotateIcon, ringSpin, ringPulse]);

  // pulse hero number when balance changes
  const prevBalanceRef = React.useRef<number | null>(null);
  React.useEffect(() => {
    const prev = prevBalanceRef.current;
    if (prev !== null && prev !== trevosDisponiveis) {
      heroPulse.setValue(0.88);
      Animated.spring(heroPulse, { toValue: 1, friction: 5, useNativeDriver: true }).start();
      // small success flash
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 700);
    }
    prevBalanceRef.current = trevosDisponiveis;
  }, [trevosDisponiveis, heroPulse]);

  const progressWidth = progressAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] });

  // realtime change badge state (shows +N / -N when balance changes)
  const prevTrevosRef = React.useRef<number | null>(null);
  const [changeDelta, setChangeDelta] = React.useState<number | null>(null);
  const [showChange, setShowChange] = React.useState(false);
  const changeScale = React.useRef(new Animated.Value(0.6)).current;
  const changeOpacity = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    const prev = prevTrevosRef.current;
    if (prev !== null && prev !== trevosDisponiveis) {
      const delta = trevosDisponiveis - prev;
      setChangeDelta(delta);
      setShowChange(true);
      changeOpacity.setValue(0);
      changeScale.setValue(0.6);
      Animated.parallel([
        Animated.timing(changeOpacity, { toValue: 1, duration: 260, useNativeDriver: true }),
        Animated.spring(changeScale, { toValue: 1, friction: 6, useNativeDriver: true }),
      ]).start(() => {
        // hide after short delay
        setTimeout(() => {
          Animated.parallel([
            Animated.timing(changeOpacity, { toValue: 0, duration: 260, useNativeDriver: true }),
            Animated.timing(changeScale, { toValue: 0.6, duration: 260, useNativeDriver: true }),
          ]).start(() => { setShowChange(false); setChangeDelta(null); });
        }, 900);
      });
    }
    prevTrevosRef.current = trevosDisponiveis;
  }, [trevosDisponiveis, changeOpacity, changeScale]);

  const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

  // portal animations and transactions
  const portalAnim = React.useRef(new Animated.Value(18)).current;
  const [transactions, setTransactions] = React.useState<any[]>([]);
  const cardScales = React.useRef<any>({}).current; // map index->Animated.Value
  const defaultScale = React.useRef(new Animated.Value(1)).current;
  const cardEntrances = React.useRef<Animated.Value[]>([]).current;

  React.useEffect(() => {
    // entrance animation for portal
    Animated.timing(portalAnim, { toValue: 0, duration: 420, useNativeDriver: true }).start();
  }, [portalAnim]);

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        const raw = localStorage.getItem('trevos_movimentacoes') || '[]';
        const arr = JSON.parse(raw || '[]') || [];
        if (!mounted) return;
        const tx = Array.isArray(arr) ? arr.slice().reverse() : [];
        if (!mounted) return;
        setTransactions(tx);
        // ensure scales map and entrance anims exist
        tx.forEach((_:any, i:number) => {
          if (!cardScales[i]) cardScales[i] = new Animated.Value(1);
          if (!cardEntrances[i]) cardEntrances[i] = new Animated.Value(18);
        });
        // staggered entrance
        setTimeout(() => {
          Animated.stagger(80, cardEntrances.slice(0, tx.length).map(a => Animated.timing(a, { toValue: 0, duration: 420, easing: Easing.out(Easing.cubic), useNativeDriver: true }))).start();
        }, 120);
      } catch (e) { if (!mounted) setTransactions([]); }
    };
    load();
    const onStorage = (ev: StorageEvent) => {
      if (!ev.key || ev.key === 'trevos_movimentacoes') load();
    };
    try { window.addEventListener('storage', onStorage as any); } catch (e) {}
    try { storage.addChangeListener && storage.addChangeListener((k:string,v:string|null)=> { if (k==='trevos_movimentacoes') load(); }); } catch (e) {}
    return () => { mounted = false; try { window.removeEventListener('storage', onStorage as any); } catch (e) {} };
  }, [cardScales]);

  return (
    <ScrollView style={styles.scroll} contentContainerStyle={styles.container}>
      <View style={styles.hero}>
        <View style={styles.heroIconWrap}>
          {/** Coin gradient background using LinearGradient; animated as a rotating coin. */}
          {(() => {
            const AnimatedLinearGradient = Animated.createAnimatedComponent(LinearGradient as any);
            return (
              <>
                <AnimatedLinearGradient
                  colors={["#ffd966", "#ffb84d", "#e6a517"]}
                  start={{ x: 0.2, y: 0 }}
                  end={{ x: 0.8, y: 1 }}
                  style={[
                    styles.coin,
                    {
                      transform: [
                        { rotate: rotateIcon.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) },
                        { scale: ringPulse },
                      ],
                    },
                  ]}
                  pointerEvents="none"
                >
                  <View style={styles.coinRim} />
                </AnimatedLinearGradient>

                {/** SVG mask to create an engraved effect using the trevo image as mask */}
                <Animated.View style={{ position: 'absolute', width: 88, height: 88, alignItems: 'center', justifyContent: 'center', transform: [{ rotate: rotateIcon.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }} pointerEvents="none">
                  <Svg width={88} height={88} viewBox="0 0 88 88">
                    <Defs>
                      <Mask id="trevoMask">
                        <SvgImage href={require('../../assets/images/trevo.png')} x={16} y={16} width={56} height={56} preserveAspectRatio="xMidYMid slice" />
                      </Mask>
                    </Defs>
                    <Rect x="0" y="0" width="88" height="88" fill="rgba(0,0,0,0.18)" mask="url(#trevoMask)" />
                  </Svg>
                </Animated.View>

                <Animated.Image
                  source={require('../../assets/images/trevo.png')}
                  style={[
                    styles.heroIconCoin,
                    { transform: [{ rotate: rotateIcon.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] },
                  ]}
                />
              </>
            );
          })()}
        </View>
        <Animated.Text style={[styles.heroNumber, { transform: [{ scale: heroPulse }] }]}>{trevosDisponiveis}</Animated.Text>
        <Text style={styles.heroSubtitle}>Seu saldo de trevos</Text>
        <View style={styles.progressContainer}>
          <View style={styles.progressBg}>
            <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
          </View>
        </View>
        {loading && <Text style={styles.loadingText}>Atualizando saldo...</Text>}
        {lastUpdate ? <Text style={styles.lastUpdateText}>Última atualização: {new Date(lastUpdate).toLocaleString()}</Text> : null}
        {/* success check */}
        {showSuccess ? (
          <Animated.View style={[styles.successBadge, { transform: [{ scale: successScale }] }] } pointerEvents="none">
            <View style={styles.successCircle}><Text style={styles.successCheck}>✓</Text></View>
          </Animated.View>
        ) : null}
        {showChange && changeDelta != null ? (
          <Animated.View style={[styles.changeBadge, { opacity: changeOpacity, transform: [{ scale: changeScale }] }]} pointerEvents="none">
            <View style={[styles.changeInner, { backgroundColor: changeDelta > 0 ? '#eaf7ef' : '#fff4e6' }]}>
              <Text style={[styles.changeText, { color: changeDelta > 0 ? '#0b6b2f' : '#b05600' }]}>{changeDelta > 0 ? `+${changeDelta}` : `${changeDelta}`}</Text>
            </View>
          </Animated.View>
        ) : null}
        {/* shimmering overlay on hero */}
        <Animated.View style={[styles.heroShimmer, { transform: [{ translateX: shimmerX }] }]} pointerEvents="none" />
      </View>

      <Text style={styles.sectionTitle}>Portal de notificações</Text>
      <Animated.View style={[styles.portalContainer, { transform: [{ translateY: portalAnim }] }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.portalScroll}>
          {transactions.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={{ fontWeight: '800', color: '#2E7D32', fontSize: 16 }}>Nenhuma movimentação ainda</Text>
              <Text style={{ color: '#666', marginTop: 6 }}>As entradas e saídas de trevos aparecerão aqui.</Text>
            </View>
          ) : transactions.map((t, i) => (
            <AnimatedTouchable
              key={t.id || i}
              style={[styles.notifyCard, { backgroundColor: t.type === 'entrada' ? '#eaf7ef' : '#fff4e6', transform: [{ translateY: cardEntrances[i] || 0 }] }]}
              activeOpacity={0.9}
              onPressIn={() => { Animated.spring(cardScales[i] || defaultScale, { toValue: 0.96, useNativeDriver: true }).start(); }}
              onPressOut={() => { Animated.spring(cardScales[i] || defaultScale, { toValue: 1, friction: 6, useNativeDriver: true }).start(); }}
            >
              <View style={styles.notifyLeft}>
                <Image source={require('../../assets/images/trevo.png')} style={styles.notifyIcon} />
                <View>
                  <Text style={styles.notifyTitle}>{t.title || (t.type === 'entrada' ? 'Entrada de trevos' : 'Saída de trevos')}</Text>
                  <Text style={styles.notifySub}>{t.source || ''}</Text>
                </View>
              </View>
              <View style={styles.notifyRight}>
                <Text style={[styles.notifyAmount, { color: t.type === 'entrada' ? '#0b6b2f' : '#b05600' }]}>{t.type === 'entrada' ? '+' : '-'}{t.amount}</Text>
                <Text style={styles.notifyDate}>{t.createdAt ? new Date(t.createdAt).toLocaleString() : ''}</Text>
              </View>
            </AnimatedTouchable>
          ))}
        </ScrollView>
      </Animated.View>

      <TouchableOpacity
        style={[styles.refreshBtn, loading && styles.refreshBtnDisabled]}
        onPress={refreshTrevos}
        disabled={loading}
      >
        {loading ? (
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
            <Text style={styles.refreshText}>Atualizando...</Text>
          </View>
        ) : (
          <Text style={styles.refreshText}>Atualizar saldo</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: 24, paddingHorizontal: 16, backgroundColor: '#F5F5F5', alignItems: 'center' },
  hero: { width: '100%', alignItems: 'center', marginBottom: 18, paddingVertical: 24, backgroundColor: '#eaf7ef', borderRadius: 12 },
  heroIcon: { width: 84, height: 84, tintColor: '#2E7D32', marginBottom: 8 },
  heroIconCoin: { width: 56, height: 56, tintColor: '#114b17', position: 'absolute' },
  heroNumber: { fontSize: 36, fontWeight: '900', color: '#145c2e' },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2E7D32', alignSelf: 'flex-start', marginLeft: 8, marginBottom: 8 },
  table: { width: '100%', backgroundColor: '#fff', borderRadius: 12, padding: 12, elevation: 3 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f1f7f2' },
  rowLabel: { color: '#2f6b3a', fontWeight: '700' },
  rowValuePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e9fcec', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 },
  rowIcon: { width: 16, height: 16, marginRight: 8, tintColor: '#2E7D32' },
  rowValue: { fontWeight: '800', color: '#145c2e' },
  refreshBtn: { marginTop: 18, backgroundColor: '#2E7D32', paddingVertical: 10, paddingHorizontal: 18, borderRadius: 10 },
  refreshText: { color: '#fff', fontWeight: '800' },
  refreshBtnDisabled: { opacity: 0.7 },
  progressContainer: { width: '80%', marginTop: 12 },
  progressBg: { width: '100%', height: 8, backgroundColor: '#defbe6', borderRadius: 8, overflow: 'hidden' },
  progressBar: { height: 8, backgroundColor: '#2E7D32' },
  heroSubtitle: { color: '#2f6b3a', fontWeight: '700', marginTop: 6 },
  loadingText: { color: '#2E7D32', marginTop: 8, fontWeight: '700' },
  lastUpdateText: { color: '#666', marginTop: 8, fontSize: 12 },
  successBadge: { position: 'absolute', right: 18, top: 16 },
  successCircle: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#eaf7ef', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#c8f0d6' },
  successCheck: { color: '#0b6b2f', fontSize: 26, fontWeight: '900' },
  portalContainer: { width: '100%', marginTop: 12 },
  portalScroll: { paddingHorizontal: 6, alignItems: 'center' },
  emptyCard: { width: 300, minHeight: 110, borderRadius: 12, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', padding: 14, marginRight: 12, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 4 },
  notifyCard: { width: 320, minHeight: 110, borderRadius: 12, padding: 12, marginRight: 12, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 10, elevation: 4 },
  notifyLeft: { flexDirection: 'row', alignItems: 'center' },
  notifyIcon: { width: 44, height: 44, marginRight: 12, tintColor: '#2E7D32' },
  notifyTitle: { fontWeight: '800', color: '#145c2e' },
  notifySub: { color: '#666', fontSize: 12 },
  notifyRight: { alignItems: 'flex-end' },
  notifyAmount: { fontWeight: '900', fontSize: 20 },
  notifyDate: { color: '#666', fontSize: 11, marginTop: 6 },
  scroll: { flex: 1, backgroundColor: '#F5F5F5' },
  changeBadge: { position: 'absolute', left: 28, top: 14 },
  changeInner: { minWidth: 48, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 18, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#f0f5ef' },
  changeText: { fontWeight: '900', fontSize: 16 },
  heroShimmer: { position: 'absolute', left: -120, top: 0, width: 120, height: '100%', backgroundColor: 'rgba(255,255,255,0.22)', transform: [{ rotate: '12deg' }] },
  heroGlow: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, borderRadius: 12, backgroundColor: 'rgba(250,255,250,0.12)' },
  heroNumberAnimated: { fontSize: 40, fontWeight: '900', color: '#145c2e' },
  heroIconWrap: { width: 88, height: 88, alignItems: 'center', justifyContent: 'center' },
  ring: { position: 'absolute', width: 112, height: 112, borderRadius: 56, alignItems: 'center', justifyContent: 'center', shadowColor: '#2E7D32', shadowOpacity: 0.22, shadowRadius: 12, elevation: 8 },
  ringInner: { width: 84, height: 84, borderRadius: 42, backgroundColor: 'rgba(234,247,239,0.92)' },
  coin: { position: 'absolute', width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', shadowColor: '#b27500', shadowOpacity: 0.28, shadowRadius: 12, elevation: 10, borderWidth: 2, borderColor: 'rgba(0,0,0,0.08)' },
  coinRim: { position: 'absolute', width: 70, height: 70, borderRadius: 35, borderWidth: 2, borderColor: 'rgba(0,0,0,0.06)', backgroundColor: 'transparent' },
  
});
