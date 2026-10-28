# 🏦 Banking DApp ด้วย Smart Contract

เว็บแอปพลิเคชันแบบ Decentralized (DApp) สำหรับระบบธนาคารบน Smart Contract
เชื่อมต่อผ่าน MetaMask รองรับการ **ฝาก (Deposit)**, **ถอน (Withdraw)** และ **ตรวจสอบยอดเงิน (CheckBalance)**

> โปรเจกต์นี้เป็นงานส่งในรายวิชา — พัฒนาด้วย React + Vite + Ethers.js และ Deploy ขึ้น GitHub Pages

## 🔗 ลิงก์เว็บไซต์

- **เว็บไซต์ (GitHub Pages):** https://aom5947.github.io/bank-dap/
- **Source Code:** https://github.com/aom5947/bank-dap
- **Smart Contract (Sepolia):** https://sepolia.etherscan.io/address/0x73A1cF776870D7624E94ED787F390d7251a04a53

## 👤 ข้อมูลนักศึกษา

| รายการ | ข้อมูล |
| --- | --- |
| รหัสนักศึกษา | `66055370` |
| ชื่อ-นามสกุล | จิรายุ ภิรมย์กิจ |
| Contract Address | [`0x73A1cF776870D7624E94ED787F390d7251a04a53`](https://sepolia.etherscan.io/address/0x73A1cF776870D7624E94ED787F390d7251a04a53) |
| Network | Sepolia Testnet |

## ✨ ฟีเจอร์

| # | รายการ | สถานะ |
| :-: | --- | :-: |
| 1 | เชื่อมต่อ Smart Contract `Bank` | ✅ |
| 2 | เชื่อมต่อ MetaMask (`eth_requestAccounts`) | ✅ |
| 3 | Deposit — ฝาก ETH เข้าระบบธนาคาร | ✅ |
| 4 | Withdraw — ถอน ETH จากยอดเงินฝาก | ✅ |
| 5 | CheckBalance (`checkBlance()`) | ✅ |
| 6 | แสดงรหัสนักศึกษาและชื่อ-นามสกุลบนหน้าเว็บ | ✅ |
| 7 | เผยแพร่เว็บไซต์บน GitHub Pages | ✅ |

## 🛠 เครื่องมือที่ใช้

- **Solidity ^0.8.0** — เขียน Smart Contract `Bank`
- **Remix IDE** — Compile & Deploy Contract
- **MetaMask** — กระเป๋าเงินและยืนยันธุรกรรม
- **React 19 + Vite** — พัฒนาหน้าเว็บ
- **Ethers.js v6** — เชื่อมต่อเว็บกับ Smart Contract
- **GitHub / GitHub Pages** — เก็บโค้ดและเผยแพร่เว็บ

## 📄 Smart Contract

ไฟล์อ้างอิงอยู่ใน [`contracts/Bank.sol`](contracts/Bank.sol)

```solidity
contract Bank {
    mapping(address => uint256) private _balances;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    function deposit() public payable;
    function withdraw(uint256 amount) public;
    function checkBlance() public view returns (uint256); // สะกดตามโจทย์
}
```

## 🚀 วิธีรันในเครื่อง

```bash
# 1. ติดตั้ง dependencies
npm install

# 2. แก้ค่า CONTRACT_ADDRESS / STUDENT_ID / STUDENT_NAME ที่ src/config.js

# 3. รันโหมด dev
npm run dev
```

เปิดเบราว์เซอร์ที่ `http://localhost:5173` แล้วกด **เชื่อมต่อ MetaMask**

> ต้องมี MetaMask และเลือก network เป็น **Sepolia** พร้อม ETH ทดสอบจาก faucet

## ⚙️ การตั้งค่า

แก้ไขได้ที่ไฟล์เดียว: [`src/config.js`](src/config.js)

```js
export const STUDENT_ID = 'รหัสนักศึกษา'
export const STUDENT_NAME = 'ชื่อ-นามสกุล'
export const CONTRACT_ADDRESS = '0x...' // address ที่ Deploy จาก Remix
```

## 🌐 การ Deploy ขึ้น GitHub Pages

โปรเจกต์ตั้งค่า `base: './'` ไว้แล้ว และมี workflow ที่ `.github/workflows/deploy.yml`

1. สร้าง repository บน GitHub แล้ว push โค้ดขึ้นไปที่ branch `main`
2. ไปที่ **Settings → Pages → Build and deployment → Source** เลือก **GitHub Actions**
3. รอ workflow *Deploy to GitHub Pages* ทำงานเสร็จ (แท็บ Actions)
4. เว็บไซต์จะออนไลน์ที่ https://aom5947.github.io/bank-dap/

```bash
git clone https://github.com/aom5947/bank-dap.git
cd bank-dap
npm install
npm run dev
```

## 📁 โครงสร้างโปรเจกต์

```
├── contracts/Bank.sol          # Smart Contract (อ้างอิงจากโจทย์)
├── src/
│   ├── App.jsx                 # หน้าหลักของ DApp (Deposit/Withdraw/CheckBalance)
│   ├── App.css                 # สไตล์ของหน้าเว็บ
│   ├── config.js               # ที่อยู่ Contract, ABI, ข้อมูลนักศึกษา, network
│   ├── index.css               # ธีมสีพื้นฐาน
│   └── main.jsx                # entry point
├── .github/workflows/deploy.yml # Auto deploy ขึ้น GitHub Pages
├── index.html
└── vite.config.js
```

## 🧪 การทดสอบที่ทำแล้ว

- [x] Compile Contract ด้วย Remix (Solidity ^0.8.0) สำเร็จ
- [x] Deploy Contract บน Sepolia สำเร็จ
- [x] เชื่อมต่อ MetaMask และอ่าน address ได้
- [x] ฝาก ETH แล้วยอดเงินในสัญญาเพิ่มขึ้น
- [x] ถอน ETH แล้วยอดเงินลดลง และได้รับ ETH คืน
- [x] กด CheckBalance แล้วยอดเงินตรงกับที่ฝากไว้
- [x] เปิดเว็บผ่าน GitHub Pages บนมือถือ/คอมพิวเตอร์ได้

## 📌 หมายเหตุ

- ฟังก์ชันอ่านยอดเงินชื่อ `checkBlance()` (สะกดตามโค้ดอาจารย์) ไม่ใช่ `checkBalance()`
- ใช้เพื่อการศึกษาเท่านั้น ห้ามใช้เก็บเงินจริง
