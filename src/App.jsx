import { useCallback, useEffect, useState } from 'react'
import { BrowserProvider, Contract, formatEther, parseEther } from 'ethers'
import {
  BANK_ABI,
  CHAIN,
  CONTRACT_ADDRESS,
  STUDENT_ID,
  STUDENT_NAME,
  isContractReady,
} from './config'
import './App.css'

const shortAddress = (addr) => `${addr.slice(0, 6)}...${addr.slice(-4)}`

function friendlyError(err) {
  if (err?.code === 'ACTION_REJECTED' || err?.info?.error?.code === 4001) {
    return 'ยกเลิกธุรกรรมใน MetaMask'
  }
  return err?.shortMessage || err?.reason || err?.message || 'เกิดข้อผิดพลาด'
}

function App() {
  const [account, setAccount] = useState('')
  const [chainId, setChainId] = useState(null)
  const [walletBalance, setWalletBalance] = useState('')
  const [bankBalance, setBankBalance] = useState('')
  const [depositAmount, setDepositAmount] = useState('')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [busy, setBusy] = useState('') // '' | 'connect' | 'deposit' | 'withdraw' | 'read'
  const [message, setMessage] = useState(null) // { type, text }

  const wrongNetwork = chainId !== null && chainId !== CHAIN.id
  const canUseContract = Boolean(account) && isContractReady && !wrongNetwork

  const readContract = useCallback(async (address) => {
    if (!window.ethereum || !address) return
    const provider = new BrowserProvider(window.ethereum)

    setWalletBalance(formatEther(await provider.getBalance(address)))

    if (!isContractReady) {
      setBankBalance('')
      return
    }
    const bank = new Contract(CONTRACT_ADDRESS, BANK_ABI, provider)
    const raw = await bank.checkBlance({ from: address })
    setBankBalance(formatEther(raw))
  }, [])

  const syncWallet = useCallback(
    async (address) => {
      if (!window.ethereum) return
      const provider = new BrowserProvider(window.ethereum)
      const network = await provider.getNetwork()
      setChainId(Number(network.chainId))
      if (address) {
        setAccount(address)
        await readContract(address)
      }
    },
    [readContract],
  )

  const connect = async () => {
    if (!window.ethereum) {
      setMessage({
        type: 'error',
        text: 'ไม่พบ MetaMask — กรุณาติดตั้ง extension MetaMask ก่อนใช้งาน',
      })
      return
    }
    setBusy('connect')
    setMessage(null)
    try {
      const provider = new BrowserProvider(window.ethereum)
      const accounts = await provider.send('eth_requestAccounts', [])
      await syncWallet(accounts[0])
      setMessage({ type: 'success', text: 'เชื่อมต่อ MetaMask สำเร็จ' })
    } catch (err) {
      setMessage({ type: 'error', text: friendlyError(err) })
    } finally {
      setBusy('')
    }
  }

  const refresh = async () => {
    if (!account) return
    setBusy('read')
    setMessage(null)
    try {
      await readContract(account)
      setMessage({ type: 'success', text: 'อัปเดตยอดเงินล่าสุดแล้ว' })
    } catch (err) {
      setMessage({ type: 'error', text: friendlyError(err) })
    } finally {
      setBusy('')
    }
  }

  const switchNetwork = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: CHAIN.idHex }],
      })
    } catch (err) {
      if (err?.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: CHAIN.idHex,
              chainName: CHAIN.name,
              nativeCurrency: CHAIN.currency,
              rpcUrls: [CHAIN.rpcUrl],
              blockExplorerUrls: [CHAIN.explorer],
            },
          ],
        })
      } else {
        setMessage({ type: 'error', text: friendlyError(err) })
      }
    }
  }

  const runTx = async (label, action) => {
    setBusy(label)
    setMessage(null)
    try {
      const provider = new BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const bank = new Contract(CONTRACT_ADDRESS, BANK_ABI, signer)
      const tx = await action(bank)
      setMessage({ type: 'info', text: `ส่งธุรกรรมแล้ว รอการยืนยัน... (${shortAddress(tx.hash)})` })
      await tx.wait()
      await readContract(account)
      return tx
    } catch (err) {
      setMessage({ type: 'error', text: friendlyError(err) })
      return null
    } finally {
      setBusy('')
    }
  }

  const handleDeposit = async (event) => {
    event.preventDefault()
    if (!canUseContract) return
    let value
    try {
      value = parseEther(depositAmount.trim() || '0')
    } catch {
      setMessage({ type: 'error', text: 'จำนวน ETH ไม่ถูกต้อง' })
      return
    }
    if (value <= 0n) {
      setMessage({ type: 'error', text: 'กรุณากรอกจำนวน ETH ที่มากกว่า 0' })
      return
    }
    const tx = await runTx('deposit', (bank) => bank.deposit({ value }))
    if (tx) {
      setDepositAmount('')
      setMessage({ type: 'success', text: `ฝากเงิน ${depositAmount} ETH เข้าระบบธนาคารสำเร็จ` })
    }
  }

  const handleWithdraw = async (event) => {
    event.preventDefault()
    if (!canUseContract) return
    let amount
    try {
      amount = parseEther(withdrawAmount.trim() || '0')
    } catch {
      setMessage({ type: 'error', text: 'จำนวน ETH ไม่ถูกต้อง' })
      return
    }
    if (amount <= 0n) {
      setMessage({ type: 'error', text: 'กรุณากรอกจำนวน ETH ที่มากกว่า 0' })
      return
    }
    const tx = await runTx('withdraw', (bank) => bank.withdraw(amount))
    if (tx) {
      setWithdrawAmount('')
      setMessage({ type: 'success', text: `ถอนเงิน ${withdrawAmount} ETH สำเร็จ` })
    }
  }

  // เชื่อมต่ออัตโนมัติถ้าเคยอนุญาตไว้แล้ว
  useEffect(() => {
    if (!window.ethereum) return
    window.ethereum
      .request({ method: 'eth_accounts' })
      .then((accounts) => syncWallet(accounts[0]))
      .catch(() => {})
  }, [syncWallet])

  // ฟังเหตุการณ์จาก MetaMask (เปลี่ยนบัญชี / เปลี่ยน network)
  useEffect(() => {
    if (!window.ethereum) return
    const onAccounts = (accounts) => {
      if (accounts.length === 0) {
        setAccount('')
        setBankBalance('')
        setWalletBalance('')
        setMessage({ type: 'info', text: 'ยกเลิกการเชื่อมต่อกระเป๋าแล้ว' })
      } else {
        syncWallet(accounts[0])
      }
    }
    const onChain = () => syncWallet(account)
    window.ethereum.on('accountsChanged', onAccounts)
    window.ethereum.on('chainChanged', onChain)
    return () => {
      window.ethereum.removeListener('accountsChanged', onAccounts)
      window.ethereum.removeListener('chainChanged', onChain)
    }
  }, [syncWallet, account])

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">B</span>
          <div>
            <h1>Bank DApp</h1>
            <p className="brand-sub">ธนาคารบน Smart Contract</p>
          </div>
        </div>

        <div className="wallet">
          {account ? (
            <>
              <span className={`net-badge ${wrongNetwork ? 'net-badge--bad' : ''}`}>
                {wrongNetwork ? `ผิด network` : CHAIN.name}
              </span>
              <span className="wallet-addr" title={account}>
                {shortAddress(account)}
              </span>
            </>
          ) : (
            <button className="btn btn--primary" onClick={connect} disabled={busy === 'connect'}>
              {busy === 'connect' ? 'กำลังเชื่อมต่อ...' : 'เชื่อมต่อ MetaMask'}
            </button>
          )}
        </div>
      </header>

      <section className="student-card">
        <div>
          <span className="label">รหัสนักศึกษา</span>
          <strong>{STUDENT_ID}</strong>
        </div>
        <div>
          <span className="label">ชื่อ-นามสกุล</span>
          <strong>{STUDENT_NAME}</strong>
        </div>
        <div className="student-card__contract">
          <span className="label">Contract</span>
          {isContractReady ? (
            <a href={`${CHAIN.explorer}/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer">
              {shortAddress(CONTRACT_ADDRESS)}
            </a>
          ) : (
            <strong className="warn">ยังไม่ได้ตั้งค่า address</strong>
          )}
        </div>
      </section>

      {wrongNetwork && (
        <div className="alert alert--warn">
          MetaMask อยู่ผิด network — กรุณาสลับไปที่ {CHAIN.name}
          <button className="btn btn--small" onClick={switchNetwork}>
            สลับ network
          </button>
        </div>
      )}

      {!isContractReady && (
        <div className="alert alert--warn">
          ยังไม่ได้ใส่ Contract Address — แก้ที่ <code>src/config.js</code>
        </div>
      )}

      <main className="grid">
        <section className="card balance-card">
          <span className="label">ยอดเงินฝากของฉัน</span>
          <p className="balance-amount">
            {account ? (bankBalance === '' ? '—' : bankBalance) : '0.0'}
            <span className="unit">ETH</span>
          </p>
          <p className="muted">
            กระเป๋า: {account ? `${walletBalance || '—'} ETH` : 'ยังไม่เชื่อมต่อ'}
          </p>
          <button className="btn btn--ghost" onClick={refresh} disabled={!account || busy === 'read'}>
            {busy === 'read' ? 'กำลังอ่าน...' : 'CheckBalance / รีเฟรช'}
          </button>
        </section>

        <section className="card">
          <h2>ฝากเงิน (Deposit)</h2>
          <form onSubmit={handleDeposit}>
            <div className="field">
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.0"
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                disabled={!canUseContract || busy === 'deposit'}
              />
              <span className="field-unit">ETH</span>
            </div>
            <button className="btn btn--primary btn--block" type="submit" disabled={!canUseContract || busy === 'deposit'}>
              {busy === 'deposit' ? 'กำลังดำเนินการ...' : 'ฝาก ETH'}
            </button>
          </form>
        </section>

        <section className="card">
          <h2>ถอนเงิน (Withdraw)</h2>
          <form onSubmit={handleWithdraw}>
            <div className="field">
              <input
                type="text"
                inputMode="decimal"
                placeholder="0.0"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
                disabled={!canUseContract || busy === 'withdraw'}
              />
              <span className="field-unit">ETH</span>
            </div>
            <button className="btn btn--outline btn--block" type="submit" disabled={!canUseContract || busy === 'withdraw'}>
              {busy === 'withdraw' ? 'กำลังดำเนินการ...' : 'ถอน ETH'}
            </button>
          </form>
        </section>
      </main>

      {message && <div className={`alert alert--${message.type}`}>{message.text}</div>}

      {!account && (
        <p className="hint">กด “เชื่อมต่อ MetaMask” เพื่อเริ่มใช้งาน (ต้องมี Sepolia ETH สำหรับทดสอบ)</p>
      )}

      <footer className="footer">
        Assignment: Banking DApp ด้วย Smart Contract · Solidity ^0.8.0 · React + Vite + Ethers.js
      </footer>
    </div>
  )
}

export default App
