class SlpTokenTransactionFactory {
    constructor(tokenVersion, tokenIdHex = null) {
        this.tokenVersion = tokenVersion
        this.tokenIdHex = tokenIdHex
        this.lokadId = "00534c50"
    }

    getPushDataOpcode(data) {
        let length = data.length

        if (length == 0)
            return [0x4c, 0x00]
        else if (length < 76)
            return length
        else if (length < 256)
            return [0x4c, length]
        else
            throw "Pushdata too large"
    }

    buildInitOpReturn(ticker, name, documentUrl, documentHash, decimals, batonVout, initialQuantity) {
        // Array to store final script
        let script = []

        // OP Return Prefix
        script.push(0x6a)

        // Lokad Id
        let lokadId = Buffer.from(this.lokadId, 'hex')
        script.push(this.getPushDataOpcode(lokadId))
        lokadId.forEach((item) => script.push(item))

        // Token Type
        //let tokenVersion = Buffer.from(this.tokenVersion)
        script.push(0x01)
        script.push(0x01)

        // Transaction Type
        let transactionType = Buffer.from('INIT')
        script.push(this.getPushDataOpcode(transactionType))
        transactionType.forEach((item) => script.push(item))

        // Ticker
        if (ticker == null || ticker.length == 0) {
            ticker = 0x00
        } else {
            ticker = Buffer.from(ticker)
        }
        script.push(this.getPushDataOpcode(ticker))
        ticker.forEach((item) => script.push(item))

        // Name
        if (name == null || name.length == 0) {
            name = 0x00
        } else {
            name = Buffer.from(name)
        }
        script.push(this.getPushDataOpcode(name))
        name.forEach((item) => script.push(item))

        // Document URL
        if (documentUrl == null || documentUrl.length == 0) {
            documentUrl = 0x00
        } else {
            documentUrl = Buffer.from(documentUrl)
        }
        script.push([0x4c, 0x00])

        // Document Hash
        if (documentHash == null || documentHash.length == 0) {
            documentHash = 0x00
        } else {
            documentHash = Buffer.from(documentHash)
        }
        script.push([0x4c, 0x00])

        // Decimals
        if (decimals < 0 || decimals > 9) {
            throw "Decimals property must be in range 0 to 9"
        }
        script.push(0x01)
        script.push(0x01)

        // Baton Vout
        if (batonVout == null) {
            batonVout = 0x00
        } else {
            if (batonVout <= 1) {
                throw "Baton vout must be 2 or greater"
            }
        }
        script.push([0x4c, 0x00])

        // Initial Quantity
        initialQuantity = [0, 0, 0, 1, 0, 0, 0, 0]
        script.push(this.getPushDataOpcode(initialQuantity))
        initialQuantity.forEach((item) => script.push(item))

        return script
    }
}

module.exports = SlpTokenTransactionFactory