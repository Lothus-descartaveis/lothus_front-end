import React from 'react';

export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  name?: string;
  size?: number | string;
  className?: string;
}

/**
 * Tabela de equivalência ótica entre classes Tailwind e tamanho de glifo Remix Icon.
 * Ícones baseados em fonte possuem uma área de respiro interna (~15-20%) no glifo.
 * Esta calibragem garante que a mancha visual dos ícones corresponda exatamente (1:1)
 * aos SVGs do Lucide React usados anteriormente na interface da Lothus.
 */
const OPTICAL_SIZE_MAP: Record<string, string> = {
  '2': '10px',
  '2.5': '12px',
  '3': '14px',
  '3.5': '16px',
  '4': '18px',
  '4.5': '20px',
  '5': '22px',
  '5.5': '24px',
  '6': '26px',
  '7': '30px',
  '8': '36px',
  '9': '40px',
  '10': '44px',
  '11': '48px',
  '12': '52px',
  '14': '60px',
  '16': '68px',
  '20': '86px',
  '24': '100px',
  '28': '116px',
  '32': '132px',
};

const TEXT_SIZE_MAP: Record<string, string> = {
  xs: '14px',
  sm: '16px',
  base: '18px',
  lg: '20px',
  xl: '24px',
  '2xl': '28px',
  '3xl': '34px',
  '4xl': '42px',
  '5xl': '54px',
};

/**
 * Resolve a dimensão ótica ideal (fontSize) a partir da prop `size` ou
 * de classes utilitárias do Tailwind no `className` (ex: `w-4 h-4`, `size-5`, etc.).
 */
export function resolveIconFontSize(
  explicitSize?: number | string,
  className: string = ''
): string {
  // 1. Prop explícita `size`
  if (explicitSize !== undefined && explicitSize !== null && explicitSize !== '') {
    if (typeof explicitSize === 'number') {
      return `${Math.round(explicitSize * 1.1)}px`;
    }
    return explicitSize;
  }

  // 2. Extrai classe de dimensão Tailwind (size-*, w-*, h-*)
  const dimMatch = className.match(/\b(?:size|w|h)-(\d+(?:\.\d+)?|\[\d+px\])\b/);
  if (dimMatch) {
    const token = dimMatch[1];
    if (token.startsWith('[') && token.endsWith('px]')) {
      const px = parseInt(token.slice(1, -3), 10);
      if (!isNaN(px)) {
        return `${Math.round(px * 1.1)}px`;
      }
    }
    if (OPTICAL_SIZE_MAP[token]) {
      return OPTICAL_SIZE_MAP[token];
    }
    const val = parseFloat(token);
    if (!isNaN(val)) {
      return `${Math.round(val * 4 * 1.1)}px`;
    }
  }

  // 3. Extrai classes de tipografia (text-xs, text-sm, etc.)
  const textMatch = className.match(/\btext-(xs|sm|base|lg|xl|2xl|3xl|4xl|5xl)\b/);
  if (textMatch && TEXT_SIZE_MAP[textMatch[1]]) {
    return TEXT_SIZE_MAP[textMatch[1]];
  }

  // 4. Default neutro e nítido
  return '20px';
}

/**
 * Componente Icon unificado baseado em CDN (Remix Icon).
 * Permite usar via prop `name` (ex: name="search-line" ou name="ri-search-line")
 * ou através dos componentes nomeados exportados abaixo.
 */
export const Icon = React.forwardRef<HTMLElement, IconProps>(
  ({ name = '', size, className = '', style, ...props }, ref) => {
    const iconClass = name.startsWith('ri-') ? name : `ri-${name}`;
    const computedFontSize = style?.fontSize || resolveIconFontSize(size, className);

    return (
      <i
        ref={ref}
        className={`inline-flex items-center justify-center shrink-0 ${iconClass} ${className}`}
        style={{
          fontSize: computedFontSize,
          lineHeight: 1,
          ...style,
        }}
        aria-hidden="true"
        {...props}
      />
    );
  }
);

Icon.displayName = 'Icon';

/**
 * Helper para criar wrappers de ícones nomeados, mantendo 100% de compatibilidade
 * com JSX existente e evitando imports gigantes de bibliotecas locais pesadas.
 */
export const createIcon = (defaultClass: string, displayName?: string) => {
  const Component = React.forwardRef<HTMLElement, Omit<IconProps, 'name'>>(
    ({ className = '', size, style, ...props }, ref) => {
      const computedFontSize = style?.fontSize || resolveIconFontSize(size, className);

      return (
        <i
          ref={ref}
          className={`inline-flex items-center justify-center shrink-0 ${defaultClass} ${className}`}
          style={{
            fontSize: computedFontSize,
            lineHeight: 1,
            ...style,
          }}
          aria-hidden="true"
          {...props}
        />
      );
    }
  );
  if (displayName) Component.displayName = displayName;
  return Component;
};

