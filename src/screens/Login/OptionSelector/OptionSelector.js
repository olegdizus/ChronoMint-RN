/* @flow */
import * as React from 'react'
import { connect } from 'react-redux'
import mnemonicProvider from '@chronobank/login/network/mnemonicProvider'
import networkService from '@chronobank/login/network/NetworkService'
import { addError, clearErrors, loading, DUCK_NETWORK } from '@chronobank/login/redux/network/actions'
import { bccProvider, btcProvider, btgProvider, ltcProvider } from '@chronobank/login/network/BitcoinProvider'
import { ethereumProvider } from '@chronobank/login/network/EthereumProvider'
import { nemProvider } from '@chronobank/login/network/NemProvider'
import { login } from 'redux/session/actions'
import Web3 from 'web3'
import web3Utils from '@chronobank/login/network/Web3Utils'
import web3Provider from '@chronobank/login/network/Web3Provider'
import privateKeyProvider from '@chronobank/login/network/privateKeyProvider'
import walletProvider from '@chronobank/login/network/walletProvider'
import List from '../../../components/List/List'
import screenLayout from '../../../utils/screenLayout'
import LoginScreenLayout from '../LoginScreenLayout'
import screens from '../../'
import strings from './strings'

type Props = {
  navigator: {
    push: ({ screen: any }) => void
  },
  addError: (error: any) => void,
  loadAccounts: () => void,
  login: (account: any) => void,
  selectAccount: (value: any) => void,
  clearErrors: () => void,
  createNetworkSession: (account: any, provider: any, network: any) => void,
  selectProvider: (providerId: number) => void,
  checkNetwork: (account: any, provider: any, network: any) => void,
  selectNetwork: (network: number) => void,
  getProviderURL: () => void,
  getProviderSettings: () => void,
  loading: () => void,
  selectedNetworkId: number,
  accounts: any[],
  isLocal: boolean,
  isMetamask: boolean,
  errors: any,
  selectedAccount: any,
  selectedProviderId: any,
  networks: any[]
}

class OptionSelector extends React.Component<Props, {}> {
  static screenOptions = {
    title: strings.login,
    subtitle: strings.selectOptions,
    hasFetchingStatus: true,
    hasLogo: true,
  }

  componentDidMount () {
    this.props.selectProvider(2)
    this.props.selectNetwork(4)
    this.resolveNetwork()
  }

  async handleLogin () {
    this.props.clearErrors()

    const isPassed = await this.props.checkNetwork(
      this.props.selectedAccount,
      this.props.selectedProviderId,
      this.props.selectedNetworkId
    )

    if (isPassed) {
      this.props.createNetworkSession(
        this.props.selectedAccount,
        this.props.selectedProviderId,
        this.props.selectedNetworkId
      )

      await this.props.login(this.props.selectedAccount)

      this.handleWallet()
    }
  }

  handleWallet = () => {
    this.props.navigator.push({
      screen: screens.Wallet,
    })
  }

  handleMnemonicLogin = (mnemonicKey) => {
    this.props.loading()
    this.props.clearErrors()
    const providerSettings = this.props.getProviderSettings()
    const provider = mnemonicProvider.getMnemonicProvider(mnemonicKey, providerSettings)
    this.setupAndLogin(provider)
  }

  handlePrivateKeyLogin = (privateKey) => {
    this.props.loading()
    this.props.clearErrors()
    try {
      const provider = privateKeyProvider.getPrivateKeyProvider(privateKey, networkService.getProviderSettings())
      this.setupAndLogin(provider)
    } catch (e) {
      this.props.addError(e.message)
    }
  }

  handleMnemonicKey = () => this.props.navigator.push({
    screen: screens.Login.EnterMnemonic,
    backButtonTitle: 'Login',
    passProps: {
      onLogin: this.handleMnemonicLogin,
    },
  })

