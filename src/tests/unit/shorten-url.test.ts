import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { lambdaHandler } from '../../handlers/shorten-url';

describe('Unit test for shorten-url handler', function () {
    it('verifies successful response', async () => {
        // Arrange
        const event: APIGatewayProxyEvent = {
            httpMethod: 'POST',
            body: JSON.stringify({
                longUrl: 'https://google.com/123/user',
            }),
            headers: {},
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: '/shorten',
            pathParameters: {},
            queryStringParameters: {},
            requestContext: {
                accountId: '123456789012',
                apiId: '1234',
                authorizer: {},
                httpMethod: 'POST',
                identity: {
                    accessKey: '',
                    accountId: '',
                    apiKey: '',
                    apiKeyId: '',
                    caller: '',
                    clientCert: {
                        clientCertPem: '',
                        issuerDN: '',
                        serialNumber: '',
                        subjectDN: '',
                        validity: { notAfter: '', notBefore: '' },
                    },
                    cognitoAuthenticationProvider: '',
                    cognitoAuthenticationType: '',
                    cognitoIdentityId: '',
                    cognitoIdentityPoolId: '',
                    principalOrgId: '',
                    sourceIp: '',
                    user: '',
                    userAgent: '',
                    userArn: '',
                },
                path: '/shorten',
                protocol: 'HTTP/1.1',
                requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                requestTimeEpoch: 1428582896000,
                resourceId: '123456',
                resourcePath: '/shorten',
                stage: 'dev',
            },
            resource: '',
            stageVariables: {},
        };

        // Act
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        // Assert
        expect(result.statusCode).toEqual(200);
        const expected = expect.stringContaining('{"data":"https://tier.app');
        expect(result.body).toEqual(expected);
    });
});
