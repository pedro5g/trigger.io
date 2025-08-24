export const LORDICON_LIBRARY = {
  home: "https://cdn.lordicon.com/cnpvyndp.json",
  user: "/icons/user.json",
  settings: "/icons/settings.json",
  menu: "/icons/menu.json",
  search: "/icons/search.json",
  close: "https://cdn.lordicon.com/zxvuvcnc.json",
  arrow: "/icons/arrow.json",
  folder: "/icons/folder.json",

  download: "https://cdn.lordicon.com/nxaaasqd.json",
  upload: "https://cdn.lordicon.com/fpmskzsv.json",
  play: "https://cdn.lordicon.com/akqsdstj.json",
  pause: "https://cdn.lordicon.com/akqsdstj.json",
  refresh: "https://cdn.lordicon.com/wzwygmng.json",
  save: "https://cdn.lordicon.com/jgnvfzqg.json",
  delete: "/icons/delete.json",
  edit: "/icons/edit.json",

  mail: "https://cdn.lordicon.com/tkgyrmwc.json",
  phone: "https://cdn.lordicon.com/srsgifqc.json",
  message: "/icons/message.json",
  notification: "https://cdn.lordicon.com/vspbqszr.json",
  bell: "/icons/bell.json",

  success: "/icons/success.json",
  error: "https://cdn.lordicon.com/akqsdstj.json",
  warning: "/icons/warning.json",
  info: "https://cdn.lordicon.com/msoeawqm.json",
  loading: "https://cdn.lordicon.com/msoeawqm.json",

  heart: "/icons/heart.json",
  like: "https://cdn.lordicon.com/pnhskdrd.json",
  share: "https://cdn.lordicon.com/udwhdpkn.json",
  star: "https://cdn.lordicon.com/rjzlnunf.json",
  bookmark: "https://cdn.lordicon.com/gigfpovs.json",

  image: "https://cdn.lordicon.com/tdtlrbly.json",
  video: "https://cdn.lordicon.com/fgkmkuox.json",
  music: "https://cdn.lordicon.com/wxnxiano.json",

  cart: "/icons/cart.json",
  bag: "https://cdn.lordicon.com/slkvcfos.json",
  money: "https://cdn.lordicon.com/qhgmphtg.json",
  card: "https://cdn.lordicon.com/qhgmphtg.json",

  cloud: "https://cdn.lordicon.com/eszyyflr.json",
  rain: "https://cdn.lordicon.com/kddagzqs.json",
  clock: "/icons/clock.json",

  wifi: "https://cdn.lordicon.com/anqzffqz.json",
  bluetooth: "https://cdn.lordicon.com/akqsdstj.json",
  battery: "https://cdn.lordicon.com/wcjauznp.json",
  computer: "https://cdn.lordicon.com/cnpvyndp.json",
  mobile: "https://cdn.lordicon.com/tkgyrmwc.json",

  assignment: "/icons/assignment.json",

  globe: "/icons/globe.json",
  metrics: "/icons/metrics.json",
  folderPlus: "/icons/folder-plus.json",
  inbox: "/icons/inbox.json",
  lockClosed: "/icons/lock-closed.json",
  swap: "/icons/swap.json",
  link: "/icons/link.json",
  error55: "/icons/55-error.json",
  arrowRocket: "/icons/arrow-rocket.json",
  arrowDown: "/icons/arrow-down.json",
  exitRoom: "/icons/exit-room.json",
  code: "/icons/code.json",
  increase: "/icons/increase.json",
  thunderbolt: "/icons/thunderbolt.json",
  list: "/icons/check-list.json",
  document: "/icons/document.json",
} as const;

export type LordIconName = keyof typeof LORDICON_LIBRARY;

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
