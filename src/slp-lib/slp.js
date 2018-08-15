import TokenTransactionFactory from './token-transaction-factory'
import network from './network'

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default;
let BITBOX = new BITBOXCli();

class Slp {
    constructor() {
        // Create new token transaction factory for v1 tokens
        this.tokenTransactionFactory = new TokenTransactionFactory(1)
    }

    buildInitTx(ticker, name, urlOrEmail, decimals, initialQuantity) {
        this.initOpReturn = this.tokenTransactionFactory.buildInitOpReturn(
            ticker,
            name,
            urlOrEmail,
            null,
            decimals,
            null,
            initialQuantity
        )

        this.sendInitTx(this.initOpReturn)
    }

    async sendInitTx(initOpReturn) {
        // TODO: Check for fee too large or send leftover to target address

        let mnemonic = ''
        let rootSeed = BITBOX.Mnemonic.toSeed(mnemonic)
        let masterHDNode = BITBOX.HDNode.fromSeed(rootSeed, 'bitcoincash')
        let hdNode = BITBOX.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")
        let node0 = BITBOX.HDNode.derivePath(hdNode, "0/0")
        let keyPair = BITBOX.HDNode.toKeyPair(node0)
        let wif = BITBOX.ECPair.toWIF(keyPair)
        let ecPair = BITBOX.ECPair.fromWIF(wif)
        let address = BITBOX.ECPair.toLegacyAddress(ecPair)

        let utxo = await network.getUtxo(address)
        console.log('utxo: ', utxo)

        let targetAddress = address

        let transactionBuilder = new BITBOX.TransactionBuilder('bitcoincash')
        transactionBuilder.addInput(utxo.txid, utxo.vout)

        let byteCount = BITBOX.BitcoinCash.getByteCount({ P2PKH: 1 }, { P2PKH: 3 })

        let satoshisAfterFee = utxo.satoshis - byteCount

        transactionBuilder.addOutput(initOpReturn, 0)
        transactionBuilder.addOutput(targetAddress, satoshisAfterFee)

        let redeemScript
        transactionBuilder.sign(0, keyPair, redeemScript, transactionBuilder.hashTypes.SIGHASH_ALL, utxo.satoshis)

        let hex = transactionBuilder.build().toHex()

        network.sendTx(hex)

        return
    }
    
}

export default Slp