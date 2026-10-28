// ============================================================
//  ตั้งค่าทั้งหมดของ DApp อยู่ที่ไฟล์นี้ที่เดียว
//  >>> แก้ 3 ค่านี้ให้ตรงกับของจริงก่อนส่งงาน <<<
// ============================================================

// 1) รหัสนักศึกษา
export const STUDENT_ID = '0000000000'

// 2) ชื่อ-นามสกุล
export const STUDENT_NAME = 'ชื่อ-นามสกุล'

// 3) Contract Address ที่ Deploy จาก Remix (ขึ้นต้นด้วย 0x ตามด้วย 40 ตัวอักษร)
export const CONTRACT_ADDRESS = '0x0000000000000000000000000000000000000000'

// ------------------------------------------------------------
//  Network ที่ใช้ (ค่าเริ่มต้น: Sepolia testnet)
// ------------------------------------------------------------
export const CHAIN = {
  id: 11155111,
  idHex: '0xaa36a7',
  name: 'Sepolia',
  rpcUrl: 'https://ethereum-sepolia-rpc.publicnode.com',
  explorer: 'https://sepolia.etherscan.io',
  currency: { name: 'Sepolia ETH', symbol: 'ETH', decimals: 18 },
}

// ------------------------------------------------------------
//  ABI ของ Smart Contract "Bank"
//  (ชื่อฟังก์ชัน checkBlance สะกดตามโค้ดอาจารย์)
// ------------------------------------------------------------
export const BANK_ABI = [
  'function deposit() payable',
  'function withdraw(uint256 amount)',
  'function checkBlance() view returns (uint256)',
]

// true เมื่อกรอก address จริงแล้ว (ไม่ใช่ 0x000...0)
export const isContractReady = /^0x[a-fA-F0-9]{40}$/.test(CONTRACT_ADDRESS)
  && CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000'
