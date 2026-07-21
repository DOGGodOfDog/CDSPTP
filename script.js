// =========================
// App State
// =========================

const appState = {
    isLogin: false,
    currentUser: null,
    isGuest: true,

    database:{
        connected:false,
        server:null,
        database:null,
        user:null
    }
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
btnLoginOpen.addEventListener("click", () => {
    LoginModal.style.display = "flex";
});

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

function enableApplication(){

    console.log("Application Enabled");

}
function loginSuccess(username){

    appState.isLogin = true;
    appState.currentUser = username;
    appState.isGuest = false;

    hideModal(LoginModal);

    enableApplication();

}
function loginFail(message){

    alert(message);

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

            //alert("Login Success");
            loginSuccess(username);

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
// Initialize Application
// =========================

window.addEventListener("DOMContentLoaded", () => {

    if (!appState.isLogin) {
        
        lockApplication();

        showModal(LoginModal);
    }

});