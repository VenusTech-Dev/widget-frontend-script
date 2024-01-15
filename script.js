import { marked } from "https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js";
import hljs from "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/es/highlight.min.js";
export const initialise = async (api_key) => {
  const url =
    "https://dev-dex-widget-backend-6bc8bcc9eb98.herokuapp.com/api/v1";
  const widgetInitialise = await (
    await fetch(`${url}/initialise`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": api_key,
      },
    })
  ).json();
  console.log(widgetInitialise);
  if (!widgetInitialise.success) {
    console.log(widgetInitialise.message);
    return;
  }
  const { position, color, size, icon } = widgetInitialise.data;
  console.log(position, color, size, icon);
  let threadId = localStorage.getItem("threadId");
  if (!threadId) {
    const thread = await (
      await fetch(`${url}/genThread`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": api_key,
        },
      })
    ).json();
    console.log(thread);
    if (!thread.success) {
      console.log(thread.message);
      return;
    }
    localStorage.setItem("threadId", thread.data);
    threadId = thread.data;
  }
  console.log(threadId);
  let isLoading = false;
  const getMessages = await (
    await fetch(`${url}/getMessages?threadId=${threadId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": api_key,
      },
    })
  ).json();
  if (!getMessages.success) {
    return;
  }
  let prevMessages = getMessages.data;
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
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M5.77973 7.22027H2.17838V8.66081H5.77973M5.77973 4.33919H2.17838V5.77973H5.77973M7.87571 3.19396L6.86013 4.20954L9.15059 6.5L6.86013 8.79046L7.87571 9.81324L11.1818 6.5M11.5419 0.0175667C12.3414 0.0175667 12.9824 0.66581 12.9824 1.45811V11.5419C12.9824 11.9239 12.8307 12.2904 12.5605 12.5605C12.2904 12.8307 11.9239 12.9824 11.5419 12.9824H1.45811C1.07605 12.9824 0.709643 12.8307 0.43949 12.5605C0.169336 12.2904 0.0175647 11.9239 0.0175647 11.5419V1.45811C0.0175647 1.07605 0.169336 0.709645 0.43949 0.439491C0.709643 0.169337 1.07605 0.0175667 1.45811 0.0175667H11.5419Z"
        fill="url(#paint0_linear_11_8)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_11_8"
          x1="12.9824"
          y1="12.9824"
          x2="-0.47052"
          y2="0.73261"
          gradientUnits="userSpaceOnUse"
        >
          <stop stop-color="#D2934E" />
          <stop offset="1" stop-color="#777BFA" />
        </linearGradient>
      </defs>
    </svg>
    <p class="powered-text">Powered by DevDex.ai</p>
  </div>
  <div class="typing-content">
    <div class="typing-textarea">
      <textarea
        id="chat-input"
        placeholder="How to deploy my application?"
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
</div>`;

  const widgetCSS = `@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@400;500&display=swap");

:root {
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
  background: var(--prime);
  transition: all 0.2s ease;
}

.modal-open .entire-chatbot {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

body.show-chatbot .chatbot-toggler {
  transform: rotate(360deg);
}

.chatbot-toggler span {
  color: var(--text-color);
  position: absolute;
}

.chatbot-toggler span:last-child,
body.show-chatbot .chatbot-toggler span:first-child {
  opacity: 0;
}

body.show-chatbot .chatbot-toggler span:last-child {
  opacity: 1;
}

* {
  margin: 0;
  box-sizing: border-box;
}

.widget * {
  font-family: "Poppins", sans-serif;
}

.chatbot {
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
  transition: all 0.1s ease;
}

body.show-chatbot .chatbot {
  opacity: 1;
  pointer-events: auto;
  transform: scale(1);
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
  height: 32rem;
  width: 27rem;
  padding-bottom: 110px;
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

header p {
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
  width: 20rem;
  word-wrap: break-word;
  padding: 0 0 0 25px;
}

.response-container > ul,
ol {
  white-space: pre-wrap;
  color: var(--text-color);
  word-break: break-word;
  padding: 0 0 0 25px;
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
  padding-top: 12px;
  padding-bottom: 12px;
}

.powered-text {
  color: var(--placeholder-color);
  padding-left: 5px;
  font-size: small;
}

.typing-container {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  padding: 2.7rem 1.25rem 1.25rem 1.25rem;
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
  .chatbot-toggler {
    right: 20px;
    bottom: 20px;
  }

  .chatbot {
    right: 0;
    bottom: 0;
    height: 100%;
    border-radius: 0;
    width: 100%;
  }

  .chatbot header span {
    display: block;
  }
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(5px);
  z-index: 1000;
  display: none;
}

.modal-open .chatbot {
  position: initial;
  top: 5%;
  bottom: 5%;
  transform: translate(-50%, -50%);
  max-width: 900px;
  height: calc(100% - 64px);
  width: calc(100% - 64px);
  z-index: 1010;
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  padding-bottom: 60px;
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
}`;

  document.body.insertAdjacentHTML("beforeend", widgetHTML);

  const lottieScript = document.createElement("script");
  lottieScript.type = "module";
  lottieScript.src =
    "https://unpkg.com/@dotlottie/player-component@latest/dist/dotlottie-player.mjs";

  document.body.appendChild(lottieScript);

  const styleSheet = document.createElement("style");
  styleSheet.innerText = widgetCSS;
  document.head.appendChild(styleSheet);

  const highlightStyle = document.createElement("link");
  highlightStyle.rel = "stylesheet";
  highlightStyle.href =
    "https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.9.0/build/styles/tokyo-night-dark.css";
  document.head.appendChild(highlightStyle);

  const chatbotToggler = document.querySelector(".chatbot-toggler");
  const closeBtn = document.querySelector(".close-btn");
  const chatInput = document.querySelector("#chat-input");
  const sendButton = document.querySelector("#send-btn");
  const chatContainer = document.querySelector(".chat-container");
  const deleteButton = document.querySelector("#delete-btn");
  const expandBtn = document.querySelector(".expand-btn");

  let userText = null;
  const initialInputHeight = chatInput.scrollHeight;

  const sentimentLottieMap = {
    Angry:
      "https://lottie.host/4ce0cd03-e3dc-4dbc-b3ee-353c166c6c0c/jqMzjHpY3A.json",
    Surprise:
      "https://lottie.host/e5fe29ae-ac0d-4028-a37c-b4ac99777b4e/ClmBvvIdd7.json",
    Happy:
      "https://lottie.host/5ead9118-8309-49be-b661-1ca06f982328/Q773uBZnnT.json",
    Sad: "https://lottie.host/784cf22a-a966-4d03-ae0e-7ce719368b49/9sMWyJ0HQZ.json",
    Scared:
      "https://lottie.host/bc678f60-f383-41ca-bd71-094a0ac31abb/RXaqzsxdNS.json",
    Fear: "https://lottie.host/1ce2708c-19c5-4c5b-903e-6119c5344b54/auAxVmT9XO.json",
  };

  const copySvg = `<svg
width="16"
height="16"
viewBox="0 0 16 16"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path
  d="M10.6667 2.66667H12C12.3536 2.66667 12.6928 2.80714 12.9428 3.05719C13.1929 3.30724 13.3333 3.64638 13.3333 4V13.3333C13.3333 13.687 13.1929 14.0261 12.9428 14.2761C12.6928 14.5262 12.3536 14.6667 12 14.6667H4C3.64638 14.6667 3.30724 14.5262 3.05719 14.2761C2.80714 14.0261 2.66666 13.687 2.66666 13.3333V4C2.66666 3.64638 2.80714 3.30724 3.05719 3.05719C3.30724 2.80714 3.64638 2.66667 4 2.66667H5.33333M6 1.33333H10C10.3682 1.33333 10.6667 1.63181 10.6667 2V3.33333C10.6667 3.70152 10.3682 4 10 4H6C5.63181 4 5.33333 3.70152 5.33333 3.33333V2C5.33333 1.63181 5.63181 1.33333 6 1.33333Z"
  stroke="white"
  stroke-linecap="round"
  stroke-linejoin="round"
/>
</svg>`;

  const checkSvg = `<svg
width="16"
height="16"
viewBox="0 0 16 16"
fill="none"
xmlns="http://www.w3.org/2000/svg"
>
<path
  d="M13.3333 4L6.00001 11.3333L2.66667 8"
  stroke="white"
  stroke-linecap="round"
  stroke-linejoin="round"
/>
</svg>`;

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
</svg>`;

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
</svg>`;

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
`;
  let isDefaultTextPresent = false;

  const loadDataFromPrevMessagesArray = () => {
    if (prevMessages.length === 0) {
      chatContainer.innerHTML = defaultText;
      isDefaultTextPresent = true;
    } else {
      prevMessages.forEach((prevMessage) => {
        if (prevMessage.role === "user") {
          const html = `<div class="chat-content">
                      <div class="chat-details">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20Z" fill="white"/>
                        <path d="M20.183 25H16.5V14.6104H20.2135C21.2585 14.6104 22.1581 14.8184 22.9123 15.2344C23.6665 15.647 24.2466 16.2406 24.6524 17.015C25.0616 17.7895 25.2662 18.7162 25.2662 19.7951C25.2662 20.8773 25.0616 21.8074 24.6524 22.5853C24.2466 23.3631 23.6631 23.9601 22.9022 24.376C22.1446 24.792 21.2382 25 20.183 25ZM18.6966 23.1179H20.0917C20.7411 23.1179 21.2873 23.0029 21.7303 22.773C22.1767 22.5396 22.5116 22.1794 22.7348 21.6924C22.9614 21.202 23.0747 20.5696 23.0747 19.7951C23.0747 19.0274 22.9614 18.4 22.7348 17.913C22.5116 17.426 22.1784 17.0675 21.7354 16.8375C21.2923 16.6075 20.7461 16.4925 20.0968 16.4925H18.6966V23.1179Z" fill="#070B13"/>
                      </svg>
                          <p>${prevMessage.content}</p>
                      </div>
                  </div>`;
          const outgoingChatDiv = createChatElement(html, "outgoing");
          chatContainer.querySelector(".default-text")?.remove();
          chatContainer.appendChild(outgoingChatDiv);
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
                <span >${copySvg}</span>
            </div>`;
          const incomingChatDiv = createChatElement(html, "incoming");
          chatContainer.appendChild(incomingChatDiv);

          const copyButton = incomingChatDiv.querySelector("span");
          copyButton.addEventListener("click", () => copyResponse(copyButton));

          const responseContainer = document.createElement("div");
          responseContainer.classList.add("response-container");

          responseContainer.innerHTML = marked.parse(prevMessage.content);

          incomingChatDiv
            .querySelector(".chat-details")
            .appendChild(responseContainer);

          const codeBlocks = responseContainer.querySelectorAll("pre code");
          codeBlocks.forEach((codeBlock) => {
            hljs.highlightElement(codeBlock);

            const languageMatch = codeBlock.className.match(/language-(\w+)/);
            if (languageMatch) {
              const language = languageMatch[1];

              const headerDiv = document.createElement("div");
              headerDiv.className = "code-header";
              headerDiv.textContent = `${language}`;

              const copyBtn = document.createElement("button");
              copyBtn.className = "copy-code-btn";
              copyBtn.textContent = "Copy";
              copyBtn.onclick = () => {
                navigator.clipboard
                  .writeText(codeBlock.textContent)
                  .then(() => {
                    copyBtn.textContent = "Copied!";
                    setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
                  });
              };

              codeBlock.parentNode.insertBefore(headerDiv, codeBlock);
              headerDiv.appendChild(copyBtn);
            }
          });

          const typingAnimation =
            incomingChatDiv.querySelector(".typing-animation");
          if (typingAnimation) {
            typingAnimation.remove();
          }
        }
      });
    }
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
  };

  const createChatElement = (content, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv;
  };

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
          );
          const pollResponse = await response.json();

          if (pollResponse.data.status === "completed") {
            clearInterval(pollInterval);
            resolve(pollResponse.data);
          }
        } catch (error) {
          clearInterval(pollInterval);
          reject(error);
        }
      }, 1000);
    });
  };

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
    ).json();
    if (!text_to_emotion.success) {
      console.log(widgetInitialise.message);
      return null;
    }
    return text_to_emotion.data;
  };

  const handleSentimentAnalysis = async (messageContent) => {
    try {
      const sentimentResponse = await analyzeSentiment(messageContent);
      if (sentimentResponse) {
        const maxSentiment = Object.keys(sentimentResponse).reduce((a, b) =>
          sentimentResponse[a] >= sentimentResponse[b] ? a : b
        );

        if (sentimentLottieMap[maxSentiment]) {
          const newLottiePlayer = document.createElement("dotlottie-player");
          newLottiePlayer.setAttribute("src", sentimentLottieMap[maxSentiment]);
          newLottiePlayer.setAttribute("background", "transparent");
          newLottiePlayer.setAttribute("speed", "1");
          newLottiePlayer.setAttribute("style", "width: 50px; height: 50px");
          newLottiePlayer.setAttribute("direction", "1");
          newLottiePlayer.setAttribute("mode", "normal");
          newLottiePlayer.setAttribute("loop", "");
          newLottiePlayer.setAttribute("autoplay", "");

          const oldLottiePlayer = document.querySelector(
            ".chatbot-toggler span:last-child dotlottie-player"
          );
          if (oldLottiePlayer) {
            oldLottiePlayer.parentNode.replaceChild(
              newLottiePlayer,
              oldLottiePlayer
            );
          }
        }
        console.log(sentimentResponse);
        console.log(maxSentiment);
      }
    } catch (error) {
      console.error("Error during sentiment analysis", error);
    }
  };

  const getChatResponse = async (incomingChatDiv) => {
    isLoading = true;
    const API_URL = `${url}/addMessageAndRun`;
    const responseContainer = document.createElement("div");
    responseContainer.classList.add("response-container");

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
    };

    try {
      const response = await (await fetch(API_URL, requestOptions)).json();
      if (!response.success) {
        console.log("error", response.message);
        return;
      }
      const run = response.data;
      const { message } = await pollForCompletion(url, run, threadId, api_key);

      const messageContent = message.content;
      responseContainer.innerHTML = marked.parse(messageContent);

      incomingChatDiv
        .querySelector(".chat-details")
        .appendChild(responseContainer);

      const codeBlocks = responseContainer.querySelectorAll("pre code");
      codeBlocks.forEach((codeBlock) => {
        hljs.highlightElement(codeBlock);

        const languageMatch = codeBlock.className.match(/language-(\w+)/);
        if (languageMatch) {
          const language = languageMatch[1];

          const headerDiv = document.createElement("div");
          headerDiv.className = "code-header";
          headerDiv.textContent = `${language}`;

          const copyBtn = document.createElement("button");
          copyBtn.className = "copy-code-btn";
          copyBtn.textContent = "Copy";
          copyBtn.onclick = () => {
            navigator.clipboard.writeText(codeBlock.textContent).then(() => {
              copyBtn.textContent = "Copied!";
              setTimeout(() => (copyBtn.textContent = "Copy"), 1500);
            });
          };

          codeBlock.parentNode.insertBefore(headerDiv, codeBlock);
          headerDiv.appendChild(copyBtn);
        }
      });

      handleSentimentAnalysis(messageContent);

      const typingAnimation =
        incomingChatDiv.querySelector(".typing-animation");
      if (typingAnimation) {
        typingAnimation.remove();
      }
    } catch (error) {
      const errorElement = document.createElement("p");
      errorElement.classList.add("error");
      errorElement.textContent = "Something went wrong! Please try again.";
      responseContainer.appendChild(errorElement);
    } finally {
      chatContainer.scrollTo(0, chatContainer.scrollHeight);
      isDefaultTextPresent = false;
      isLoading = false;
    }
  };

  const copyResponse = (copyBtn) => {
    const reponseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(reponseTextElement.textContent);
    copyBtn.innerHTML = `${checkSvg}`;
    setTimeout(() => (copyBtn.innerHTML = `${copySvg}`), 1000);
  };

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
                <span >${copySvg}</span>
            </div>`;
    const incomingChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);

    const copyButton = incomingChatDiv.querySelector("span");
    copyButton.addEventListener("click", () => copyResponse(copyButton));

    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
  };

  const handleOutgoingChat = () => {
    if (isLoading) return;
    userText = chatInput.value.trim();
    if (!userText) return;

    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;

    const html = `<div class="chat-content">
                      <div class="chat-details">
                      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M40 20C40 31.0457 31.0457 40 20 40C8.9543 40 0 31.0457 0 20C0 8.9543 8.9543 0 20 0C31.0457 0 40 8.9543 40 20Z" fill="white"/>
                        <path d="M20.183 25H16.5V14.6104H20.2135C21.2585 14.6104 22.1581 14.8184 22.9123 15.2344C23.6665 15.647 24.2466 16.2406 24.6524 17.015C25.0616 17.7895 25.2662 18.7162 25.2662 19.7951C25.2662 20.8773 25.0616 21.8074 24.6524 22.5853C24.2466 23.3631 23.6631 23.9601 22.9022 24.376C22.1446 24.792 21.2382 25 20.183 25ZM18.6966 23.1179H20.0917C20.7411 23.1179 21.2873 23.0029 21.7303 22.773C22.1767 22.5396 22.5116 22.1794 22.7348 21.6924C22.9614 21.202 23.0747 20.5696 23.0747 19.7951C23.0747 19.0274 22.9614 18.4 22.7348 17.913C22.5116 17.426 22.1784 17.0675 21.7354 16.8375C21.2923 16.6075 20.7461 16.4925 20.0968 16.4925H18.6966V23.1179Z" fill="#070B13"/>
                      </svg>
                          <p>${userText}</p>
                      </div>
                  </div>`;
    const outgoingChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
  };

  deleteButton.addEventListener("click", async () => {
    const thread = await (
      await fetch(`${url}/genThread`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": api_key,
        },
      })
    ).json();
    console.log(thread);
    if (!thread.success) {
      console.log(thread.message);
      return;
    }
    localStorage.setItem("threadId", thread.data);
    threadId = thread.data;
    prevMessages = [];
    loadDataFromPrevMessagesArray();
    isDefaultTextPresent = true;
  });

  chatInput.addEventListener("input", () => {
    chatInput.style.height = `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
  });

  chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey && window.innerWidth > 800) {
      e.preventDefault();
      if (isLoading) return;
      handleOutgoingChat();
    }
  });

  loadDataFromPrevMessagesArray();
  sendButton.addEventListener("click", handleOutgoingChat);

  const modalBackdrop = document.createElement("div");
  modalBackdrop.classList.add("modal-backdrop");
  document.body.appendChild(modalBackdrop);

  const handleCloseChatbot = () => {
    document.body.classList.remove("show-chatbot");
    if (isExpanded) {
      isExpanded = false;
      expandBtn.innerHTML = expandSvg;
      if (document.body.classList.contains("modal-open")) {
        document.body.classList.remove("modal-open");
      }
    }
  };

  closeBtn.addEventListener("click", handleCloseChatbot);

  const handleClickOutside = (event) => {
    if (isExpanded && !chatContainer.contains(event.target)) {
      handleCloseChatbot();
    }
  };

  let isExpanded = false;

  expandBtn.addEventListener("click", () => {
    isExpanded = !isExpanded;
    expandBtn.innerHTML = isExpanded ? minimizeSvg : expandSvg;
    document.body.classList.toggle("modal-open");

    if (isExpanded) {
      modalBackdrop.addEventListener("click", handleClickOutside);
    } else {
      modalBackdrop.removeEventListener("click", handleClickOutside);
    }
  });

  const manageChatbotState = (state) => {
    const chatbot = document.querySelector(".chatbot");
    if (state === "close") {
      chatbot.classList.remove("open", "semi-closed");
      chatbot.classList.add("close");
    } else if (state === "open") {
      chatbot.classList.remove("close", "semi-closed");
      chatbot.classList.add("open");
    } else if (state === "semi-closed") {
      chatbot.classList.remove("open", "close");
      chatbot.classList.add("semi-closed");
    }
  };

  chatContainer.scrollTo(0, chatContainer.scrollHeight);
  if (isDefaultTextPresent) {
    manageChatbotState("semi-closed");
    document.body.classList.add("show-chatbot");
  } else {
    manageChatbotState("open");
  }

  closeBtn.addEventListener("click", () => {
    manageChatbotState("close");
  });

  chatInput.addEventListener("focus", () => {
    manageChatbotState("open");
  });

  chatbotToggler.addEventListener("click", () => {
    document.body.classList.toggle("show-chatbot");
    const chatbot = document.querySelector(".chatbot");
    if (chatbot.classList.contains("close")) {
      if (isDefaultTextPresent) {
        manageChatbotState("semi-closed");
      } else {
        manageChatbotState("open");
      }
    } else {
      manageChatbotState("close");
    }
  });

  const heart = document.querySelector(".heart");
  heart.addEventListener("click", function () {
    if (!this.classList.contains("liked")) {
      this.classList.add("is_animating");
    }
    this.classList.toggle("liked");
  });

  heart.addEventListener("animationend", function () {
    this.classList.remove("is_animating");
  });
};
