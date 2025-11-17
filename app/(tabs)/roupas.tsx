import storage from '@/utils/storage';
import React from 'react';
import { Animated, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, useWindowDimensions } from 'react-native';

const produtos = [
  {
    nome: 'Camiseta West Coast Choopers',
    descricao: 'Conforto e estilo no mesmo lugar',
    imagem: 'https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcSifv2Ge_x22O73douF4mHmVifsEJMz32uUUQ47YnWyEPGuuCV20EK9EVEPQ5rdIY6s-DuVX_ZA5kbGpwP7sF_j5wTOOQqVYMwgqZPRacauZTJRnMZw2yINsA',
    custo: 4,
  },
  {
    nome: 'Moletom Cropped de Jeans',
    descricao: 'Moletom feminino',
    imagem: 'https://lojabeefancy.com.br/cdn/shop/files/jaqueta-streetwear-611736_1200x.png?v=1724351656',
    custo: 5,
  },
  {
    nome: 'Calça Denim Preta',
    descricao: 'Calça preta masculina',
    imagem: 'https://img4.dhresource.com/webp/m/0x0/f3/albu/jc/l/19/e8ce0efc-a8b1-471f-9612-4bf617c2cf4b.jpg',
    custo: 4,
  },
  {
    nome: 'Camiseta feminina cinza',
    descricao: 'Confortavel e basica',
    imagem: 'https://p.globalsources.com/IMAGES/PDT/B5418846505/Y2K-Camisa-top-de-manga-curta.jpg',
    custo: 3,
  },
  {
    nome: 'Blusa masculina preta',
    descricao: 'Blusa preta masculina',
    imagem: 'https://down-br.img.susercontent.com/file/sg-11134201-22100-3g4v6a7aabjv89',
    custo: 3,
  },
  {
    nome: 'Camiseta marrom chocolate',
    descricao: 'Camiseta confeccionada em algodão de gola em V e manga comprida.',
    imagem: 'https://static.zara.net/assets/public/dbe6/e35b/dbe641d4b5fa/753b7ba98790/01044628717-e1/01044628717-e1.jpg?ts=1727362866626&w=750',
    custo: 2,
  },
  {
    nome: 'Camiseta esmeralda',
    descricao: 'Camisa confeccionada em tecido acetinado. Gola com lapela e manga comprida com acabamento em punho com pregas.',
    imagem: 'https://static.zara.net/assets/public/e9d3/e101/d50a454ea287/e07083d79b6d/03645194504-e1/03645194504-e1.jpg?ts=1724757386887&w=850',
    custo: 4,
  },
  {
    nome: 'Camiseta verde claro',
    descricao: 'Camisa confeccionada em linho e viscose 48%. Gola com lapela e manga abaixo do cotovelo com punho. Fecho frontal com botões.',
    imagem: 'https://static.zara.net/assets/public/9537/108a/03ca496e9eb1/a0237551c131/07138089912-e1/07138089912-e1.jpg?ts=1732885643105&w=750',
    custo: 3,
  },
  {
    nome: 'Calça de veludo verde',
    descricao: 'Calça de cintura alta e cós elástico. Parte inferior com acabamento em linha evasê.',
    imagem: 'https://static.zara.net/assets/public/6595/04e1/9dee4b1ab836/e54b41a587e9/07705617527-e1/07705617527-e1.jpg?ts=1741863059988&w=750',
    custo: 6,
  },
  {
    nome: 'Calça verde',
    descricao: 'Calça confeccionada com linho e viscose 45%. Cintura alta com cós elástico. Bolsos laterais.',
    imagem: 'https://static.zara.net/assets/public/11af/573d/b0a34191871c/8623a0223f94/04088912500-e1/04088912500-e1.jpg?ts=1733143227582&w=850',
    custo: 5,
  },
  {
    nome: 'Moletom Racionais',
    descricao: 'Moletom baseado no Grupo de rap Racionais, ela é feita de algodão.',
    imagem: 'https://i.pinimg.com/736x/43/0c/8c/430c8cb913f9c4940cdfbe370374a524.jpg',
    custo: 4,
  },
  {
    nome: 'Casaco Bomber em Poliuretano',
    descricao: 'Jaqueta bomber de gola com lapela e manga comprida com punho e botão. Bolsos de debrum na frente. Bainha com elástico. Fecho frontal com zíper metálico.',
    imagem: 'https://static.zara.net/assets/public/a8d5/1357/3ff04fa3b5e1/bfc397028692/04391865717-e1/04391865717-e1.jpg?ts=1730642518057&w=750',
    custo: 6,
  },
];

// Componente auxiliar que destaca a parte do texto que casa com a query
function HighlightedText({ text, query, style }: { text: string; query: string; style?: any }) {
  if (!query) return <Text style={style}>{text}</Text>;
  const lower = String(text || '').toLowerCase();
  const q = String(query || '').toLowerCase();
  const idx = lower.indexOf(q);
  if (idx === -1) return <Text style={style}>{text}</Text>;
  const before = text.slice(0, idx);
  const match = text.slice(idx, idx + q.length);
  const after = text.slice(idx + q.length);
  return (
    <Text style={style}>
      {before}
      <Text style={{ backgroundColor: 'rgba(46,125,50,0.12)', color: '#145c2e', fontWeight: '800' }}>{match}</Text>
      {after}
    </Text>
  );
}

