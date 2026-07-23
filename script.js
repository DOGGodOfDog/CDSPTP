// =========================
// App State
// =========================

const appState = {
    // Session
    auth:{
        isLogin:false,
        currentUser: null,
        isGuest: true
    },
    // Application
    workspace:{
        currentPage:null,
        chatHistory:[],
        sqlResult:null
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

    page.style.display = "block";

    button.classList.add("active");

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

btnMenuAction.addEventListener("click",()=>{

    dropdownMenu.style.display = "none";

    if(appState.isLogin){

        appState.isLogin = false;
        appState.currentUser = null;
        appState.isGuest = true;

        hideModal(dropdownMenu);

        clearSession();

        updateUserMenu();

    }
    else{

        hideModal(dropdownMenu);

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
            //Date.now() + (60 * 60 * 1000) // 1 ชั่วโมง
            Date.now() + (60 * 1000) 

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