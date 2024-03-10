import express from "express";
import bodyParser from "body-parser";
import cors from 'cors'
import { BedrockAgentRuntimeClient, InvokeAgentCommand  } from '@aws-sdk/client-bedrock-agent-runtime'

// app setting
const app = express()
const port = 8000
app.use(bodyParser.json())
app.use(cors())

const agentId = process.env.AGENT_ID
const agentAliasId = process.env.AGENT_ALIAS_ID
  /**
   * @typedef {Object} ResponseBody
   * @property {string} completion
   */
  
  /**
   * Invokes a Bedrock agent to run an inference using the input
   * provided in the request body.
   *
   * @param {string} prompt - The prompt that you want the Agent to complete.
   * @param {string} sessionId - An arbitrary identifier for the session.
   */
  export const invokeBedrockAgent = async (prompt, token, accountId, sessionId) => {
    const client = new BedrockAgentRuntimeClient({ region: "us-east-1" });
  
    const agentId = "IUFLFZG1TW";
    const agentAliasId = "GDOGYNUEF9";
  
    const command = new InvokeAgentCommand({
      sessionState: { // SessionState
        sessionAttributes: { // SessionAttributesMap
            "token": token,
            "accountId": accountId,
        },
      },
      agentId,
      agentAliasId,
      sessionId,
      inputText: prompt,
    });
  
    try {
      let completion = "";
      const response = await client.send(command);
  
      if (response.completion === undefined) {
        throw new Error("Completion is undefined");
      }
  
      for await (let chunkEvent of response.completion) {
        const chunk = chunkEvent.chunk;
        const decodedResponse = new TextDecoder("utf-8").decode(chunk.bytes);
        completion += decodedResponse;
      }
  
      return { "role": "assistant", "content": completion };
    } catch (err) {
      console.error(err);
    }
  };
  
app.post("/", async (req, res) => {
    const { accountId, token, prompt, sessionId } = req.body
    console.log("prompt: ", prompt)
    const result = await invokeBedrockAgent(prompt, token, accountId, sessionId)
    console.log(result)
    res.json({
        output: result
    })
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})

