import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { lambdaHandler as shortenUrlHandler } from '../../handlers/shorten-url';
import { lambdaHandler } from '../../handlers/redirect';

describe('Unit test for redirect handler', function () {
    it('verifies successful response', async () => {
        // Arrange
        const longUrl = 'https://google.com/123/user';
        const shortenEvent: APIGatewayProxyEvent = {
            httpMethod: 'POST',
            body: JSON.stringify({
                longUrl,
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

        const { data } = JSON.parse((await shortenUrlHandler(shortenEvent)).body);
        const shortUrlPathname = new URL(data).pathname;

        const event: APIGatewayProxyEvent = {
            httpMethod: 'GET',
            headers: {},
            body: '',
            isBase64Encoded: false,
            multiValueHeaders: {},
            multiValueQueryStringParameters: {},
            path: shortUrlPathname,
            pathParameters: { shortUrl: shortUrlPathname.replace('/', '') },
            queryStringParameters: {},
            requestContext: {
                accountId: '123456789012',
                apiId: '1234',
                authorizer: {},
                httpMethod: 'GET',
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
                path: shortUrlPathname,
                protocol: 'HTTP/1.1',
                requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
                requestTimeEpoch: 1428582896000,
                resourceId: '123456',
                resourcePath: shortUrlPathname,
                stage: 'dev',
            },
            resource: '',
            stageVariables: {},
        };

        // Act
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        // Assert
        expect(result.statusCode).toEqual(308);
        expect(result.headers.location).toEqual(longUrl);
    });
});
