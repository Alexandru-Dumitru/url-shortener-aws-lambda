import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import * as dynamodb from 'aws-sdk/clients/dynamodb';

const docClient = new dynamodb.DocumentClient({ region: 'eu-central-1' });

const urlTable = process.env.URL_TABLE;

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    //env var checks
    if (!urlTable) throw new Error('Environment variale "URL_TABLE" not defined.');

    // All log statements are written to CloudWatch
    console.info('received:', event);

    const shortUrl = event.pathParameters?.shortUrl;
    if (!shortUrl) {
        return {
            statusCode: 400,
            body: JSON.stringify({
                message: 'Missing required path parameter: shortUrl',
            }),
        };
    }

    const params = {
        TableName: urlTable,
        Key: { shortUrl },
    };

    let response: APIGatewayProxyResult;

    try {
        const result = await docClient.get(params).promise();
        response = {
            statusCode: 308,
            headers: { location: result.Item?.longUrl },
            body: '',
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
