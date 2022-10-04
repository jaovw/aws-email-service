const AWS = require('aws-sdk')
const sns = new AWS.SNS()
const axios = require('axios')

const publishToSns = message => {
    sns.publish({
        Message: message,
        TopicArn: process.env.SNS_TOPIC_ARN
    }).promise()
}

const buildEmailBody = (id, form) => {
    return`
        Message: ${form.message}
        Name: ${form.name}
        Email: ${form.email}
        Service Information: ${id.sorceIp} - ${id.userAgent}
    `
}

module.exports.staticMailer = async event => {

    const data = JSON.parse(event.body)
    const emailBody = buildEmailBody(event.requestContext.identity, data)

    if(typeof data.email !== 'string') {
        return{
            statusCode: 404,
            body: JSON.stringify({
                message: 'Validacao falha'
            })
        }
    }

    await publishToSns(emailBody)

    await axios.post(
        'https://730qe7chqb.execute-api.us-east-1.amazonaws.com/dev/subscribe',
        {
            email: data.email
        }
    )

    return{
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': false
        },
        body: JSON.stringify({
            message: 'Sucesso!'
        })
    }
}