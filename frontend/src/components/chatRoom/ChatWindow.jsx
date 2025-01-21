
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function ChatWindow({socket, chat, handleSubmit, inputValue, setInputValue, lastMessageRef, styles, messages}) {
  return (
    <div className={styles.subContainer}>
      <div className={styles.chat}>
          <h2>
            {chat.name?.length? `${chat.name, "Join Code: ", chat.id}` : ""}&nbsp;
          </h2>
        </div>
      <div className={styles.messageContainer}>
        <ul>
          {messages.map((message, index) => {
            return (
              <li
                className={message.sender === socket.id? styles.sending: styles.recieving}
                key={message.id}
                ref={index === messages.length - 1 ? lastMessageRef : null}>
                <span>
                  <b>{message.sender} </b>
                  {message.sentAt}
                </span>
                <div>{message.value}</div>
              </li>
            );
          })}
        </ul>
      </div>
      <div className={styles.textbar}>
        <form action="">
            <input
              type="text"
              name="textfield"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="type something..."
            />
          <button type="submit" onClick={handleSubmit}>
            <FontAwesomeIcon icon={faPaperPlane} />
          </button>
        </form>
      </div>
    </div>
  );
}
