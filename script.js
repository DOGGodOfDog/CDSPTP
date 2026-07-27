// =========================
// App State
// =========================

const appState = {
    // Session
    auth:{
        isLogin:false,
        currentUser: null,
        currentUserAD: null,
        isGuest: true
    },
    // Application
    workspace:{
        currentPage:"design",
        chatHistory:[],
        sqlResult:null,
        history:[]
    },
    // Database
    databaseContext:{
        connected:false,
        type:null,
        server:null,
        database:null
    },

    isDatabaseConnected: false
};
function lockApplication(){

    pageDesign.style.display = "none";
    pageAssistant.style.display = "none";
    pageHistory.style.display = "none";

}
// =========================
// Menu
// =========================

const btnDesign = document.getElementById("btnDesign");
const btnAssistant = document.getElementById("btnAssistant");
const btnHistory = document.getElementById("btnHistory");

// =========================
// Page
// =========================

const pageDesign = document.getElementById("page-design");
const pageAssistant = document.getElementById("page-assistant");
const pageHistory = document.getElementById("page-history");

// =========================
// Function
// =========================

function hideAllPages() {

    pageDesign.style.display = "none";
    pageAssistant.style.display = "none";
    pageHistory.style.display = "none";

}

function removeActiveMenu() {

    btnDesign.classList.remove("active");
    btnAssistant.classList.remove("active");
    btnHistory.classList.remove("active");

}

function showPage(page, button){

    hideAllPages();

    removeActiveMenu();

    page.style.display = "flex";

    button.classList.add("active");


    if(page === pageDesign){
        appState.workspace.currentPage = "design";
    }
    else if(page === pageAssistant){
        appState.workspace.currentPage = "assistant";
    }
    else if(page === pageHistory){
        appState.workspace.currentPage = "history";
    }
}
function showModal(modal){

    modal.style.display = "flex";

}


function hideModal(modal){

    modal.style.display = "none";

}
function checkLogin(){

    if(appState.isLogin){
        return true;
    }

    showModal(LoginModal);

    return false;

}

// =========================
// Database Design
// =========================


btnDesign.onclick = function () {

    if(!checkLogin()){
        return;
    }

    showPage(pageDesign, btnDesign);

}

// =========================
// SQL Assistant
// =========================

btnAssistant.onclick = function () {

    if(!checkLogin()){
        return;
    }

    showPage(pageAssistant, btnAssistant);

}

// =========================
// History
// =========================

btnHistory.onclick = function () {

    if(!checkLogin()){
        return;
    }

    showPage(pageHistory, btnHistory);
}
// =========================
// Connection db poup
// =========================

const btnConnect = document.getElementById("btnConnect");
const connectModal = document.getElementById("connectModal");
const closeModal = document.getElementById("closeModal");
const btnCancel = document.getElementById("btnCancel");

const chatPanelDesign = document.getElementById('chatPanelDesign');
const chatPanelAssistant = document.getElementById('chatPanelAssistant');
const chatContentDesign = document.querySelector("#chatPanelDesign .chat-content");

const workflowDesign = document.getElementById('workflowDesign');
const workflowAssistant = document.getElementById('workflowAssistant');
const sqlPreviewDesign = document.getElementById('sqlPreviewDesign');
const sqlPreviewAssistant = document.getElementById('sqlPreviewAssistant');

const chatInput = document.getElementById('chatInput');
const btnGenerate = document.getElementById('btnGenerate');

function updateDatabaseStatus(isConnected) {

    const statusDot = document.getElementById("statusDot");
    const statusText = document.getElementById("statusText");

    if (isConnected) {
        statusDot.textContent = "🟢";
        statusText.textContent = "Connected";
    } else {
        statusDot.textContent = "🔴";
        statusText.textContent = "Disconnected";
    }
}

// เปิด Popup
btnConnect.addEventListener("click", () => {
    if(!checkLogin()){
        return;
    }
    showModal(connectModal);
    //connectModal.style.display = "flex";
});

