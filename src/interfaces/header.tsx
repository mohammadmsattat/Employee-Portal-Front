import { ReactNode } from "react";

export interface HeaderAction {
  key: string;
  icon: ReactNode;
  onClick?: () => void;
  to?: string;
  badgeCount?: number;
  ariaLabel: string;
}

export interface MobileHeaderConfig {
  showBack?: boolean;
  showBrand?: boolean;
  showGreeting?: boolean;
  showSubtitle?: boolean;
  showNotifications?: boolean;
  showLanguage?: boolean;
  title?: string;
  subtitle?: string;
  onBack?: () => void;
  rightActions?: HeaderAction[];
}

export interface AppHeaderConfig {
  mobile?: MobileHeaderConfig;
}
