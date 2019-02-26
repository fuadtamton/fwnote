errorCode = (status, message) => {
    return {
        returnCode: status,
        returnMessage: message
    }
}

module.exports = { errorCode }