// ปิด Popup (ปุ่ม X)
closeModal.addEventListener("click", () => {
    connectModal.style.display = "none";
});
// ปิด Popup (ปุ่ม X)
btnCancel.addEventListener("click", () => {
    connectModal.style.display = "none";
});
//ปุ่ม Connect
btnConnectDatabase.addEventListener("click", async()=>{


    const type = document.getElementById("dbType").value;
    const server = document.getElementById("server").value;
    const database = document.getElementById("database").value;
    const username = document.getElementById("dbUsername").value;
    const password = document.getElementById("dbPassword").value;


    const response = await fetch("http://localhost:3000/api/database/connect",{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({

            type:type,
            server:server,
            database:database,
            username:username,
            password:password

        })

    });


    const result = await response.json();


    if(result.success){

        appState.databaseContext = result.context;
        console.log(appState.databaseContext);
        alert("Database Connected");
        connectModal.style.display = "none"
    }
    else{
        alert(result.message);
    }
    if(result.success){
        appState.databaseContext = result.context;
        updateDatabaseStatus(true);
    }
    else{
        updateDatabaseStatus(false);
    }

});

// คลิกพื้นที่นอก Popup เพื่อปิด
window.addEventListener("click", (event) => {
    if (event.target === connectModal) {
        connectModal.style.display = "none";
    }
});
// =========================
// Login Open btn
// =========================
//const btnLoginOpen = document.getElementById("btnLoginOpen");
const LoginModal = document.getElementById("LoginModal");
const closeLoginModal = document.getElementById("closeLoginModal");
const btnCancelLogin = document.getElementById("btnCancelLogin");

// เปิด Popup
//btnLoginOpen.addEventListener("click", () => {
//    LoginModal.style.display = "flex";
//});

// ปิด Popup (ปุ่ม X)
closeLoginModal.addEventListener("click", () => {
    LoginModal.style.display = "none";
});
// ปิด Popup (ปุ่ม X)
btnCancelLogin.addEventListener("click", () => {
    LoginModal.style.display = "none";
});

// คลิกพื้นที่นอก Popup เพื่อปิด
window.addEventListener("click", (event) => {
    if (event.target === LoginModal) {
        LoginModal.style.display = "none";
    }
});

//ปุ่ม login
const btnMenuAction = document.getElementById("btnMenuAction");

btnMenuAction.addEventListener("click", async()=>{

    dropdownMenu.style.display = "none";


    if(appState.isLogin){


        try{

            const response = await fetch(
                "http://localhost:3000/api/logout",
                {
                    method:"POST",

                    headers:{
                        "Content-Type":"application/json"
                    },

                    body:JSON.stringify({

                        username: appState.currentUserAD
                        
                    })
                }
            );


            const result = await response.json();


            if(result.success){

                console.log(result.message);

            }
            else{

                console.log(result.message);

            }


        }
        catch(error){

            console.error("Logout Error",error);

        }


        // Reset Frontend State

        appState.isLogin = false;
        appState.currentUser = null;
        appState.isGuest = true;


        clearSession();

        updateUserMenu();


    }
    else{

        showModal(LoginModal);

    }

});
function enableApplication(){

    console.log("Application Enabled");

}
function loginSuccess(userName){

    appState.isLogin = true;
    appState.currentUser = userName;
    appState.isGuest = false;

    saveSession(userName);

    hideModal(LoginModal);

    enableApplication();

    updateUserMenu();

}
function loginFail(message){

    alert(message);

}
// =========================
// Session Management
// =========================

function saveSession(userName){

    const session = {

        userName:userName,

        expireTime:
            Date.now() + (8 * 60 * 60 * 1000)
            //Date.now() + (60 * 60 * 1000) // 1 ชั่วโมง
            //Date.now() + (60 * 1000) 

    };


    localStorage.setItem(
        "dbcopilot_session",
        JSON.stringify(session)
    );

}


function checkSession(){

    const session =
        localStorage.getItem("dbcopilot_session");


    if(!session){
        return false;
    }


    const data = JSON.parse(session);


    if(Date.now() > data.expireTime){

        localStorage.removeItem(
            "dbcopilot_session"
        );

        return false;

    }


    loginSuccess(data.userName);

    return true;

}
function monitorSession(){

    setInterval(()=>{


        const session =
            localStorage.getItem("dbcopilot_session");


        if(!session){

            return;

        }


        const data = JSON.parse(session);


        if(Date.now() > data.expireTime){


            console.log("Session Expired");


            clearSession();


            appState.isLogin = false;
            appState.currentUser = null;
            appState.isGuest = true;


            lockApplication();

            updateUserMenu();


            showModal(LoginModal);


        }


    },5000); // ตรวจทุก 5 วินาที


}


