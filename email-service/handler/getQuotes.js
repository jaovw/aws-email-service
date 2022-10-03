const AWS = require("aws-sdk")
AWS.config.update({region: process.env.REGION})
const s3 = new AWS.S3()


module.exports.getQuotes = async event => {
    
    const data = await s3.getObject({
        Bucket: 'email-service-json',
        Key: 'quotes.json'
    }).promise()

    const json = JSON.parse(data.Body)

    const response = {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*'
        },
        statusCode: 200,
        body: JSON.stringify(json)
    }

    return response
}