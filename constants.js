export const NETWORKS = {
  AGUNG: {
    name: "agung",
    ws: "wss://wsspc1-qa.agung.peaq.network",
    chainId: "9999",
    chainName: "agung",
    currencyName: "agung",
    currencySymbol: "agng",
    currencyDecimals: 18,
    rpcUrls: ["https://erpc.agung.peaq.network/"],
    blockExplorerUrls: ["https://scout.agung.peaq.network/"],
  },
  KREST: {
    name: "krest",
    ws: "wss://wss-krest.peaq.network",
    chainId: "424242",
    chainName: "krest",
    currencyName: "krest",
    currencySymbol: "KREST",
    currencyDecimals: 18,
    rpcUrls: ["https://erpc-krest.peaq.network/"],
    blockExplorerUrls: ["https://krest.subscan.io/"],
  },
};

export const CREATE_STORAGE_KEYS_ENUM = {
  ADDRESS: 0,
  STANDARD: 1,
};