function clearSession(){

    localStorage.removeItem(
        "dbcopilot_session"
    );

}

const btnLogin = document.getElementById("btnLogin");

btnLogin.addEventListener("click", async () => {

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;


    try {

        const response = await fetch("http://localhost:3000/api/login", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                username: username,
                password: password

            })

        });


        const result = await response.json();


        if(result.success){

            alert("Login Success");
            loginSuccess(result.user_name);
            appState.currentUserAD = result.user_name_ad;
            console.log("Login API Result:", result);
            console.log("Sending Logout:", appState.currentUserAD);
            document.getElementById("currentUser").textContent = appState.currentUser;
            // เก็บข้อมูล User ไว้ก่อน
            //localStorage.setItem(
            //   "dbcopilot_login",
            //   JSON.stringify(result)
            //);
            //appState.isLogin = true;
            //appState.currentUser = username;


            // ปิด Popup Login
            //document.getElementById("LoginModal").style.display = "none";
        }
        else{
            loginFail(result.message);
            //alert(result.message);

        }


    }
    catch(error){
        console.error(error);
        alert("Cannot connect to server");

    }

});
// =========================
// User menu
// =========================
//Dropdown user
const btnUserMenu = document.getElementById("btnUserMenu");
const dropdownMenu = document.getElementById("dropdownMenu");

btnUserMenu.addEventListener("click",()=>{

    dropdownMenu.style.display =
        dropdownMenu.style.display === "block"
        ? "none"
        : "block";

});

