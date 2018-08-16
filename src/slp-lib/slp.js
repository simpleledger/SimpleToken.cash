import network from './network'
import SlpTokenType1 from './slptokentype1'

let BITBOXCli = require('bitbox-cli/lib/bitbox-cli').default;
let BITBOX = new BITBOXCli();

class Slp {

    buildGenesisTx(tokenType, ticker, name, urlOrEmail, decimals, initialQuantity, addressQuantities) {
        this.genesisOpReturn = SlpTokenType1.buildGenesisOpReturn(
            tokenType,
            ticker,
            name,
            urlOrEmail,
            null,
            decimals,
            null,
            initialQuantity
        )

        this.sendGenesisTx(this.genesisOpReturn, addressQuantities)
    }

    async sendGenesisTx(initOpReturn, genesisTokenAddress) {
        // TODO: Check for fee too large or send leftover to target address

        let mnemonic = 'suggest cabin brand grief pulse phone vicious fluid wear mouse taxi random armor million dolphin clump width inherit tattoo ticket reward clean farm stamp'
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

        let byteCount = BITBOX.BitcoinCash.getByteCount({ P2PKH: 1 }, { P2PKH: 4 })

        let satoshisAfterFee = utxo.satoshis - 546- byteCount

        transactionBuilder.addOutput(initOpReturn, 0)

        // All tokens with dust BCH output
        transactionBuilder.addOutput(genesisTokenAddress, 546)

        // Change
        transactionBuilder.addOutput(targetAddress, satoshisAfterFee)

        let redeemScript
        transactionBuilder.sign(0, keyPair, redeemScript, transactionBuilder.hashTypes.SIGHASH_ALL, utxo.satoshis)

        let hex = transactionBuilder.build().toHex()

        network.sendTx(hex)

        return
    }
    
}

export default Slp