  handleWalletFile = () => this.props.navigator.push({
    screen: screens.Login.WalletFile,
    backButtonTitle: 'Login',
    passProps: {
      onLogin: this.handleWalletUpload,
    },
  })

  handlePrivateKey = () => this.props.navigator.push({
    screen: screens.Login.EnterPrivate,
    backButtonTitle: 'Login',
    passProps: {
      onLogin: this.handlePrivateKeyLogin,
    },
  })

  handleWalletUpload = (wallet, password) => {
    this.props.loading()
    this.props.clearErrors()
    try {
      const provider = walletProvider.getProvider(wallet, password, networkService.getProviderSettings())
      this.setupAndLogin(provider)
    } catch (e) {
      this.props.addError(e.message)
    }
  }

  handleUPort = () => {

  }

  async setupAndLogin ({ ethereum, btc, bcc, btg, ltc, nem }) {
    // setup
    const web3 = new Web3()
    web3Provider.setWeb3(web3)
    web3Provider.setProvider(ethereum.getProvider())

    // login
    try {
      await this.props.loadAccounts()
      await this.props.selectAccount(this.props.accounts[ 0 ])
      ethereumProvider.setEngine(ethereum)
      bccProvider.setEngine(bcc)
      btcProvider.setEngine(btc)
      btgProvider.setEngine(btg)
      ltcProvider.setEngine(ltc)
      nemProvider.setEngine(nem)
      await this.handleLogin()
    } catch (e) {
      // eslint-disable-next-line
      this.props.addError(e.message)
    }
  }

  resolveNetwork = () => {
    const web3 = new Web3()
    web3Provider.setWeb3(web3)
    const providerUrl = this.props.getProviderURL()
    const statusEngine = web3Utils.createStatusEngine(providerUrl)
    web3Provider.setProvider(statusEngine)
    web3Provider.resolve()
  }

  render () {
    return (
      <List
        isDark
        data={[
          {
            key: strings.mnemonicKey,
            icon: require('../../../assets/icons/mnemonic.png'),
            hasArrow: true,
            onPress: this.handleMnemonicKey,
          },
          {
            key: strings.walletFile,
            icon: require('../../../assets/icons/wallet.png'),
            hasArrow: true,
            onPress: this.handleWalletFile,
          },
          {
            key: strings.privateKey,
            icon: require('../../../assets/icons/key.png'),
            hasArrow: true,
            onPress: this.handlePrivateKey,
          },
          {
            key: strings.uPort,
            icon: require('../../../assets/icons/uport.png'),
            hasArrow: true,
            onPress: this.handleUPort,
          },
        ]}
      />
    )
  }
}

const mapStateToProps = (state) => {
  const network = state.get(DUCK_NETWORK)

  return {
    networks: network.networks,
    errors: network.errors,
    selectedAccount: network.selectedAccount,
    selectedProviderId: network.selectedProviderId,
    selectedNetworkId: network.selectedNetworkId,
    isLoading: network.isLoading,
    accounts: network.accounts,
    isLocal: network.isLocal,
    isMetamask: network.isMetamask,
  }
}

const mapDispatchToProps = (dispatch) => ({
  addError: (error) => dispatch(addError(error)),
  loadAccounts: () => networkService.loadAccounts(),
  login: (account) => dispatch(login(account)),
  selectAccount: (value) => networkService.selectAccount(value),
  selectNetwork: (network) => networkService.selectNetwork(network),
  selectProvider: (providerId) => networkService.selectProvider(providerId),
  clearErrors: () => dispatch(clearErrors()),
  createNetworkSession: (account, provider, network) => networkService.createNetworkSession(account, provider, network),
  checkNetwork: () => networkService.checkNetwork(),
  getProviderURL: () => networkService.getProviderURL(),
  getProviderSettings: () => networkService.getProviderSettings(),
  loading: () => dispatch(loading()),
})

export default screenLayout(LoginScreenLayout)(
  connect(mapStateToProps, mapDispatchToProps)(OptionSelector )
)
