/**
 * Copyright 2017–2018, LaborX PTY
 * Licensed under the AGPL Version 3 license.
 *
 * @flow
 */

//#region common imports
import { createDrawerNavigator, createStackNavigator } from 'react-navigation'
import { Dimensions } from 'react-native'
import React from 'react'
//#endregion

// //#region Login imports
// import AccountImportMethod from './containers/AccountImportMethodContainer'
// // import AccountPassword from './containers/AccountPasswordContainer'
// import Add2FAWallet from './containers/Add2FAWalletContainer'
// import AddAdvancedWallet from './containers/AddAdvancedWalletContainer'
// import AddEthereumWallet from './containers/AddEthereumWalletContainer'
// import AddMultiSigWallet from './containers/AddMultiSigWalletContainer'
// import AddStandardWallet from './containers/AddStandardWalletContainer'
// import AddTimeLockedWallet from './containers/AddTimeLockedWalletContainer'
// import AddTokenToAdvancedWallet from './containers/AddTokenToAdvancedWalletContainer'
// import AddWallet from './containers/AddWalletContainer'
// import ConfirmMnemonic from './containers/ConfirmMnemonicContainer'
// import Download2FAApp from './containers/Download2FAAppContainer'
// import Drawer from './containers/DrawerContainer'
// import EnterMnemonic from './containers/EnterMnemonicContainer'
// import EnterPin from './containers/EnterPinContainer'
// import EnterPrivateKey from './containers/EnterPrivateKeyContainer'
// import GenerateMnemonic from './containers/GenerateMnemonicContainer'
// import SelectAccount from './containers/SelectAccountContainer'
// import SelectLanguage from './containers/SelectLanguageContainer'
// import SelectNetwork from './containers/SelectNetworkContainer'
import SetAccountPasswordContainer from './containers/SetAccountPasswordContainer'
// import WalletBackup from './containers/WalletBackupContainer'

import screenLayout from './utils/screenLayout'
import LoginScreenLayout from './components/LoginScreenLayout'
// //#endregion

// //#region Wallet imports
// import ConfirmSend from './containers/ConfirmSendContainer'
// import SelectToken from './screens/SelectToken'
// import Send from './containers/SendContainer'
// import TransactionDetails from './screens/TransactionDetails'
// import Wallet from './containers/WalletContainer'
// import WalletOwnersTab from './containers/WalletOwnersTabContainer'
// import WalletsList from './containers/WalletsListContainer'
// import WalletTemplatesTab from './containers/WalletTemplatesTabContainer'
// import WalletTokensTab from './containers/WalletTokensTabContainer'
//#endregion

// const MainMenuLeftDrawer = createDrawerNavigator(
//   {
//     Inbox: {
//       screen: WalletTokensTab,
//     },
//     Drafts: {
//       screen: WalletTemplatesTab,
//     },
//   },
//   {
//     initialRouteName: 'Drafts',
//     contentOptions: {
//       activeTintColor: '#e91e63',
//     },
//   }
// )
// const SelectLanguageRightDrawer = createDrawerNavigator(
//   {
//     MainMenuLeftDrawer: {
//       screen: MainMenuLeftDrawer,
//     },
//   },
//   {
//     initialRouteName: 'MainMenuLeftDrawer',
//     navigationOptions: {},
//     drawerPosition: 'right',
//     drawerWidth: Dimensions.get('window').width,
//     contentComponent: SelectLanguage,
//     drawerOpenRoute: 'RightSideMenu',
//     drawerCloseRoute: 'RightSideMenuClose',
//     drawerToggleRoute: 'RightSideMenuToggle',
//   }
// )

const AuthStack = createStackNavigator(
  {
    SetAccountPassword: {
      screen: (props) => {
        const LayoutedScreen = screenLayout(LoginScreenLayout)(SetAccountPasswordContainer)
        return (<LayoutedScreen {...props} isCreatingNewWallet={true} />)
      }
    }
  },
  {
    initialRouteName: 'SetAccountPassword',
    headerMode: 'none'
  }
)

// const WalletStack = () => createDrawerNavigator(
//   {
//     WalletsList: WalletsList
//   },
//   {
//     initialRouteName: 'WalletsList',
//   })

export {
  AuthStack,
  // WalletStack
}
