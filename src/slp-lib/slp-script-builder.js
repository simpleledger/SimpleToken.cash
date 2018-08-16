class SlpScriptBuilder {
    constructor(tokenType, tokenIdHex = null) {
        this.tokenType = tokenType
        this.tokenIdHex = tokenIdHex
        this.lokadId = "534c5000"
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

    int2FixedBuffer(amount, byteLength) {
        let hex = amount.toString(16)
        const len = hex.length
        for (let i = 0; i < byteLength*2 - len; i++) {
            hex = '0' + hex;
        }
        
        let buffer = Buffer.from(hex, 'hex')
        return buffer
    }

    encodeScript(script) {
        const bufferSize = script.reduce((acc, cur) => {
            if (Array.isArray(cur)) return acc + cur.length
            else return acc + 1
        }, 0)

        const buffer = Buffer.allocUnsafe(bufferSize)
        let offset = 0
        script.forEach((scriptItem) => {
            if (Array.isArray(scriptItem)) {
                scriptItem.forEach((item) => {
                    buffer.writeUInt8(item, offset)
                    offset += 1
                })
            } else {
                buffer.writeUInt8(scriptItem, offset)
                offset += 1
            }
        })

        return buffer
    }

    buildGenesisOpReturn(ticker, name, documentUrl, documentHash, decimals, batonVout, initialQuantity) {
        let script = []

        // OP Return Prefix
        script.push(0x6a)

        // Lokad Id
        let lokadId = Buffer.from(this.lokadId, 'hex')
        script.push(this.getPushDataOpcode(lokadId))
        lokadId.forEach((item) => script.push(item))

        // Token Type
        if (this.tokenType != 0x01) {
            throw "Unsupported token type"
        }
        script.push(this.getPushDataOpcode(this.tokenType))
        script.push(this.tokenType)

        // Transaction Type
        let transactionType = Buffer.from('GENESIS')
        script.push(this.getPushDataOpcode(transactionType))
        transactionType.forEach((item) => script.push(item))

        // Ticker
        if (ticker == null || ticker.length == 0) {
            [0x4c, 0x00].forEach((item) => script.push(item))
        } else {
            ticker = Buffer.from(ticker)
            script.push(this.getPushDataOpcode(ticker))
            ticker.forEach((item) => script.push(item))
        }

        // Name
        if (name == null || name.length == 0) {
            [0x4c, 0x00].forEach((item) => script.push(item))
        } else {
            name = Buffer.from(name)
            script.push(this.getPushDataOpcode(name))
            name.forEach((item) => script.push(item))
        }


        // Document URL
        if (documentUrl == null || documentUrl.length == 0) {
            [0x4c, 0x00].forEach((item) => script.push(item))
        } else {
            documentUrl = Buffer.from(documentUrl)
            script.push(this.getPushDataOpcode(documentUrl))
            documentUrl.forEach((item) => script.push(item))
        }

        // Document Hash
        if (documentHash == null || documentHash.length == 0) {
            [0x4c, 0x00].forEach((item) => script.push(item))
        } else {
            documentHash = Buffer.from(documentHash)
            script.push(this.getPushDataOpcode(documentHash))
            documentHash.forEach((item) => script.push(item))
        }

        // Decimals
        if (decimals < 0 || decimals > 9) {
            throw "Decimals property must be in range 0 to 9"
        } else {
            script.push(this.getPushDataOpcode(decimals))
            script.push(decimals)
        }

        // Baton Vout
        if (batonVout == null) {
            [0x4c, 0x00].forEach((item) => script.push(item))
        } else {
            if (batonVout <= 1) {
                throw "Baton vout must be 2 or greater"
            }
            script.push(this.getPushDataOpcode(batonVout))
            script.push(batonVout)
        }

        // Initial Quantity
        initialQuantity = int2FixedBuffer(initialQuantity, 8)
        script.push(this.getPushDataOpcode(initialQuantity))
        initialQuantity.forEach((item) => script.push(item))

        let encodedScript = this.encodeScript(script)
        if (encodedScript.length > 223) {
            throw "Script too long, must be less than 223 bytes."
        }
        return encodedScript
    }

    buildSendOpReturn(outputQtyArray) {
        let script = []

        // OP Return Prefix
        script.push(0x6a)

        // Lokad Id
        let lokadId = Buffer.from(this.lokadId, 'hex')
        script.push(this.getPushDataOpcode(lokadId))
        lokadId.forEach((item) => script.push(item))

        // Token Type
        if (this.tokenType != 0x01) {
            throw "Unsupported token type"
        }
        script.push(this.getPushDataOpcode(this.tokenType))
        script.push(this.tokenType)

        // Transaction Type
        let transactionType = Buffer.from('SEND')
        script.push(this.getPushDataOpcode(transactionType))
        transactionType.forEach((item) => script.push(item))

        // Token Id
        let tokenId = Buffer.from(this.tokenIdHex, 'hex')
        script.push(this.getPushDataOpcode(tokenId))
        tokenId.forEach((item) => script.push(item))

        // Output Quantities
        if (outputQtyArray.length > 19) {
            throw "Cannot have more than 19 SLP token outputs."
        }
        outputQtyArray.forEach((outputQty) => {
            if (outputQty < 0) {
                throw "All outputs must be 0 or greater"
            }
            let qtyBuffer = this.int2FixedBuffer(outputQty, 8)
            script.push(this.getPushDataOpcode(qtyBuffer))
            qtyBuffer.forEach((item) => script.push(item))
        })

        let encodedScript = this.encodeScript(script)
        if (encodedScript.length > 223) {
            throw "Script too long, must be less than 223 bytes."
        }
        return encodedScript
    }
}

module.exports = SlpScriptBuilder