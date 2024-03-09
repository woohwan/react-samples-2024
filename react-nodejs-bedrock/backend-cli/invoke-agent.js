//  https://stackoverflow.com/questions/77874914/how-to-invoke-agent-using-bedrock-agent-runtime-client-in-aws-sdk-for-javascript

import { BedrockAgentRuntimeClient, InvokeAgentCommand } from "@aws-sdk/client-bedrock-agent-runtime"

// import { PromptTemplate } from "@langchain/core/prompts"

const client = new BedrockAgentRuntimeClient({
    region: 'us-east-1'
})
// const promptTemplate = PromptTemplate.fromTemplate(
//     "{yeaer}년 {month}월 자원 사용량은?"
// )
// const chain = promptTemplate.pipe(model)

const input = {
    agentId: "IUFLFZG1TW",
    agentAliasId: "GDOGYNUEF9",
    sessionId: 'fitcloud-js-01',
    InputText: '2023년 9월 자원 사용량은?'
}

const invokeFitCloud = async () => {
    return new Promise(async (resolve, reject) => {
       let completion = "";
       const command = new InvokeAgentCommand(input);
       const response = await client.send(command);
 
       for await (const chunkEvent of response.completion) {
         if (chunkEvent.chunk) {
           const chunk = chunkEvent.chunk;
           let decoded = new TextDecoder("utf-8").decode(chunk.bytes);
           completion += decoded;
         }
       }      
       
       resolve(response);
    });
 }

 invokeFitCloud()