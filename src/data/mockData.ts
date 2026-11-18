import { Product, Department, KitCombo } from '../types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'limpeza',
    name: 'Limpeza & Higiene',
    slug: 'limpeza-e-higiene',
    discountBadge: 'ATÉ 50%',
    image: '/produtos/limpeza/papel-toalha-santher-eco-et100.png',
    iconName: 'Sparkles'
  },
  {
    id: 'food-service',
    name: 'Food Service & Descartáveis',
    slug: 'food-service-e-descartaveis',
    discountBadge: 'ATÉ 40%',
    image: '/produtos/descartaveis/copos-descartaveis-ecocoppo.png',
    iconName: 'Utensils'
  },
  {
    id: 'papelaria',
    name: 'Escritório & Papelaria',
    slug: 'escritorio-e-papelaria',
    discountBadge: 'ATÉ 35%',
    image: '/produtos/papelaria/papel-chamex-a4.png',
    iconName: 'Briefcase'
  },
  {
    id: 'equipamentos',
    name: 'Equipamentos Bralimpia',
    slug: 'equipamentos-de-limpeza',
    discountBadge: 'ATÉ 30%',
    image: '/produtos/limpeza/kit-limpeza-bralimpia.png',
    iconName: 'Wrench'
  },
  {
    id: 'artesanato',
    name: 'Artesanato & Tecidos',
    slug: 'artesanato-tecidos-festas',
    discountBadge: 'ATÉ 50% OFF',
    image: '/produtos/artesanato/novelos-circulo-mollet.png',
    iconName: 'Palette'
  }
];

