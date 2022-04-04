import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as dynamodb from 'aws-sdk/clients/dynamodb';
import { getNextId, idToShortURL } from '../utils';

const docClient = new dynamodb.DocumentClient({ region: 'eu-central-1' });
const urlTable = process.env.URL_TABLE;

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    //env var checks
    if (!urlTable) throw new Error('Environment variale "URL_TABLE" not defined.');

    // All log statements are written to CloudWatch
    console.info('received:', event);

    const { longUrl } = JSON.parse(event.body ?? '');
    if (!longUrl) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Missing required body parameter: longUrl',
            }),
        };
    }

    try {
        new URL(longUrl);
    } catch (err) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Invalid URL passed as "long_url"',
            }),
        };
    }

    const shortUrl = idToShortURL(await getNextId(urlTable, docClient));
    const params = {
        TableName: urlTable,
        Item: { shortUrl, longUrl },
    };

    let response: APIGatewayProxyResult;

    try {
        await docClient.put(params).promise();
        response = {
            statusCode: 200,
            body: JSON.stringify({
                data: new URL(shortUrl, 'https://tier.app').href,
            }),
        };
    } catch (err) {
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }

    return response;
};
