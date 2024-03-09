import { BedrockChat } from "@langchain/community/chat_models/bedrock"
import { PromptTemplate } from "@langchain/core/prompts"

const model = new BedrockChat({
    model: "anthropic.claude-v2:1",
    region: "us-east-1",
    modelKwargs: { }
})

const promptTemplate = PromptTemplate.fromTemplate(
    "{conuntry}의 수도는?"
)

const chain = promptTemplate.pipe(model)
const result = await chain.invoke( {conuntry: "한국"})

console.log(result.content)