export const FLASH_PRODUCTS: Product[] = [
  {
    id: 'papel-chamex-a4',
    name: 'Papel Sulfite A4 75g/m² Chamex Branco (Caixa Master c/ 10 Resmas - 5.000 Folhas)',
    category: 'Escritório & Papelaria',
    categorySlug: 'escritorio-e-papelaria',
    price: 269.90,
    originalPrice: 319.00,
    discountPixPercent: 10,
    installmentsMax: 3,
    image: '/produtos/papelaria/papel-chamex-a4.png',
    badge: 'Flash Sale',
    badgeColor: 'orange',
    rating: 5.0,
    reviewsCount: 512,
    sku: 'PAP-CHAMEX-CX10',
    brand: 'Chamex / Sylvamo',
    isFlashDeal: true,
    unit: 'Caixa c/ 10 resmas (5.000 fls)',
    description: 'Papel sulfite A4 Chamex 75g/m² 100% celulose virgem com certificação FSC. Tecnologia 99,99% livre de atolamento em impressoras e copiadoras de alta velocidade. Caixa fechada master com 10 resmas de 500 folhas (5.000 folhas totais), ideal para abastecimento corporativo, departamentos fiscais, escritórios e escolas com emissão de nota fiscal PJ.',
    features: [
      'Caixa master com 10 resmas de 500 folhas (5.000 folhas no formato A4 210 x 297 mm)',
      'Gramatura standard de 75 g/m² com excelente opacidade e alvura balanceada',
      'Desempenho comprovado: 99,99% livre de atolamentos em impressoras laser e jato de tinta',
      'Certificação internacional FSC de manejo florestal responsável e sustentável',
      'Absorção equilibrada de toner que reduz custos de impressão corporativa'
    ],
    specifications: {
      'Formato': 'A4 (210 mm x 297 mm)',
      'Gramatura': '75 g/m²',
      'Quantidade por Caixa': '10 resmas de 500 folhas (Total 5.000 folhas)',
      'Cor / Alvura': 'Branco 98% ISO',
      'Origem': 'Nacional (Sylvamo do Brasil)'
    },
    itemsIncluded: [
      '01 Caixa de Papel Sulfite Chamex A4 com 10 Resmas (5.000 Folhas)'
    ],
    stock: 48,
    b2bPrices: [
      { minQty: 5, price: 249.90 },
      { minQty: 10, price: 229.90 },
      { minQty: 20, price: 219.90 }
    ]
  },
  {
    id: 'copos-descartaveis-ecocoppo-200ml',
    name: 'Copo Plástico Descartável 200ml Branco EcoCoppo (Tira c/ 100 Unidades)',
    category: 'Food Service & Descartáveis',
    categorySlug: 'food-service-e-descartaveis',
    price: 5.20,
    originalPrice: 6.80,
    discountPixPercent: 10,
    installmentsMax: 1,
    image: '/produtos/descartaveis/copos-descartaveis-ecocoppo.png',
    badge: 'Flash Sale',
    badgeColor: 'orange',
    rating: 4.9,
    reviewsCount: 320,
    sku: 'DESC-COPO-ECO200',
    brand: 'EcoCoppo',
    isFlashDeal: true,
    unit: 'Tira c/ 100 un.',
    description: 'Copos plásticos descartáveis de 200ml EcoCoppo fabricados rigorosamente de acordo com a norma ABNT NBR 14865 em polipropileno (PP) virgem 100% reciclável e atóxico. Borda arredondada suave e nervuras anatômicas para maior conforto e firmeza ao segurar líquidos quentes ou frios em bebedouros corporativos e recepções.',
    features: [
      'Tira lacrada com 100 copos plásticos descartáveis de 200ml',
      'Fabricado em Polipropileno (PP) virgem atóxico e 100% reciclável',
      'Em conformidade com as normas técnicas da ABNT NBR 14865',
      'Borda com acabamento ergonômico anti-corte e corpo com estrias de reforço',
      'Compatível com os principais suportes e dispensadores de parede do mercado'
    ],
    specifications: {
      'Capacidade': '200 ml',
      'Material': 'Polipropileno (PP) virgem',
      'Cor': 'Branco leitoso',
      'Embalagem': 'Tira com 100 unidades',
      'Laudo Sanitário': 'Atóxico e aprovado para contato direto com bebidas'
    },
    itemsIncluded: [
      '01 Tira selada com 100 Copos Descartáveis EcoCoppo 200ml'
    ],
    stock: 320,
    b2bPrices: [
      { minQty: 20, price: 4.80 },
      { minQty: 50, price: 4.50 },
      { minQty: 100, price: 4.20 }
    ]
  },
  {
    id: 'kit-profissional-limpeza-bralimpia',
    name: 'Kit Profissional de Higienização Bralimpia: Balde Doblô 30L + Mop Líquido Completo',
    category: 'Equipamentos de Limpeza',
    categorySlug: 'equipamentos-de-limpeza',
    price: 389.90,
    originalPrice: 469.00,
    discountPixPercent: 10,
    installmentsMax: 3,
    image: '/produtos/limpeza/kit-limpeza-bralimpia.png',
    badge: 'Últimas Unidades',
    badgeColor: 'orange',
    rating: 5.0,
    reviewsCount: 198,
    sku: 'EQUIP-KIT-BRA30L',
    brand: 'Bralimpia',
    isFlashDeal: true,
    unit: 'Kit Completo',
    description: 'Kit de higienização profissional completo Bralimpia composto por Balde Doblô de 30 litros com duas águas (divisória interna de água limpa e suja), espremedor mecânico de alta pressão reforçado, cabo telescópico em alumínio anodizado e refil de mop algodão loop de 320g. Evita contaminação cruzada e reduz o esforço ergonômico dos operadores.',
    features: [
      'Balde com capacidade de 30 litros com divisória removível para separação de águas',
      'Espremedor de compressão vertical de alta eficiência com engrenagens em nylon',
      '4 rodízios giratórios anti-risco de 3 polegadas em borracha sintética silenciosa',
      'Cabo profissional em alumínio anodizado leve e resistente à corrosão',
      'Refil mop líquido em fios de algodão crú loop de 320g com cinta estabilizadora'
    ],
    specifications: {
      'Capacidade do Balde': '30 Litros (18L água limpa / 12L água de enxágue)',
      'Dimensões do Balde': '52 cm x 37 cm x 48 cm',
      'Comprimento do Cabo': '1,40 m em alumínio anodizado',
      'Refil Mop': 'Algodão Cru Loop 320g com ponta dobrada',
      'Garantia': '12 meses contra defeitos de fabricação'
    },
    itemsIncluded: [
      '01 Balde Doblô 30 Litros Amarelo Bralimpia',
      '01 Divisória interna removível',
      '01 Espremedor mecânico de alta pressão',
      '01 Cabo de alumínio 1,40m com garra Euro',
      '01 Refil Mop Líquido Loop 320g'
    ],
    stock: 4
  }
];

