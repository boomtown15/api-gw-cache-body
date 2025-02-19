# API Gateway with Response Caching

This project demonstrates API Gateway caching using properties from the request body as cache keys.  API Gateway can cache responses using custom headers, URL paths or query strings.  You can select one or many of these parameters as the key.  Each unique key value will be cached separately.  In this example, we use a property in the body named "type" that is mapped to a customer header during our integration request.  You can map multiple properties from the body to different headers to create unique cache key values.  

## Prerequisites

- AWS Account
- AWS SAM CLI installed
- Node.js 14.x or later installed
- AWS CLI configured with appropriate credentials

## Deployment

To deploy the application using AWS SAM:

1. Build the application:
```bash
sam build
```

2. Deploy the application:
```bash
sam deploy --guided
```

During the guided deployment, you can accept the default options. Note the API endpoint URL in the deployment outputs.

Creation of the cache can take several minutes.  You can check progress by running: 
```aiignore
aws apigateway get-stage --rest-api-id <API ID> --stage-name dev
```

Example output of the command is shown below.  Wait until CacheClusterStatus is in "AVAILABLE" state
```aiignore
{
    "deploymentId": "ydcpfv",
    "stageName": "dev",
    "cacheClusterEnabled": true,
    "cacheClusterSize": "0.5",
    "cacheClusterStatus": "CREATE_IN_PROGRESS",
    "methodSettings": {
    ...
```

## Testing

To test the API and verify the caching behavior:

1. Send a request with a specific type (this will be a cache miss):
```bash
curl -X POST https://your-api-endpoint/dev/ \
  -H "Content-Type: application/json" \
  -d '{"type": "test1"}' \
  -i
```

2. Send the same request again (this should be a cache hit):
```bash
curl -X POST https://your-api-endpoint/dev/ \
  -H "Content-Type: application/json" \
  -d '{"type": "test1"}' \
  -i
```

3. Send a request with a different type (this will be a cache miss):
```bash
curl -X POST https://your-api-endpoint/dev/ \
  -H "Content-Type: application/json" \
  -d '{"type": "test2"}' \
  -i
```

### Verifying Cache Behavior

It may take several minutes for metric data to become available.  To check the cache hit metrics, you can run the following CLI commands or view the metrics within CloudWatch.  

To check Cache Hit metrics for the API dev stage: 
```aws cloudwatch get-metric-statistics \
    --namespace "AWS/ApiGateway" \
    --metric-name "CacheHitCount" \
    --dimensions Name=ApiName,Value="APIGW caching from the body example" Name=Stage,Value=dev \
    --start-time $(date -v-1H -u +%Y-%m-%dT%H:%M:%S) \
    --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
    --period 3600 \
    --statistics Sum
```

To check cache miss metrics: 
```aws cloudwatch get-metric-statistics \
    --namespace "AWS/ApiGateway" \
    --metric-name "CacheMissCount" \
    --dimensions Name=ApiName,Value="APIGW caching from the body example" Name=Stage,Value=dev \
    --start-time $(date -v-1H -u +%Y-%m-%dT%H:%M:%S) \
    --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
    --period 3600 \
    --statistics Sum
```

You've successfully deployed and tested an API Gateway caching solution using properties from the request body as cache keys.   