// Ícones de Navegação e Sistema
export const Search = createIcon('ri-search-line', 'Search');
export const ShoppingCart = createIcon('ri-shopping-cart-2-line', 'ShoppingCart');
export const ShoppingBag = createIcon('ri-shopping-bag-3-line', 'ShoppingBag');
export const User = createIcon('ri-user-3-line', 'User');
export const UserPlus = createIcon('ri-user-add-line', 'UserPlus');
export const Users = createIcon('ri-group-line', 'Users');
export const Building2 = createIcon('ri-building-line', 'Building2');
export const MapPin = createIcon('ri-map-pin-2-line', 'MapPin');
export const ChevronDown = createIcon('ri-arrow-down-s-line', 'ChevronDown');
export const ChevronLeft = createIcon('ri-arrow-left-s-line', 'ChevronLeft');
export const ChevronRight = createIcon('ri-arrow-right-s-line', 'ChevronRight');
export const Menu = createIcon('ri-menu-line', 'Menu');
export const X = createIcon('ri-close-line', 'X');
export const Check = createIcon('ri-check-line', 'Check');
export const CheckCircle2 = createIcon('ri-checkbox-circle-fill', 'CheckCircle2');
export const ArrowRight = createIcon('ri-arrow-right-line', 'ArrowRight');
export const ArrowLeft = createIcon('ri-arrow-left-line', 'ArrowLeft');
export const ArrowUpDown = createIcon('ri-arrow-up-down-line', 'ArrowUpDown');

// Ícones de Status, Avaliação e Destaques
export const Star = createIcon('ri-star-fill', 'Star');
export const Heart = createIcon('ri-heart-line', 'Heart');
export const Zap = createIcon('ri-flashlight-fill', 'Zap');
export const Sparkles = createIcon('ri-sparkling-line', 'Sparkles');
export const Tag = createIcon('ri-price-tag-3-line', 'Tag');
export const Layers = createIcon('ri-stack-line', 'Layers');

// Ícones de Ações e Comunicação
export const Send = createIcon('ri-send-plane-fill', 'Send');
export const MessageCircle = createIcon('ri-whatsapp-line', 'MessageCircle');
export const WhatsApp = createIcon('fa-brands fa-whatsapp', 'WhatsApp');
export const FileText = createIcon('ri-file-text-line', 'FileText');
export const FileSpreadsheet = createIcon('ri-file-excel-2-line', 'FileSpreadsheet');
export const FileCheck = createIcon('ri-file-check-line', 'FileCheck');
export const ClipboardList = createIcon('ri-clipboard-line', 'ClipboardList');
export const Trash2 = createIcon('ri-delete-bin-line', 'Trash2');
export const Plus = createIcon('ri-add-line', 'Plus');
export const Minus = createIcon('ri-subtract-line', 'Minus');
export const RotateCcw = createIcon('ri-refresh-line', 'RotateCcw');
export const Download = createIcon('ri-download-2-line', 'Download');
export const ExternalLink = createIcon('ri-external-link-line', 'ExternalLink');
export const LogOut = createIcon('ri-logout-box-r-line', 'LogOut');

// Ícones Financeiros, Segurança e Entrega
export const CreditCard = createIcon('ri-bank-card-line', 'CreditCard');
export const ShieldCheck = createIcon('ri-shield-check-line', 'ShieldCheck');
export const QrCode = createIcon('ri-qr-code-line', 'QrCode');
export const Lock = createIcon('ri-lock-line', 'Lock');
export const Eye = createIcon('ri-eye-line', 'Eye');
export const EyeOff = createIcon('ri-eye-off-line', 'EyeOff');
export const Package = createIcon('ri-box-3-line', 'Package');
export const Boxes = createIcon('ri-archive-stack-line', 'Boxes');
export const PackageCheck = createIcon('ri-box-3-line', 'PackageCheck');
export const Store = createIcon('ri-store-2-line', 'Store');
export const Truck = createIcon('ri-truck-line', 'Truck');
export const LayoutDashboard = createIcon('ri-dashboard-line', 'LayoutDashboard');
export const Copy = createIcon('ri-file-copy-line', 'Copy');
export const Printer = createIcon('ri-printer-line', 'Printer');
export const Clock = createIcon('ri-time-line', 'Clock');
export const AlertCircle = createIcon('ri-error-warning-line', 'AlertCircle');
export const HelpCircle = createIcon('ri-question-line', 'HelpCircle');
export const BadgePercent = createIcon('ri-percent-line', 'BadgePercent');
export const Barcode = createIcon('ri-barcode-line', 'Barcode');
export const Wallet = createIcon('ri-wallet-3-line', 'Wallet');
export const Receipt = createIcon('ri-receipt-line', 'Receipt');

// Redes Sociais e Contato
export const Phone = createIcon('ri-phone-line', 'Phone');
export const Mail = createIcon('ri-mail-line', 'Mail');
export const Instagram = createIcon('ri-instagram-line', 'Instagram');
export const Linkedin = createIcon('ri-linkedin-fill', 'Linkedin');
export const Twitter = createIcon('ri-twitter-x-line', 'Twitter');
export const Youtube = createIcon('ri-youtube-fill', 'Youtube');
export const Facebook = createIcon('ri-facebook-fill', 'Facebook');
export const Github = createIcon('ri-github-fill', 'Github');
export const Dribbble = createIcon('ri-dribbble-line', 'Dribbble');

// Categorias e Layout
export const Utensils = createIcon('ri-restaurant-line', 'Utensils');
export const Briefcase = createIcon('ri-briefcase-line', 'Briefcase');
export const Wrench = createIcon('ri-tools-line', 'Wrench');
export const Palette = createIcon('ri-palette-line', 'Palette');
export const LayoutGrid = createIcon('ri-grid-fill', 'LayoutGrid');
export const List = createIcon('ri-list-check-2', 'List');
export const Filter = createIcon('ri-filter-3-line', 'Filter');

export default Icon;