export const BEST_SELLER_PRODUCTS: Product[] = [
  {
    id: 'caixa-canetas-bic-cristal-azul',
    name: 'Caneta Esferográfica BIC Cristal Média 1.0mm Azul (Caixa c/ 50 Unidades)',
    category: 'Escritório & Papelaria',
    categorySlug: 'escritorio-e-papelaria',
    price: 44.90,
    originalPrice: 56.00,
    discountPixPercent: 10,
    installmentsMax: 2,
    image: '/produtos/papelaria/caixa-canetas-bic-cristal-azul.png',
    badge: 'Mais Vendida',
    badgeColor: 'green',
    rating: 5.0,
    reviewsCount: 340,
    sku: 'PAP-BIC-AZ50',
    brand: 'BIC',
    isBestSeller: true,
    unit: 'Caixa c/ 50 un.',
    description: 'A clássica caneta esferográfica BIC Cristal azul com ponta média de 1.0mm e esfera de tungstênio de alta durabilidade. Escrita suave, contínua e precisa até a última gota de tinta (rende mais de 2 quilômetros de escrita por unidade). Corpo hexagonal ergonômico translúcido e tampa ventilada de segurança.',
    features: [
      'Caixa econômica corporativa lacrada com 50 unidades',
      'Ponta média de 1.0 mm com traço macio de 0.4 mm',
      'Tinta azul de secagem rápida que não borra no papel',
      'Esfera em carbeto de tungstênio altamente resistente',
      'Corpo hexagonal transparente que permite visualizar o nível de tinta'
    ],
    specifications: {
      'Cor da Tinta': 'Azul clássico',
      'Espessura da Ponta': '1.0 mm (Média)',
      'Quantidade por Caixa': '50 canetas',
      'Rendimento': 'Até 2.000 metros lineares de escrita por caneta'
    },
    itemsIncluded: [
      '01 Caixa com 50 Canetas Esferográficas BIC Cristal Azul'
    ],
    stock: 85,
    b2bPrices: [
      { minQty: 10, price: 39.90 },
      { minQty: 25, price: 36.90 }
    ]
  },
  {
    id: 'santher-eco-et100',
    name: 'Papel Toalha Interfolhado 2 Dobras 100% Celulose Santher Eco ET100 (Fardo c/ 2.000 Folhas)',
    category: 'Limpeza & Higiene',
    categorySlug: 'limpeza-e-higiene',
    price: 32.90,
    originalPrice: 41.50,
    discountPixPercent: 10,
    installmentsMax: 2,
    image: '/produtos/limpeza/papel-toalha-santher-eco-et100.png',
    badge: 'Mais Vendido',
    badgeColor: 'green',
    rating: 4.9,
    reviewsCount: 174,
    sku: 'LIM-SANT-ET100',
    brand: 'Santher',
    isBestSeller: true,
    unit: 'Fardo c/ 2.000 fls',
    description: 'Papel toalha interfolhado Santher Eco ET100 com 2 dobras em 100% fibras virgens de alta pureza e brancura. Secagem completa das mãos com apenas 1 a 2 folhas, sem esfarelar nem soltar fiapos residuais na pele, proporcionando máxima economia e higiene em sanitários corporativos, clínicas médicas e restaurantes.',
    features: [
      'Fardo com 2.000 folhas interfolhadas em pacotes práticos',
      '100% Celulose virgem de alta alvura e toque aveludado',
      'Formato 2 dobras com alta resistência úmida (não rasga ao puxar)',
      'Absorção ultrarrápida que reduz o consumo médio por usuário',
      'Compatível com todos os toalheiros interfolhados padrão do mercado'
    ],
    specifications: {
      'Formato das Folhas': '21 cm x 20 cm (2 dobras)',
      'Gramatura': '28 a 30 g/m²',
      'Quantidade': '2.000 folhas (8 pacotes com 250 folhas cada)',
      'Composição': '100% Fibras virgens de celulose'
    },
    itemsIncluded: [
      '01 Fardo com 2.000 Folhas de Papel Toalha Santher Eco ET100'
    ]
  },
  {
    id: 'toalha-snob-santher-2r',
    name: 'Toalha de Papel Multiuso Folha Dupla Santher Snob (Pacote c/ 2 Rolos)',
    category: 'Food Service & Descartáveis',
    categorySlug: 'food-service-e-descartaveis',
    price: 7.90,
    originalPrice: 9.90,
    discountPixPercent: 5,
    installmentsMax: 1,
    image: '/produtos/descartaveis/papel-toalha-snob-santher.png',
    badge: 'Últimas Unidades',
    badgeColor: 'orange',
    rating: 5.0,
    reviewsCount: 215,
    sku: 'DESC-SNOB-2R',
    brand: 'Santher / Snob',
    isBestSeller: true,
    unit: 'Pacote c/ 2 Rolos',
    description: 'Papel toalha multiuso folha dupla Snob Santher com círculos de absorção patenteados. Proporciona máxima absorção de gorduras, óleos e líquidos com apenas uma folha, sendo indispensável em cozinhas industriais, copas corporativas, lanchonetes e áreas de manipulação de alimentos.',
    features: [
      'Folha dupla com textura especial em microporos de alta retenção',
      'Absorve até 3x mais líquidos que papéis toalha convencionais',
      'Picote preciso que facilita o destaque folha a folha sem desperdício',
      'Pacote prático com 2 rolos lacrados higienicamente'
    ],
    specifications: {
      'Quantidade de Rolos': '2 rolos de 50 toalhas cada',
      'Dimensão da Folha': '19 cm x 21 cm',
      'Tipo de Folha': 'Dupla gofrada'
    },
    itemsIncluded: [
      '01 Pacote com 2 Rolos de Papel Toalha Snob Santher'
    ],
    stock: 3
  },
  {
    id: 'galao-cera-pisos-shinefloor-5l',
    name: 'Cera Acrílica Auto-Brilho para Pisos SHINEFLOOR 5 Litros (Galão Profissional)',
    category: 'Limpeza & Higiene',
    categorySlug: 'limpeza-e-higiene',
    price: 68.90,
    originalPrice: 84.90,
    discountPixPercent: 10,
    installmentsMax: 3,
    image: '/produtos/limpeza/galao-cera-pisos-shinefloor.png',
    badge: 'Flash Sale',
    badgeColor: 'orange',
    rating: 4.9,
    reviewsCount: 129,
    sku: 'LIM-CERA-SHINE5L',
    brand: 'ShineFloor / Lothus Pro',
    isBestSeller: true,
    unit: 'Galão 5L',
    description: 'Cera acrílica impermeabilizante auto-brilho SHINEFLOOR com alto teor de sólidos. Forma uma película protetora transparente antiderrapante de excelente durabilidade, resistente a tráfego intenso de pedestres em pisos laváveis de ardósia, cerâmica, granilite, vinílico, paviflex e cimento queimado sem necessidade de enceradeira.',
    features: [
      'Efeito auto-brilho imediato que dispensa lustro com enceradeira',
      'Resistente ao tráfego pesado e a marcas de sapatos e rodízios',
      'Ação antiderrapante certificada para segurança de pedestres',
      'Rendimento aproximado de até 60 m² por litro por demão',
      'Galão industrial de 5 litros em PEAD com tampa lacrada'
    ],
    specifications: {
      'Volume': '5 Litros',
      'Tipo de Filme': 'Acrílico metalizado auto-brilhante',
      'Indicação': 'Pisos vinílicos, cerâmicas, pedras polidas e cimentícios',
      'pH': 'Neutro (7,5 a 8,5)'
    },
    itemsIncluded: [
      '01 Galão de 5 Litros Cera Acrílica SHINEFLOOR'
    ]
  },
  {
    id: 'lixeira-branca-pedal-rodas-60l',
    name: 'Lixeira Hospitalar e Coletiva 60 Litros com Pedal e Rodízios Branca',
    category: 'Limpeza & Higiene',
    categorySlug: 'limpeza-e-higiene',
    price: 149.90,
    originalPrice: 185.00,
    discountPixPercent: 10,
    installmentsMax: 3,
    image: '/produtos/limpeza/lixeira-branca-pedal-rodas.png',
    badge: 'Últimas Unidades',
    badgeColor: 'orange',
    rating: 4.8,
    reviewsCount: 67,
    sku: 'LIM-LIX-PED60B',
    brand: 'Bralimpia / JSN',
    isBestSeller: true,
    unit: 'Unidade 60L',
    description: 'Lixeira plástica injetada em polipropileno de alta densidade com pedal frontal e haste mecânica reforçada, eliminando qualquer contato manual com a tampa conforme as exigências sanitárias da ANVISA (RDC 306). Equipada com 2 rodas emborrachadas e alça ergonômica traseira para deslocamento prático e seguro.',
    features: [
      'Acionamento por pedal resistente que preserva a biossegurança',
      'Capacidade nominal de 60 litros para sacos de lixo hospitalar ou comum',
      '2 rodas em borracha maciça que não riscam pisos sensíveis',
      'Tampa com vedação perimetral que impede a saída de odores e insetos',
      'Construção reforçada lavável imune à ação de desinfetantes e cloro'
    ],
    specifications: {
      'Capacidade': '60 Litros',
      'Dimensões': '48 cm x 44 cm x 65 cm (LxPxA)',
      'Material': 'Polipropileno virgem injetado',
      'Cor': 'Branca sanitária'
    },
    itemsIncluded: [
      '01 Lixeira Coletiva 60 Litros com Pedal, Tampa e Rodas montadas'
    ],
    stock: 7
  },
  {
    id: 'prato-descartavel-kerocopo-15cm',
    name: 'Prato Plástico Descartável Raso 15cm Branco Kerocopo (Pacote c/ 10 Unidades)',
    category: 'Food Service & Descartáveis',
    categorySlug: 'food-service-e-descartaveis',
    price: 3.80,
    originalPrice: 5.20,
    discountPixPercent: 5,
    installmentsMax: 1,
    image: '/produtos/descartaveis/prato-descartavel-kerocopo.png',
    badge: 'Flash Sale',
    badgeColor: 'orange',
    rating: 4.8,
    reviewsCount: 78,
    sku: 'DESC-PRAT-15K',
    brand: 'Kerocopo',
    isBestSeller: true,
    unit: 'Pacote c/ 10 un.',
    description: 'Prato plástico descartável raso de 15cm em poliestireno (PS) virgem de alta resistência térmica e mecânica. Borda com reforço estrutural anti-dobra ideal para servir bolos, sobremesas, petiscos e salgados em eventos corporativos, coffee breaks, refeitórios e confraternizações.',
    features: [
      'Pacote lacrado com 10 pratos descartáveis de 15cm',
      'Borda canelada que confere maior rigidez contra curvaturas',
      'Poliestireno virgem 100% atóxico com laudo de contato alimentar',
      'Design raso ergonômico fácil de manusear'
    ],
    specifications: {
      'Diâmetro': '15 cm',
      'Material': 'Poliestireno (PS)',
      'Cor': 'Branco',
      'Quantidade': '10 unidades por pacote'
    },
    itemsIncluded: [
      '01 Pacote com 10 Pratos Descartáveis Kerocopo 15cm'
    ]
  },
  {
    id: 'guardanapo-santapel-20x20',
    name: 'Guardanapo de Papel Folha Simples 20x20cm Santapel (Pacote c/ 50 Folhas)',
    category: 'Food Service & Descartáveis',
    categorySlug: 'food-service-e-descartaveis',
    price: 2.90,
    originalPrice: 3.90,
    discountPixPercent: 5,
    installmentsMax: 1,
    image: '/produtos/descartaveis/guardanapo-santapel.png',
    badge: 'Mais Vendido',
    badgeColor: 'green',
    rating: 4.7,
    reviewsCount: 95,
    sku: 'DESC-GUARD-SAN20',
    brand: 'Santapel',
    isBestSeller: true,
    unit: 'Pacote c/ 50 fls',
    description: 'Guardanapo de papel folha simples 20x20cm Santapel fabricado com 100% de fibras celulósicas selecionadas. Alta absorção, textura macia e excelente alvura para mesas de café corporativo, lanchonetes, padarias e refeitórios industriais.',
    features: [
      'Pacote higiênico com 50 folhas no formato 20x20 cm',
      '100% Fibras celulósicas biodegradáveis',
      'Gofragem sutil que aumenta a capacidade de retenção de umidade',
      'Ideal para copas de escritórios e suporte ao buffet'
    ],
    specifications: {
      'Tamanho da Folha': '20 cm x 20 cm',
      'Folha': 'Simples gofrada',
      'Quantidade': '50 folhas por pacote'
    },
    itemsIncluded: [
      '01 Pacote de Guardanapo Santapel com 50 Folhas'
    ]
  },
  {
    id: 'colheres-mexabem-50un',
    name: 'Colher Plástica Descartável para Sobremesa Mexabem (Pacote c/ 50 Unidades)',
    category: 'Food Service & Descartáveis',
    categorySlug: 'food-service-e-descartaveis',
    price: 6.50,
    originalPrice: 8.90,
    discountPixPercent: 5,
    installmentsMax: 1,
    image: '/produtos/descartaveis/colheres-descartaveis-mexabem.png',
    badge: 'Flash Sale',
    badgeColor: 'orange',
    rating: 4.9,
    reviewsCount: 110,
    sku: 'DESC-COLH-MEX50',
    brand: 'Mexabem',
    isBestSeller: true,
    unit: 'Pacote c/ 50 un.',
    description: 'Colheres plásticas descartáveis reforçadas Mexabem. Fabricadas em poliestireno atóxico de alta rigidez estrutural que não deforma nem quebra durante o consumo de sobremesas, mousses, caldos e alimentos densos em eventos corporativos.',
    features: [
      'Pacote econômico lacrado com 50 unidades',
      'Cabo anatômico reforçado com perfil que não dobra',
      'Poliestireno virgem atóxico aprovado para alimentos',
      'Acabamento polido sem rebarbas cortantes'
    ],
    specifications: {
      'Comprimento': '13 cm (Tamanho Sobremesa)',
      'Material': 'Poliestireno (PS) virgem',
      'Cor': 'Branca',
      'Quantidade': '50 unidades por embalagem'
    },
    itemsIncluded: [
      '01 Pacote com 50 Colheres Descartáveis Mexabem'
    ]
  },
  {
    id: 'dispenser-papel-higienico-branco',
    name: 'Dispenser Porta Papel Higiênico Rolão 300m/500m Branco Minimalista com Trava',
    category: 'Limpeza & Higiene',
    categorySlug: 'limpeza-e-higiene',
    price: 42.90,
    originalPrice: 56.00,
    discountPixPercent: 10,
    installmentsMax: 2,
    image: '/produtos/limpeza/dispenser-papel-higienico.png',
    badge: 'Últimas Unidades',
    badgeColor: 'orange',
    rating: 4.9,
    reviewsCount: 86,
    sku: 'LIM-DISP-ROL-BR',
    brand: 'Bralimpia / Premisse',
    isBestSeller: true,
    unit: 'Unidade',
    description: 'Dispenser institucional para papel higiênico em rolo tipo rolão de 300 a 500 metros. Fabricado em termoplástico ABS de alto impacto com visor central transparente de monitoramento de nível, sistema de fechamento por trava e chave de segurança anti-furto.',
    features: [
      'Design clean minimalista que valoriza sanitários corporativos',
      'Compatível com bobinas de papel higiênico rolão de 300m a 500m',
      'Visor transparente frontal para verificação rápida do estoque de papel',
      'Fechamento com chave de segurança para prevenir abertura indevida',
      'Serrilha inferior que corta o papel com facilidade sem desperdício'
    ],
    specifications: {
      'Dimensões': '27 cm x 27 cm x 12 cm',
      'Material': 'Termoplástico ABS virgem de alta resistência',
      'Tubete Compatível': 'Padrão 45 mm a 50 mm',
      'Acompanha': 'Chave de segurança e kit de buchas para fixação'
    },
    itemsIncluded: [
      '01 Dispenser Rolão Branco Minimalista',
      '01 Chave de travamento de segurança',
      '01 Kit com buchas e parafusos para instalação'
    ],
    stock: 2
  },
  {
    id: 'marca-texto-gatte-amarelo',
    name: 'Caneta Marca-Texto Amarela Fluorescente Ponta Chanfrada Gatte',
    category: 'Escritório & Papelaria',
    categorySlug: 'escritorio-e-papelaria',
    price: 3.50,
    originalPrice: 4.90,
    discountPixPercent: 5,
    installmentsMax: 1,
    image: '/produtos/papelaria/marca-texto-gatte-amarelo.png',
    badge: 'Flash Sale',
    badgeColor: 'orange',
    rating: 4.8,
    reviewsCount: 82,
    sku: 'PAP-MARC-GATTE-AM',
    brand: 'Gatte',
    isBestSeller: true,
    unit: 'Unidade',
    description: 'Marca-texto fluorescente amarelo com ponta chanfrada de poliéster de 2 a 5mm. Tinta luminosa à base de água que não transpassa o verso da folha nem borra impressões a laser ou jato de tinta, sendo ideal para relatórios, livros e estudos corporativos.',
    features: [
      'Ponta chanfrada versátil para marcação em linha fina ou ampla',
      'Tinta atóxica à base de água de secagem quase instantânea',
      'Cor amarela fluorescente vibrante que não escurece com o tempo',
      'Tampa com clipe resistente para fixação em blocos e pastas'
    ],
    specifications: {
      'Traço da Ponta': 'De 2.0 mm a 5.0 mm',
      'Tinta': 'À base de água sem solventes voláteis',
      'Cor': 'Amarelo Neon Fluorescente'
    },
    itemsIncluded: [
      '01 Caneta Marca-Texto Gatte Amarela'
    ]
  },
  {
    id: 'porta-canetas-mint-3em1',
    name: 'Organizador de Mesa e Porta Canetas / Clips / Lembretes 3 em 1 Verde Mint',
    category: 'Escritório & Papelaria',
    categorySlug: 'escritorio-e-papelaria',
    price: 14.90,
    originalPrice: 19.50,
    discountPixPercent: 5,
    installmentsMax: 1,
    image: '/produtos/papelaria/porta-canetas-mint.png',
    badge: 'Últimas Unidades',
    badgeColor: 'orange',
    rating: 4.8,
    reviewsCount: 64,
    sku: 'PAP-ORG-MINT3',
    brand: 'Dello / Waleu',
    isBestSeller: true,
    unit: 'Unidade',
    description: 'Organizador de mesa multifuncional 3 em 1 em poliestireno acabamento fosco na moderna cor Verde Mint. Compartimentos dedicados para canetas/lápis, clipes/borrachas e bloco de notas adesivas, mantendo sua estação de trabalho limpa, organizada e produtiva.',
    features: [
      'Design monobloco com 3 divisórias ergonômicas funcionais',
      'Material resistente que não quebra com facilidade',
      'Cor Verde Mint contemporânea para escritórios e home office',
      'Base estável com textura que não arranha tampos de mesa'
    ],
    specifications: {
      'Dimensões': '14 cm x 8 cm x 9 cm',
      'Material': 'Poliestireno rígido de alta durabilidade',
      'Divisórias': 'Porta-Canetas, Porta-Clips e Porta-Lembretes'
    },
    itemsIncluded: [
      '01 Organizador de Mesa 3 em 1 Verde Mint'
    ]
  },
  {
    id: 'quadro-cortica-cortiarte-60x40',
    name: 'Quadro de Cortiça para Avisos e Recados 60x40cm Moldura de Madeira Cortiarte',
    category: 'Escritório & Papelaria',
    categorySlug: 'escritorio-e-papelaria',
    price: 34.90,
    originalPrice: 44.00,
    discountPixPercent: 10,
    installmentsMax: 2,
    image: '/produtos/papelaria/quadro-cortica-cortiarte.png',
    badge: 'Mais Vendido',
    badgeColor: 'green',
    rating: 4.9,
    reviewsCount: 103,
    sku: 'PAP-QUAD-CORT60',
    brand: 'Cortiarte',
    isBestSeller: true,
    unit: 'Unidade',
    description: 'Quadro de avisos em cortiça natural de alta densidade 60x40cm com moldura em madeira de reflorestamento Cortiarte. Perfeito para fixação de comunicados internos, cronogramas de tarefas, recados da equipe e lembretes com alfinetes/tachinhas.',
    features: [
      'Superfície em lâmina de cortiça natural auto-regenerativa',
      'Moldura sólida em madeira de reflorestamento com fino acabamento',
      'Suporte traseiro em chapa de fibra de madeira que não deforma',
      'Pode ser instalado tanto na posição horizontal quanto vertical',
      'Acompanha kit de ganchos para fixação na parede'
    ],
    specifications: {
      'Dimensões': '60 cm de comprimento x 40 cm de largura x 1,5 cm de espessura',
      'Material': 'Cortiça natural e moldura em madeira',
      'Fixação': 'Ganchos metálicos inclusos'
    },
    itemsIncluded: [
      '01 Quadro de Cortiça 60x40cm Cortiarte',
      '01 Kit de ganchos de fixação para parede'
    ]
  },
  {
    id: 'novelos-circulo-mollet-coloridos',
    name: 'Novelo de Lã Mollet 40g 100% Acrílico Círculo (Cores Sortidas / Novelo de 100m)',
    category: 'Artesanato & Tecidos',
    categorySlug: 'artesanato-tecidos-festas',
    price: 5.90,
    originalPrice: 7.50,
    discountPixPercent: 5,
    installmentsMax: 1,
    image: '/produtos/artesanato/novelos-circulo-mollet.png',
    badge: 'Flash Sale',
    badgeColor: 'orange',
    rating: 4.9,
    reviewsCount: 142,
    sku: 'ART-MOLLET-40G',
    brand: 'Círculo',
    isBestSeller: true,
    unit: 'Novelo 40g',
    description: 'O Novelo Mollet 40g da Círculo é o clássico fio 100% acrílico indispensável para trabalhos de tricô, crochê, tear, amigurumis e confecção de artesanato escolar e ateliês. Proporciona alto rendimento, maciez extrema e excelente vivacidade de cor que não desbota com a lavagem.',
    features: [
      'Composição 100% Acrílico com toque suave e alta resistência',
      'Rendimento de 100 metros por novelo (Tex 500)',
      'Cores firmes e homogêneas com amplo leque cromático',
      'Ideal para confecção de mantas, peças de vestuário e oficinas criativas'
    ],
    specifications: {
      'Peso Líquido': '40 gramas',
      'Comprimento': '100 metros',
      'Agulhas Recomendadas': 'Crochê 2.0mm a 2.5mm | Tricô 4.0mm a 5.0mm',
      'Composição': '100% Acrílico'
    },
    itemsIncluded: [
      '01 Novelo de Fio Mollet 40g Círculo'
    ]
  },
  {
    id: 'quadro-branco-90x60',
    name: 'Quadro Branco Magnético 90x60cm Moldura Alumínio Stalo',
    category: 'Escritório & Papelaria',
    categorySlug: 'escritorio-e-papelaria',
    price: 76.90,
    originalPrice: 94.00,
    discountPixPercent: 10,
    installmentsMax: 3,
    image: '/assets_site_atual/Magnetico-60x40-1.jpg',
    badge: 'Últimas Unidades',
    badgeColor: 'orange',
    rating: 4.8,
    reviewsCount: 64,
    sku: 'QUA-MAG9060',
    brand: 'Stalo',
    isBestSeller: true,
    unit: 'Unidade',
    description: 'Quadro branco magnético profissional com dimensões de 90x60cm e chapa de aço esmaltada especial para fixação de ímãs e aviso de comunicados corporativos. Possui moldura em alumínio anodizado fosco de alto padrão, cantos arredondados em polietileno com fixação invisível na parede e porta-apagador em alumínio reposicionável.',
    features: [
      'Superfície magnética de aço que aceita qualquer ímã de neodímio ou comum',
      'Chapa resinada de alto brilho que não mancha nem risca no uso diário',
      'Moldura de alumínio resistente que não empena nem oxida',
      'Acompanha porta-canetas/apagador deslizante de 20 cm',
      'Kit completo de instalação incluso (buchas, parafusos e gabarito)'
    ],
    specifications: {
      'Dimensões': '90 cm x 60 cm x 1,5 cm',
      'Tipo de Superfície': 'Aço magnético vitrificado',
      'Acabamento': 'Alumínio anodizado fosco'
    },
    itemsIncluded: [
      '01 Quadro Branco Magnético 90x60 cm Stalo',
      '01 Porta-apagador em alumínio',
      '01 Kit de fixação para parede'
    ]
  },
  {
    id: 'sianinha-sao-jose-10m',
    name: 'Sianinha Decorativa 10mm Rolo com 10 Metros — Artesanato & Embalagens',
    category: 'Artesanato & Tecidos',
    categorySlug: 'artesanato-tecidos-festas',
    price: 11.90,
    originalPrice: 15.90,
    discountPixPercent: 5,
    installmentsMax: 2,
    image: '/assets_site_atual/Sianinha-2-600x533.jpg',
    badge: 'Mais Vendido',
    badgeColor: 'green',
    rating: 4.7,
    reviewsCount: 118,
    sku: 'ART-SIAN-10M',
    brand: 'São José',
    isBestSeller: true,
    unit: 'Rolo 10m',
    description: 'Sianinha trançada de alta definição com 10mm de largura em rolo fechado de 10 metros, ideal para acabamentos têxteis, confecção de kits promocionais, artesanato corporativo e customização de embalagens.',
    features: [
      'Trama firme que não desfia durante o corte ou costura',
      'Cores vivas com excelente solidez à lavagem',
      'Rolo fechado de 10 metros para alto rendimento'
    ],
    specifications: {
      'Largura': '10 mm',
      'Comprimento': '10 metros',
      'Composição': '100% Viscose / Poliéster'
    },
    itemsIncluded: [
      '01 Rolo de Sianinha 10mm com 10 metros'
    ]
  },
  {
    id: 'caderno-stranger-things',
    name: 'Caderno Espiral Universitário Stranger Things 10 Matérias Tilibra',
    category: 'Escritório & Papelaria',
    categorySlug: 'escritorio-e-papelaria',
    price: 34.90,
    originalPrice: 42.00,
    discountPixPercent: 10,
    installmentsMax: 2,
    image: '/assets_site_atual/Stranger.jpeg',
    badge: 'Flash Sale',
    badgeColor: 'orange',
    rating: 4.9,
    reviewsCount: 97,
    sku: 'CAD-ST-10M',
    brand: 'Tilibra',
    isBestSeller: true,
    unit: 'Unidade',
    description: 'Caderno universitário espiral de 10 matérias com capa dura laminada e artes exclusivas licenciadas da franquia Stranger Things. Contém 160 folhas pautadas decoradas em papel off-white com gramatura que não transfere tinta de caneta esferográfica para o verso.',
    features: [
      'Capa dura com laminação fosca e detalhes em verniz localizado',
      '160 folhas pautadas decoradas com divisórias destacáveis',
      'Bolsa plástica interna para documentos e folha de adesivos'
    ],
    specifications: {
      'Formato': '200 mm x 275 mm',
      'Número de Matérias': '10 matérias (160 folhas)',
      'Gramatura': '56 g/m²'
    },
    itemsIncluded: [
      '01 Caderno Universitário Tilibra Stranger Things 160 folhas'
    ]
  }
];

