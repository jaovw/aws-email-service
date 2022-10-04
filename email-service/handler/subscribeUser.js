const AWS = require('aws-sdk')
const uuid = require('uuid')
const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();


module.exports.subscribeUser = async event => {

    const timestamp = new Date().getTime()
    const data = JSON.parse(event.body)

    const newItem = {
        userId: uuid.v4(),
        email: data.email,
        subscriber: true,
        createdAt: timestamp,
        updatedAt: timestamp
    }

    if(typeof data.email !== 'string') {
        return{
            statusCode: 404,
            body: JSON.stringify({
                message: 'Validacao falha'
            })
        }
    }

    await dynamoDb.put({
        TableName: USERS_TABLE,
        Item: newItem
    }).promise()
    
    return {
        statusCode: 200,
        body: JSON.stringify(newItem)
    }

}