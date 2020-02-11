# Post Image API
Summary:

# Service Function 
- upload images (binary / url)
- read the message from SQS queue and do console log to do page post


# Code Covertage
- setup lambdas function, api gateway and event handler and aws resources (cloudformation, policies, roles, etc)
- SAM Demo 
- CI/CD Demo
- blue green deployment
- canary deployment
- Create serverless version (API Gateway / Lambda Function)
- Demonstrate `serverless` framework and compare with SAM 


## Test Command
```
curl -X POST \
  https://d8frhit1vg.execute-api.us-west-2.amazonaws.com/Prod \
  -H 'cache-control: no-cache' \
  -H 'content-type: application/json' \
  -H 'x-account-id: 20190528' \
  -d '{
  "url": "https://www.gstatic.com/webp/gallery/2.jpg"
}'
```

## Reference
- https://github.com/awslabs/serverless-application-model/
- https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html
- https://serverless.com/

