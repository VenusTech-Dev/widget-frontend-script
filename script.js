import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js"
import hljs from "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/es/highlight.min.js"

export const initialise = async (api_key) => {
  const FingerprintJS = await import("https://openfpcdn.io/fingerprintjs/v4")
  async function getVisitorId() {
    // Load FingerprintJS
    const fp = await FingerprintJS.load()

    // Get the visitor identifier
    const result = await fp.get()

    // This is the visitor identifier:
    const visitorId = result.visitorId

    // Return the visitorId if needed
    return visitorId
  }
  const visitorId = await getVisitorId()
  console.log(visitorId)
  const url = "https://dev-dex-widget-backend-6bc8bcc9eb98.herokuapp.com/api/v1"
  // const url = "http://localhost:4000/api/v1";
  const widgetInitialise = await (
    await fetch(`${url}/initialise`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": api_key,
        "x-fingerprint": visitorId,
      },
    })
  ).json()
  console.log(widgetInitialise)
  if (!widgetInitialise.success) {
    console.log(widgetInitialise.message)
    return
  }
  const { position, color, size, icon, type } = widgetInitialise.data
  // let type = "dex";
  let messageCountText = widgetInitialise.data.messageCountText
  let { threadId } = widgetInitialise.data
  console.log(position, color, size, icon, type, threadId)
  // let threadId = localStorage.getItem("threadId");
  // if (!threadId) {
  //   const thread = await (
  //     await fetch(`${url}/genThread`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         "x-api-key": api_key,
  //       },
  //     })
  //   ).json();
  //   console.log(thread);
  //   if (!thread.success) {
  //     console.log(thread.message);
  //     return;
  //   }
  //   localStorage.setItem("threadId", thread.data);
  //   threadId = thread.data;
  // }
  let isLoading = false
  let takeEmail = false
  let takeOTP = false
  const getMessages = await (
    await fetch(`${url}/getMessages?threadId=${threadId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": api_key,
      },
    })
  ).json()
  if (!getMessages.success) {
    return
  }
  let prevMessages = getMessages.data
  const widgetHTML = `<div class="widget">
<button class="chatbot-toggler">
<span>
  <dotlottie-player
    src="https://lottie.host/f143117b-d082-4105-8b93-a04f101cdf69/D4bQ2oo7jt.json"
    background="transparent"
    speed="1"
    style="width: 50px; height: 50px"
    direction="1"
    mode="normal"
    loop
    autoplay
  ></dotlottie-player>
</span>
<span>
  <dotlottie-player
    src="https://lottie.host/1ce2708c-19c5-4c5b-903e-6119c5344b54/auAxVmT9XO.json"
    background="transparent"
    speed="1"
    style="width: 50px; height: 50px"
    direction="1"
    mode="normal"
    loop
    autoplay
  ></dotlottie-player>
</span>
</button>
<div class="entire-chatbot">
<div class="chatbot semi-closed">
<header>
  <span class="expand-btn"
    ><svg
      width="21"
      height="20"
      viewBox="0 0 21 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.60083 2.5H2.60083V7.5"
        stroke="#AAB8C2"
        stroke-width="1.54618"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M12.6008 17.5H17.6008V12.5"
        stroke="#AAB8C2"
        stroke-width="1.54618"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M2.60099 2.5L8.43433 8.33333"
        stroke="#AAB8C2"
        stroke-width="1.54618"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M17.6008 17.5001L11.7675 11.6667"
        stroke="#AAB8C2"
        stroke-width="1.54618"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </span>
  <p>Need help writing code?</p>
  <div>
    <span class="heart"></span>
    <span class="delete-btn" id="delete-btn"
      ><svg
        width="17"
        height="17"
        viewBox="0 0 17 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4.95843 14.875L1.9126 11.8292C1.20426 11.1209 1.20426 10.0584 1.9126 9.42085L8.7126 2.62085C9.42093 1.91252 10.4834 1.91252 11.1209 2.62085L15.0876 6.58752C15.7959 7.29585 15.7959 8.35835 15.0876 8.99585L9.20843 14.875"
          stroke="#AAB8C2"
          stroke-width="1.51852"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M15.5833 14.875H4.95825"
          stroke="#AAB8C2"
          stroke-width="1.51852"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M3.54175 7.79175L9.91675 14.1667"
          stroke="#AAB8C2"
          stroke-width="1.51852"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </span>
    <span class="close-btn"
      ><svg
        width="22"
        height="22"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M17.1481 4.85174C17.5061 5.20972 17.5061 5.79012 17.1481 6.1481L6.1481 17.1481C5.79012 17.5061 5.20972 17.5061 4.85174 17.1481C4.49376 16.7901 4.49376 16.2097 4.85174 15.8517L15.8517 4.85174C16.2097 4.49376 16.7901 4.49376 17.1481 4.85174Z"
          fill="#AAB8C2"
        />
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M4.85174 4.85174C5.20972 4.49376 5.79012 4.49376 6.1481 4.85174L17.1481 15.8517C17.5061 16.2097 17.5061 16.7901 17.1481 17.1481C16.7901 17.5061 16.2097 17.5061 15.8517 17.1481L4.85174 6.1481C4.49376 5.79012 4.49376 5.20972 4.85174 4.85174Z"
          fill="#AAB8C2"
        />
      </svg>
    </span>
  </div>
</header>
<div class="chat-container"></div>
<div class="typing-container">
  <div class="powered-container">
  <svg
  width="12"
  height="12"
  viewBox="0 0 507 507"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <path
    d="M224.724 281.59H84.2716V337.772H224.724M224.724 169.228H84.2716V225.409H224.724M306.468 124.564L266.86 164.172L356.322 253.443L265.832 343.306L306.527 384.001L435.403 253.5M449.449 0.685059C480.629 0.685059 505.63 25.9665 505.63 56.8661V450.134C505.63 465.034 499.711 479.324 489.175 489.86C478.639 500.396 464.349 506.315 449.449 506.315H56.1811C41.2809 506.315 26.9911 500.396 16.4551 489.86C5.91907 479.324 0 465.034 0 450.134V56.8661C0 41.966 5.91907 27.6761 16.4551 17.1401C26.9911 6.60412 41.2809 0.685059 56.1811 0.685059H449.449Z"
    fill="url(#paint0_linear_521_1286)"
  />
  <path
    d="M84.2716 169.214L224.724 169.228V225.409H84.2716V169.214Z"
    fill="#FAFAFA"
  />
  <path d="M84.2716 281.59H224.724V337.772H84.2716V281.59Z" fill="#FAFAFA" />
  <path
    d="M265.832 343.306L311.737 298.034L356.322 253.443L396.437 293.238L306.527 384.001L265.832 343.306Z"
    fill="#FAFAFA"
  />
  <path
    d="M306.468 124.564L436.549 253.761L396.437 293.238L332.291 229.602L266.86 164.172L306.468 124.564Z"
    fill="white"
  />
  <defs>
    <linearGradient
      id="paint0_linear_521_1286"
      x1="371.7"
      y1="41.6004"
      x2="629.987"
      y2="421.795"
      gradientUnits="userSpaceOnUse"
    >
      <stop stop-color="#5F3B67" />
      <stop offset="1" stop-color="#5E5BE6" />
    </linearGradient>
  </defs>
</svg>
    <p class="powered-text">Powered by DevDex.ai</p>
  </div>
  <div class="typing-content">
    <div class="typing-textarea">
      <textarea
        id="chat-input"
        placeholder="How can I deploy this app?"
        spellcheck="false"
        required
      ></textarea>
    </div>
  </div>
  <span id="send-btn" class="send-btn">
    <svg
      width="33"
      height="33"
      viewBox="0 0 33 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16.5 30.25C24.0939 30.25 30.25 24.0939 30.25 16.5C30.25 8.90608 24.0939 2.75 16.5 2.75C8.90608 2.75 2.75 8.90608 2.75 16.5C2.75 24.0939 8.90608 30.25 16.5 30.25Z"
        fill=${color}
        stroke=${color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M22 16.5L16.5 11L11 16.5"
        stroke="#FAFAFA"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M16.5 22V11"
        stroke="#FAFAFA"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <!-- <svg
      width="34"
      height="34"
      viewBox="0 0 34 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clip-path="url(#clip0_156_1112)">
        <path
          d="M31.1126 16.9706H15.5563"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M31.1128 16.9705L12.021 26.1629L15.5565 16.9705L12.021 7.77812L31.1128 16.9705Z"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_156_1112">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(16.9707) rotate(45)"
          />
        </clipPath>
      </defs>
    </svg> -->
  </span>
</div>
</div>
</div>
</div>`

  const widgetCSS = `
:host {
  --prime: ${color};
  --text-color: #d1d5db;
  --icon-color: #d1d5db;
  --icon-hover-bg: #5b5e71;
  --placeholder-color: #a1a1aa;
  --outgoing-chat-bg: #23262c;
  --incoming-chat-bg: #32353b;
  --outgoing-chat-border: #23262c;
  --incoming-chat-border: #32353b;
  --code-header-color: #d9d9e3;
}

.chatbot-toggler {
  position: fixed;
  bottom: 30px;
  ${position}: 35px;
  outline: none;
  border: none;
  height: 50px;
  width: 50px;
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: rgba(0,0,0,0);
  transition: all 0.2s ease-in-out;
}

.entire-chatbot {
  z-index: 10010;
}

.show-chatbot .chatbot-toggler {
  transform: rotate(360deg);
}

.chatbot-toggler span {
  color: var(--text-color);
  position: absolute;
}

.chatbot-toggler span:last-child,
.show-chatbot .chatbot-toggler span:first-child {
  opacity: 0;
}

.show-chatbot .chatbot-toggler span:last-child {
  opacity: 1;
}

:host * {
  margin: 0;
  box-sizing: border-box;
  z-index: 10000;
}

.widget * {
  font-family: "Poppins", sans-serif;
  font-weight: 400;
}

.chatbot {
  display: flex;
  flex-direction: column;
  position: fixed;
  ${position}: 2.25rem;
  bottom: 5.75rem;
  background: var(--outgoing-chat-bg);
  border-radius: 16px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
  transform: scale(0.5);
  transform-origin: bottom ${position};
  transition: opacity 0.3s ease-in-out;
}

.show-chatbot .chatbot {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1);
  transition: transform 0.2s ease-in-out
}

.chatbot header {
  display: flex;
  padding: 1rem 1.375rem 1rem 1.375rem;
  position: relative;
  text-align: left;
  color: var(--text-color);
  background: var(--outgoing-chat-bg);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
}

.chat-container {
  overflow-y: auto;
  height: 52vh;
  width: 28vw;
  flex-grow: 1;
}

.chat-container .chat {
  padding: 25px 20px;
  display: flex;
  justify-content: space-evenly;
  color: var(--text-color);
}

.chat-container .chat.outgoing {
  background: var(--outgoing-chat-bg);
  border: 1px solid var(--outgoing-chat-border);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
}
.chat-container .chat.incoming {
  background: var(--incoming-chat-bg);
  border: 1px solid var(--incoming-chat-border);
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
}

.expand-btn {
  cursor: pointer;
}

.delete-btn {
  position: absolute;
  right: 55px;
  top: 50%;
  cursor: pointer;
  transform: translateY(-45%);
}

.close-btn {
  position: absolute;
  right: 22px;
  top: 50%;
  cursor: pointer;
  transform: translateY(-45%);
}

.heart {
  position: absolute;
  right: 70px;
  top: 50%;
  cursor: pointer;
  transform: translateY(-52%);
  display: inline-block;
  height: 55px;
  width: 55px;
  background-image: url("https://abs.twimg.com/a/1446542199/img/t1/web_heart_animation.png");
  background-position: left;
  background-repeat: no-repeat;
  background-size: 2900%;
}

.heart.liked {
  background-position: right;
}

.is_animating {
  animation: heart-burst 0.8s steps(28) 1;
}

@keyframes heart-burst {
  from {
    background-position: left;
  }
  to {
    background-position: right;
  }
}

.chatbot header p {
  padding-left: 1.5rem;
  font-size: 1rem;
  font-weight: 500;
}

.chatbot :where(.chat-container, textarea)::-webkit-scrollbar {
  width: 6px;
}

.chatbot :where(.chat-container)::-webkit-scrollbar-track {
  background: var(--outgoing-chat-bg);
  border-radius: 25px;
}

.chatbot :where(.chat-container)::-webkit-scrollbar-thumb {
  background: var(--placeholder-color);
  border-radius: 25px;
}

.chatbot :where(textarea)::-webkit-scrollbar-track {
  background: var(--incoming-chat-bg);
  border-radius: 25px;
}

.chatbot :where(textarea)::-webkit-scrollbar-thumb {
  background: var(--placeholder-color);
  border-radius: 25px;
}

.chat .chat-content {
  display: flex;
  width: 100%;
  align-items: flex-start;
  justify-content: space-between;
}

span.material-symbols-rounded {
  user-select: none;
  cursor: pointer;
}

.chat .chat-content span {
  cursor: pointer;
  /* font-size: 1.3rem; */
  /* color: var(--icon-color); */
  visibility: visible;
}

/* .chat:hover .chat-content:has(.typing-animation),
:has(.error) span {
  visibility: visible;
} */

.chat .chat-details {
  display: flex;
  align-items: center;
  width: 95%;
}

.chat .chat-details svg {
  align-self: flex-start;
  min-width: 40px;
  height: 40px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
}

.chat-container .chat.outgoing svg {
  border-radius: 50%;
}

.chat .chat-details > p {
  white-space: pre-wrap;
  font-size: 1rem;
  color: var(--text-color);
  word-wrap: break-word;
  overflow-wrap: break-word;
  padding: 0 0 0 25px;
  font-size: 0.875rem;
}

.response-container {
  color: var(--text-color);
  word-wrap: break-word;
  padding: 0 0 0 25px;
  overflow: auto;
}

.response-container > ul,
ol {
  white-space: pre-wrap;
  color: var(--text-color);
  overflow-wrap: break-word;
  font-size: 0.875rem;
  padding: 0;
  display: flex;
  flex-direction: column;
  margin-top: 0.75em;
  margin-bottom: 1em;
}

.response-container ul>li, ol>li {
  padding-top: 4px;
  min-height: 28px;
  margin: 0;
}

.response-container ol li>p {
  padding: 0;
}

.response-container ul li>p {
  padding: 0;
}

.response-container ol ul, ul ol, ul ul, ol ol {
  margin-top: 0;
  margin-bottom: 0;
  padding-left: 1em;
}

.response-container ol {
  display: flex;
  flex-direction: column;
}

.response-container ul {
  display: flex;
  flex-direction: column;
}

.response-container p {
  overflow-wrap: break-word;
  padding: 0;
  line-height: 1.75rem;
  font-size: 0.875rem;
}

.chat .chat-details p.error {
  color: #e55865;
}

.chat .typing-animation {
  padding-left: 25px;
  display: inline-flex;
}
.typing-animation .typing-dot {
  height: 7px;
  width: 7px;
  border-radius: 50%;
  margin: 0 3px;
  opacity: 0.7;
  background: var(--icon-color);
  animation: animateDots 1.5s var(--delay) ease-in-out infinite;
}
.typing-animation .typing-dot:first-child {
  margin-left: 0;
}

@keyframes animateDots {
  0%,
  44% {
    transform: translateY(0px);
  }
  28% {
    opacity: 0.4;
    transform: translateY(-6px);
  }
  44% {
    opacity: 0.2;
  }
}

.powered-container {
  display: flex;
  align-items: center;
  position: absolute;
  top: 0;
  padding-top: 10px;
  padding-bottom: 10px;
}
.remaining-message-container{
  display: flex;
  align-items: center;
  position: absolute;
  bottom: 0;
  padding: 8px 0px 12px 0px;
}

.powered-text {
  color: var(--placeholder-color);
  padding-left: 5px;
  font-size: 12px;
}

.typing-container {
  position: relative;
  bottom: 0;
  width: 100%;
  display: flex;
  padding: 2.5rem 1.25rem 1.5rem 1.25rem;
  justify-content: center;
  align-items: center;
  background: var(--outgoing-chat-bg);
}

/* .send-btn {
  cursor: pointer;
  background: var(--prime);
  margin-left: 0.75rem;
  width: 3rem;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.5rem 0.25rem 0.25rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
} */

.send-btn {
  cursor: pointer;
  background: var(--prime);
  margin-left: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 200px;
}

.typing-container .typing-content {
  display: flex;
  max-width: 950px;
  width: 100%;
}

/* .typing-container .typing-textarea {
  width: 100%;
  display: flex;
  position: relative;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.4);
}

.typing-textarea textarea {
  resize: none;
  height: 3rem;
  width: 100%;
  border: none;
  padding: 15px 45px 15px 20px;
  color: var(--text-color);
  border-radius: 8px;
  max-height: 250px;
  overflow-y: auto;
  background: var(--incoming-chat-bg);
  outline: 1px solid var(--incoming-chat-border);
} */

.typing-container .typing-textarea {
  width: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
  border-radius: 20px;
  outline: 1px solid #444444;
}

.typing-textarea textarea {
  resize: none;
  height: 50px;
  width: 100%;
  border: none;
  padding: 15px 45px 15px 20px;
  color: var(--text-color);
  border-radius: 20px;
  max-height: 250px;
  overflow-y: auto;
  background: var(--outgoing-chat-bg);
  outline: 1px solid #444444;
  font-size: 13px;
}

.typing-textarea textarea::placeholder {
  color: var(--placeholder-color);
}

@media (max-width: 490px) {
  // .widget {
  //   display: none;
  // }

  .chatbot-toggler {
    right: 20px;
    bottom: 20px;
  }

  .chatbot.open {
    right: 0;
    bottom: 0;
    height: 100%;
    border-radius: 0;
    width: 100%;
  }

  .show-chatbot .chatbot.semi-closed {
    transform: scale(0.75);
    right: 1.5rem;
    bottom: 5rem;
  }

  .show-chatbot .chatbot {
    // position: absolute;
    z-index: 10000;
    height: 100%;
    width: 100%;
  }

  .chatbot.open .chat-container {
    height: 93%;
    width: auto;
  }

  .expand-btn {
    display: none;
  }

  header p {
    padding-left: 0;
  }

  .chat .chat-content span {
    display: none;
  }

  .typing-textarea textarea {
    font-size: 16px;
    padding: 12.5px 45px 12.5px 20px;
  }
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  z-index: 10000;
  display: none;
}

.modal-open .chatbot {
  position: fixed;
  top: 4%;
  bottom: 4%;
  left: 25%;
  right: 25%;
  z-index: 10010;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-width: calc(100% - 25%);
}

.modal-open .chat-container .chat {
  padding: 40px 50px;
}

.modal-open .modal-backdrop {
  display: block;
}

.modal-open .chat-container {
  height: calc(100% - 120px);
  width: auto;
}

.modal-open .response-container {
  width: calc(100% - 40px);
}

pre {
  margin-top: 10px;
  margin-bottom: 10px;
  display: block;
  max-width: 100%;
  overflow-x: auto;
  border-radius: 0 0 10px 10px;
}

code {
  font-size: 0.875rem;
  overflow-wrap: normal;
  white-space: pre;
  overflow-x: auto;
  max-width: 100%;
}

.chatbot code::-webkit-scrollbar {
  height: 6px;
}

.chatbot code::-webkit-scrollbar-track {
  background: var(--outgoing-chat-bg);
  border-radius: 10px;
}

.chatbot code::-webkit-scrollbar-thumb {
  background: var(--placeholder-color);
  border-radius: 10px;
}

.semi-closed .chat-container {
  display: none;
}

.semi-closed .typing-container {
  position: relative;
}

.semi-closed header {
  width: 27rem;
  box-shadow: none;
}

.semi-closed header span svg {
  display: none;
}

.semi-closed header p {
  padding-left: 0;
}

.semi-closed header div span svg {
  display: initial;
}

.semi-closed #delete-btn {
  display: none;
}

.semi-closed .heart {
  display: none;
}

/* Code header styles */

.code-header {
  font-family: "Poppins", sans-serif;
  color: var(--code-header-color);
  background-color: var(--outgoing-chat-bg);
  padding: 0.75rem 1rem;
  border-top-left-radius: 10px;
  border-top-right-radius: 10px;
  font-size: 0.85rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copy-code-btn {
  font-family: "Poppins", sans-serif;
  color: var(--code-header-color);
  background-color: var(--outgoing-chat-bg);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.85rem;
}

.fade-out {
  animation: fadeOutAnimation 0.5s;
  opacity: 0;
}

.fade-in {
  animation: fadeInAnimation 0.5s;
  animation-fill-mode: forwards;
}

@keyframes fadeOutAnimation {
  from { opacity: 1; }
  to { opacity: 0; }
}

@keyframes fadeInAnimation {
  from { opacity: 0; }
  to { opacity: 1; }
}

.chatbot.expanded {
  animation: fadeInAnimation 0.2s ease-in-out forwards;
}

.chatbot.collapsed {
  animation: fadeOutAnimation 0.2s ease-in-out forwards;
}

.chatbot.close {
  display: none;
}
.response-container a {
  color: #2c8bd3;
}
`

  const shadowDiv = document.createElement("div")
  document.body.appendChild(shadowDiv)

  const shadowRoot = shadowDiv.attachShadow({ mode: "open" })

  const htmlContainer = document.createElement("div")
  htmlContainer.innerHTML = widgetHTML
  shadowRoot.appendChild(htmlContainer)

  const styleElement = document.createElement("style")
  styleElement.textContent = widgetCSS
  shadowRoot.appendChild(styleElement)

  const lottieScript = document.createElement("script")
  lottieScript.type = "module"
  lottieScript.src =
    "https://unpkg.com/@dotlottie/player-component@2.3.0/dist/dotlottie-player.mjs"
  shadowRoot.appendChild(lottieScript)

  const highlightStyle = document.createElement("link")
  highlightStyle.rel = "stylesheet"
  highlightStyle.href =
    "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/tokyo-night-dark.css"
  shadowRoot.appendChild(highlightStyle)

  const linkNode = document.createElement("link")
  linkNode.type = "text/css"
  linkNode.rel = "stylesheet"
  linkNode.href =
    "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap"
  document.head.appendChild(linkNode)

  const chatbotToggler = shadowRoot.querySelector(".chatbot-toggler")
  const closeBtn = shadowRoot.querySelector(".close-btn")
  const chatInput = shadowRoot.querySelector("#chat-input")
  const sendButton = shadowRoot.querySelector("#send-btn")
  const deleteButton = shadowRoot.querySelector("#delete-btn")
  const expandBtn = shadowRoot.querySelector(".expand-btn")
  const chatContainer = shadowRoot.querySelector(".chat-container")

  let userText = null
  const initialInputHeight = chatInput.scrollHeight
  let isExpanded = false

  let chatbotIconUrl
  if (icon === null && type !== null) {
    if (type === "dex") {
      chatbotToggler.style.backgroundColor = "rgba(0,0,0,0)"
    } else if (type === "robot") {
      chatbotToggler.style.backgroundColor = `var(--prime)`

      const lottiePlayers = chatbotToggler.querySelectorAll("dotlottie-player")
      lottiePlayers.forEach((player) => player.remove())

      const newLottiePlayer = document.createElement("dotlottie-player")
      newLottiePlayer.setAttribute(
        "src",
        "https://lottie.host/470142a6-196d-49dc-aeb6-1e5b73df327a/4lmfN0pVBW.json"
      )
      newLottiePlayer.setAttribute("background", "transparent")
      newLottiePlayer.setAttribute("speed", "1")
      newLottiePlayer.setAttribute("style", "width: 50px; height: 50px")
      newLottiePlayer.setAttribute("direction", "1")
      newLottiePlayer.setAttribute("mode", "normal")
      newLottiePlayer.setAttribute("loop", "")
      newLottiePlayer.setAttribute("autoplay", "")

      chatbotToggler.appendChild(newLottiePlayer)
    }
  } else if (icon !== null) {
    chatbotIconUrl = icon
    console.log(chatbotIconUrl)
    const lottiePlayers = chatbotToggler.querySelectorAll("dotlottie-player")
    lottiePlayers.forEach((player) => (player.style.display = "none"))

    chatbotToggler.style.background = `url(${chatbotIconUrl})`
    chatbotToggler.style.backgroundSize = "cover"
    chatbotToggler.style.backgroundPosition = "center"
  }

  const sentimentLottieMap = {
    Surprise:
      "https://lottie.host/e5fe29ae-ac0d-4028-a37c-b4ac99777b4e/ClmBvvIdd7.json",
    Happy:
      "https://lottie.host/5ead9118-8309-49be-b661-1ca06f982328/Q773uBZnnT.json",
    Sad: "https://lottie.host/784cf22a-a966-4d03-ae0e-7ce719368b49/9sMWyJ0HQZ.json",
    Scared:
      "https://lottie.host/bc678f60-f383-41ca-bd71-094a0ac31abb/RXaqzsxdNS.json",
    Fear: "https://lottie.host/784cf22a-a966-4d03-ae0e-7ce719368b49/9sMWyJ0HQZ.json",
    Nerd: "https://lottie.host/9ac1af7f-9d27-4c83-adbf-8d48d20993df/gN1jEA0Wcj.json",
  }

  const minimizeSvg = `<svg
width="21"
height="21"
viewBox="0 0 21 21"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path
  d="M3.5 12.25H8.75M8.75 12.25V17.5M8.75 12.25L2.625 18.375M17.5 8.75H12.25M12.25 8.75V3.5M12.25 8.75L18.375 2.625"
  stroke="white"
  stroke-linecap="round"
  stroke-linejoin="round"
/>
</svg>`

  const expandSvg = `<svg
width="21"
height="21"
viewBox="0 0 21 21"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path
  d="M7.53809 2.51245H2.51301V7.53753"
  stroke="white"
  stroke-width="1.54618"
  stroke-linecap="round"
  stroke-linejoin="round"
/>
<path
  d="M12.5631 17.5878H17.5881V12.5627"
  stroke="white"
  stroke-width="1.54618"
  stroke-linecap="round"
  stroke-linejoin="round"
/>
<path
  d="M2.51314 2.51245L8.37573 8.37504"
  stroke="white"
  stroke-width="1.54618"
  stroke-linecap="round"
  stroke-linejoin="round"
/>
<path
  d="M17.5881 17.5877L11.7255 11.7251"
  stroke="white"
  stroke-width="1.54618"
  stroke-linecap="round"
  stroke-linejoin="round"
/>
</svg>`

  const defaultText = `<div class="chat incoming">
  <div class="chat-content">
    <div class="chat-details">
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clip-path="url(#clip0_156_920)">
          <path
            d="M17.7297 22.2162H6.64865V26.6487H17.7297M17.7297 13.3514H6.64865V17.7838H17.7297M24.1789 9.82759L21.0541 12.9525L28.1122 19.9955L20.973 27.0853L24.1836 30.296L34.3513 20M35.4595 0.0540771C37.9195 0.0540771 39.8919 2.04867 39.8919 4.48651V35.5135C39.8919 36.6891 39.4249 37.8165 38.5937 38.6477C37.7624 39.479 36.635 39.946 35.4595 39.946H4.43243C3.25688 39.946 2.12947 39.479 1.29823 38.6477C0.466988 37.8165 0 36.6891 0 35.5135V4.48651C0 3.31096 0.466988 2.18355 1.29823 1.35231C2.12947 0.521064 3.25688 0.0540771 4.43243 0.0540771H35.4595Z"
            fill=${color}
          />
          <path
            d="M6.64865 13.3502L17.7297 13.3514V17.7838H6.64865V13.3502Z"
            fill="#FAFAFA"
          />
          <path
            d="M6.64865 22.2162H17.7297V26.6487H6.64865V22.2162Z"
            fill="#FAFAFA"
          />
          <path
            d="M20.973 27.0853L24.5946 23.5135L28.1122 19.9955L31.2771 23.1352L24.1836 30.296L20.973 27.0853Z"
            fill="#FAFAFA"
          />
          <path
            d="M24.1789 9.82759L34.4417 20.0206L31.2771 23.1352L26.2162 18.1146L21.0541 12.9525L24.1789 9.82759Z"
            fill="white"
          />
        </g>
        <defs>
          <clipPath id="clip0_156_920">
            <rect
              width="40"
              height="40"
              fill="white"
              transform="matrix(-1 0 0 1 40 0)"
            />
          </clipPath>
        </defs>
      </svg>
      <p>Hi there! How can I help you?</p>
    </div>
  </div>
</div>
`

  let isDefaultTextPresent = false

  const escapeHtml = (string) => {
    return string
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;")
  }

  // Function to escape HTML except inside markdown code blocks
  const escapeContent = (content) => {
    return content
      .split(/(```[\s\S]*?```|`[^`]*`)/)
      .map((segment, index) => {
        // Only escape content that is not inside a code block
        return index % 2 === 0 ? escapeHtml(segment) : segment
      })
      .join("")
  }

  const loadDataFromPrevMessagesArray = () => {
    if (prevMessages.length === 0) {
      chatContainer.innerHTML = defaultText
      isDefaultTextPresent = true
    } else {
      prevMessages.forEach((prevMessage) => {
        let escapedContent = escapeContent(prevMessage.content)

        if (prevMessage.role === "user") {
          const html = `<div class="chat-content">
                      <div class="chat-details">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20Z" fill="white"/>
                        <path d="M20.183 25H16.5V14.6104H20.2135C21.2585 14.6104 22.1581 14.8184 22.9123 15.2344C23.6665 15.647 24.2466 16.2406 24.6524 17.015C25.0616 17.7895 25.2662 18.7162 25.2662 19.7951C25.2662 20.8773 25.0616 21.8074 24.6524 22.5853C24.2466 23.3631 23.6631 23.9601 22.9022 24.376C22.1446 24.792 21.2382 25 20.183 25ZM18.6966 23.1179H20.0917C20.7411 23.1179 21.2873 23.0029 21.7303 22.773C22.1767 22.5396 22.5116 22.1794 22.7348 21.6924C22.9614 21.202 23.0747 20.5696 23.0747 19.7951C23.0747 19.0274 22.9614 18.4 22.7348 17.913C22.5116 17.426 22.1784 17.0675 21.7354 16.8375C21.2923 16.6075 20.7461 16.4925 20.0968 16.4925H18.6966V23.1179Z" fill="#070B13"/>
                      </svg>
                          <p>${escapedContent}</p>
                      </div>
                  </div>`
          const outgoingChatDiv = createChatElement(html, "outgoing")
          chatContainer.querySelector(".default-text")?.remove()
          chatContainer.appendChild(outgoingChatDiv)
        } else if (prevMessage.role === "assistant") {
          const html = `<div class="chat-content">
                    <div class="chat-details">
                      <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_156_920)">
                        <path
                          d="M17.7297 22.2162H6.64865V26.6487H17.7297M17.7297 13.3514H6.64865V17.7838H17.7297M24.1789 9.82759L21.0541 12.9525L28.1122 19.9955L20.973 27.0853L24.1836 30.296L34.3513 20M35.4595 0.0540771C37.9195 0.0540771 39.8919 2.04867 39.8919 4.48651V35.5135C39.8919 36.6891 39.4249 37.8165 38.5937 38.6477C37.7624 39.479 36.635 39.946 35.4595 39.946H4.43243C3.25688 39.946 2.12947 39.479 1.29823 38.6477C0.466988 37.8165 0 36.6891 0 35.5135V4.48651C0 3.31096 0.466988 2.18355 1.29823 1.35231C2.12947 0.521064 3.25688 0.0540771 4.43243 0.0540771H35.4595Z"
                          fill=${color}
                        />
                        <path
                          d="M6.64865 13.3502L17.7297 13.3514V17.7838H6.64865V13.3502Z"
                          fill="#FAFAFA"
                        />
                        <path
                          d="M6.64865 22.2162H17.7297V26.6487H6.64865V22.2162Z"
                          fill="#FAFAFA"
                        />
                        <path
                          d="M20.973 27.0853L24.5946 23.5135L28.1122 19.9955L31.2771 23.1352L24.1836 30.296L20.973 27.0853Z"
                          fill="#FAFAFA"
                        />
                        <path
                          d="M24.1789 9.82759L34.4417 20.0206L31.2771 23.1352L26.2162 18.1146L21.0541 12.9525L24.1789 9.82759Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_156_920">
                          <rect
                            width="40"
                            height="40"
                            fill="white"
                            transform="matrix(-1 0 0 1 40 0)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    <div class="typing-animation">
                        <div class="typing-dot" style="--delay: 0.2s"></div>
                        <div class="typing-dot" style="--delay: 0.3s"></div>
                        <div class="typing-dot" style="--delay: 0.4s"></div>
                    </div>
                </div>
            </div>`
          const incomingChatDiv = createChatElement(html, "incoming")
          chatContainer.appendChild(incomingChatDiv)

          const responseContainer = document.createElement("div")
          responseContainer.classList.add("response-container")

          responseContainer.innerHTML = marked.parse(escapedContent)

          incomingChatDiv
            .querySelector(".chat-details")
            .appendChild(responseContainer)

          const codeBlocks = responseContainer.querySelectorAll("pre code")
          codeBlocks.forEach((codeBlock) => {
            hljs.highlightElement(codeBlock)

            const languageMatch = codeBlock.className.match(/language-(\w+)/)
            if (languageMatch) {
              const language = languageMatch[1]

              const headerDiv = document.createElement("div")
              headerDiv.className = "code-header"
              headerDiv.textContent = `${language}`

              const copyBtn = document.createElement("button")
              copyBtn.className = "copy-code-btn"
              copyBtn.textContent = "Copy"
              copyBtn.onclick = () => {
                navigator.clipboard
                  .writeText(codeBlock.textContent)
                  .then(() => {
                    copyBtn.textContent = "Copied!"
                    setTimeout(() => (copyBtn.textContent = "Copy"), 1500)
                  })
              }

              codeBlock.parentNode.insertBefore(headerDiv, codeBlock)
              headerDiv.appendChild(copyBtn)
            }
          })

          const typingAnimation =
            incomingChatDiv.querySelector(".typing-animation")
          if (typingAnimation) {
            typingAnimation.remove()
          }
        }
      })
    }
    chatContainer.scrollTo(0, chatContainer.scrollHeight)
    if (chatContainer) {
      if (window.innerWidth <= 490) {
        chatContainer.style.height = "93%"
        chatContainer.style.width = "auto"
      } else if (window.innerWidth > 490) {
        if (size === "s" && !isExpanded) {
          chatContainer.style.height = "52vh"
          chatContainer.style.width = "28vw"
        } else if (size === "l") {
          if (!isExpanded) {
            chatContainer.style.height = "62vh"
            chatContainer.style.width = "30vw"
          } else {
            chatContainer.style.height = ""
            chatContainer.style.width = ""
          }
        }
      }
    } else {
      console.error("Chat container not found in the DOM")
    }
  }

  const createChatElement = (content, className) => {
    const chatDiv = document.createElement("div")
    chatDiv.classList.add("chat", className)
    chatDiv.innerHTML = content
    return chatDiv
  }

  const pollForCompletion = (url, runId, threadId, apiKey) => {
    return new Promise((resolve, reject) => {
      const pollInterval = setInterval(async () => {
        try {
          const response = await fetch(
            `${url}/checkRun?threadId=${threadId}&runId=${runId}`,
            {
              headers: {
                "x-api-key": apiKey,
              },
            }
          )
          const pollResponse = await response.json()

          if (pollResponse.data.status === "completed") {
            clearInterval(pollInterval)
            resolve(pollResponse.data)
          }
        } catch (error) {
          clearInterval(pollInterval)
          reject(error)
        }
      }, 1000)
    })
  }

  const analyzeSentiment = async (messageContent) => {
    const text_to_emotion = await (
      await fetch(`${url}/text_to_emotion`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": api_key,
        },
        redirect: "follow",
        body: JSON.stringify({
          text: messageContent,
        }),
      })
    ).json()
    if (!text_to_emotion.success) {
      console.log(widgetInitialise.message)
      return null
    }
    return text_to_emotion.data
  }

  const changeLottieThinking = (emotion) => {
    const newLottiePlayer = document.createElement("dotlottie-player")
    newLottiePlayer.setAttribute("src", sentimentLottieMap[emotion])
    newLottiePlayer.setAttribute("background", "transparent")
    newLottiePlayer.setAttribute("speed", "1")
    newLottiePlayer.setAttribute("style", "width: 50px; height: 50px")
    newLottiePlayer.setAttribute("direction", "1")
    newLottiePlayer.setAttribute("mode", "normal")
    newLottiePlayer.setAttribute("loop", "")
    newLottiePlayer.setAttribute("autoplay", "")

    const oldLottiePlayer = shadowRoot.querySelector(
      ".chatbot-toggler span:last-child dotlottie-player"
    )
    if (oldLottiePlayer) {
      oldLottiePlayer.classList.add("fade-out")
      oldLottiePlayer.parentNode.replaceChild(newLottiePlayer, oldLottiePlayer)
      newLottiePlayer.classList.add("fade-in")
    }
  }

  const handleSentimentAnalysis = async (messageContent) => {
    try {
      const sentimentResponse = await analyzeSentiment(messageContent)
      if (sentimentResponse) {
        const maxSentiment = Object.keys(sentimentResponse).reduce((a, b) =>
          sentimentResponse[a] >= sentimentResponse[b] ? a : b
        )

        if (
          sentimentLottieMap[maxSentiment] &&
          sentimentResponse[maxSentiment] >= 0.5
        ) {
          const newLottiePlayer = document.createElement("dotlottie-player")
          newLottiePlayer.setAttribute("src", sentimentLottieMap[maxSentiment])
          newLottiePlayer.setAttribute("background", "transparent")
          newLottiePlayer.setAttribute("speed", "1")
          newLottiePlayer.setAttribute("style", "width: 50px; height: 50px")
          newLottiePlayer.setAttribute("direction", "1")
          newLottiePlayer.setAttribute("mode", "normal")
          newLottiePlayer.setAttribute("loop", "")
          newLottiePlayer.setAttribute("autoplay", "")

          const oldLottiePlayer = shadowRoot.querySelector(
            ".chatbot-toggler span:last-child dotlottie-player"
          )
          if (oldLottiePlayer) {
            oldLottiePlayer.classList.add("fade-out")
            oldLottiePlayer.parentNode.replaceChild(
              newLottiePlayer,
              oldLottiePlayer
            )
            newLottiePlayer.classList.add("fade-in")
          }
        }
        console.log(sentimentResponse)
        console.log(maxSentiment)
      }
    } catch (error) {
      console.error("Error during sentiment analysis", error)
    }
  }
  let isLimitReached = false
  let isRequestedForIncrease = false

  const getChatResponse = async (incomingChatDiv) => {
    if (type === "dex") {
      changeLottieThinking("Nerd")
    }
    isLoading = true
    const API_URL = `${url}/addMessageAndRun`
    const responseContainer = document.createElement("div")
    responseContainer.classList.add("response-container")
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": api_key,
      },
      body: JSON.stringify({
        message: userText,
        threadId: threadId,
      }),
    }

    try {
      let messageContent = null
      if (takeEmail) {
        if (takeOTP) {
          const otpRegex = /^[0-9]{5}$/g
          if (!otpRegex.test(userText)) {
            messageContent = "Please enter a valid otp"
          } else {
            const response = await (
              await fetch(`${url}/verifyEmail`, {
                method: "POST",
                headers: {
                  "x-api-key": api_key,
                  "Content-Type": "application/json",
                  "x-fingerprint": visitorId,
                },
                body: JSON.stringify({
                  otp: userText,
                }),
              })
            ).json()
            if (!response.success) {
              console.log("error", response.message)
              messageContent = response.message
            } else {
              messageContent = "Email verified now you can chat normally"
              takeOTP = false
              takeEmail = false
            }
          }
          incomingChatDiv
            .querySelector(".chat-details")
            .appendChild(responseContainer)
          responseContainer.innerHTML = marked.parse(messageContent)
          const typingAnimation =
            incomingChatDiv.querySelector(".typing-animation")
          if (typingAnimation) {
            typingAnimation.remove()
          }
        } else {
          const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g
          if (!emailRegex.test(userText)) {
            messageContent = "Please enter a valid email"
          } else {
            const response = await (
              await fetch(`${url}/addEmail`, {
                method: "POST",
                headers: {
                  "x-api-key": api_key,
                  "Content-Type": "application/json",
                  "x-fingerprint": visitorId,
                },
                body: JSON.stringify({
                  email: userText,
                }),
              })
            ).json()
            if (!response.success) {
              console.log("error", response.message)
              messageContent = response.message
            } else {
              messageContent = "Email verified now you can chat normally"
              // takeOTP = true
              takeEmail = false
            }
          }
          incomingChatDiv
            .querySelector(".chat-details")
            .appendChild(responseContainer)
          responseContainer.innerHTML = marked.parse(messageContent)
          const typingAnimation =
            incomingChatDiv.querySelector(".typing-animation")
          if (typingAnimation) {
            typingAnimation.remove()
          }
        }
      } else {
        const response = await fetch(API_URL, requestOptions)
        incomingChatDiv
          .querySelector(".chat-details")
          .appendChild(responseContainer)
        const typingAnimation =
          incomingChatDiv.querySelector(".typing-animation")
        if (typingAnimation) {
          typingAnimation.remove()
        }
        let buffer = ""
        let message = ""
        if (!response.ok) {
          const data = await response.json()
          message += data.data
          if (data.data === "Inactive limit reached") {
            responseContainer.innerHTML = marked.parse(
              "Please enter your email to continue"
            )
            message = "Please enter your email to continue"
            takeEmail = true
          }
        } else {
          const reader = response.body.getReader()
          const decoder = new TextDecoder()
          while (true) {
            const { value, done } = await reader.read()
            if (done) break

            buffer += decoder.decode(value, { stream: true })

            let eolIndex
            while ((eolIndex = buffer.indexOf("\n\n")) >= 0) {
              const line = buffer.slice(0, eolIndex).trim()
              buffer = buffer.slice(eolIndex + 2)
              if (line.startsWith("data: ")) {
                const data = JSON.parse(line.substring(5))
                if (data.response) {
                  message += data.response
                  responseContainer.innerHTML = marked.parse(message)
                  chatContainer.scrollTo(0, chatContainer.scrollHeight)
                }
              }
            }
          }
          await (
            await fetch(`${url}/addAssistantMessage`, {
              method: "POST",
              headers: {
                "x-api-key": api_key,
                "Content-Type": "application/json",
                "x-fingerprint": visitorId,
              },
              body: JSON.stringify({
                message: message,
                threadId: threadId,
              }),
            })
          ).json()
        }
        // if (
        //   !response.success &&
        //   response.data !== "Inactive limit reached" &&
        //   response.data !== "Limit reached"
        // ) {
        //   console.log("error", response.message);
        //   return;
        // }
        // if (response.success) {
        //   const run = response.data;
        //   messageCountText = response.messageCountText;
        //   document.getElementById(
        //     "chat-input"
        //   ).placeholder = `Messages utilized: ${messageCountText}`;
        //   const { message } = await pollForCompletion(
        //     url,
        //     run,
        //     threadId,
        //     api_key
        //   );
        //   messageContent = message.content;
        // } else if (response.data === "Inactive limit reached") {
        //   messageContent = "Please enter your email to continue";
        //   takeEmail = true;
        // } else if (response.data === "Limit reached") {
        //   messageContent =
        //     "Uh oh! Looks like you have reached the message limit with Dex, want to chat more?";
        //   isLimitReached = true;
        //   isRequestedForIncrease = response.isRequestedForIncrease;
        // }
      }

      if (isLimitReached) {
        shadowRoot.querySelector(".typing-content").style.display = "none"
        shadowRoot.querySelector(".send-btn").style.display = "none"
        const increaseLimitBtn = document.createElement("button")
        increaseLimitBtn.className = "increase-limit-btn"
        increaseLimitBtn.textContent = "Request Limit Increase"
        increaseLimitBtn.style.backgroundColor = "#5E5BE6"
        increaseLimitBtn.style.borderRadius = "5px"
        increaseLimitBtn.style.color = "white"
        increaseLimitBtn.style.padding = "10px"
        increaseLimitBtn.style.marginTop = "10px"
        increaseLimitBtn.style.border = "none"
        increaseLimitBtn.style.cursor = "pointer"
        if (isRequestedForIncrease) {
          increaseLimitBtn.textContent = "Request Sent"
          increaseLimitBtn.disabled = true
          increaseLimitBtn.style.backgroundColor = "rgba(94, 91, 230, 0.21)"
          increaseLimitBtn.style.cursor = "not-allowed"
          increaseLimitBtn.style.border = "1px solid #5E5BE6"
          shadowRoot.querySelector(".typing-content").innerHTML =
            "Please check back after some time, you will get an email from us if your limit increase request gets approved"
          shadowRoot.querySelector(".typing-content").style.color =
            "var(--text-color)"
          shadowRoot.querySelector(".typing-content").style.fontSize = "14px"
          shadowRoot.querySelector(".typing-content").style.textAlign = "center"

          shadowRoot.querySelector(".typing-content").style.display = "block"
        }
        increaseLimitBtn.onclick = async () => {
          increaseLimitBtn.disabled = true
          const response = await (
            await fetch(`${url}/requestForIncrease`, {
              headers: {
                "x-api-key": api_key,
                "Content-Type": "application/json",
                "x-fingerprint": visitorId,
              },
            })
          ).json()
          if (!response.success) {
            increaseLimitBtn.textContent = response.message
          } else {
            increaseLimitBtn.textContent = "Request Sent"
            shadowRoot.querySelector(".typing-content").innerHTML =
              "Please check back after some time, you will get an email from us if your limit increase request gets approved"
            shadowRoot.querySelector(".typing-content").style.color =
              "var(--text-color)"
            shadowRoot.querySelector(".typing-content").style.fontSize = "14px"
            // text center
            shadowRoot.querySelector(".typing-content").style.textAlign =
              "center"
            shadowRoot.querySelector(".typing-content").style.display = "block"
          }
          isRequestedForIncrease = true
          increaseLimitBtn.style.backgroundColor = "rgba(94, 91, 230, 0.21)"
          increaseLimitBtn.style.cursor = "not-allowed"
          increaseLimitBtn.style.border = "1px solid #5E5BE6"
        }
        responseContainer.appendChild(increaseLimitBtn)
      }

      const codeBlocks = responseContainer.querySelectorAll("pre code")
      codeBlocks.forEach((codeBlock) => {
        hljs.highlightElement(codeBlock)

        const languageMatch = codeBlock.className.match(/language-(\w+)/)
        if (languageMatch) {
          const language = languageMatch[1]

          const headerDiv = document.createElement("div")
          headerDiv.className = "code-header"
          headerDiv.textContent = `${language}`

          const copyBtn = document.createElement("button")
          copyBtn.className = "copy-code-btn"
          copyBtn.textContent = "Copy"
          copyBtn.onclick = () => {
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
              copyBtn.textContent = "Copied!"
              setTimeout(() => (copyBtn.textContent = "Copy"), 1500)
            })
          }

          codeBlock.parentNode.insertBefore(headerDiv, codeBlock)
          headerDiv.appendChild(copyBtn)
        }
      })

      handleSentimentAnalysis(messageContent)

      if (type === "dex") {
        changeLottieThinking("Happy")
      }
    } catch (error) {
      console.error("Error while fetching chat response", error)
      const errorElement = document.createElement("p")
      errorElement.classList.add("error")
      errorElement.textContent = "Something went wrong! Please try again."
      responseContainer.appendChild(errorElement)
    } finally {
      chatContainer.scrollTo(0, chatContainer.scrollHeight)
      isDefaultTextPresent = false
      isLoading = false
      if (responseContainer) {
        if (window.innerWidth <= 490) {
          chatContainer.style.height = ""
          chatContainer.style.width = ""
        } else {
          if (size === "s" && !isExpanded) {
            responseContainer.style.width = "20rem"
          } else if (size === "l" && !isExpanded) {
            responseContainer.style.width = "24vw"
          }
        }
      } else {
        console.error("Chat container not found in the DOM")
      }
    }
  }

  const showTypingAnimation = () => {
    const html = `<div class="chat-content">
                    <div class="chat-details">
                      <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <g clip-path="url(#clip0_156_920)">
                        <path
                          d="M17.7297 22.2162H6.64865V26.6487H17.7297M17.7297 13.3514H6.64865V17.7838H17.7297M24.1789 9.82759L21.0541 12.9525L28.1122 19.9955L20.973 27.0853L24.1836 30.296L34.3513 20M35.4595 0.0540771C37.9195 0.0540771 39.8919 2.04867 39.8919 4.48651V35.5135C39.8919 36.6891 39.4249 37.8165 38.5937 38.6477C37.7624 39.479 36.635 39.946 35.4595 39.946H4.43243C3.25688 39.946 2.12947 39.479 1.29823 38.6477C0.466988 37.8165 0 36.6891 0 35.5135V4.48651C0 3.31096 0.466988 2.18355 1.29823 1.35231C2.12947 0.521064 3.25688 0.0540771 4.43243 0.0540771H35.4595Z"
                          fill=${color}
                        />
                        <path
                          d="M6.64865 13.3502L17.7297 13.3514V17.7838H6.64865V13.3502Z"
                          fill="#FAFAFA"
                        />
                        <path
                          d="M6.64865 22.2162H17.7297V26.6487H6.64865V22.2162Z"
                          fill="#FAFAFA"
                        />
                        <path
                          d="M20.973 27.0853L24.5946 23.5135L28.1122 19.9955L31.2771 23.1352L24.1836 30.296L20.973 27.0853Z"
                          fill="#FAFAFA"
                        />
                        <path
                          d="M24.1789 9.82759L34.4417 20.0206L31.2771 23.1352L26.2162 18.1146L21.0541 12.9525L24.1789 9.82759Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_156_920">
                          <rect
                            width="40"
                            height="40"
                            fill="white"
                            transform="matrix(-1 0 0 1 40 0)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                    <div class="typing-animation">
                        <div class="typing-dot" style="--delay: 0.2s"></div>
                        <div class="typing-dot" style="--delay: 0.3s"></div>
                        <div class="typing-dot" style="--delay: 0.4s"></div>
                    </div>
                </div>
            </div>`
    const incomingChatDiv = createChatElement(html, "incoming")
    chatContainer.appendChild(incomingChatDiv)

    chatContainer.scrollTo(0, chatContainer.scrollHeight)
    getChatResponse(incomingChatDiv)
  }

  const handleOutgoingChat = () => {
    if (isLoading) return
    userText = chatInput.value.trim()
    if (!userText) return

    userText = escapeContent(userText)

    chatInput.value = ""
    chatInput.style.height = `${initialInputHeight}px`

    const html = `<div class="chat-content">
                      <div class="chat-details">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20Z" fill="white"/>
                        <path d="M20.183 25H16.5V14.6104H20.2135C21.2585 14.6104 22.1581 14.8184 22.9123 15.2344C23.6665 15.647 24.2466 16.2406 24.6524 17.015C25.0616 17.7895 25.2662 18.7162 25.2662 19.7951C25.2662 20.8773 25.0616 21.8074 24.6524 22.5853C24.2466 23.3631 23.6631 23.9601 22.9022 24.376C22.1446 24.792 21.2382 25 20.183 25ZM18.6966 23.1179H20.0917C20.7411 23.1179 21.2873 23.0029 21.7303 22.773C22.1767 22.5396 22.5116 22.1794 22.7348 21.6924C22.9614 21.202 23.0747 20.5696 23.0747 19.7951C23.0747 19.0274 22.9614 18.4 22.7348 17.913C22.5116 17.426 22.1784 17.0675 21.7354 16.8375C21.2923 16.6075 20.7461 16.4925 20.0968 16.4925H18.6966V23.1179Z" fill="#070B13"/>
                      </svg>
                          <p>${userText}</p>
                      </div>
                  </div>`
    const outgoingChatDiv = createChatElement(html, "outgoing")
    chatContainer.querySelector(".default-text")?.remove()
    chatContainer.appendChild(outgoingChatDiv)
    chatContainer.scrollTo(0, chatContainer.scrollHeight)
    setTimeout(showTypingAnimation, 500)
  }

  deleteButton.addEventListener("click", async () => {
    const thread = await (
      await fetch(`${url}/genThread`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": api_key,
          "x-fingerprint": visitorId,
        },
      })
    ).json()
    console.log(thread)
    if (!thread.success) {
      console.log(thread.message)
      return
    }
    threadId = thread.data
    prevMessages = []
    loadDataFromPrevMessagesArray()
    isDefaultTextPresent = true
  })

  chatInput.addEventListener("input", () => {
    chatInput.style.height = `${initialInputHeight}px`
    chatInput.style.height = `${chatInput.scrollHeight}px`
  })
  const viewportMeta = document.querySelector('meta[name="viewport"]')
  const originalContent = viewportMeta.getAttribute("content")

  chatInput.addEventListener("click", () => {
    const content =
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"
    viewportMeta.setAttribute("content", content)
  })
  chatInput.addEventListener("blur", () => {
    viewportMeta.setAttribute("content", originalContent)
  })

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
      e.preventDefault()
      if (isLoading) return
      handleOutgoingChat()
    }
  })

  loadDataFromPrevMessagesArray()
  sendButton.addEventListener("click", handleOutgoingChat)

  const modalBackdrop = document.createElement("div")
  modalBackdrop.classList.add("modal-backdrop")
  shadowRoot.appendChild(modalBackdrop)

  const handleCloseChatbot = () => {
    htmlContainer.classList.remove("show-chatbot")
    const chatbot = shadowRoot.querySelector(".chatbot")
    if (isExpanded) {
      isExpanded = false
      expandBtn.innerHTML = expandSvg
      if (htmlContainer.classList.contains("modal-open")) {
        htmlContainer.classList.remove("modal-open")
        chatbot.classList.remove("expanded")
      }
    }
  }

  closeBtn.addEventListener("click", handleCloseChatbot)

  const handleClickOutside = (event) => {
    if (isExpanded && !chatContainer.contains(event.target)) {
      handleCloseChatbot()
      manageChatbotState("close")
    }
    if (chatContainer) {
      if (window.innerWidth <= 490) {
        chatContainer.style.height = "93%"
        chatContainer.style.width = "auto"
      } else if (window.innerWidth > 490) {
        if (size === "s" && !isExpanded) {
          chatContainer.style.height = "52vh"
          chatContainer.style.width = "28vw"
        } else if (size === "l") {
          if (!isExpanded) {
            chatContainer.style.height = "62vh"
            chatContainer.style.width = "30vw"
          } else {
            chatContainer.style.height = ""
            chatContainer.style.width = ""
          }
        }
      }
    } else {
      console.error("Chat container not found in the DOM")
    }
  }

  expandBtn.addEventListener("click", () => {
    isExpanded = !isExpanded
    expandBtn.innerHTML = isExpanded ? minimizeSvg : expandSvg
    htmlContainer.classList.toggle("modal-open")
    const chatbot = shadowRoot.querySelector(".chatbot")
    chatbot.classList.toggle("expanded")

    if (isExpanded) {
      modalBackdrop.addEventListener("click", handleClickOutside)
      chatbot.classList.add("expanded")
      chatbot.classList.remove("collapsed")
      const responseContainers = shadowRoot.querySelectorAll(
        ".response-container"
      )
      if (window.innerWidth <= 490) {
        chatContainer.style.height = ""
        chatContainer.style.width = ""
        responseContainers.forEach((container) => {
          container.style.width = ""
        })
      } else {
        if (size === "l" && isExpanded) {
          chatContainer.style.height = ""
          chatContainer.style.width = ""
          responseContainers.forEach((container) => {
            container.style.width = isExpanded ? "" : "24vw"
          })
        } else if (size === "s" && isExpanded) {
          chatContainer.style.height = ""
          chatContainer.style.width = ""
          responseContainers.forEach((container) => {
            container.style.width = isExpanded ? "" : "20rem"
          })
        }
      }
    } else {
      modalBackdrop.removeEventListener("click", handleClickOutside)
      // chatbot.classList.add("collapsed");
      chatbot.classList.remove("expanded")
      if (chatContainer) {
        if (window.innerWidth <= 490) {
          chatContainer.style.height = "93%"
          chatContainer.style.width = "auto"
        } else if (window.innerWidth > 490) {
          if (size === "s" && !isExpanded) {
            chatContainer.style.height = "52vh"
            chatContainer.style.width = "28vw"
          } else if (size === "l") {
            if (!isExpanded) {
              chatContainer.style.height = "62vh"
              chatContainer.style.width = "30vw"
            } else {
              chatContainer.style.height = ""
              chatContainer.style.width = ""
            }
          }
        }
      } else {
        console.error("Chat container not found in the DOM")
      }
    }
  })

  const manageChatbotState = (state) => {
    const chatbot = shadowRoot.querySelector(".chatbot")
    if (state === "close") {
      chatbot.classList.remove("open", "semi-closed")
      chatbot.classList.add("close")
      if (window.innerWidth <= 490) {
        document.body.style.overflow = ""
      }
    } else if (state === "open") {
      chatbot.classList.remove("close", "semi-closed")
      chatbot.classList.add("open")
      if (window.innerWidth <= 490) {
        document.body.style.overflow = "hidden"
      }
      chatContainer.scrollTo(0, chatContainer.scrollHeight)
    } else if (state === "semi-closed") {
      chatbot.classList.remove("open", "close")
      chatbot.classList.add("semi-closed")
    }

    if (chatContainer) {
      if (window.innerWidth <= 490) {
        chatContainer.style.height = "93%"
        chatContainer.style.width = "auto"
      } else if (window.innerWidth > 490) {
        if (size === "s" && !isExpanded) {
          chatContainer.style.height = "52vh"
          chatContainer.style.width = "28vw"
        } else if (size === "l") {
          if (!isExpanded) {
            chatContainer.style.height = "62vh"
            chatContainer.style.width = "30vw"
          } else {
            chatContainer.style.height = ""
            chatContainer.style.width = ""
          }
        }
      }
    } else {
      console.error("Chat container not found in the DOM")
    }
  }

  chatContainer.scrollTo(0, chatContainer.scrollHeight)
  if (isDefaultTextPresent && window.matchMedia("(min-width: 768px)").matches) {
    manageChatbotState("semi-closed")
    htmlContainer.classList.add("show-chatbot")
  } else {
    manageChatbotState("close")
  }

  closeBtn.addEventListener("click", () => {
    manageChatbotState("close")
  })

  chatInput.addEventListener("focus", () => {
    manageChatbotState("open")
  })

  chatbotToggler.addEventListener("click", () => {
    htmlContainer.classList.toggle("show-chatbot")
    const chatbot = shadowRoot.querySelector(".chatbot")
    if (chatbot.classList.contains("close")) {
      if (
        isDefaultTextPresent &&
        window.matchMedia("(min-width: 768px)").matches
      ) {
        manageChatbotState("semi-closed")
      } else {
        manageChatbotState("open")
      }
    } else {
      manageChatbotState("close")
    }
  })

  const heart = shadowRoot.querySelector(".heart")
  heart.addEventListener("click", function () {
    if (!this.classList.contains("liked")) {
      this.classList.add("is_animating")
    }
    this.classList.toggle("liked")
  })

  heart.addEventListener("animationend", function () {
    this.classList.remove("is_animating")
  })
}