function updateUserMenu(){

    const loginStatus = document.getElementById("loginStatus");
    const currentUser = document.getElementById("currentUser");
    const btnMenuAction = document.getElementById("btnMenuAction");

    if(appState.isLogin){

        loginStatus.textContent = "🟢";
        currentUser.textContent = appState.currentUser;

        btnMenuAction.textContent = "Logout";

    }
    else{

        loginStatus.textContent = "🔴";
        currentUser.textContent = "Guest";

        btnMenuAction.textContent = "Login";
        lockApplication();
    }

}
// ============================================================
// Chat rendering helpers
// ============================================================
function escapeHtml(str){
  return str.replace(/[&<>"']/g, c => ({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[c]));
}

function renderContent(text){
  const escaped = escapeHtml(text);
  let html = escaped.replace(/```(\w*)\n?([\s\S]*?)```/g, (m, lang, code) => {
    return `<pre>${code.trim()}</pre>`;
  });
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  return html;
}



function panelFor(page){

    if(page === "design"){
        return document.querySelector("#chatPanelDesign .chat-content");
    }

    if(page === "assistant"){
        return document.querySelector("#chatPanelAssistant .chat-content");
    }

}
function workflowFor(page){ return null;}
function sqlPreviewFor(page){ return null;}

function addMessage(page, role, text, autoScroll = true){
  const panel = panelFor(page);

  const div = document.createElement('div');

  div.className = 'message ' + (role === 'user' ? 'user' : 'ai');

  const strong = document.createElement('strong');
  strong.textContent = role === 'user' ? 'คุณ' : 'DB Copilot';

  const p = document.createElement('p');
  p.innerHTML = renderContent(text);

  div.appendChild(strong);
  div.appendChild(p);

  panel.appendChild(div);


  if(autoScroll){

      setTimeout(()=>{
          panel.scrollTop = panel.scrollHeight;
      },50);

  }
}

function addTypingBubble(page){
  const panel = panelFor(page);

  const div = document.createElement('div');

  div.className = 'message ai';
  div.id = 'typingBubble-' + page;

  div.innerHTML = `
    <strong>DB Copilot</strong>
    <div class="typing-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;

  panel.appendChild(div);

  panel.scrollTop = panel.scrollHeight;
}
function removeTypingBubble(page){
  const el = document.getElementById('typingBubble-' + page);
  if (el) el.remove();
}

function resetWorkflow(page){

    const workflow = workflowFor(page);

    if(!workflow){
        return;
    }

    workflow.querySelectorAll('li').forEach(li=>{
        li.className='';
    });

}
async function animateWorkflow(page){
  const workflow = workflowFor(page);

    if(!workflow){
        return;
    }
}

function renderHistory(){
  if (appState.workspace.chatHistory.length === 0){
    historyList.innerHTML = '<p class="empty-hint">ยังไม่มีประวัติการสนทนา</p>';
    return;
  }
  historyList.innerHTML = '';
  [...appState.workspace.chatHistory].reverse().forEach(item => {
    const div = document.createElement('div');
    div.className = 'history-item';
    div.innerHTML = `
      <div class="h-q">💬 ${escapeHtml(item.question)}</div>
      <div class="h-meta">${item.page === 'design' ? '🗄 Database Design' : '💬 SQL Assistant'} · ${item.time}</div>
    `;
    historyList.appendChild(div);
  });
}
// ============================================================
// AI call
// ============================================================

async function askAI(page, userText) {
    const controller = new AbortController();
    // 1. ตั้งเวลา Timeout ไว้ที่ 3 นาที (180,000 ms)
    const timeoutId = setTimeout(() => controller.abort(), 180000); 

    try {
        const response = await fetch(
            "http://localhost:3000/api/agent/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                signal: controller.signal,
                body: JSON.stringify({
                    message: userText,
                    page,
                    connection: appState.databaseContext
                })
            }
        );

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message || "เกิดข้อผิดพลาดจากฝั่ง Server");
        }

        return data;

    } catch (err) {
        // ดักจับกรณีโดนตัดเวลา (Timeout 3 นาที) ชัดเจน
        if (err.name === 'AbortError') {
            console.error('❌ Request timed out (เกินเวลา 3 นาทีที่กำหนด)');
            return {
                success: false,
                answer: "ขออภัย AI ใช้เวลาประมวลผลนานเกินไป (Timeout 3 นาที)",
                sql: null
            };
        } else {
            console.error('❌ askAI Error:', err.message || err);
            return {
                success: false,
                answer: err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ AI",
                sql: null
            };
        }

    } finally {
        // 2. เคลียร์ timeout ออกเสมอ ไม่ว่าจะสำเร็จหรือล้มเหลว
        clearTimeout(timeoutId);
    }
}
// ============================================================
// Send flow (footer input drives whichever page is active)
// ============================================================
async function handleSend() {

    const text = chatInput.value.trim();

    if (!text) return;

    let page = appState.workspace.currentPage;


    if (page === "history")
    {
        setActivePage("design");
        page = "design";
    }

    // แสดงข้อความผู้ใช้
    addMessage(page, "user", text, false);

    chatInput.value = "";

    btnGenerate.disabled = true;
    chatInput.disabled = true;

    resetWorkflow(page);

    //const workflowPromise = animateWorkflow(page);

    addTypingBubble(page);

    try {

        const response = await askAI(page, text);

        removeTypingBubble(page);

        // แสดงคำตอบ AI
        addMessage(page, "ai", response.answer, true);

        // SQL Preview
        if (response.sql && sqlPreviewFor(page)) {
            sqlPreviewFor(page).textContent = response.sql;
        }

        // History
        appState.workspace.chatHistory.push({
            page,
            question: text,
            answer: response.answer,
            time: new Date().toLocaleTimeString("th-TH", {
                hour: "2-digit",
                minute: "2-digit"
            })
        });

    }
    catch (err) {

        removeTypingBubble(page);

        addMessage(page, "ai", "เกิดข้อผิดพลาด");

        console.error(err);

    }
    finally {

        btnGenerate.disabled = false;
        chatInput.disabled = false;
        chatInput.focus();

    }

}
btnGenerate.addEventListener("click", handleSend);

chatInput.addEventListener("keydown", e => {

    if (e.key === "Enter") {

        e.preventDefault();

        handleSend();

    }

});
// =========================
// Initialize Application
// =========================

window.addEventListener("DOMContentLoaded", () => {

    const sessionValid = checkSession();

    monitorSession();

    if(!sessionValid){
        lockApplication();
        showModal(LoginModal);
        updateUserMenu();
    }

});