const mogodbUrl = "mongodb://127.0.0.1:27017";
const WS_ENDPOINT = "wss://rpc-shadow.crustnetwork.xyz";
const CHAIN = "shadow";

const MONGO_BLOCK_SCAN_URL = mogodbUrl,
  MONGO_BLOCK_SCAN_NAME = `statescan-${CHAIN}-block`;
const MONGO_ASSET_SCAN_URL = mogodbUrl,
  MONGO_ASSET_SCAN_NAME = `tatescan-${CHAIN}-asset`;
const MONGO_META_URL = mogodbUrl,
  MONGO_DB_META_NAME = `meta-${CHAIN}`;
const MONGO_RUNTIME_SCAN_URL = mogodbUrl,
  MONGO_RUNTIME_SCAN_NAME = `statescan-${CHAIN}-runtime`;
const MONGO_ACCOUNT_SCAN_URL = mogodbUrl,
  MONGO_ACCOUNT_SCAN_NAME = `statescan-${CHAIN}-account`;
const MONGO_IDENTITY_SCAN_URL = mogodbUrl,
  MONGO_IDENTITY_SCAN_NAME = `statescan-${CHAIN}-identity`;
const MONGO_MULTISIG_SCAN_URL = mogodbUrl,
  MONGO_MULTISIG_SCAN_NAME = `statescan-${CHAIN}-multisig`;
const MONGO_PALLET_ASSET_SCAN_URL = mogodbUrl,
  MONGO_PALLET_ASSET_SCAN_NAME = `statescan-${CHAIN}-asset-1`;
const MONGO_PROXY_SCAN_URL = mogodbUrl,
  MONGO_PROXY_SCAN_NAME = `statescan-${CHAIN}-proxy-1`;
const MONGO_PALLET_RECOVERY_SCAN_URL = mogodbUrl,
  MONGO_PALLET_RECOVERY_SCAN_NAME = `statescan-${CHAIN}-recovery-1`;
const MONGO_UNIQUES_SCAN_URL = mogodbUrl,
  MONGO_UNIQUES_SCAN_NAME = `statescan-${CHAIN}-uniques`;
const MONGO_VESTING_SCAN_URL = mogodbUrl,
  MONGO_VESTING_SCAN_NAME = `statescan-${CHAIN}-vesting`;
const MONGO_DB_KNOWN_HEIGHTS_URL = mogodbUrl;

const SCAN_STEP = "100";
const USE_META = "0";
const LOG_LEVEL = "info";
const NODE_ENV = "production";

const scanBaseEnv = {
  WS_ENDPOINT,
  CHAIN,
  SCAN_STEP,
  USE_META,
  MONGO_META_URL,
  MONGO_DB_META_NAME,
  USE_KNOWN_HEIGHTS: 1,
  MONGO_DB_KNOWN_HEIGHTS_URL,
  SIMPLE_MODE: "0",
  LOG_LEVEL,
  NODE_ENV,
};

const backendBase = (dir) => ({ name: `${CHAIN}-${dir}`, cwd: `./backend/packages/${dir}`, script: "src/index.js" });
module.exports = {
  apps: [
    {
      ...backendBase("block-scan"),
      env: { ...scanBaseEnv, MONGO_BLOCK_SCAN_URL, MONGO_BLOCK_SCAN_NAME },
    },
    {
      ...backendBase("runtime-scan"),
      env: { ...scanBaseEnv, MONGO_RUNTIME_SCAN_URL, MONGO_RUNTIME_SCAN_NAME },
    },
    {
      ...backendBase("account-scan"),
      env: { ...scanBaseEnv, MONGO_ACCOUNT_SCAN_URL, MONGO_ACCOUNT_SCAN_NAME },
    },
    {
      ...backendBase("asset-scan"),
      env: {
        ...scanBaseEnv,
        MONGO_ASSET_SCAN_URL,
        MONGO_ASSET_SCAN_NAME,
        MONGO_BLOCK_SCAN_URL,
        MONGO_BLOCK_SCAN_NAME,
        MONGO_DB_KNOWN_HEIGHTS_NAME: `known-heights-statescan-${CHAIN}-asset`,
        FOLLOW_BLOCK_SCAN: true,
      },
    },
    {
      ...backendBase("graphql-server"),
      env: {
        PORT: 7002,
        MONGO_VESTING_SCAN_URL,
        MONGO_VESTING_SCAN_NAME,
        MONGO_PALLET_ASSET_SCAN_URL,
        MONGO_PALLET_ASSET_SCAN_NAME,
        MONGO_MULTISIG_SCAN_URL,
        MONGO_MULTISIG_SCAN_NAME,
        MONGO_IDENTITY_SCAN_URL,
        MONGO_IDENTITY_SCAN_NAME,
        MONGO_PALLET_RECOVERY_SCAN_URL,
        MONGO_PALLET_RECOVERY_SCAN_NAME,
        MONGO_PROXY_SCAN_URL,
        MONGO_PROXY_SCAN_NAME,
      },
    },
    {
      ...backendBase("server"),
      env: {
        PORT: 7001,
        MONGO_BLOCK_SCAN_URL,
        MONGO_BLOCK_SCAN_NAME,
        MONGO_ACCOUNT_SCAN_URL,
        MONGO_ACCOUNT_SCAN_NAME,
        // # config only for chains with assets pallet
        MONGO_ASSET_SCAN_URL,
        MONGO_ASSET_SCAN_NAME,
        // # config only for chains with uniques pallet
        MONGO_UNIQUES_SCAN_URL,
        MONGO_UNIQUES_SCAN_NAME,
        MONGO_RUNTIME_SCAN_URL,
        MONGO_RUNTIME_SCAN_NAME,
        CHAIN,
        SIMPLE_MODE: 0,
      },
    },
    {
      name: `${CHAIN}-site`,
      script: "serve",
      env: {
        PM2_SERVE_PATH: "site/build", // 静态文件所在路径，'.' 表示当前目录
        PM2_SERVE_PORT: 7000, // 网站访问端口
        PM2_SERVE_SPA: "true", // 如果是单页应用 (Vue/React)，设为 true 以处理路由跳转
        PM2_SERVE_HOMEPAGE: "/index.html", // 指定首页文件
      },
    },
  ],
};