export const KIT_COMBOS: KitCombo[] = [
  {
    id: 'kit-limpeza-profissional-bralimpia',
    title: 'Kit Higienização Profissional: Balde Doblô 30L + Fardo Santher Eco ET100 + Cera ShineFloor 5L',
    badge: 'COMBO OPERACIONAL 22% OFF',
    description: 'Solução completa para condomínios, clínicas e escritórios: 1 Balde Doblô com espremedor Bralimpia + 1 Fardo com 2.000 folhas Papel Toalha Interfolhado Santher Eco + 1 Galão de 5L Cera Acrílica ShineFloor com frete consolidado em nota única.',
    originalPrice: 489.80,
    currentPrice: 382.90,
    economyAmount: 106.90,
    image: '/produtos/limpeza/kit-limpeza-bralimpia.png',
    itemsIncluded: [
      '01 Balde Doblô 30 Litros c/ Espremedor e Divisória Bralimpia',
      '01 Fardo com 2.000 Folhas de Papel Toalha Santher Eco ET100',
      '01 Galão de 5 Litros Cera Acrílica Auto-Brilho SHINEFLOOR',
      '01 Cabo de Alumínio 1,40m com Refil Mop Líquido Loop 320g'
    ]
  },
  {
    id: 'kit-corporativo-escritorio',
    title: 'Combo Escritório Completo: Caixa Sulfite Chamex A4 5.000 Fls + Cx 50 Canetas BIC Cristal + Porta Canetas Mint',
    badge: 'ECONOMIA CORPORATIVA 18% OFF',
    description: 'Abastecimento corporativo com tudo o que sua sala de reuniões, recepção e equipe precisam em um clique com faturamento no boleto PJ para 28 dias.',
    originalPrice: 329.70,
    currentPrice: 269.90,
    economyAmount: 59.80,
    image: '/produtos/papelaria/papel-chamex-a4.png',
    itemsIncluded: [
      '01 Caixa Fechada de Papel Sulfite Chamex A4 (10 Resmas - 5.000 Folhas)',
      '01 Caixa com 50 Canetas Esferográficas BIC Cristal Azul Média',
      '01 Organizador de Mesa 3 em 1 Verde Mint Dello',
      '01 Caneta Marca-Texto Amarela Gatte'
    ]
  },
  {
    id: 'kit-food-service-copa',
    title: 'Kit Food Service & Copa: Copos EcoCoppo 200ml + Toalhas Snob + Guardanapos Santapel + Pratos Kerocopo',
    badge: 'PACK COPA & EVENTOS 20% OFF',
    description: 'Pacote essencial para copas empresariais, lanchonetes e refeitórios: copos descartáveis certificados ABNT, toalhas de alta absorção Snob, guardanapos macios e pratos rasos.',
    originalPrice: 119.80,
    currentPrice: 95.90,
    economyAmount: 23.90,
    image: '/produtos/descartaveis/copos-descartaveis-ecocoppo.png',
    itemsIncluded: [
      '05 Tiras c/ 100 Copos Descartáveis EcoCoppo 200ml (500 copos)',
      '02 Pacotes Toalha Multiuso Snob Santher Folha Dupla (4 Rolos)',
      '04 Pacotes de Guardanapo Santapel 20x20cm (200 Folhas)',
      '05 Pacotes Prato Descartável Kerocopo 15cm (50 Pratos)'
    ]
  }
];
