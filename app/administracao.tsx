import storage from '@/utils/storage';
import { useRouter } from 'expo-router';
import React from 'react';
import { ActivityIndicator, Animated, Image, ImageBackground, Modal, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Toast from '../components/Toast';

export default function AdministracaoScreen() {
  const [user, setUser] = React.useState('');
  const [profileName, setProfileName] = React.useState('Administrador');
  const [pass, setPass] = React.useState('');
  const [toast, setToast] = React.useState<{ message: string; type?: 'success' | 'error' } | null>(null);
  const [isAdmin, setIsAdmin] = React.useState<boolean>(false);
  const [doacoes, setDoacoes] = React.useState<Array<any>>([]);
  const [solicitacoesDoacao, setSolicitacoesDoacao] = React.useState<Array<any>>([]);
  const [loadingDoacoes, setLoadingDoacoes] = React.useState(false);
  const [trocas, setTrocas] = React.useState<Array<any>>([]);
  const [loadingTrocas, setLoadingTrocas] = React.useState(false);
  const [approveModalVisible, setApproveModalVisible] = React.useState(false);
  const [selectedTrocaForApprove, setSelectedTrocaForApprove] = React.useState<any | null>(null);
  const [approveDoacaoModalVisible, setApproveDoacaoModalVisible] = React.useState(false);
  const [approveDoacaoTarget, setApproveDoacaoTarget] = React.useState<any | null>(null);
  const [approveTrevosAmount, setApproveTrevosAmount] = React.useState<number>(5);
  const [valueTableModalVisible, setValueTableModalVisible] = React.useState(false);
  const [rejectModalVisible, setRejectModalVisible] = React.useState(false);
  const [rejectTargetId, setRejectTargetId] = React.useState<number | null>(null);
  const [rejectReason, setRejectReason] = React.useState('');
  const [deliveryDate, setDeliveryDate] = React.useState('');
  const [showDatePicker, setShowDatePicker] = React.useState(false);
  const [dateOptions, setDateOptions] = React.useState<string[]>([]);
  const [feedbacks, setFeedbacks] = React.useState<Array<any>>([]);
  const [loadingFeedbacks, setLoadingFeedbacks] = React.useState(false);
  const [produtosAdmin, setProdutosAdmin] = React.useState<Array<any>>([]);
  const [loadingProdutos, setLoadingProdutos] = React.useState(false);
  const [editModalVisible, setEditModalVisible] = React.useState(false);
  const [editItem, setEditItem] = React.useState<any | null>(null);
  const [editNome, setEditNome] = React.useState('');
  const [editDescricao, setEditDescricao] = React.useState('');
  const [editImagem, setEditImagem] = React.useState('');
  const [priceEditModalVisible, setPriceEditModalVisible] = React.useState(false);
  const [priceEditItem, setPriceEditItem] = React.useState<any | null>(null);
  const [priceEditValue, setPriceEditValue] = React.useState<number | string>('');
  const [priceEditCurrent, setPriceEditCurrent] = React.useState<number | null>(null);
  const [showRemoved, setShowRemoved] = React.useState(false);
  const [removedItems, setRemovedItems] = React.useState<Array<any>>([]);
  // admin-side chat modal state
  const [adminChatVisible, setAdminChatVisible] = React.useState(false);
  const [adminChatMessages, setAdminChatMessages] = React.useState<any[]>([]);
  const [adminChatInput, setAdminChatInput] = React.useState('');
  const adminChatAnim = React.useRef(new Animated.Value(0)).current;
  const adminChatScrollRef = React.useRef<ScrollView | null>(null);
  const [selectedChatUserId, setSelectedChatUserId] = React.useState<string | null>(null);
  const [conversationUsers, setConversationUsers] = React.useState<Array<{ id: string | null; name: string }>>([]);
  const router = useRouter();
  const [selectedSection, setSelectedSection] = React.useState<string | null>(null);
  const [solicitTab, setSolicTab] = React.useState<'doacoes' | 'trocas'>('doacoes');

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
    // load profile name for header display
    (async () => {
      try {
        const n = await storage.getItem('profile_name');
        if (n) setProfileName(n);
      } catch (e) {}
    })();
    return () => { mounted = false; };
  }, []);

  // load/persist admin chat messages and listen for external updates
  React.useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem('chat_admin_messages') || '[]';
        const arr = JSON.parse(raw || '[]') || [];
        const list = Array.isArray(arr) ? arr : [];
        setAdminChatMessages(list);
        // compute conversation users
        const usersMap: Record<string, string> = {};
        list.forEach((m:any) => {
          const id = m.usuario_id || null;
          if (!usersMap[String(id)]) usersMap[String(id)] = m.userName || (`user:${String(id)}`);
        });
        const users = Object.keys(usersMap).filter(k => k !== 'null').map(k => ({ id: k, name: usersMap[k] }));
        setConversationUsers(users);
        if (!selectedChatUserId && users.length > 0) setSelectedChatUserId(users[0].id || null);
      } catch (e) { setAdminChatMessages([]); }
    };
    load();
    const onStorage = (ev: StorageEvent) => { if (!ev.key || ev.key === 'chat_admin_messages') load(); };
    try { window.addEventListener('storage', onStorage as any); } catch (e) {}
    return () => { try { window.removeEventListener('storage', onStorage as any); } catch (e) {} };
  }, []);

  const sendAdminMessage = (text: string) => {
    if (!text || !text.trim()) return;
    const usuarioId = selectedChatUserId || null;
    const msg = { id: Date.now(), sender: 'admin', usuario_id: usuarioId, text: text.trim(), time: Date.now() };
    const updated = [...adminChatMessages, msg];
    setAdminChatMessages(updated);
    try { localStorage.setItem('chat_admin_messages', JSON.stringify(updated)); try { window.dispatchEvent(new StorageEvent('storage', { key: 'chat_admin_messages', newValue: JSON.stringify(updated) } as any)); } catch (e) {} } catch (e) {}
    setAdminChatInput('');
    setTimeout(() => { try { adminChatScrollRef.current && (adminChatScrollRef.current as any).scrollToEnd({ animated: true }); } catch (e) {} }, 80);
  };

  const openAdminChat = () => {
    setAdminChatVisible(true);
    try { adminChatAnim.setValue(0); } catch (e) {}
    try {
      Animated.spring(adminChatAnim, { toValue: 1, friction: 8, useNativeDriver: true }).start(() => {
        setTimeout(() => { try { adminChatScrollRef.current && (adminChatScrollRef.current as any).scrollToEnd({ animated: true }); } catch (e) {} }, 160);
      });
    } catch (e) {}
    try { const ev = new StorageEvent('storage', { key: 'chat_admin_messages', newValue: localStorage.getItem('chat_admin_messages') } as any); window.dispatchEvent(ev as any); } catch (e) {}
  };

  // Message bubble component for admin modal (animated, shows time and avatar for user)
  const AdminMessageBubble: React.FC<{ m: any }> = ({ m }) => {
    const anim = React.useRef(new Animated.Value(0)).current;
    React.useEffect(() => { try { Animated.spring(anim, { toValue: 1, friction: 8, useNativeDriver: true }).start(); } catch (e) {} }, []);
    const isUser = m.sender === 'user';
    const initials = (m.userName || '').split(' ').map((s:string)=>s[0]).slice(0,2).join('').toUpperCase() || '?';
    return (
      <Animated.View style={{ opacity: anim, transform: [{ translateY: anim.interpolate({ inputRange: [0,1], outputRange: [8,0] }) }], marginBottom: 10 }}>
        <View style={{ flexDirection: isUser ? 'row' : 'row-reverse', alignItems: 'flex-end' }}>
          {isUser ? (
            <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: '#eaf7ef', alignItems: 'center', justifyContent: 'center', marginRight: 8 }}>
              <Text style={{ color: '#145c2e', fontWeight: '900' }}>{initials}</Text>
            </View>
          ) : null}
          <View style={isUser ? styles.messageBubbleUser : styles.messageBubbleAdmin}>
            <Text style={isUser ? { color: '#fff' } : { color: '#222' }}>{m.text}</Text>
            {m.time ? <Text style={styles.messageTimeAdmin}>{new Date(m.time).toLocaleTimeString()}</Text> : null}
          </View>
        </View>
      </Animated.View>
    );
  };

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

  // load local solicitacoes_de_doacao from localStorage when admin opens solicitacoes/doacoes
  React.useEffect(() => {
    let mounted = true;
    function loadLocal() {
      if (!isAdmin) return;
      if (selectedSection !== 'solicitacoes' || solicitTab !== 'doacoes') return;
      try {
        const raw = localStorage.getItem('solicitacoes_doacao') || '[]';
        const arr = JSON.parse(raw || '[]');
        if (!mounted) return;
        setSolicitacoesDoacao(Array.isArray(arr) ? arr : []);
      } catch (e) {
        if (mounted) setSolicitacoesDoacao([]);
      }
    }
    loadLocal();
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === 'solicitacoes_doacao') loadLocal();
    };
    try { window.addEventListener('storage', onStorage as any); } catch (e) {}
    return () => { mounted = false; try { window.removeEventListener('storage', onStorage as any); } catch (e) {} };
  }, [isAdmin, selectedSection, solicitTab]);

  // load feedbacks from localStorage when admin opens feedbacks section
  React.useEffect(() => {
    let mounted = true;
    async function loadFeedbacks() {
      if (!isAdmin) return;
      if (selectedSection !== 'feedbacks') return;
      setLoadingFeedbacks(true);
      try {
        const raw = localStorage.getItem('feedbacks') || '[]';
        const arr = JSON.parse(raw || '[]');
        if (!mounted) return;
        setFeedbacks(Array.isArray(arr) ? arr : []);
      } catch (e) {
        if (mounted) setFeedbacks([]);
      } finally {
        if (mounted) setLoadingFeedbacks(false);
      }
    }
    loadFeedbacks();
    return () => { mounted = false; };
  }, [isAdmin, selectedSection]);

  // load trocas (solicitações de troca) from localStorage when admin opens solicitacoes
  React.useEffect(() => {
    let mounted = true;
    function loadTrocas() {
      if (!isAdmin) return;
      if (selectedSection !== 'solicitacoes') return;
      setLoadingTrocas(true);
      try {
        const raw = localStorage.getItem('solicitacoes_troca') || '[]';
        const arr = JSON.parse(raw || '[]');
        if (!mounted) return;
        setTrocas(Array.isArray(arr) ? arr : []);
      } catch (e) {
        if (mounted) setTrocas([]);
      } finally {
        if (mounted) setLoadingTrocas(false);
      }
    }
    loadTrocas();
    // also listen for storage events to refresh
    const onStorage = (ev: StorageEvent) => {
      if (ev.key === 'solicitacoes_troca') loadTrocas();
    };
    try { window.addEventListener('storage', onStorage as any); } catch (e) {}
    return () => { mounted = false; try { window.removeEventListener('storage', onStorage as any); } catch (e) {} };
  }, [isAdmin, selectedSection]);

  // load products for admin management
  React.useEffect(() => {
    let mounted = true;
    async function loadProdutos() {
      if (!isAdmin) return;
      if (selectedSection !== 'roupas') return;
      setLoadingProdutos(true);
      try {
        const custom = JSON.parse(localStorage.getItem('produtos_custom') || '[]');
        const base = JSON.parse(localStorage.getItem('produtos_base') || '[]') || [];
        const overrides = JSON.parse(localStorage.getItem('produtos_overrides') || '{}') || {};
        const removed = JSON.parse(localStorage.getItem('produtos_removed') || '[]') || [];
        const cleanedCustom = Array.isArray(custom) ? custom : [];
        // mark custom items
        const customMarked = cleanedCustom.map((c:any) => ({ ...c, __source: 'custom' }));
        const baseWithOverrides = (Array.isArray(base) ? base : []).map((b:any) => {
          const key = String(b.nome || '').trim();
          const overridden = overrides && overrides[key] ? { ...b, ...overrides[key] } : b;
          return { ...overridden, __source: 'base' };
        }).filter((b:any) => !removed.includes(String(b.nome || '').trim()));
        const combined = [...customMarked.filter((c:any) => !removed.includes(String(c.nome||'').trim())), ...baseWithOverrides];
        if (!mounted) return;
        setProdutosAdmin(combined);
      } catch (e) {
        if (mounted) setProdutosAdmin([]);
      } finally {
        if (mounted) setLoadingProdutos(false);
      }
    }
    loadProdutos();
    return () => { mounted = false; };
  }, [isAdmin, selectedSection]);

  const reloadAdminProdutos = () => {
    // trigger reload by toggling selectedSection (quick hack) or just call load effect by setting state
    setTimeout(() => {
      try {
        const ev = new StorageEvent('storage', { key: 'produtos_custom', newValue: localStorage.getItem('produtos_custom') } as any);
        window.dispatchEvent(ev as any);
      } catch (e) {}
    }, 80);
  };

  // resolve custo exibido para um produto (considera overrides e custom)
  const getDisplayCusto = React.useCallback((item: any) => {
    try {
      const key = String(item?.nome || '').trim();
      // check overrides
      try {
        const overridesRaw = localStorage.getItem('produtos_overrides') || '{}';
        const overrides = JSON.parse(overridesRaw || '{}') || {};
        if (overrides && overrides[key] && (overrides[key].custo || overrides[key].custo === 0)) {
          return Number(overrides[key].custo);
        }
      } catch (e) {}
      // check custom list
      try {
        const customRaw = localStorage.getItem('produtos_custom') || '[]';
        const custom = JSON.parse(customRaw || '[]') || [];
        const found = (custom || []).find((c:any) => String(c.nome || '') === key && (c.custo || c.custo === 0));
        if (found) return Number(found.custo);
      } catch (e) {}
      // fallback to item.custo or default 11
      if (item && (item.custo || item.custo === 0)) return Number(item.custo);
      return 11;
    } catch (e) {
      return 11;
    }
  }, []);

  const loadRemovedItems = () => {
    try {
      const removedNames = JSON.parse(localStorage.getItem('produtos_removed') || '[]') || [];
      const custom = JSON.parse(localStorage.getItem('produtos_custom') || '[]') || [];
      const base = JSON.parse(localStorage.getItem('produtos_base') || '[]') || [];
      const list: any[] = [];
      removedNames.forEach((name: string) => {
        const fromCustom = (custom || []).find((c: any) => String(c.nome || '') === String(name));
        if (fromCustom) {
          list.push({ ...fromCustom, __source: 'custom' });
          return;
        }
        const fromBase = (base || []).find((b: any) => String(b.nome || '') === String(name));
        if (fromBase) list.push({ ...fromBase, __source: 'base' });
      });
      setRemovedItems(list);
    } catch (e) {
      setRemovedItems([]);
    }
  };

  const handleRestoreProduct = (nome: string) => {
    try {
      const removed = JSON.parse(localStorage.getItem('produtos_removed') || '[]') || [];
      const updated = (Array.isArray(removed) ? removed : []).filter((n: string) => String(n) !== String(nome));
      localStorage.setItem('produtos_removed', JSON.stringify(updated));
      setToast({ message: 'Produto restaurado para usuários', type: 'success' });
      setTimeout(() => setToast(null), 1400);
      loadRemovedItems();
      reloadAdminProdutos();
      try { window.dispatchEvent(new StorageEvent('storage', { key: 'produtos_removed', newValue: JSON.stringify(updated) } as any)); } catch (e) {}
    } catch (e) {
      setToast({ message: 'Erro ao restaurar produto', type: 'error' });
      setTimeout(() => setToast(null), 1400);
    }
  };

  const handleTirarProduto = (nome: string) => {
    try {
      const removed = JSON.parse(localStorage.getItem('produtos_removed') || '[]');
      const arr = Array.isArray(removed) ? removed : [];
      if (!arr.includes(nome)) arr.push(nome);
      localStorage.setItem('produtos_removed', JSON.stringify(arr));
      setToast({ message: 'Produto removido da visualização do usuário', type: 'success' });
      setTimeout(() => setToast(null), 1400);
      reloadAdminProdutos();
      try { window.dispatchEvent(new StorageEvent('storage', { key: 'produtos_removed', newValue: JSON.stringify(arr) } as any)); } catch (e) {}
    } catch (e) {
      setToast({ message: 'Erro ao remover produto', type: 'error' });
      setTimeout(() => setToast(null), 1400);
    }
  };

  const openEditProduto = (item: any) => {
    setEditItem(item);
    setEditNome(item.nome || '');
    setEditDescricao(item.descricao || '');
    setEditImagem(item.imagem || '');
    setEditModalVisible(true);
  };

  const openPriceEditor = (item: any) => {
    setPriceEditItem(item);
    // determine the current persisted custo (check overrides and custom first), then fallback to item.custo
    try {
      let current: any = null;
      const key = String(item?.nome || '').trim();
      // check overrides
      try {
        const overridesRaw = localStorage.getItem('produtos_overrides') || '{}';
        const overrides = JSON.parse(overridesRaw || '{}') || {};
        if (overrides && overrides[key] && (overrides[key].custo || overrides[key].custo === 0)) {
          current = overrides[key].custo;
        }
      } catch (e) {}
      // if still null, check custom list
      if (current === null) {
        try {
          const customRaw = localStorage.getItem('produtos_custom') || '[]';
          const custom = JSON.parse(customRaw || '[]') || [];
          const found = (custom || []).find((c:any) => String(c.nome || '') === key && (c.custo || c.custo === 0));
          if (found) current = found.custo;
        } catch (e) {}
      }
      // fallback to provided item.custo
      if (current === null && (item && (item.custo || item.custo === 0))) current = item.custo;
      setPriceEditCurrent(typeof current === 'number' ? Number(current) : null);
      setPriceEditValue(current ?? '');
    } catch (e) {
      setPriceEditCurrent(null);
      setPriceEditValue(item && (item.custo || item.custo === 0) ? item.custo : '');
    }
    setPriceEditModalVisible(true);
  };

  const savePriceEdit = () => {
    if (!priceEditItem) return;
    const key = String(priceEditItem.nome || '').trim();
    const parsed = typeof priceEditValue === 'string' ? parseInt(priceEditValue || '0', 10) : Number(priceEditValue || 0);
    const custo = Number.isFinite(parsed) && parsed > 0 ? parsed : 11;
    try {
      if (priceEditItem.__source === 'custom') {
        const customRaw = localStorage.getItem('produtos_custom') || '[]';
        const custom = JSON.parse(customRaw || '[]') || [];
        const updated = (Array.isArray(custom) ? custom : []).map((c:any) => (String(c.nome||'') === String(priceEditItem.nome||'') ? { ...c, custo } : c));
        localStorage.setItem('produtos_custom', JSON.stringify(updated));
      } else {
        const overridesRaw = localStorage.getItem('produtos_overrides') || '{}';
        const overrides = JSON.parse(overridesRaw || '{}') || {};
        overrides[key] = { ...(overrides[key] || {}), custo };
        localStorage.setItem('produtos_overrides', JSON.stringify(overrides));
      }
      try { window.dispatchEvent(new StorageEvent('storage', { key: 'produtos_overrides', newValue: localStorage.getItem('produtos_overrides') } as any)); } catch (e) {}
      setToast({ message: 'Valor atualizado com sucesso', type: 'success' });
      setTimeout(() => setToast(null), 1400);
      setPriceEditModalVisible(false);
      setPriceEditItem(null);
      reloadAdminProdutos();
    } catch (e) {
      setToast({ message: 'Erro ao salvar valor', type: 'error' });
      setTimeout(() => setToast(null), 1400);
    }
  };

  // re-check persisted custo when modal opens (handles cases where openPriceEditor lookup missed)
  React.useEffect(() => {
    if (!priceEditModalVisible || !priceEditItem) return;
    try {
      const key = String(priceEditItem?.nome || '').trim();
      let current: any = null;
      try {
        const overridesRaw = localStorage.getItem('produtos_overrides') || '{}';
        const overrides = JSON.parse(overridesRaw || '{}') || {};
        if (overrides && overrides[key] && (overrides[key].custo || overrides[key].custo === 0)) {
          current = overrides[key].custo;
        }
      } catch (e) {}
      if (current === null) {
        try {
          const customRaw = localStorage.getItem('produtos_custom') || '[]';
          const custom = JSON.parse(customRaw || '[]') || [];
          const found = (custom || []).find((c:any) => String(c.nome || '') === key && (c.custo || c.custo === 0));
          if (found) current = found.custo;
        } catch (e) {}
      }
      if (current === null && (priceEditItem && (priceEditItem.custo || priceEditItem.custo === 0))) current = priceEditItem.custo;
      setPriceEditCurrent(typeof current === 'number' ? Number(current) : null);
      setPriceEditValue(current ?? (priceEditItem && (priceEditItem.custo || priceEditItem.custo === 0) ? priceEditItem.custo : ''));
    } catch (e) {
      setPriceEditCurrent(null);
    }
  }, [priceEditModalVisible, priceEditItem]);

  const saveEditProduto = () => {
    if (!editItem) return;
    const key = String(editItem.nome || '').trim();
    try {
      if (editItem.__source === 'custom') {
        const custom = JSON.parse(localStorage.getItem('produtos_custom') || '[]') || [];
        const updated = (Array.isArray(custom) ? custom : []).map((c:any) => (String(c.nome||'') === String(editItem.nome||'') ? { ...c, nome: editNome, descricao: editDescricao, imagem: editImagem } : c));
        localStorage.setItem('produtos_custom', JSON.stringify(updated));
      } else {
        const overrides = JSON.parse(localStorage.getItem('produtos_overrides') || '{}') || {};
        overrides[key] = { nome: editNome, descricao: editDescricao, imagem: editImagem };
        localStorage.setItem('produtos_overrides', JSON.stringify(overrides));
      }
      setToast({ message: 'Produto atualizado', type: 'success' });
      setTimeout(() => setToast(null), 1200);
      setEditModalVisible(false);
      reloadAdminProdutos();
      try { window.dispatchEvent(new StorageEvent('storage', { key: 'produtos_overrides', newValue: localStorage.getItem('produtos_overrides') } as any)); } catch (e) {}
    } catch (e) {
      setToast({ message: 'Erro ao atualizar produto', type: 'error' });
      setTimeout(() => setToast(null), 1400);
    }
  };

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
      try { router.replace('/'); } catch (e) {}
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

  const handleApproveSolicitacaoDoacao = (id: number) => {
    try {
      const raw = localStorage.getItem('solicitacoes_doacao') || '[]';
      const arr = JSON.parse(raw || '[]') || [];
      const original = (Array.isArray(arr) ? arr : []).find((s:any) => s.id === id);

      if (original) {
        // add product to produtos_custom
        try {
          const customRaw = localStorage.getItem('produtos_custom') || '[]';
          const custom = JSON.parse(customRaw || '[]') || [];
          const newProd = { nome: original.nome, descricao: original.descricao || '', imagem: original.imagem || '', addedAt: new Date().toISOString(), recent: true };
          custom.unshift(newProd);
          localStorage.setItem('produtos_custom', JSON.stringify(custom));
          try { window.dispatchEvent(new StorageEvent('storage', { key: 'produtos_custom', newValue: JSON.stringify(custom) } as any)); } catch (e) {}

          // notify the user by adding an entry to a per-user solicitation list
          try {
            const userKey = 'solicitacoes_doacao_usuario';
            const rawUser = localStorage.getItem(userKey) || '[]';
            const userArr = JSON.parse(rawUser || '[]') || [];
            // include trevos awarded information if present
            const trevosAwarded = original.trevosSolicitados || 0;
            userArr.unshift({ id: Date.now(), originalSolicitId: original.id, usuario_id: original.usuario_id || 0, nome: original.nome, status: 'aprovado', adminMessage: 'Sua doação foi aprovada e adicionada ao catálogo.', trevosRecebidos: trevosAwarded, createdAt: new Date().toISOString(), produto: newProd });
            localStorage.setItem(userKey, JSON.stringify(userArr));
            try { window.dispatchEvent(new StorageEvent('storage', { key: userKey, newValue: JSON.stringify(userArr) } as any)); } catch (e) {}
            // If the approved donation belongs to a user currently using this browser, credit their trevos balance immediately
            try {
              const currentId = localStorage.getItem('idUsuario');
              if (currentId && String(currentId) === String(original.usuario_id || '')) {
                const currentTrevos = parseInt(localStorage.getItem('trevos') || '0', 10) || 0;
                const newTrevos = currentTrevos + (trevosAwarded || 0);
                localStorage.setItem('trevos', String(newTrevos));
                try { window.dispatchEvent(new StorageEvent('storage', { key: 'trevos', newValue: String(newTrevos) } as any)); } catch (e) {}
                // registra movimentação de entrada para o portal de notificações
                try {
                  const rawMov = localStorage.getItem('trevos_movimentacoes') || '[]';
                  const arrMov = JSON.parse(rawMov || '[]') || [];
                  const mov = { id: Date.now(), type: 'entrada', amount: trevosAwarded || 0, title: 'Crédito por doação', source: original.nome || 'Doação', createdAt: Date.now() };
                  arrMov.push(mov);
                  localStorage.setItem('trevos_movimentacoes', JSON.stringify(arrMov));
                  try { window.dispatchEvent(new StorageEvent('storage', { key: 'trevos_movimentacoes', newValue: JSON.stringify(arrMov) } as any)); } catch (e) {}
                } catch (e) {}
              }
            } catch (e) { /* ignore */ }
          } catch (e) {}
        } catch (e) {
          // ignore product add errors
        }
      }

      // remove the processed solicitation from the admin list so it disappears
      const remaining = (Array.isArray(arr) ? arr : []).filter((s:any) => s.id !== id);
      localStorage.setItem('solicitacoes_doacao', JSON.stringify(remaining));
      try { window.dispatchEvent(new StorageEvent('storage', { key: 'solicitacoes_doacao', newValue: JSON.stringify(remaining) } as any)); } catch (e) {}
      setSolicitacoesDoacao(remaining);
      setToast({ message: 'Solicitação aprovada e adicionada às roupas', type: 'success' });
      setTimeout(() => setToast(null), 1400);
      // trigger reload of admin produtos
      reloadAdminProdutos();
    } catch (e) {
      setToast({ message: 'Erro ao aprovar solicitação', type: 'error' });
      setTimeout(() => setToast(null), 1400);
    }
  };

  const openRejectModal = (id: number) => {
    setRejectTargetId(id);
    setRejectReason('');
    setRejectModalVisible(true);
  };

  const handleRejectSolicitacaoDoacaoConfirmed = (id: number, reason: string) => {
    try {
      const raw = localStorage.getItem('solicitacoes_doacao') || '[]';
      const arr = JSON.parse(raw || '[]') || [];
      const original = (Array.isArray(arr) ? arr : []).find((s:any) => s.id === id);

      if (original) {
        try {
          // Ensure the item exists in produtos_custom so lixeira can reference it
          const customRaw = localStorage.getItem('produtos_custom') || '[]';
          const customArr = Array.isArray(JSON.parse(customRaw || '[]')) ? JSON.parse(customRaw || '[]') : [];
          const exists = (customArr || []).some((c:any) => String(c.nome || '') === String(original.nome || ''));
          if (!exists) {
            const newProd = { nome: original.nome, descricao: original.descricao || '', imagem: original.imagem || '', addedAt: new Date().toISOString(), recent: false };
            customArr.unshift(newProd);
            localStorage.setItem('produtos_custom', JSON.stringify(customArr));
            try { window.dispatchEvent(new StorageEvent('storage', { key: 'produtos_custom', newValue: JSON.stringify(customArr) } as any)); } catch (e) {}
          }

          const removedRaw = localStorage.getItem('produtos_removed') || '[]';
          const removedArr = Array.isArray(JSON.parse(removedRaw || '[]')) ? JSON.parse(removedRaw || '[]') : [];
          if (!removedArr.includes(String(original.nome || ''))) {
            removedArr.push(String(original.nome || ''));
            localStorage.setItem('produtos_removed', JSON.stringify(removedArr));
            try { window.dispatchEvent(new StorageEvent('storage', { key: 'produtos_removed', newValue: JSON.stringify(removedArr) } as any)); } catch (e) {}
          }

          // write response to user-specific notifications list
          try {
            const userKey = 'solicitacoes_doacao_usuario';
            const rawUser = localStorage.getItem(userKey) || '[]';
            const userArr = JSON.parse(rawUser || '[]') || [];
            userArr.unshift({ id: Date.now(), originalSolicitId: original.id, usuario_id: original.usuario_id || 0, nome: original.nome, status: 'reprovado', adminMessage: reason || 'Doação reprovada pelo administrador.', createdAt: new Date().toISOString() });
            localStorage.setItem(userKey, JSON.stringify(userArr));
            try { window.dispatchEvent(new StorageEvent('storage', { key: userKey, newValue: JSON.stringify(userArr) } as any)); } catch (e) {}
          } catch (e) {}
        } catch (e) {
          // ignore sub-errors
        }
      }

      // remove from admin solicitations
      const remaining = (Array.isArray(arr) ? arr : []).filter((s:any) => s.id !== id);
      localStorage.setItem('solicitacoes_doacao', JSON.stringify(remaining));
      try { window.dispatchEvent(new StorageEvent('storage', { key: 'solicitacoes_doacao', newValue: JSON.stringify(remaining) } as any)); } catch (e) {}
      setSolicitacoesDoacao(remaining);
      setToast({ message: 'Solicitação reprovada e enviada para a Lixeira', type: 'success' });
      setTimeout(() => setToast(null), 1400);
      // trigger admin products reload to reflect new custom/removed entries
      reloadAdminProdutos();
    } catch (e) {
      setToast({ message: 'Erro ao reprovar solicitação', type: 'error' });
      setTimeout(() => setToast(null), 1400);
    }
  };

  const handleRemoveTroca = (id: number) => {
    try {
      const raw = localStorage.getItem('solicitacoes_troca') || '[]';
      const arr = JSON.parse(raw || '[]');
      const updated = (Array.isArray(arr) ? arr : []).filter((t:any) => t.id !== id);
      localStorage.setItem('solicitacoes_troca', JSON.stringify(updated));
      setTrocas(updated);
      try { window.dispatchEvent(new StorageEvent('storage', { key: 'solicitacoes_troca', newValue: JSON.stringify(updated) } as any)); } catch (e) {}
      setToast({ message: 'Solicitação de troca removida', type: 'success' });
      setTimeout(() => setToast(null), 1400);
    } catch (e) {
      setToast({ message: 'Erro ao remover solicitação', type: 'error' });
      setTimeout(() => setToast(null), 1400);
    }
  };

  const handleRejectTroca = (id: number) => {
    try {
      const raw = localStorage.getItem('solicitacoes_troca') || '[]';
      const arr = JSON.parse(raw || '[]');
      const updated = (Array.isArray(arr) ? arr : []).map((t:any) => (t.id === id ? { ...t, status: 'reprovado', reviewedAt: new Date().toISOString() } : t));
      localStorage.setItem('solicitacoes_troca', JSON.stringify(updated));

      // find the rejected troca and move related produto to produtos_custom/removed so it appears in Lixeira
      const rejected = updated.find((t:any) => t.id === id);
      if (rejected && rejected.produto) {
        try {
          const prod = rejected.produto;
          const customRaw = localStorage.getItem('produtos_custom') || '[]';
          const customArr = Array.isArray(JSON.parse(customRaw || '[]')) ? JSON.parse(customRaw || '[]') : [];
          const exists = (customArr || []).some((c:any) => String(c.nome || '') === String(prod.nome || ''));
          if (!exists) {
            const newProd = { nome: prod.nome || '', descricao: prod.descricao || '', imagem: prod.imagem || '', addedAt: new Date().toISOString(), recent: false };
            customArr.unshift(newProd);
            localStorage.setItem('produtos_custom', JSON.stringify(customArr));
            try { window.dispatchEvent(new StorageEvent('storage', { key: 'produtos_custom', newValue: JSON.stringify(customArr) } as any)); } catch (e) {}
          }

          const removedRaw = localStorage.getItem('produtos_removed') || '[]';
          const removedArr = Array.isArray(JSON.parse(removedRaw || '[]')) ? JSON.parse(removedRaw || '[]') : [];
          if (!removedArr.includes(String(prod.nome || ''))) {
            removedArr.push(String(prod.nome || ''));
            localStorage.setItem('produtos_removed', JSON.stringify(removedArr));
            try { window.dispatchEvent(new StorageEvent('storage', { key: 'produtos_removed', newValue: JSON.stringify(removedArr) } as any)); } catch (e) {}
          }
        } catch (e) {
          // ignore sub-errors
        }
      }

      setTrocas(updated);
      try { window.dispatchEvent(new StorageEvent('storage', { key: 'solicitacoes_troca', newValue: JSON.stringify(updated) } as any)); } catch (e) {}
      setToast({ message: 'Solicitação de troca reprovada e movida para Lixeira', type: 'success' });
      setTimeout(() => setToast(null), 1400);
      reloadAdminProdutos();
    } catch (e) {
      setToast({ message: 'Erro ao reprovar solicitação de troca', type: 'error' });
      setTimeout(() => setToast(null), 1400);
    }
  };

  const handleMarkTrocaProcessed = (id: number) => {
    try {
      const raw = localStorage.getItem('solicitacoes_troca') || '[]';
      const arr = JSON.parse(raw || '[]');
      const updated = (Array.isArray(arr) ? arr : []).map((t:any) => (t.id === id ? { ...t, status: 'processado' } : t));
      localStorage.setItem('solicitacoes_troca', JSON.stringify(updated));
      setTrocas(updated);
      try { window.dispatchEvent(new StorageEvent('storage', { key: 'solicitacoes_troca', newValue: JSON.stringify(updated) } as any)); } catch (e) {}
      setToast({ message: 'Solicitação marcada como processada', type: 'success' });
      setTimeout(() => setToast(null), 1400);
    } catch (e) {
      setToast({ message: 'Erro ao atualizar solicitação', type: 'error' });
      setTimeout(() => setToast(null), 1400);
    }
  };

  const openApproveModal = (troca: any) => {
    setSelectedTrocaForApprove(troca);
    setDeliveryDate('');
    setApproveModalVisible(true);
  };

  const openApproveDoacaoModal = (solicit: any) => {
    setApproveDoacaoTarget(solicit);
    setApproveTrevosAmount(solicit?.trevosSolicitados || 5);
    setApproveDoacaoModalVisible(true);
  };

  const handleConfirmApproveDoacao = (confirm = true) => {
    try {
      const original = approveDoacaoTarget;
      if (!original) return;
      const trevosAwarded = approveTrevosAmount || 0;

      // add product to produtos_custom
      try {
        const customRaw = localStorage.getItem('produtos_custom') || '[]';
        const custom = JSON.parse(customRaw || '[]') || [];
        const newProd = { nome: original.nome, descricao: original.descricao || '', imagem: original.imagem || '', addedAt: new Date().toISOString(), recent: true };
        custom.unshift(newProd);
        localStorage.setItem('produtos_custom', JSON.stringify(custom));
        try { window.dispatchEvent(new StorageEvent('storage', { key: 'produtos_custom', newValue: JSON.stringify(custom) } as any)); } catch (e) {}

        // notify the user by adding an entry to a per-user solicitation list
        try {
          const userKey = 'solicitacoes_doacao_usuario';
          const rawUser = localStorage.getItem(userKey) || '[]';
          const userArr = JSON.parse(rawUser || '[]') || [];
          userArr.unshift({ id: Date.now(), originalSolicitId: original.id, usuario_id: original.usuario_id || 0, nome: original.nome, status: 'aprovado', adminMessage: 'Sua doação foi aprovada e adicionada ao catálogo.', trevosRecebidos: trevosAwarded, createdAt: new Date().toISOString(), produto: newProd });
          localStorage.setItem(userKey, JSON.stringify(userArr));
          try { window.dispatchEvent(new StorageEvent('storage', { key: userKey, newValue: JSON.stringify(userArr) } as any)); } catch (e) {}

          // If the approved donation belongs to a user currently using this browser, credit their trevos balance immediately
          try {
            const currentId = localStorage.getItem('idUsuario');
            if (currentId && String(currentId) === String(original.usuario_id || '')) {
              const currentTrevos = parseInt(localStorage.getItem('trevos') || '0', 10) || 0;
              const newTrevos = currentTrevos + (trevosAwarded || 0);
              localStorage.setItem('trevos', String(newTrevos));
              try { window.dispatchEvent(new StorageEvent('storage', { key: 'trevos', newValue: String(newTrevos) } as any)); } catch (e) {}
            }
          } catch (e) { /* ignore */ }
        } catch (e) {}
      } catch (e) {
        // ignore product add errors
      }

      // remove solicitation from list
      try {
        const raw = localStorage.getItem('solicitacoes_doacao') || '[]';
        const arr = JSON.parse(raw || '[]') || [];
        const remaining = (Array.isArray(arr) ? arr : []).filter((s:any) => s.id !== original.id);
        localStorage.setItem('solicitacoes_doacao', JSON.stringify(remaining));
        try { window.dispatchEvent(new StorageEvent('storage', { key: 'solicitacoes_doacao', newValue: JSON.stringify(remaining) } as any)); } catch (e) {}
        setSolicitacoesDoacao(remaining);
      } catch (e) {}

      setToast({ message: 'Solicitação aprovada e adicionada às roupas', type: 'success' });
      setTimeout(() => setToast(null), 1400);
      reloadAdminProdutos();
      setApproveDoacaoModalVisible(false);
      setApproveDoacaoTarget(null);
    } catch (e) {
      setToast({ message: 'Erro ao aprovar solicitação', type: 'error' });
      setTimeout(() => setToast(null), 1400);
    }
  };

  // generate next 30 days for quick pick
  React.useEffect(() => {
    const opts: string[] = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) {
      const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
      opts.push(d.toISOString().slice(0, 10));
    }
    setDateOptions(opts);
  }, []);

  const handleSendReportForTroca = (id: number) => {
    try {
      const raw = localStorage.getItem('solicitacoes_troca') || '[]';
      const arr = JSON.parse(raw || '[]');
      const updated = (Array.isArray(arr) ? arr : []).map((t:any) => {
        if (t.id === id) {
          return { ...t, status: 'aprovado', deliveryDate: deliveryDate || null, reportSent: true, reportSentAt: new Date().toISOString() };
        }
        return t;
      });
      localStorage.setItem('solicitacoes_troca', JSON.stringify(updated));
      setTrocas(updated);
      try { window.dispatchEvent(new StorageEvent('storage', { key: 'solicitacoes_troca', newValue: JSON.stringify(updated) } as any)); } catch (e) {}
      setToast({ message: 'Relatório enviado ao usuário', type: 'success' });
      setTimeout(() => setToast(null), 1600);
      setApproveModalVisible(false);
    } catch (e) {
      setToast({ message: 'Erro ao enviar relatório', type: 'error' });
      setTimeout(() => setToast(null), 1600);
    }
  };

  const handleRemoveFeedback = (id: number) => {
    try {
      const raw = localStorage.getItem('feedbacks') || '[]';
      const arr = JSON.parse(raw || '[]');
      const updated = (Array.isArray(arr) ? arr : []).filter((f: any) => f.id !== id);
      localStorage.setItem('feedbacks', JSON.stringify(updated));
      setFeedbacks(updated);
      setToast({ message: 'Feedback removido', type: 'success' });
      setTimeout(() => setToast(null), 1400);
    } catch (e) {
      setToast({ message: 'Erro ao remover feedback', type: 'error' });
      setTimeout(() => setToast(null), 1400);
    }
  };

  if (!isAdmin) {
    return (
      <View style={{ flex: 1, backgroundColor: '#F5F5F5', justifyContent: 'center' }}>
        {/* Back button for login view (in case global overlay is hidden) */}
        <View style={{ position: 'absolute', top: Platform.OS === 'web' ? 12 : 6, left: 12, zIndex: 999 }} pointerEvents="box-none">
          <TouchableOpacity onPress={() => { try { router.back(); } catch (e) { try { router.replace('/'); } catch {} } }} style={{ backgroundColor: 'rgba(0,0,0,0.6)', padding: 8, borderRadius: 8 }} accessibilityLabel="Voltar">
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 16 }}>←</Text>
          </TouchableOpacity>
        </View>
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

  const renderDoacoesList = () => (
    loadingDoacoes ? (
      <ActivityIndicator size="large" color="#2E7D32" />
    ) : (
      <ScrollView contentContainerStyle={{ padding: 8 }}>
        {/* local solicitations (pending donations from users) shown first */}
        {solicitacoesDoacao && solicitacoesDoacao.length > 0 ? (
          <>
            <Text style={{ fontWeight: '800', marginBottom: 8 }}>Solicitações de Doação (pendentes)</Text>
            {solicitacoesDoacao.map((s) => (
              <View key={s.id} style={[styles.doacaoCard, { borderColor: '#cfeedd', borderWidth: 1 }]}>
                {s.imagem ? (
                  // @ts-ignore
                  <Image source={{ uri: s.imagem }} style={styles.doacaoImage} />
                ) : null}
                <Text style={styles.doacaoTitle}>{s.nome || s.descricao || 'Sem título'}</Text>
                <Text style={styles.doacaoMeta}>Criado: {s.createdAt ? new Date(s.createdAt).toLocaleString() : ''}</Text>
                <Text style={styles.doacaoMeta}>Status: {s.status || 'pendente'}</Text>
                {s.trevosSolicitados ? <Text style={styles.doacaoMeta}>Trevos solicitados: {s.trevosSolicitados}</Text> : null}
                {s.adminMessage ? <Text style={[styles.doacaoMeta, { marginTop: 6, color: '#444' }]}>Resposta ao usuário: {s.adminMessage}</Text> : null}
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                  <TouchableOpacity style={[styles.removeBtn, { backgroundColor: '#1976D2' }]} onPress={() => openApproveDoacaoModal(s)}>
                    <Text style={{ color: '#fff', fontWeight: '700' }}>Aprovar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.removeBtn, { backgroundColor: '#B71C1C' }]} onPress={() => openRejectModal(s.id)}>
                    <Text style={{ color: '#fff', fontWeight: '700' }}>Reprovar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            <View style={{ height: 8 }} />
          </>
        ) : null}

        {doacoes.length === 0 && solicitacoesDoacao.length === 0 && <Text>Nenhuma doação encontrada.</Text>}
        {doacoes.map((d) => (
          <View key={d.id} style={styles.doacaoCard}>
            {d.fotoUrl ? (
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              <Image source={{ uri: d.fotoUrl }} style={styles.doacaoImage} />
            ) : null}
            <Text style={styles.doacaoTitle}>{d.descricao || 'Sem descrição'}</Text>
            <Text style={styles.doacaoMeta}>Destino: {d.destino}</Text>
            <Text style={styles.doacaoMeta}>Estado: {d.estado}</Text>
            <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemove(d.id)}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Remover</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    )
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#F5F5F5' }}>
      <ImageBackground source={require('../assets/images/trevo.png')} style={styles.adminHeaderBg} imageStyle={{ opacity: 0.06, resizeMode: 'cover' }}>
        <View style={styles.adminHeaderContent}>
          {/* Back button inside admin header */}
          <TouchableOpacity onPress={() => { try { router.back(); } catch (e) { try { router.replace('/'); } catch {} } }} style={{ marginRight: 8, backgroundColor: 'rgba(0,0,0,0.08)', padding: 8, borderRadius: 8 }} accessibilityLabel="Voltar">
            <Text style={{ color: '#0b3b0f', fontWeight: '700' }}>←</Text>
          </TouchableOpacity>
          <Image source={require('../assets/images/logo.png')} style={styles.adminLogo} resizeMode="contain" />
          <View style={{ flex: 1, marginLeft: 12, alignItems: 'center' }}>
            <Text style={styles.adminTitle}>Área de Administrador</Text>
            <Text style={styles.adminSubtitle}>Controle rápido das roupas, feedbacks e solicitações.</Text>
          </View>
          <TouchableOpacity style={styles.logoutBtnHeader} onPress={handleLogout} accessibilityLabel="Sair do painel">
            <Text style={styles.logoutBtnText}>Sair</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.adminButtonsRow}>
          <TouchableOpacity style={[styles.adminBtn, selectedSection === 'roupas' ? styles.adminBtnActive : null]} onPress={() => setSelectedSection('roupas')}>
            <Text style={[styles.adminBtnText, selectedSection === 'roupas' ? styles.adminBtnTextActive : null]}>👗 Gerenciar Roupas</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.adminBtn, selectedSection === 'feedbacks' ? styles.adminBtnActive : null]} onPress={() => setSelectedSection('feedbacks')}>
            <Text style={[styles.adminBtnText, selectedSection === 'feedbacks' ? styles.adminBtnTextActive : null]}>💬 Feedbacks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.adminBtn, selectedSection === 'solicitacoes' ? styles.adminBtnActive : null]} onPress={() => setSelectedSection('solicitacoes')}>
            <Text style={[styles.adminBtnText, selectedSection === 'solicitacoes' ? styles.adminBtnTextActive : null]}>📦 Solicitações</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.adminBtn]} onPress={() => openAdminChat()}>
            <Text style={styles.adminBtnText}>💬 Solucionar</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>

      {/* Admin chat modal (Solucionar) */}
      <Modal visible={adminChatVisible} transparent animationType="none">
        <View style={styles.chatModalOverlay}>
          <Animated.View style={[styles.chatModalContentAdmin, { opacity: adminChatAnim, transform: [{ translateY: adminChatAnim.interpolate({ inputRange: [0,1], outputRange: [220, 0] }) }] }]}>
            <View style={styles.chatHeaderAdmin}>
              <View>
                <Text style={styles.chatHeaderTitleAdmin}>{(conversationUsers.find(u => String(u.id) === String(selectedChatUserId)) || { name: 'Usuário' }).name}</Text>
                <Text style={{ color: '#666', fontSize: 12 }}>Conversa</Text>
              </View>
              <TouchableOpacity onPress={() => setAdminChatVisible(false)}>
                <Text style={{ fontSize: 18, color: '#666' }}>✕</Text>
              </TouchableOpacity>
            </View>
            {/* Conversation selector */}
            <View style={{ paddingHorizontal: 12, paddingTop: 8 }}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }} contentContainerStyle={{ gap: 8 }}>
                {conversationUsers.length === 0 ? (
                  <Text style={{ color: '#666' }}>Nenhuma conversa disponível</Text>
                ) : conversationUsers.map((u) => (
                  <TouchableOpacity key={String(u.id)} onPress={() => setSelectedChatUserId(String(u.id))} style={[{ paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: selectedChatUserId === String(u.id) ? '#eaf7ef' : '#f3f3f3', marginRight: 8 }]}>
                    <Text style={{ color: selectedChatUserId === String(u.id) ? '#145c2e' : '#333', fontWeight: '700' }}>{u.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
            <ScrollView ref={(r)=>{ adminChatScrollRef.current = r; }} style={styles.chatMessagesAdmin} contentContainerStyle={{ padding: 12, paddingBottom: 18 }}>
              {adminChatMessages.filter((m:any) => String(m.usuario_id) === String(selectedChatUserId)).map((m:any, i:number) => (
                <AdminMessageBubble key={m.id || i} m={m} />
              ))}
            </ScrollView>
            <View style={styles.chatInputRowAdmin}>
              <TextInput value={adminChatInput} onChangeText={setAdminChatInput} placeholder="Escreva sua resposta..." style={styles.chatInputAdmin} multiline={false} />
              <TouchableOpacity onPress={() => sendAdminMessage(adminChatInput)} style={styles.chatSendBtnAdmin}>
                <Text style={styles.chatSendText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>

  {/* Small back button inside admin header (visible when authenticated) */}
  {/* It will be rendered as part of the header content so it's easy to reach */}

  <View style={{ flex: 1, padding: 12 }}>
        {selectedSection === null && (
          <View style={styles.sectionPlaceholder}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#2E7D32', marginBottom: 6 }}>Bem-vindo ao painel</Text>
            <Text style={{ color: '#356b3a', textAlign: 'center' }}>Selecione uma das opções acima para gerenciar conteúdos. Estas áreas foram preparadas e estarão prontas para atualizações futuras.</Text>
          </View>
        )}

        {selectedSection === 'roupas' && (
          <View style={{ flex: 1 }}>
            {loadingProdutos ? (
              <ActivityIndicator size="large" color="#2E7D32" />
            ) : (
              <ScrollView contentContainerStyle={{ padding: 8 }}>
                {produtosAdmin.length === 0 && <Text style={{ textAlign: 'center', color: '#666' }}>Nenhuma peça encontrada.</Text>}
                {produtosAdmin.map((p) => (
                  <View key={p.nome} style={styles.prodCard}>
                    <Image source={{ uri: p.imagem }} style={styles.prodImage} />
                    <View style={styles.prodInfo}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Text style={styles.prodTitle} numberOfLines={1}>{p.nome}</Text>
                        <View style={[styles.badge, p.__source === 'custom' ? styles.badgeCustom : styles.badgeBase]}>
                          <Text style={p.__source === 'custom' ? styles.badgeTextCustom : styles.badgeTextBase}>
                            {p.__source === 'custom' ? '✳️ Personalizada' : '📦 Original'}
                          </Text>
                        </View>
                      </View>
                      <Text style={styles.prodDesc} numberOfLines={3}>{p.descricao}</Text>
                      <View style={styles.actionRow}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                          <View style={styles.adminPricePill}>
                            <Image source={require('../assets/images/trevo.png')} style={{ width: 16, height: 16, tintColor: '#fff', marginRight: 8 }} />
                            <Text style={{ color: '#fff', fontWeight: '900' }}>{getDisplayCusto(p)}</Text>
                          </View>
                          <TouchableOpacity activeOpacity={0.85} style={styles.priceEditBtn} onPress={() => openPriceEditor(p)}>
                            <Text style={{ color: '#145c2e', fontWeight: '800' }}>Editar valor</Text>
                          </TouchableOpacity>
                        </View>

                        <View style={{ flexDirection: 'row', gap: 8 }}>
                          <TouchableOpacity activeOpacity={0.8} style={[styles.actionBtn, { backgroundColor: '#B71C1C' }]} onPress={() => handleTirarProduto(p.nome)}>
                            <Text style={styles.actionBtnText}>🗑️ Tirar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity activeOpacity={0.8} style={[styles.actionBtn, { backgroundColor: '#2E7D32' }]} onPress={() => openEditProduto(p)}>
                            <Text style={styles.actionBtnText}>✏️ Editar</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
                <View style={{ alignItems: 'center', marginTop: 12 }}>
                  <TouchableOpacity style={[styles.removeBtn, { backgroundColor: '#B71C1C', paddingHorizontal: 20 }]} onPress={() => { setShowRemoved(s => !s); if (!showRemoved) loadRemovedItems(); }}>
                    <Text style={{ color: '#fff', fontWeight: '800' }}>{showRemoved ? 'Fechar Lixeira' : 'Abrir Lixeira'}</Text>
                  </TouchableOpacity>
                </View>
                {showRemoved ? (
                  <View style={styles.trashPanel}>
                    <Text style={styles.trashTitle}>Lixeira — peças removidas</Text>
                    {removedItems.length === 0 ? (
                      <View style={styles.emptyTrash}><Text style={{ color: '#666' }}>Nenhuma peça na lixeira.</Text></View>
                    ) : (
                      <ScrollView contentContainerStyle={{ padding: 8 }} style={{ maxHeight: 300 }}>
                        {removedItems.map((r) => (
                          <View key={r.nome} style={styles.removedCard}>
                            <Image source={{ uri: r.imagem }} style={styles.removedImage} />
                            <View style={{ flex: 1, marginLeft: 12 }}>
                              <Text style={styles.prodTitle} numberOfLines={1}>{r.nome}</Text>
                              <Text style={styles.prodDesc} numberOfLines={2}>{r.descricao}</Text>
                              <TouchableOpacity activeOpacity={0.85} style={[styles.restoreBtn]} onPress={() => handleRestoreProduct(r.nome)}>
                                <Text style={{ color: '#fff', fontWeight: '800' }}>♻️ Restaurar</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ))}
                      </ScrollView>
                    )}
                  </View>
                ) : null}
              </ScrollView>
            )}
            <Modal visible={editModalVisible} transparent animationType="fade">
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.32)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: '92%', maxWidth: 720, backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
                  <Text style={{ fontSize: 18, fontWeight: '800', color: '#2E7D32', marginBottom: 8, textAlign: 'center' }}>Editar Produto</Text>
                  <TextInput style={styles.input} value={editNome} onChangeText={setEditNome} placeholder="Nome" />
                  <TextInput style={[styles.input, { minHeight: 80 }]} value={editDescricao} onChangeText={setEditDescricao} placeholder="Descrição" multiline />
                  <TextInput style={styles.input} value={editImagem} onChangeText={setEditImagem} placeholder="URL da imagem" />
                  <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center' }}>
                    <TouchableOpacity style={styles.modalBtn} onPress={() => setEditModalVisible(false)}>
                      <Text style={styles.modalBtnText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={saveEditProduto}>
                      <Text style={[styles.modalBtnText, { color: '#fff' }]}>Salvar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
            {/* Modal: Editar Valor da Peça */}
            <Modal visible={priceEditModalVisible} transparent animationType="fade">
              <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.36)', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ width: '92%', maxWidth: 480, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center' }}>
                  <View style={{ width: 72, height: 72, borderRadius: 36, backgroundColor: '#f3fff7', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
                    <Image source={require('../assets/images/trevo.png')} style={{ width: 36, height: 36, tintColor: '#2E7D32' }} />
                  </View>
                  <Text style={{ fontSize: 18, fontWeight: '900', color: '#145c2e', marginBottom: 6 }}>{priceEditItem?.nome || 'Editar valor'}</Text>
                  <Text style={{ fontWeight: '800', marginBottom: 6 }}>{(priceEditCurrent !== null) ? `Valor atual: ${priceEditCurrent} trevos` : (priceEditValue ? `Valor atual: ${priceEditValue} trevos` : 'Valor atual: —')}</Text>
                  <Text style={{ color: '#666', marginBottom: 12, textAlign: 'center' }}>Defina um valor fixo em trevos para esta peça. Valores maiores deixam a peça mais premium.</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                    <TextInput value={String(priceEditValue)} onChangeText={t => setPriceEditValue(t)} keyboardType="numeric" style={[styles.input, { minWidth: 140, textAlign: 'center' }]} />
                    <View style={{ backgroundColor: '#eaf7ef', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12 }}>
                      <Text style={{ color: '#145c2e', fontWeight: '800' }}>trevos</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 10 }}>
                    {[11,13,15,18].map((val) => (
                      <TouchableOpacity key={val} onPress={() => setPriceEditValue(String(val))} style={{ backgroundColor: priceEditValue == String(val) || priceEditValue == val ? '#e9fcec' : '#f3f3f3', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}>
                        <Text style={{ color: '#145c2e', fontWeight: '800' }}>{val}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                  <View style={{ flexDirection: 'row', gap: 12, marginTop: 16 }}>
                    <TouchableOpacity style={styles.modalBtn} onPress={() => { setPriceEditModalVisible(false); setPriceEditItem(null); }}>
                      <Text style={styles.modalBtnText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={savePriceEdit}>
                      <Text style={[styles.modalBtnText, { color: '#fff' }]}>Salvar valor</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}

        {selectedSection === 'feedbacks' && (
          <View style={{ flex: 1 }}>
            {loadingFeedbacks ? (
              <ActivityIndicator size="large" color="#2E7D32" />
            ) : (
              <ScrollView contentContainerStyle={{ padding: 8 }}>
                {feedbacks.length === 0 && <Text>Nenhum feedback encontrado.</Text>}
                {feedbacks.map((f) => (
                  <View key={f.id} style={styles.doacaoCard}>
                    <Text style={styles.doacaoTitle}>{f.message}</Text>
                    <Text style={styles.doacaoMeta}>{new Date(f.createdAt).toLocaleString()}</Text>
                    <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemoveFeedback(f.id)}>
                      <Text style={{ color: '#fff', fontWeight: '700' }}>Remover</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        )}

        {selectedSection === 'solicitacoes' && (
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginBottom: 8 }}>
              <TouchableOpacity style={[styles.adminBtn, solicitTab === 'doacoes' ? styles.adminBtnActive : null]} onPress={() => setSolicTab('doacoes')}>
                <Text style={[styles.adminBtnText, solicitTab === 'doacoes' ? styles.adminBtnTextActive : null]}>Doações</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.adminBtn, solicitTab === 'trocas' ? styles.adminBtnActive : null]} onPress={() => setSolicTab('trocas')}>
                <Text style={[styles.adminBtnText, solicitTab === 'trocas' ? styles.adminBtnTextActive : null]}>Trocas</Text>
              </TouchableOpacity>
            </View>
            {solicitTab === 'doacoes' ? (
              <View style={{ flex: 1 }}>{renderDoacoesList()}</View>
            ) : (
              <View style={{ flex: 1 }}>
                {loadingTrocas ? <ActivityIndicator size="large" color="#2E7D32" /> : (
                  <ScrollView contentContainerStyle={{ padding: 8 }}>
                    {trocas.length === 0 && <Text>Nenhuma solicitação de troca encontrada.</Text>}
                    {trocas.map((t) => (
                      <View key={t.id} style={styles.doacaoCard}>
                        {t.produto && t.produto.imagem ? (
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-ignore
                          <Image source={{ uri: t.produto.imagem }} style={styles.doacaoImage} />
                        ) : null}
                        <Text style={styles.doacaoTitle}>{t.produto?.nome || 'Produto'}</Text>
                        <Text style={styles.doacaoMeta}>Custo: {t.custo} trevos</Text>
                        <Text style={styles.doacaoMeta}>Endereço: {t.endereco?.rua || ''} {t.endereco?.numero || ''} — {t.endereco?.cidade || ''} {t.endereco?.cep || ''}</Text>
                        <Text style={styles.doacaoMeta}>Criado: {new Date(t.createdAt).toLocaleString()}</Text>
                        <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
                          <TouchableOpacity style={[styles.removeBtn, { backgroundColor: '#1976D2' }]} onPress={() => openApproveModal(t)}>
                            <Text style={{ color: '#fff', fontWeight: '700' }}>Aprovar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.removeBtn, { backgroundColor: '#2E7D32' }]} onPress={() => handleMarkTrocaProcessed(t.id)}>
                            <Text style={{ color: '#fff', fontWeight: '700' }}>Marcar Processado</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.removeBtn, { backgroundColor: '#B71C1C' }]} onPress={() => handleRejectTroca(t.id)}>
                            <Text style={{ color: '#fff', fontWeight: '700' }}>Reprovar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity style={styles.removeBtn} onPress={() => handleRemoveTroca(t.id)}>
                            <Text style={{ color: '#fff', fontWeight: '700' }}>Remover</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                )}
              </View>
            )}
          </View>
        )}
        {/* Modal: Aprovar Doação (escolher trevos) */}
        <Modal visible={approveDoacaoModalVisible} transparent animationType="slide">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.36)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '92%', maxWidth: 420, backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 18, fontWeight: '800', color: '#2E7D32' }}>Aprovar Doação</Text>
                <TouchableOpacity onPress={() => { setApproveDoacaoModalVisible(false); setApproveDoacaoTarget(null); }}>
                  <Text style={{ fontSize: 20 }}>✕</Text>
                </TouchableOpacity>
              </View>
              {approveDoacaoTarget ? (
                <>
                  <View style={{ alignItems: 'center', marginTop: 12 }}>
                    {approveDoacaoTarget.imagem ? <Image source={{ uri: approveDoacaoTarget.imagem }} style={{ width: 120, height: 120, borderRadius: 8 }} /> : null}
                    <Text style={{ fontWeight: '800', marginTop: 8 }}>{approveDoacaoTarget.nome}</Text>
                    <Text style={{ color: '#666', marginTop: 6 }}>{approveDoacaoTarget.descricao}</Text>
                  </View>

                  <View style={{ marginTop: 14 }}>
                    <Text style={{ color: '#145c2e', fontWeight: '700', marginBottom: 8 }}>Quantos trevos recompensar?</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                      <TouchableOpacity onPress={() => setApproveTrevosAmount(a => Math.max(0, (a || 0) - 1))} style={[styles.optionBtn, { paddingHorizontal: 12 }]}>
                        <Text style={{ fontWeight: '800' }}>-</Text>
                      </TouchableOpacity>
                      <Text style={{ fontSize: 20, fontWeight: '900', color: '#145c2e' }}>{approveTrevosAmount}</Text>
                      <TouchableOpacity onPress={() => setApproveTrevosAmount(a => Math.min(100, (a || 0) + 1))} style={[styles.optionBtn, { paddingHorizontal: 12 }]}>
                        <Text style={{ fontWeight: '800' }}>+</Text>
                      </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                      {[1,2,3,5,6,7,10].map(n => (
                        <TouchableOpacity key={n} onPress={() => setApproveTrevosAmount(n)} style={[styles.optionBtn, approveTrevosAmount === n ? styles.selectedOption : {}, { marginRight: 8, marginBottom: 8 }]}>
                          <Text style={{ fontWeight: approveTrevosAmount === n ? '800' : '600', color: approveTrevosAmount === n ? '#145c2e' : '#2E7D32' }}>{n} trevos</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                    <View style={{ marginTop: 8 }}>
                      <TouchableOpacity style={[styles.optionBtn, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#2E7D32', width: 200, alignSelf: 'center' }]} onPress={() => setValueTableModalVisible(true)}>
                        <Text style={{ color: '#145c2e', fontWeight: '700', textAlign: 'center' }}>Acesso à tabela de valor</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 12, marginTop: 14 }}>
                    <TouchableOpacity style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={() => handleConfirmApproveDoacao(true)}>
                      <Text style={[styles.modalBtnText, { color: '#fff' }]}>Confirmar e Aprovar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.modalBtn} onPress={() => { setApproveDoacaoModalVisible(false); setApproveDoacaoTarget(null); }}>
                      <Text style={styles.modalBtnText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </>
              ) : null}
            </View>
          </View>
        </Modal>

        {/* Modal: Tabela de valores (pequeno) */}
        <Modal visible={valueTableModalVisible} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.36)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '86%', maxWidth: 480, backgroundColor: '#fff', borderRadius: 10, padding: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, fontWeight: '800', color: '#2E7D32' }}>Tabela de Valores</Text>
                <TouchableOpacity onPress={() => setValueTableModalVisible(false)}>
                  <Text style={{ fontSize: 18 }}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 10 }}>
                {Object.entries({
                  'Camiseta (bom estado)': 5,
                  'Moletom (bom estado)': 6,
                  'Calça/Jeans (bom estado)': 6,
                  'Casaco/Jaqueta (bom estado)': 7,
                  'Vestido (bom estado)': 6,
                  'Blusa (bom estado)': 5,
                  'Camiseta (rasgada / ruim)': 2,
                  'Peça pequena (acessório)': 1,
                }).map(([label, val]) => (
                  <View key={label} style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#f1f7f2' }}>
                    <Text style={{ color: '#2f6b3a', fontWeight: '700' }}>{label}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#e9fcec', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 20 }}>
                      <Image source={require('../assets/images/trevo.png')} style={{ width: 16, height: 16, marginRight: 8, tintColor: '#2E7D32' }} />
                      <Text style={{ fontWeight: '800', color: '#145c2e' }}>{val}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        </Modal>

        {/* Modal: Aprovar troca e enviar relatório ao usuário */}
        <Modal visible={approveModalVisible} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.32)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '92%', maxWidth: 720, backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#2E7D32', marginBottom: 8, textAlign: 'center' }}>Aprovar Solicitação</Text>
              <Text style={{ marginBottom: 8 }}>{selectedTrocaForApprove?.produto?.nome}</Text>
              <TouchableOpacity style={[styles.input, { justifyContent: 'center' }]} onPress={() => setShowDatePicker(true)}>
                <Text style={{ color: deliveryDate ? '#222' : '#888' }}>{deliveryDate ? deliveryDate : 'Escolher data de entrega'}</Text>
              </TouchableOpacity>
              <Modal visible={showDatePicker} transparent animationType="slide">
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.32)', justifyContent: 'center', padding: 16 }}>
                  <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, maxHeight: '60%' }}>
                    <Text style={{ fontWeight: '800', marginBottom: 8 }}>Escolha a data de entrega</Text>
                    <ScrollView>
                      {dateOptions.map(d => (
                        <TouchableOpacity key={d} style={{ padding: 10, borderBottomWidth: 1, borderColor: '#eee' }} onPress={() => { setDeliveryDate(d); setShowDatePicker(false); }}>
                          <Text>{d}</Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 8 }}>
                      <TouchableOpacity style={styles.modalBtn} onPress={() => setShowDatePicker(false)}>
                        <Text style={styles.modalBtnText}>Fechar</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
              <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                <TouchableOpacity style={styles.modalBtn} onPress={() => setApproveModalVisible(false)}>
                  <Text style={styles.modalBtnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={() => selectedTrocaForApprove && handleSendReportForTroca(selectedTrocaForApprove.id)}>
                  <Text style={[styles.modalBtnText, { color: '#fff' }]}>Mandar relatório para usuário</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
        {/* Modal: Reprovar solicitação com justificativa (doações) */}
        <Modal visible={rejectModalVisible} transparent animationType="fade">
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.32)', justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ width: '92%', maxWidth: 720, backgroundColor: '#fff', borderRadius: 12, padding: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: '800', color: '#B71C1C', marginBottom: 8, textAlign: 'center' }}>Reprovar Solicitação</Text>
              <Text style={{ marginBottom: 8 }}>Escreva uma justificativa que será enviada ao usuário:</Text>
              <TextInput value={rejectReason} onChangeText={setRejectReason} multiline style={[styles.input, { minHeight: 100 }]} placeholder="Motivo da reprovação (ex.: condição, falta de informação, etc.)" />
              <View style={{ flexDirection: 'row', gap: 8, justifyContent: 'center', marginTop: 12 }}>
                <TouchableOpacity style={styles.modalBtn} onPress={() => { setRejectModalVisible(false); setRejectTargetId(null); setRejectReason(''); }}>
                  <Text style={styles.modalBtnText}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={() => {
                  if (rejectTargetId) handleRejectSolicitacaoDoacaoConfirmed(rejectTargetId, rejectReason || 'Doação reprovada pelo administrador.');
                  setRejectModalVisible(false);
                  setRejectTargetId(null);
                  setRejectReason('');
                }}>
                  <Text style={[styles.modalBtnText, { color: '#fff' }]}>Confirmar reprovação</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
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
  adminPricePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E7D32',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 18,
    shadowColor: '#2E7D32',
    shadowOpacity: 0.12,
    elevation: 3,
  },
  priceEditBtn: {
    backgroundColor: '#eaf7ef',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#dff6e6',
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
  /* Admin enhanced styles */
  adminHeader: { alignItems: 'center', paddingVertical: 20, paddingHorizontal: 12, backgroundColor: '#eaf7ef', borderBottomWidth: 1, borderColor: '#e0f1e4' },
  adminLogo: { width: 88, height: 88, marginBottom: 8 },
  adminTitle: { fontSize: 26, fontWeight: '900', color: '#145c2e', marginBottom: 6, textAlign: 'center' },
  adminSubtitle: { color: '#356b3a', textAlign: 'center', maxWidth: 760, marginBottom: 12 },
  adminButtonsRow: { flexDirection: 'row', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 12 },
  adminBtn: { backgroundColor: '#2E7D32', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 12, marginHorizontal: 6, marginVertical: 6 },
  adminBtnText: { color: '#fff', fontWeight: '700' },
  adminHeaderBg: { backgroundColor: '#eaf7ef', paddingVertical: 18, paddingHorizontal: 12 },
  adminHeaderContent: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  logoutBtnHeader: { backgroundColor: '#C62828', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, elevation: 2 },
  adminBtnActive: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#2E7D32' },
  adminBtnTextActive: { color: '#2E7D32', fontWeight: '900' },
  sectionPlaceholder: { backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', elevation: 2 },
  sectionTitle: { fontSize: 18, fontWeight: '800', color: '#2E7D32', marginBottom: 6 },
  sectionSubtitle: { color: '#356b3a', textAlign: 'center' },
  doacaoCard: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12, alignItems: 'center' },
  doacaoImage: { width: 220, height: 160, borderRadius: 8, marginBottom: 8 },
  doacaoTitle: { fontWeight: 'bold', color: '#1f4f2a', marginBottom: 4 },
  doacaoMeta: { color: '#666' },
  removeBtn: { marginTop: 8, backgroundColor: '#B71C1C', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  /* Novos estilos para painel de produtos/admin */
  prodCard: { backgroundColor: '#fff', padding: 12, borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'flex-start', elevation: 3, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  prodImage: { width: 120, height: 120, borderRadius: 10, backgroundColor: '#f2f2f2' },
  prodInfo: { flex: 1, marginLeft: 12 },
  prodTitle: { fontSize: 16, fontWeight: '800', color: '#134f2a' },
  prodDesc: { color: '#666', marginTop: 6 },
  badge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  badgeText: { color: '#fff', fontWeight: '800', fontSize: 12 },
  badgeCustom: { backgroundColor: '#6a1b9a' },
  badgeTextCustom: { color: '#fff', fontWeight: '800', fontSize: 12 },
  badgeBase: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#1565c0' },
  badgeTextBase: { color: '#1565c0', fontWeight: '800', fontSize: 12 },
  actionRow: { flexDirection: 'row', gap: 10, marginTop: 10 },
  actionBtn: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, minWidth: 100, alignItems: 'center' },
  actionBtnText: { color: '#fff', fontWeight: '800' },
  /* Lixeira */
  trashPanel: { backgroundColor: '#f7fff7', borderRadius: 12, padding: 10, marginTop: 12, borderWidth: 1, borderColor: '#e6f6ea' },
  trashTitle: { fontWeight: '900', textAlign: 'center', color: '#2E7D32', marginBottom: 8 },
  emptyTrash: { padding: 16, alignItems: 'center' },
  removedCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10, padding: 10, marginBottom: 10, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  removedImage: { width: 80, height: 64, borderRadius: 6, backgroundColor: '#f2f2f2' },
  restoreBtn: { marginTop: 8, backgroundColor: '#2E7D32', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 8, alignSelf: 'flex-start' },
  optionBtn: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, backgroundColor: '#e8f8e8', borderWidth: 1, borderColor: '#43ea7a', marginRight: 8 },
  selectedOption: { backgroundColor: '#c6f7d0', borderColor: '#2E7D32' },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 14, borderRadius: 8, backgroundColor: '#f0f0f0' },
  modalBtnPrimary: { backgroundColor: '#2E7D32' },
  modalBtnText: { color: '#333', fontWeight: '700' },
  /* Admin 'Solucionar' button in header */
  adminSolveName: { color: '#145c2e', fontWeight: '900', marginBottom: 6 },
  chatButtonAdmin: { backgroundColor: '#fff', paddingVertical: 10, paddingHorizontal: 12, borderRadius: 14, alignItems: 'center', justifyContent: 'center', flexDirection: 'row', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  chatButtonIcon: { fontSize: 16, marginRight: 8, color: '#2E7D32' },
  chatButtonText: { color: '#2E7D32', fontWeight: '900' },
  /* Admin chat modal styles */
  chatModalOverlay: { flex: 1, backgroundColor: 'rgba(2,10,6,0.36)', justifyContent: 'flex-end' },
  chatModalContentAdmin: { backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingTop: 8, maxHeight: '78%', minHeight: 240, shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 12, shadowOffset: { width: 0, height: -6 }, elevation: 12 },
  chatHeaderAdmin: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 14, paddingBottom: 10, paddingTop: 8, backgroundColor: '#eaf7ef', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  chatHeaderTitleAdmin: { fontWeight: '900', color: '#145c2e', fontSize: 16 },
  chatMessagesAdmin: { flex: 1, backgroundColor: '#fff' },
  msgRowLeft: { alignItems: 'flex-start', marginBottom: 10 },
  msgRowRight: { alignItems: 'flex-end', marginBottom: 10 },
  messageBubbleAdmin: { backgroundColor: '#f3f5f6', padding: 12, borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottomRightRadius: 18, borderBottomLeftRadius: 6, maxWidth: '82%', shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 6 },
  messageBubbleUser: { backgroundColor: '#2E7D32', padding: 12, borderTopLeftRadius: 18, borderTopRightRadius: 18, borderBottomLeftRadius: 18, borderBottomRightRadius: 6, maxWidth: '82%', shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 10 },
  messageText: { color: '#222' },
  messageTimeAdmin: { color: '#8b8b8b', fontSize: 11, marginTop: 6, textAlign: 'right' },
  chatInputRowAdmin: { flexDirection: 'row', alignItems: 'center', padding: 12, borderTopWidth: 0, backgroundColor: '#fff' },
  chatInputAdmin: { flex: 1, backgroundColor: '#f6f7f7', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 22, marginRight: 10, borderWidth: 1, borderColor: '#eef3ee' },
  chatSendBtnAdmin: { width: 46, height: 46, borderRadius: 23, backgroundColor: '#2E7D32', alignItems: 'center', justifyContent: 'center', shadowColor: '#2E7D32', shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 6 }, elevation: 8 },
  chatSendText: { color: '#fff', fontWeight: '800' },
});
