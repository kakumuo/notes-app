

const formatMessage = (errorCode, message, data=null) => {
    if(!data)
        return {code: errorCode, success: errorCode == 0, message: message}
    return {
        code: errorCode,
        success: errorCode == 0, 
        message: message, 
        data: data
    }

}


module.exports = {
    formatMessage: formatMessage
}