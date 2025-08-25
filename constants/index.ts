export const LORDICON_THEMES = {
  default: {
    primary: "#121331",
    secondary: "#646681",
  },
  primary: {
    primary: "#3b82f6",
    secondary: "#60a5fa",
  },
  success: {
    primary: "#10b981",
    secondary: "#34d399",
  },
  warning: {
    primary: "#f59e0b",
    secondary: "#fbbf24",
  },
  error: {
    primary: "#ef4444",
    secondary: "#f87171",
  },
  dark: {
    primary: "#f8fafc",
    secondary: "#cbd5e1",
  },
} as const;

export type LordIconTheme = keyof typeof LORDICON_THEMES;

export const MODAL_NAMES = {
  CREATE_PROJECT: "create-project",
  UPDATE_PROJECT: "update-project",
  DISABLE_PROJECT: "disable-project",
} as const;

export type ModalNames = (typeof MODAL_NAMES)[keyof typeof MODAL_NAMES];

export const ANIMATE_ICON_VARIANTS = {
  error: "/icons/error.li",
  success: "/icons/success.li",
  assignment: "/icons/assignment.li",
  globe: "/icons/globe.li",
  menu: "/icons/menu.li",
  threeDots: "/icons/three-dots.li",
  user: "/icons/user.li",
  metrics: "/icons/metrics.li",
  settings: "/icons/settings.li",
  folder: "/icons/folder.li",
  folderPlus: "/icons/folder-plus.li",
  inbox: "/icons/inbox.li",
  lockClosed: "/icons/lock-closed.li",
  swap: "/icons/swap.li",
  link: "/icons/link.li",
  arrowRocket: "/icons/arrow-rocket.li",
  arrow: "/icons/arrow.li",
  arrowDown: "/icons/arrow-down.li",
  exitRoom: "/icons/exit-room.li",
  code: "/icons/code.li",
  increase: "/icons/increase.li",
  decrease: "/icons/decrease.li",
  thunderbolt: "/icons/thunderbolt.li",
  list: "/icons/check-list.li",
  document: "/icons/document.li",
  clock: "/icons/clock.li",
  delete: "/icons/delete.li",
  edit: "/icons/edit.li",
  heart: "/icons/heart.li",
  warning: "/icons/warning.li",
  message: "/icons/message.li",
  bell: "/icons/bell.li",
  cart: "/icons/cart.li",
  close: "/icons/close.li",
  eye: "/icons/eye.li",
} as const;

export type AnimateIconVariants = keyof typeof ANIMATE_ICON_VARIANTS;
