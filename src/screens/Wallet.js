/* @flow */
import * as React from 'react'
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from 'react-native'
import I18n from 'react-native-i18n'
import colors from 'utils/colors'
import Separator from 'components/Separator'

import WalletTransactions from './WalletTransactions'
import WalletOwners from './WalletOwners'
import WalletTokens from './WalletTokens'
import WalletTemplates from './WalletTemplates'

import {
  type TWallet,
} from '../types'

type ActionButtonProps = {
  title: string,
  image: number,
  onPress: () => void,
}
/**
 * Tabs IDs for Wallet screen. Used to switch between tabs.
 */
type TTabs = 'transactions' | 'tokens' | 'owners' | 'templates'

const ActionButton = ({ title, image, onPress }: ActionButtonProps) => (
  <TouchableOpacity
    style={styles.actionButton}
    onPress={onPress}
  >
    <Image source={image} style={styles.actionIcon} />
    <Text style={styles.actionTitle}>
      {title}
    </Text>
  </TouchableOpacity>
)

export default class Wallet extends React.Component<{ wallet: TWallet, address: string, navigator: any }, { tab: TTabs }> {
  state = {
    tab: 'transactions',
  }

  handleTransactions = () => {
    this.setState({ tab: 'transactions' })
  }

  handleTokens = () => {
    this.setState({ tab: 'tokens' })
  }

  handleOwners = () => {
    this.setState({ tab: 'owners' })
  }

  handleTemplates = () => {
    this.setState({ tab: 'templates' })
  }

  handleSend = (): void => {
    const {
      // navigator,
      wallet,
    } = this.props
    this.props.navigator.push({
      screen: 'Send',
      title: 'Send Funds',
      passProps: {
        selcetedBlockchainName: wallet.title,
      },
    })
  }

  handleNothing = () => {}

  render () {
    const { tab } = this.state
    const { mode } = this.props.wallet
    
    return (
      <View style={styles.screenView}>
        <View style={styles.tabsContainer}>  
          <Text style={styles.tabItem} onPress={this.handleTransactions}>
            Transactions
          </Text>
          <Separator style={styles.separator} />
          {/* Alexey Ozerov: Do not understand a logic here. We have tokens - array, which one should be compared with btc?
            this.props.wallet.token !== 'btc' && ([
              <Text
                style={styles.tabItem}
                onPress={this.handleTokens}
                key='0'
              >
                Tokens
              </Text>,
              <Separator style={styles.separator} key='1' />,
            ])
          */}
          { mode === 'shared' && ([
            <Text style={styles.tabItem} onPress={this.handleOwners} key='0'>
              Owners
            </Text>,
            <Separator style={styles.separator} key='1' />,
          ])}
          <Text style={styles.tabItem} onPress={this.handleTemplates}>
            Templates
          </Text>
        </View>
        { tab === 'transactions' && <WalletTransactions wallet={this.props.wallet} />}
        { tab === 'tokens' && <WalletTokens {...this.props} />}
        { tab === 'owners' && <WalletOwners {...this.props} />}
        { tab === 'templates' && <WalletTemplates {...this.props} />}
        <View style={styles.actions}>
          <ActionButton
            title={I18n.t('Wallet.send')}
            image={require('../images/send-ios.png')}
            onPress={this.handleSend}
          />
          <ActionButton
            title={I18n.t('Wallet.receive')}
            image={require('../images/receive-ios.png')}
            onPress={this.handleNothing}
          />
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  screenView: { flex: 1 },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
  },
  separator: {
    backgroundColor: colors.primary,
  },
  tabItem: {
    backgroundColor: '#4e3d99',
    paddingVertical: 8,
    paddingHorizontal: 14,
    color: colors.background,
    fontSize: 12,
  },
  actions: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  actionIcon: {
    tintColor: colors.background,
  },
  actionTitle: {
    color: colors.background,
    fontSize: 10,
    fontWeight: '500',
    marginTop: 4,
  },
})
