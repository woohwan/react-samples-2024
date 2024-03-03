import { OpenAI } from 'openai'
import express, { response } from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'

const app = express()
const port = 8000
app.use(bodyParser.json())
app.use(cors())

const openai = new OpenAI()

app.post("/", async (req, res) => {
    const { chats } = req.body

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {
                role: "system",
                content: "You are a EbereGPT. You can help with graphic design tasks",
            },
            ...chats,
        ],
    })

    res.json({
        output: completion.choices[0].message
    })
})

app.listen(port, () => {
    console.log(`listening on port ${port}`)
})