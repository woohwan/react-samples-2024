import { OpenAI } from 'openai'
import readlineSync from "readline-sync"
import colors from 'colors'


const openai = new OpenAI()

async function main() {
    console.log(colors.bold.green('Welcome to the Chatbot Program!'))
    console.log(colors.bold.green("You can start chatting with the bot"))

    const chatHistory = []

    while (true) {
        const userInput = readlineSync.question(colors.yellow('You: '))

        try {
            // Construct messages by iterating over the history
            const messages = chatHistory.map(([role, content]) => ({
                role,
                content,
            }))

            // Add latest user input
            messages.push({role: 'user', content: userInput})

            // Call the API with the user input & history
            const completion = await openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: messages
            })

            // Get completion text/content
            const completionText = completion.choices[0].message.content

            if (userInput.toLocaleLowerCase() === 'exit') {
                console.log(colors.green('Bot: ') + completionText)
                return
            }

            console.log(colors.green('Bot: ' + completionText))

            // update history with user input and assistant response
            chatHistory.push(['user', userInput])
            chatHistory.push(['assistant', completionText])
        } catch(error) {
            console.error(colors.red(error))
        }
    }
}

main()
