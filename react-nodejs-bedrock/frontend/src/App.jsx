import { useEffect, useState } from 'react'

const App = () => {
  const [ message, setMessage ] = useState("")
  const [ chats, setChats] = useState([])
  const [ isTyping, setIsTyping ] = useState(false)
  const [ sessionId, setSessionID] = useState("")
  const [ token, setToken ] = useState("")
  const [ accountId, setAccountID] = useState("")

  useEffect(() => {
    setAccountID("")
    setSessionID("s-123")
    setToken("")
  })

  const chat = async(e, message) => {
    e.preventDefault()

    if(!message) return
    setIsTyping(true)
    scrollTo(0, 1e10)

    let msgs = chats
    msgs.push({role: "user", content: message })
    let prompt = message
    setChats(msgs)

    setMessage("")
  
    fetch("http://localhost:8000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        "prompt": prompt,
        "accountId": accountId,
        "token": token,
        "sessionId": sessionId
      }),
    })
      .then((resp) => resp.json())
      .then((data) => {
        msgs.push(data.output)
        setChats(msgs)
        setIsTyping(false)
        scrollTo(0, 1e10)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return (
    <main>
      <h1>FullStack Chat AI Tutorial</h1>

      <section>
        {chats && chats.length ? chats.map((chat, index) => (
          <p key={index} className={chat.role === "user" ? "user_msg" : ""}>
            <span>
              <b>{chat.role.toUpperCase()}</b>
            </span>
            <span>:</span>
            <span>{chat.content}</span>
          </p>
        ))
      : ""}
      </section>

      <div className='isTyping ? "": "hide'>
          <p>
            <i>{isTyping? "Typing" : ""}</i>
          </p>
      </div>

      <form action='' onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder='Type a message here and hit Enter...'
          onChange={(e) => setMessage(e.target.value)}
        />
      </form>
    </main>
  )
}

export default App;