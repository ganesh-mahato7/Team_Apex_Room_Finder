const loginContainer = document.getElementById("loginContainer");
const registerContainer = document.getElementById("registerContainer");
const showRegister = document.getElementById("showRegister");
const showLogin = document.getElementById("showLogin");
const togglePassword = document.getElementById("togglePassword");
const loginPassword = document.getElementById("loginPassword");
const roleButtons = document.querySelectorAll(".role-select button");

// Switch to Register
showRegister.onclick = () => {
    loginContainer.classList.add("hidden");
    registerContainer.classList.remove("hidden");
};

// Switch to Login
showLogin.onclick = () => {
    registerContainer.classList.add("hidden");
    loginContainer.classList.remove("hidden");
};

// Toggle password visibility
togglePassword.onclick = () => {
    loginPassword.type = loginPassword.type === "password" ? "text" : "password";
};

// Role button toggle
roleButtons.forEach(btn => {
    btn.onclick = () => {
        roleButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
    };
});

// Success alerts
document.getElementById("loginForm").onsubmit = (e) => {
    e.preventDefault();
    alert("Login successful!");
};

document.getElementById("registerForm").onsubmit = (e) => {
    e.preventDefault();
    alert("Registration successful!");
};
