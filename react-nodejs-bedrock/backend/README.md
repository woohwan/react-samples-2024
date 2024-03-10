1. module install
```  
npm init -y
npm i --save @aws-sdk/client-bedrock-agent
npm i --save langchain  @langchain/community
npm i --save express body-parser cors
```  
2. package.json 에 "type": "module" 추가  
3. use import {} from 'modulename' 형식 사용  


참고:  
https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_bedrock-agent-runtime_code_examples.html  