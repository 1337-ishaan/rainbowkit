import React from 'react'
import { isAddress, shortenAddress, chainIDToToken } from '@rainbowkit/utils'
import styles from '../../styles/EthAddress.module.css'
import { BaseProvider } from '@ethersproject/providers'
import { useState, useEffect } from 'react'
import { BigNumber } from '@ethersproject/bignumber'
import { formatEther } from '@ethersproject/units'

export interface EthAddressProps {
  addr: string
  shorten?: boolean
  showBalance?: boolean
  provider?: BaseProvider
  profileIcon?: string
  networkToken?: string
  classNames?: Partial<{
    profileIcon: string
    container: string
    address: string
    balance: string
  }>
}

export const EthAddress = ({
  addr,
  shorten,
  profileIcon,
  showBalance,
  provider,
  networkToken,
  ...props
}: EthAddressProps) => {
  shorten = shorten === undefined ? true : shorten

  const [bal, setBal] = useState('0')

  const [symbol, setSymbol] = useState(networkToken || 'eth')

  useEffect(() => {
    if (showBalance && provider && addr) {
      provider.getBalance(addr).then((b: BigNumber) => {
        const floatBal = parseFloat(formatEther(b))

        if (floatBal > 9999) {
          setBal(floatBal.toFixed(0))
        } else setBal(floatBal.toPrecision(4))

        if (!networkToken) {
          provider.getNetwork().then(({ name, chainId }) => {
            setSymbol(chainIDToToken(chainId))
          })
        }
      })
    }
  }, [provider, showBalance, addr])

  return (
    <div className={`${styles.container} ${props.classNames?.container}`}>
      {showBalance && (
        <span className={`${styles.balance} ${props.classNames?.balance}`}>
          {bal} {symbol.toUpperCase()}
        </span>
      )}
      <span className={`${styles.address} ${props.classNames?.address}`}>
        {(shorten && isAddress(addr) && shortenAddress(addr)) || addr}
      </span>
      {profileIcon && <img src={profileIcon} className={`${styles.profileIcon} ${props.classNames?.profileIcon}`} />}
    </div>
  )
}