export default function RoupasScreen() {
  const [modalVisible, setModalVisible] = React.useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = React.useState<{
    nome: string;
    descricao: string;
    imagem: string;
  } | null>(null);
  const [showSolicModal, setShowSolicModal] = React.useState(false);
  const [solicitacoesUser, setSolicitacoesUser] = React.useState<Array<any>>([]);
  const [currentSolicId, setCurrentSolicId] = React.useState<number | null>(null);
  const [deliveryProgress, setDeliveryProgress] = React.useState<Record<number, number>>({});
  const deliveryIntervals = React.useRef<Record<number, any>>({});
  const [userTrevos, setUserTrevos] = React.useState<number>(() => {
    try {
      const t = localStorage.getItem('trevos');
      return t ? parseInt(t, 10) : 0;
    } catch (e) {
      return 0;
    }
  });
  const COST_PER_ITEM = 3; // custo padrão por troca (pode ajustar)
  const [selectedCost, setSelectedCost] = React.useState<number | null>(null);

  const [profileName, setProfileName] = React.useState<string | null>(null);
  const [profileImage, setProfileImage] = React.useState<string | null>(null);
  const [favoritos, setFavoritos] = React.useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('favoritos') || '[]');
    } catch (e) { return []; }
  });

  const router = require('expo-router').useRouter();
  const profileOpacity = React.useRef(new Animated.Value(0));

  // fluxo de modais/etapas: 'check' | 'address' | 'loading' | 'success' | 'not_enough' | null
  const [flowStage, setFlowStage] = React.useState<string | null>(null);
  const [address, setAddress] = React.useState({ rua: '', numero: '', cidade: '', cep: '' });
  const [loadingSeconds, setLoadingSeconds] = React.useState<number>(10);

  // Lista de produtos que combina os padrões com produtos adicionados pelo usuário
  const [listaProdutos, setListaProdutos] = React.useState(() => {
    try {
      const custom = JSON.parse(localStorage.getItem('produtos_custom') || '[]');
      // ensure base products are persisted so admin can read them
      try {
        if (!localStorage.getItem('produtos_base')) {
          localStorage.setItem('produtos_base', JSON.stringify(produtos));
        }
      } catch (e) {}
      const base = JSON.parse(localStorage.getItem('produtos_base') || 'null') || produtos;
      const overrides = JSON.parse(localStorage.getItem('produtos_overrides') || '{}');
      const removed = JSON.parse(localStorage.getItem('produtos_removed') || '[]');
      // remove itens indesejados (p.ex. entradas de teste como 'dasd', 'KAUE', 'f wsf')
      const unwanted = ['dasd', 'kaue', 'f wsf', 'a chave', 'o virus', 'personagem de branco'];
      const filteredCustom = (custom || []).filter((p: any) => {
        if (!p || !p.nome) return false;
        const n = String(p.nome).trim().toLowerCase();
        return !unwanted.includes(n);
      });
      // persist cleanup if we removed unwanted entries
      try {
        if (Array.isArray(custom) && filteredCustom.length !== custom.length) {
          localStorage.setItem('produtos_custom', JSON.stringify(filteredCustom));
        }
      } catch (e) {}
      // apply overrides to base and filter removed
      const baseWithOverrides = (base || []).map((b: any) => {
        const key = String(b.nome || '').trim();
        if (overrides && overrides[key]) return { ...b, ...overrides[key] };
        return b;
      }).filter((b: any) => !removed.includes(String(b.nome || '').trim()));
  const combined = [...filteredCustom.filter((c:any) => !removed.includes(String(c.nome||'').trim())), ...baseWithOverrides];
  // ensure every product has a custo (random between 2 and 6 if missing)
  const withCosts = (combined || []).map((p:any) => ({ ...p, custo: typeof p.custo === 'number' ? p.custo : (Math.floor(Math.random() * 5) + 2) }));
  return withCosts;
    } catch (e) {
      return produtos;
    }
  });

  const [searchQuery, setSearchQuery] = React.useState('');
  // Debounced query to avoid filtering on every keystroke
  const [debouncedQuery, setDebouncedQuery] = React.useState(searchQuery);
  React.useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(String(searchQuery || '').trim().toLowerCase()), 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Active chip label (to visually show which chip is selected)
  const [activeChip, setActiveChip] = React.useState<string | null>(null);
  // visual focus state for the search input
  const [searchFocused, setSearchFocused] = React.useState(false);
  const filteredProdutos = React.useMemo(() => {
    const q = String(debouncedQuery || '').trim().toLowerCase();
    if (!q) return listaProdutos;
    return listaProdutos.filter(p => {
      try {
        const nome = String(p.nome || '').toLowerCase();
        const desc = String(p.descricao || '').toLowerCase();
        return nome.includes(q) || desc.includes(q);
      } catch (e) { return false; }
    });
  }, [debouncedQuery, listaProdutos]);

  // Escuta mudanças no localStorage para atualizar a lista (quando o usuário adiciona novas roupas)
  React.useEffect(() => {
    const handleStorage = (ev: StorageEvent) => {
      if (ev.key === 'produtos_custom' || ev.key === '__last_produtos_update' || ev.key === 'produtos_overrides' || ev.key === 'produtos_removed' || ev.key === 'produtos_base') {
        try {
          const custom = JSON.parse(localStorage.getItem('produtos_custom') || '[]');
          const unwanted = ['dasd', 'kaue', 'f wsf', 'a chave', 'o virus', 'personagem de branco'];
          const filteredCustom = (custom || []).filter((p: any) => {
            if (!p || !p.nome) return false;
            const n = String(p.nome).trim().toLowerCase();
            return !unwanted.includes(n);
          });
          try {
            // persist cleanup if unwanted entries were present
            const raw = localStorage.getItem('produtos_custom') || '[]';
            const original = JSON.parse(raw || '[]');
            if (Array.isArray(original) && filteredCustom.length !== original.length) {
              localStorage.setItem('produtos_custom', JSON.stringify(filteredCustom));
            }
          } catch (e) {}
          const base = JSON.parse(localStorage.getItem('produtos_base') || 'null') || produtos;
          const overrides = JSON.parse(localStorage.getItem('produtos_overrides') || '{}');
          const removed = JSON.parse(localStorage.getItem('produtos_removed') || '[]');
          const baseWithOverrides = (base || []).map((b: any) => {
            const key = String(b.nome || '').trim();
            if (overrides && overrides[key]) return { ...b, ...overrides[key] };
            return b;
          }).filter((b: any) => !removed.includes(String(b.nome || '').trim()));
          const combined = [...filteredCustom.filter((c:any) => !removed.includes(String(c.nome||'').trim())), ...baseWithOverrides];
          const withCosts = (combined || []).map((p:any) => ({ ...p, custo: typeof p.custo === 'number' ? p.custo : (Math.floor(Math.random() * 5) + 2) }));
          setListaProdutos(withCosts);
        } catch (e) {
          setListaProdutos(produtos);
        }
      }
    };
    try {
      window.addEventListener('storage', handleStorage as any);
    } catch (e) {}
    return () => {
      try {
        window.removeEventListener('storage', handleStorage as any);
      } catch (e) {}
    };
  }, []);

  // Load profile info (name + image) from storage and listen for changes
  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const name = await storage.getItem('profile_name');
        const img = await storage.getItem('profile_image');
        if (!mounted) return;
        setProfileName(name);
        setProfileImage(img);
        if (img) {
          // fade in initial image
          try { profileOpacity.current.setValue(0); Animated.timing(profileOpacity.current as any, { toValue: 1, duration: 350, useNativeDriver: true }).start(); } catch (e) {}
        }
      } catch (e) {
        // ignore
      }
    })();

    const onStorage = (ev: StorageEvent) => {
      if (!mounted) return;
      if (ev.key === 'profile_name') setProfileName(ev.newValue);
      if (ev.key === 'profile_image') setProfileImage(ev.newValue);
    };
    try { window.addEventListener('storage', onStorage as any); } catch (e) {}

    // also subscribe to storage wrapper changes
    const cb = (k:string, v:string|null) => {
      if (!mounted) return;
      if (k === 'profile_name') setProfileName(v);
      if (k === 'profile_image') setProfileImage(v);
    };
    try { storage.addChangeListener(cb); } catch (e) {}

    return () => { mounted = false; try { window.removeEventListener('storage', onStorage as any); } catch (e) {} try { storage.removeChangeListener(cb); } catch (e) {} };
  }, []);

  // animate when profileImage changes
  React.useEffect(() => {
    if (!profileImage) return;
    try {
      profileOpacity.current.setValue(0);
      Animated.timing(profileOpacity.current as any, { toValue: 1, duration: 350, useNativeDriver: true }).start();
    } catch (e) {}
  }, [profileImage]);

  const handleLogoutUser = async () => {
    try {
      // clear user id from cross-platform storage and localStorage
      try { await storage.removeItem('idUsuario'); } catch (e) {}
      try { localStorage.removeItem('idUsuario'); } catch (e) {}
    } catch (e) {}
    try { router.replace('/'); } catch (e) { try { router.push('/'); } catch (e) {} }
  };

  const isFavorito = (produto:any) => {
    try {
      return (favoritos || []).some(f => String(f.nome || '') === String(produto.nome || ''));
    } catch (e) { return false; }
  };

  const toggleFavorito = (produto:any) => {
    try {
      const raw = localStorage.getItem('favoritos') || '[]';
      const arr = JSON.parse(raw || '[]') || [];
      const idx = arr.findIndex((p:any) => String(p.nome || '') === String(produto.nome || ''));
      if (idx === -1) {
        arr.unshift({ nome: produto.nome, descricao: produto.descricao, imagem: produto.imagem });
      } else {
        arr.splice(idx, 1);
      }
      localStorage.setItem('favoritos', JSON.stringify(arr));
      try { window.dispatchEvent(new StorageEvent('storage', { key: 'favoritos', newValue: JSON.stringify(arr) } as any)); } catch (e) {}
      setFavoritos(arr);
    } catch (e) {
      // ignore
    }
  };

  // load user's solicitacoes_troca and listen for updates
  React.useEffect(() => {
    const load = () => {
      try {
        const raw = localStorage.getItem('solicitacoes_troca') || '[]';
        const arr = JSON.parse(raw || '[]');
        const uid = localStorage.getItem('idUsuario') ? parseInt(localStorage.getItem('idUsuario') as string, 10) : 0;
        const mine = (Array.isArray(arr) ? arr : []).filter((s:any) => !s.usuario_id || s.usuario_id === uid);
        setSolicitacoesUser(mine);
        // initialize progress for approved items if missing
        const map: Record<number, number> = {};
        mine.forEach((s:any) => {
          if (s.status === 'aprovado') {
            map[s.id] = deliveryProgress[s.id] ?? 0;
          }
        });
        if (Object.keys(map).length) setDeliveryProgress(prev => ({ ...prev, ...map }));
      } catch (e) {
        setSolicitacoesUser([]);
      }
    };
    load();
    const onStorage = (ev: StorageEvent) => {
      if (!ev.key || ev.key === 'solicitacoes_troca') load();
    };
    try { window.addEventListener('storage', onStorage as any); } catch (e) {}
    return () => { try { window.removeEventListener('storage', onStorage as any); } catch (e) {} };
  }, []);

  // Start delivery progress intervals for approved solicitations
  React.useEffect(() => {
    // start intervals for approved solicitations that don't have one yet
    solicitacoesUser.forEach((s: any) => {
      if (s.status === 'aprovado') {
        const id = s.id;
        const current = deliveryProgress[id] ?? 0;
        const hasInterval = Boolean(deliveryIntervals.current[id]);
        if (!hasInterval && current < 100) {
          // start a gentle randomized progress animation
          // slower progress: smaller steps and longer interval so delivery feels slower
          const interval = setInterval(() => {
            setDeliveryProgress(prev => {
              const prevVal = prev[id] ?? 0;
              // random step between 2 and 5 (slower)
              const step = 2 + Math.floor(Math.random() * 4);
              const next = Math.min(100, prevVal + step);
              // if reached 100, clear interval
              if (next >= 100) {
                try { clearInterval(deliveryIntervals.current[id]); } catch (e) {}
                deliveryIntervals.current[id] = null;
              }
              return { ...prev, [id]: next };
            });
          }, 5000);
          deliveryIntervals.current[id] = interval;
        }
      }
    });

    // clean intervals for solicitations that no longer exist or are not approved
    const activeIds = solicitacoesUser.map((s: any) => s.id);
    Object.keys(deliveryIntervals.current).forEach(k => {
      const key = Number(k);
      const exists = activeIds.includes(key);
      const corresponding = solicitacoesUser.find((s: any) => s.id === key);
      if (!exists || !corresponding || corresponding.status !== 'aprovado') {
        try {
          if (deliveryIntervals.current[key]) {
            clearInterval(deliveryIntervals.current[key]);
          }
        } catch (e) {}
        delete deliveryIntervals.current[key];
      }
    });

    return () => {
      // don't clear intervals here; keep them per solicitation until unmount
    };
  }, [solicitacoesUser]);

  // cleanup on unmount
  React.useEffect(() => {
    return () => {
      try {
        Object.keys(deliveryIntervals.current).forEach(k => {
          const key = Number(k);
          if (deliveryIntervals.current[key]) clearInterval(deliveryIntervals.current[key]);
        });
      } catch (e) {}
    };
  }, []);

  // Para facilitar testes locais, garantimos que o usuário possui 10 trevos
  // Para facilitar testes locais, definimos um saldo padrão (10) somente se a chave não existir.
  React.useEffect(() => {
    try {
      const existing = localStorage.getItem('trevos');
      if (existing == null) {
        localStorage.setItem('trevos', '10');
        setUserTrevos(10);
        try { window.dispatchEvent(new StorageEvent('storage', { key: 'trevos', newValue: '10' } as any)); } catch (e) {}
      } else {
        setUserTrevos(existing ? parseInt(existing, 10) : 0);
      }
    } catch (e) {
      setUserTrevos(0);
    }
  }, []);

  // Responsividade: recalcula colunas automaticamente conforme largura da tela
  const { width: windowWidth } = useWindowDimensions();
  let columns = 5;
  if (windowWidth < 360) columns = 1; // very small phones
  else if (windowWidth < 480) columns = 2; // small phones
  else if (windowWidth < 720) columns = 3; // large phones / small tablets
  else if (windowWidth < 1024) columns = 4; // tablets
  else columns = 5; // desktop / wide

  const horizontalPadding = 12 * 2; // container paddingHorizontal * 2
  const gap = 16; // espaço entre cards
  const cardWidth = Math.max(120, Math.floor((windowWidth - horizontalPadding - gap * (columns - 1)) / columns));

  const handleTroca = (produto: { nome: string; descricao: string; imagem: string }) => {
    setProdutoSelecionado(produto);
    // iniciar fluxo de verificação
    // usar saldo local (localStorage) sem chamar backend
    try {
      const t = localStorage.getItem('trevos');
      setUserTrevos(t ? parseInt(t, 10) : 0);
    } catch (e) {
      setUserTrevos(0);
    }
    // definir custo do item (se o produto tiver propriedade 'custo' use-a)
    const custo = (produto as any).custo ?? COST_PER_ITEM;
    setSelectedCost(custo);
    // create a solicitação entry with status 'em_andamento' so user sees it immediately
    try {
      const rawUserId = localStorage.getItem('idUsuario') || '0';
      const usuario_id = rawUserId ? parseInt(rawUserId, 10) : 0;
      const now = Date.now();
      const solicit = {
        id: now,
        usuario_id,
        produto: { nome: produto.nome, descricao: produto.descricao, imagem: produto.imagem },
        custo,
        endereco: null,
        createdAt: new Date(now).toISOString(),
        status: 'em_andamento'
      };
      const raw = localStorage.getItem('solicitacoes_troca') || '[]';
      const arr = JSON.parse(raw || '[]');
      arr.unshift(solicit);
      localStorage.setItem('solicitacoes_troca', JSON.stringify(arr));
      try { window.dispatchEvent(new StorageEvent('storage', { key: 'solicitacoes_troca', newValue: JSON.stringify(arr) } as any)); } catch (e) {}
      setCurrentSolicId(now);
    } catch (e) {
      // ignore storage errors
    }
    setFlowStage('check');
    setModalVisible(true);
  };

  const fecharModal = () => {
    setModalVisible(false);
    setProdutoSelecionado(null);
    setFlowStage(null);
    setAddress({ rua: '', numero: '', cidade: '', cep: '' });
    setLoadingSeconds(10);
  };

  const handleConfirmCheck = () => {
    const custo = selectedCost ?? COST_PER_ITEM;
    if (userTrevos >= custo) {
      // seguir para cadastro de endereço
      setFlowStage('address');
    } else {
      setFlowStage('not_enough');
    }
  };

  const handleConfirmAddress = () => {
    // validação simples
    if (!address.rua || !address.cidade || !address.cep) {
      alert('Preencha os campos de endereço.');
      return;
    }
    // Simular processamento local sem backend
    const custo = selectedCost ?? COST_PER_ITEM;
    if (userTrevos < custo) {
      setFlowStage('not_enough');
      return;
    }
    setFlowStage('loading');
    setLoadingSeconds(10);
    const interval = setInterval(() => {
      setLoadingSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          // decrementar trevos localmente e mostrar sucesso
          const novo = Math.max(0, userTrevos - custo);
          setUserTrevos(novo);
          try {
            localStorage.setItem('trevos', String(novo));
            try { window.dispatchEvent(new StorageEvent('storage', { key: 'trevos', newValue: String(novo) } as any)); } catch (e) {}
          } catch (e) {}
          // registra movimentação de saída em trevos_movimentacoes para o portal
          try {
            const rawMov = localStorage.getItem('trevos_movimentacoes') || '[]';
            const arrMov = JSON.parse(rawMov || '[]');
            const mov = { id: Date.now(), type: 'saida', amount: custo, title: 'Troca realizada', source: produtoSelecionado?.nome || 'Troca', createdAt: Date.now() };
            arrMov.push(mov);
            localStorage.setItem('trevos_movimentacoes', JSON.stringify(arrMov));
            try { window.dispatchEvent(new StorageEvent('storage', { key: 'trevos_movimentacoes', newValue: JSON.stringify(arrMov) } as any)); } catch (e) {}
          } catch (e) {}
          // update the existing solicitação (currentSolicId) to include address and set status to 'pendente'
          try {
            const raw = localStorage.getItem('solicitacoes_troca') || '[]';
            const arr = JSON.parse(raw || '[]');
            const updated = (Array.isArray(arr) ? arr : []).map((s:any) => {
              if (currentSolicId && s.id === currentSolicId) {
                return { ...s, endereco: { ...(address || {}) }, status: 'pendente', updatedAt: new Date().toISOString() };
              }
              return s;
            });
            // if we didn't find it (edge case), create a new finalized entry
            if (currentSolicId && !updated.find((x:any) => x.id === currentSolicId)) {
              const now2 = Date.now();
              updated.unshift({ id: now2, usuario_id: (localStorage.getItem('idUsuario') ? parseInt(localStorage.getItem('idUsuario') as string, 10) : 0), produto: produtoSelecionado ? { nome: produtoSelecionado.nome, descricao: produtoSelecionado.descricao, imagem: produtoSelecionado.imagem } : null, custo, endereco: { ...(address || {}) }, createdAt: new Date(now2).toISOString(), status: 'pendente' });
            }
            localStorage.setItem('solicitacoes_troca', JSON.stringify(updated));
            try { window.dispatchEvent(new StorageEvent('storage', { key: 'solicitacoes_troca', newValue: JSON.stringify(updated) } as any)); } catch (e) {}
          } catch (e) {}
          setFlowStage('success');
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerCenter}>
          <Image source={require('../../assets/images/logo.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.header}>ROUPAS DISPONIVEIS</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.profileArea} onPress={() => { try { router.push('/configuracoes/perfil'); } catch (e) {} }}>
            {profileImage ? (
              // @ts-ignore
              <Animated.Image source={{ uri: profileImage }} style={[styles.profileThumb, { opacity: profileOpacity.current } as any]} />
            ) : (
              <View style={styles.profileThumbPlaceholder}><Text style={{ color: '#fff', fontWeight: '800' }}>{(profileName || 'U').slice(0,1).toUpperCase()}</Text></View>
            )}
            <Text style={styles.profileName} numberOfLines={1}>{profileName || 'Meu Perfil'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutUserBtn} onPress={handleLogoutUser} accessibilityLabel="Sair">
            <Text style={styles.logoutUserText}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* Banner atraente abaixo do título e acima dos cards */}
      <View style={styles.hero}>
        {/* subtle background trevo for visual flair */}
        <Image source={require('../../assets/images/trevo.png')} style={styles.heroBg} />
        <View style={styles.heroTop}>
          <Image source={require('../../assets/images/logo.png')} style={styles.heroLogo} resizeMode="contain" />
          <Text style={styles.heroTitle}>Explorar estilos</Text>
        </View>
        <Text style={styles.heroSubtitle}>Encontre peças sustentáveis e troque com seus trevos.</Text>

        <View style={styles.searchRow}>
          <View style={[styles.searchContainer, searchFocused ? styles.searchContainerFocused : null]}>
            <Text style={styles.searchIcon}>🔎</Text>
            <TextInput
              value={searchQuery}
              onChangeText={t => {
                setSearchQuery(t);
                // clear chip selection when user types manually
                if (activeChip && t.toLowerCase() !== activeChip.toLowerCase()) setActiveChip(null);
              }}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              placeholder="Buscar peça por nome ou descrição"
              placeholderTextColor="#6b8f74"
              style={styles.searchInput}
              clearButtonMode="while-editing"
            />
          </View>
          {searchQuery ? (
            <TouchableOpacity style={styles.clearBtn} onPress={() => { setSearchQuery(''); setActiveChip(null); }}>
              <Text style={{ color: '#fff', fontWeight: '700' }}>Limpar</Text>
            </TouchableOpacity>
          ) : null}
        </View>

        <View style={styles.chipsRow}>
          {[
            { key: 'camiseta', label: 'Camisetas', icon: require('../../assets/images/camiseta.png') },
            { key: 'moletom', label: 'Moletom' },
            { key: 'calça', label: 'Calças' },
            { key: 'jeans', label: 'Jeans' },
          ].map(ch => (
            <TouchableOpacity
              key={ch.key}
              style={[styles.chip, activeChip === ch.key ? styles.chipActive : null]}
              onPress={() => { setSearchQuery(ch.key); setActiveChip(ch.key); }}
            >
              {ch.icon ? <Image source={ch.icon} style={styles.chipIcon} /> : null}
              <Text style={[styles.chipText, activeChip === ch.key ? styles.chipTextActive : null]}>{ch.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={[styles.chip, { backgroundColor: '#fff', borderWidth: 1, borderColor: '#2E7D32' }]} onPress={() => setShowSolicModal(true)}>
            <Text style={{ color: '#2E7D32', fontWeight: '800' }}>Solicitações</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* mostra contagem de resultados / sugestão quando vazio */}
      <View style={{ width: '100%', alignItems: 'center' }}>
        <Text style={{ color: '#2f6b3a', marginBottom: 8 }}>{filteredProdutos.length} resultado(s)</Text>
        {filteredProdutos.length === 0 ? (
          <View style={styles.noResults}>
            <Text style={{ color: '#2E7D32', fontWeight: '700', marginBottom: 6 }}>Nenhum resultado encontrado</Text>
            <Text style={{ color: '#356b3a', textAlign: 'center' }}>Tente outras palavras-chave ou limpe a busca para ver todas as peças.</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.grid}>
        {filteredProdutos.map((produto, idx) => (
          <View key={idx} style={[styles.card, { width: cardWidth }] }>
            <Image source={{ uri: produto.imagem }} style={[
              styles.imagem,
              { width: Math.max(64, Math.round(cardWidth * 0.7)), height: Math.max(64, Math.round(cardWidth * 0.7)) }
            ]} />
            {/* badge para produtos adicionados recentemente */}
            {(produto.addedAt || produto.recent) ? (
              <View style={{ position: 'absolute', top: 8, left: 8, backgroundColor: '#2E7D32', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 }}>
                <Text style={{ color: '#fff', fontWeight: '800', fontSize: 10 }}>Adicionado recentemente</Text>
              </View>
            ) : null}
            {/* destacar as partes do nome que casam com a busca */}
            <HighlightedText style={styles.nome} text={produto.nome} query={debouncedQuery} />
            <Text style={styles.descricao}>{produto.descricao}</Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 8, alignItems: 'center' }}>
              <TouchableOpacity
                style={styles.starBtnWrapper}
                onPress={() => {
                  toggleFavorito(produto);
                  try {
                    // set a flag so profile opens favorites view on navigation
                    localStorage.setItem('__open_favoritos', '1');
                    try { window.dispatchEvent(new StorageEvent('storage', { key: '__open_favoritos', newValue: '1' } as any)); } catch (e) {}
                    router.push('/configuracoes/perfil');
                  } catch (e) {}
                }}
              >
                <Text style={[styles.starBtn, isFavorito(produto) ? styles.starBtnActive : null]}>{isFavorito(produto) ? '★' : '☆'}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.trocaBtn} onPress={() => handleTroca(produto)}>
                <Text style={styles.trocaBtnText}>Trocar</Text>
              </TouchableOpacity>
              <View style={styles.pricePill}>
                <Image source={require('../../assets/images/trevo.png')} style={styles.priceIcon} />
                <Text style={styles.priceNumber}>{(produto as any).custo ?? COST_PER_ITEM}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
      

      {/* Modal de fluxo de troca (checar trevos -> endereço -> loading -> success / erro) */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeModal} onPress={fecharModal}>
              <Text style={{ fontSize: 24 }}>&times;</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Troca</Text>

            {flowStage === 'check' && (
              <>
                {produtoSelecionado && (
                  <>
                    <Image source={{ uri: produtoSelecionado.imagem }} style={styles.modalImg} />
                    <Text style={styles.nome}>{produtoSelecionado.nome}</Text>
                    <Text style={styles.descricao}>{produtoSelecionado.descricao}</Text>
                  </>
                )}
                <Text style={{ marginTop: 12 }}>Você tem <Text style={{ fontWeight: 'bold' }}>{userTrevos}</Text> trevos.</Text>
                <Text>Esta troca custa <Text style={{ fontWeight: 'bold' }}>{selectedCost ?? COST_PER_ITEM}</Text> trevos.</Text>
                <View style={{ flexDirection: 'row', marginTop: 16, gap: 12 }}>
                  <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: '#2E7D32' }]} onPress={handleConfirmCheck}>
                    <Text style={styles.confirmBtnText}>Continuar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.confirmBtn, { backgroundColor: '#aaa' }]} onPress={fecharModal}>
                    <Text style={styles.confirmBtnText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}

            {flowStage === 'not_enough' && (
              <>
                <Text style={{ marginVertical: 12 }}>Você não tem trevos suficientes para realizar essa troca.</Text>
                <Text>Você tem <Text style={{ fontWeight: 'bold' }}>{userTrevos}</Text> e precisa de <Text style={{ fontWeight: 'bold' }}>{selectedCost ?? COST_PER_ITEM}</Text>.</Text>
                <TouchableOpacity style={[styles.confirmBtn, { marginTop: 16 }]} onPress={fecharModal}>
                  <Text style={styles.confirmBtnText}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}

            {flowStage === 'address' && (
              <>
                <Text style={{ marginBottom: 8 }}>Informe o endereço para envio:</Text>
                <TextInput placeholder="Rua" value={address.rua} onChangeText={t => setAddress(a => ({ ...a, rua: t }))} style={styles.input} />
                <TextInput placeholder="Número" value={address.numero} onChangeText={t => setAddress(a => ({ ...a, numero: t }))} style={styles.input} />
                <TextInput placeholder="Cidade" value={address.cidade} onChangeText={t => setAddress(a => ({ ...a, cidade: t }))} style={styles.input} />
                <TextInput placeholder="CEP" value={address.cep} onChangeText={t => setAddress(a => ({ ...a, cep: t }))} style={styles.input} />
                <TouchableOpacity style={[styles.confirmBtn, { marginTop: 8 }]} onPress={handleConfirmAddress}>
                  <Text style={styles.confirmBtnText}>Confirmar Endereço</Text>
                </TouchableOpacity>
              </>
            )}

            {flowStage === 'loading' && (
              <>
                <Text style={{ marginVertical: 12 }}>Enviando solicitação...</Text>
                <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#2E7D32' }}>{loadingSeconds}s</Text>
              </>
            )}

            {flowStage === 'success' && (
              <>
                <Text style={{ marginVertical: 12, fontWeight: 'bold' }}>Troca solicitada com sucesso!</Text>
                <Text>Estamos processando o envio — o produto será encaminhado em breve.</Text>
                <TouchableOpacity style={[styles.confirmBtn, { marginTop: 16 }]} onPress={fecharModal}>
                  <Text style={styles.confirmBtnText}>Fechar</Text>
                </TouchableOpacity>
              </>
            )}

          </View>
        </View>
      </Modal>

      {/* Modal: Solicitações do usuário (acessível via botão ao lado dos chips) */}
      <Modal visible={showSolicModal} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.32)', justifyContent: 'center', padding: 16 }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 12, maxHeight: '80%' }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text style={{ fontWeight: '800', fontSize: 16, color: '#2E7D32' }}>Suas Solicitações</Text>
              <TouchableOpacity onPress={() => setShowSolicModal(false)}>
                <Text style={{ fontSize: 18 }}>&times;</Text>
              </TouchableOpacity>
            </View>
            <ScrollView contentContainerStyle={{ paddingBottom: 12 }}>
              {solicitacoesUser.length === 0 ? <Text>Nenhuma solicitação encontrada.</Text> : solicitacoesUser.map(s => (
                <View key={s.id} style={{ padding: 10, backgroundColor: '#f8fff8', borderRadius: 10, marginBottom: 8 }}>
                  <Text style={{ fontWeight: '800' }}>{s.produto?.nome}</Text>
                  <Text style={{ color: '#666' }}>{s.produto?.descricao}</Text>
                  <Text style={{ marginTop: 6 }}>Status: <Text style={{ fontWeight: '800' }}>{s.status}</Text></Text>
                  <Text style={{ color: '#666', fontSize: 12 }}>Criado: {s.createdAt ? new Date(s.createdAt).toLocaleString() : ''}</Text>
                  {s.status === 'aprovado' ? (
                    <View style={{ marginTop: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{ fontSize: 28, marginRight: 10 }}>🚚</Text>
                          <View>
                            <Text style={{ fontWeight: '800', color: '#2E7D32' }}>Entrega agendada</Text>
                            <Text style={{ color: '#356b3a' }}>{s.deliveryDate ? s.deliveryDate : 'Data não informada'}</Text>
                          </View>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          {deliveryProgress[s.id] >= 100 ? (
                            <Text style={{ color: '#2E7D32', fontWeight: '900' }}>Entregue ✅</Text>
                          ) : (
                            <Text style={{ color: '#1976D2', fontWeight: '700' }}>{deliveryProgress[s.id] ?? 0}%</Text>
                          )}
                        </View>
                      </View>
              
                              {/* delivery art removed per user request; keep spacing */}
                              <View style={{ height: 8 }} />

                              <View style={{ height: 12, backgroundColor: '#e6f2ea', borderRadius: 8, overflow: 'hidden', marginTop: 8 }}>
                                <View style={{ height: 12, backgroundColor: '#2E7D32', width: `${deliveryProgress[s.id] ?? 0}%` }} />
                              </View>

                              <View style={{ marginTop: 10, padding: 12, backgroundColor: '#fff', borderRadius: 8, alignItems: 'center' }}>
                                <Text style={{ fontWeight: '800', color: '#2E7D32' }}>Rastreamento</Text>
                                <Text style={{ color: '#666', marginTop: 6 }}>{deliveryProgress[s.id] >= 100 ? 'Seu pedido foi entregue.' : 'Seu pedido está a caminho. Acompanhe o progresso abaixo.'}</Text>
                                <View style={{ marginTop: 8, width: '100%', alignItems: 'center' }}>
                                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                    <Text style={{ fontSize: 12, color: '#999' }}>Saiu para entrega</Text>
                                    <Text style={{ fontSize: 12, color: '#999' }}>A caminho</Text>
                                    <Text style={{ fontSize: 12, color: '#999' }}>Chegando</Text>
                                  </View>
                                  <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, width: '100%', justifyContent: 'space-between' }}>
                                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: deliveryProgress[s.id] > 0 ? '#2E7D32' : '#ddd' }} />
                                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: deliveryProgress[s.id] > 40 ? '#2E7D32' : '#ddd' }} />
                                    <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: deliveryProgress[s.id] > 80 ? '#2E7D32' : '#ddd' }} />
                                  </View>
                                </View>
                              </View>
                    </View>
                  ) : null}
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
      {/* solicitações em análise removidas */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 24,
    paddingHorizontal: 12,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
    textAlign: 'center',
    backgroundColor: '#2E7D32',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
    overflow: 'hidden',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    alignItems: 'center',
    marginBottom: 18,
    // stronger elevation / shadow to make card pop forward
    elevation: 10,
    borderWidth: 0,
    shadowColor: '#1b5e20',
    shadowOpacity: 0.18,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    transform: [{ translateZ: 0 } as any],
  },
  imagem: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#f0fff4',
    borderWidth: 1,
    borderColor: '#bff0c4',
  },
  nome: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#145c2e',
    marginBottom: 4,
    textAlign: 'center',
  },
  descricao: {
    fontSize: 12,
    color: '#386c3a',
    textAlign: 'center',
  },
  trocaBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#43ea7a',
  },
  trocaBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  precoText: {
    marginTop: 6,
    color: '#145c2e',
    fontWeight: '800',
    fontSize: 13,
  },
  pricePill: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e6f2ea',
    shadowColor: '#2E7D32',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  priceIcon: {
    width: 18,
    height: 18,
    marginRight: 6,
    tintColor: '#2E7D32'
  },
  priceNumber: {
    color: '#145c2e',
    fontWeight: '900',
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: 320,
    elevation: 4,
    position: 'relative',
  },
  closeModal: {
    position: 'absolute',
    top: 8,
    right: 12,
    zIndex: 2,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalImg: {
    width: 120,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#eee',
  },
  confirmBtn: {
    backgroundColor: '#388E3C',
    paddingVertical: 10,
    paddingHorizontal: 32,
    borderRadius: 24,
    marginTop: 12,
  },
  confirmBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  headerRow: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginBottom: 12,
  },
  headerCenter: { position: 'absolute', left: 0, right: 0, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' },
  logo: {
    width: 48,
    height: 48,
    marginRight: 8,
    marginBottom: 4,
  },
  profileArea: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  profileThumb: { width: 44, height: 44, borderRadius: 22, borderWidth: 2, borderColor: '#fff', backgroundColor: '#eee' },
  profileThumbPlaceholder: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#2E7D32', alignItems: 'center', justifyContent: 'center' },
  profileName: { color: '#2E7D32', fontWeight: '800', marginLeft: 6, maxWidth: 120 },
  headerRight: { marginLeft: 'auto', flexDirection: 'row', alignItems: 'center' },
  logoutUserBtn: { marginLeft: 12, backgroundColor: '#B71C1C', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  logoutUserText: { color: '#fff', fontWeight: '700' },
  banner: {
    alignSelf: 'stretch',
    marginHorizontal: 12,
    backgroundColor: '#e9fcec',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 12,
    alignItems: 'center',
    shadowColor: '#2E7D32',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  bannerText: {
    color: '#145c2e',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },
  bannerSubtitle: {
    color: '#2E7D32',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  starBtnWrapper: { width: 40, height: 36, borderRadius: 8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', borderWidth: 1, borderColor: '#eee' },
  starBtn: { fontSize: 18, color: '#999', fontWeight: '800' },
  starBtnActive: { color: '#FFD700' },
  bannerButton: {
    marginTop: 10,
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  bannerImage: {
    width: 140,
    height: 56,
    marginBottom: 8,
  },
  bannerButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerButtonIcon: {
    width: 22,
    height: 22,
    marginRight: 8,
  },
  searchRow: {
    width: '100%',
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    minWidth: 160,
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#dfeee0',
    color: '#145c2e',
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 24,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#e6f1e8',
    shadowColor: '#2E7D32',
    shadowOpacity: 0.02,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  searchContainerFocused: {
    borderColor: '#2E7D32',
    shadowOpacity: 0.12,
    elevation: 4,
  },
  searchIcon: {
    marginRight: 8,
    fontSize: 16,
    color: '#2E7D32',
  },
  clearBtn: {
    backgroundColor: '#2E7D32',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 18,
  },
  bannerButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  hero: {
    alignSelf: 'stretch',
    marginHorizontal: 12,
    backgroundColor: '#eaf7ef',
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 3,
  },
  heroBg: {
    position: 'absolute',
    right: -18,
    top: -18,
    width: 140,
    height: 140,
    opacity: 0.06,
    transform: [{ rotate: '18deg' }],
  },
  heroTop: { flexDirection: 'column', alignItems: 'center', gap: 6, marginBottom: 6 },
  heroLogo: { width: 56, height: 56, marginBottom: 4 },
  heroTitle: { fontSize: 18, fontWeight: '800', color: '#145c2e', textAlign: 'center' },
  heroSubtitle: { color: '#356b3a', marginBottom: 8, marginTop: 2, textAlign: 'center' },
  chipsRow: { flexDirection: 'row', gap: 10, marginTop: 12, flexWrap: 'wrap', justifyContent: 'center' },
  chip: { backgroundColor: '#fff', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 18, flexDirection: 'row', alignItems: 'center', gap: 8, borderWidth: 1, borderColor: '#dfeee0', marginRight: 8, marginBottom: 8 },
  chipIcon: { width: 20, height: 20 },
  chipText: { color: '#145c2e', fontWeight: '700' },
  chipActive: { backgroundColor: '#2E7D32', borderColor: '#1f5a26' },
  chipTextActive: { color: '#fff' },
  noResults: { width: '90%', backgroundColor: '#f1fbf5', borderRadius: 10, padding: 12, alignItems: 'center', borderWidth: 1, borderColor: '#dfeee0', marginBottom: 12 },
  /* requests UI removed per user request */
});
