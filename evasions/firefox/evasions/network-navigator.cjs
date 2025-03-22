module.exports = async function (requestData, requestData, fingerprint) {
    let result = requestData

    if(result.headers["user-agent"]){
        result.headers["user-agent"] = fingerprint.userAgent
    }
    
    return result
}