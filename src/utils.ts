import * as dynamodb from 'aws-sdk/clients/dynamodb';

export const idToShortURL = (id: number) => {
    const map = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const shorturl = [];

    while (id) {
        shorturl.push(map[id % 62]);
        id = Math.floor(id / 62);
    }
    shorturl.reverse();

    return shorturl.join('');
};

export const getNextId = async (tableName: string, dbClient: dynamodb.DocumentClient) => {
    const params = {
        TableName: tableName,
        Key: {
            shortUrl: '__id',
        },
        UpdateExpression: 'add #counter :n',
        ExpressionAttributeNames: {
            '#counter': 'counter',
        },
        ExpressionAttributeValues: {
            ':n': 1,
        },
        ReturnValues: 'UPDATED_NEW',
    };

    const res = await dbClient.update(params).promise();
    return res.Attributes?.counter;
};
