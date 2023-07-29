var userNameInputSign = document.querySelector('#userName');
var userEmailInputSign = document.querySelector('#userEmailSign');
var userPassInputSign = document.querySelector('#userPassSign');

var userEmailInputLogin = document.querySelector('#userEmailLogin');
var userPassInputLogin = document.querySelector('#userPassLogin');

var errorMessage = document.querySelector('#errorMessage');

var loginBtn = document.querySelector('#loginBtn');
var signUpBtn = document.querySelector('#signUpBtn');
var logoutBtn = document.querySelector('#logoutBtn');

var userNameRegex = /^[a-z]{2}([a-z\s]*[a-z]{2})?$/i;
var userEmailRegex = /^[\w\-\.]+@(\w+\-?\w+\.){1,3}[\w-]{2,4}$/i;
// Password must contain at least two uppercase, two lowercase, two digits, two special characters and with no whitespaces
var userPassRegex = /^(?=(?:.*?[0-9]){2})(?=(?:.*?[a-z]){2})(?=(?:.*?[A-Z]){2})(?=(?:.*?[^a-zA-Z0-9]){2})(?!.*\s).{8,30}$/;

var currentPage = location.href.substring(location.href.lastIndexOf('/') + 1);

var errorMessageIcon = `<span class=""><i class="fa-solid fa-circle-exclamation fs-5 align-text-bottom"></i></span> `;

// Check localstorage for existing users.
var users = (localStorage.getItem('todousers')) ? JSON.parse(localStorage.getItem('todousers')) : [];



// Check which page is loaded.
if (currentPage == 'index.html') {
    // Login Page
    if (checkUserLoggedIn()) {
        location.replace('home.html');
    } else {
        loginBtn.addEventListener('click', login)
        userEmailInputLogin.addEventListener('input', function () {
            errorMessage.classList.replace('d-flex', 'd-none');
        })
        userPassInputLogin.addEventListener('input', function () {
            errorMessage.classList.replace('d-flex', 'd-none');
        })
    }
} else if (currentPage == 'signup.html') {
    // Sign Up page
    if (checkUserLoggedIn()) {
        location.replace('home.html');
    } else {
        signUpBtn.addEventListener('click', signUp);
        userNameInputSign.addEventListener('input', function () {
            errorMessage.classList.replace('d-flex', 'd-none');
        })
        userEmailInputSign.addEventListener('input', function () {
            errorMessage.classList.replace('d-flex', 'd-none');
        })
        userPassInputSign.addEventListener('input', function () {
            errorMessage.classList.replace('d-flex', 'd-none');
        })
    }
} else if (currentPage == 'home.html') {
    if (checkUserLoggedIn()) {
        document.querySelector('#msgContainer').innerHTML = sessionStorage.getItem('userName');
        logoutBtn.addEventListener('click', logout)
    } else {
        location.replace('index.html');
    }
}

function signUp() {
    if (checkSignUpEmpty()) {
        showErrorMessage("All fields are required.")
    } else {
        if (validateFields(userNameInputSign, userNameRegex)) {
            if (validateFields(userEmailInputSign, userEmailRegex)) {
                if (validateFields(userPassInputSign, userPassRegex)) {
                    if (checkEmailExists(userEmailInputSign)) {
                        showErrorMessage("Email already exists.");
                    } else {
                        addAccount();
                    }
                } else {
                    showErrorMessage("Password must contain at least two uppercase, two lowercase, two digits, two special characters and with no whitespaces.");
                }
            } else {
                showErrorMessage("Your Email is not valid.");
            }
        } else {
            showErrorMessage("Your Name is not valid. It must contain at least two letters and does not end with whitespace");
        }
    }

}

function addAccount() {
    var user = {
        userName: userNameInputSign.value,
        userEmail: userEmailInputSign.value,
        userPass: userPassInputSign.value
    }
    users.push(user);
    localStorage.setItem('todousers', JSON.stringify(users));
    location.replace('index.html');
}

function login() {
    if (checkLoginEmpty()) {
        showErrorMessage("All fields are required.");
    } else {
        var accountIndex = checkEmailExists(userEmailInputLogin);

        if (accountIndex) {
            if (users[accountIndex - 1].userPass == userPassInputLogin.value) {
                sessionStorage.setItem('userName', users[accountIndex - 1].userName);
                location.replace('home.html');
            } else {
                showErrorMessage("Incorrect password");
            }
        } else {
            showErrorMessage("Email doesn't exist");
        }
    }
}

function logout() {
    sessionStorage.removeItem('userName');
    location.replace('index.html');
}

function checkUserLoggedIn() {
    if (sessionStorage.getItem('userName') != null) {
        return true;
    }
}

function checkSignUpEmpty() {
    if (userNameInputSign.value == "" || userEmailInputSign.value == "" || userPassInputSign.value == "") {
        return true;
    }
}

function checkLoginEmpty() {
    if (userEmailInputLogin.value == "" || userPassInputLogin.value == "") {
        return true;
    }
}

function checkEmailExists(field) {
    for (let i = 0; i < users.length; i++) {
        if (field.value.toLowerCase() == users[i].userEmail.toLowerCase()) {
            return i + 1;
        }
    }
}

function validateFields(field, regex) {
    if (regex.test(field.value)) {
        return true;
    } else {
        return false;
    }
}

function showErrorMessage(message) {
    errorMessage.classList.replace('d-none', 'd-flex');
    errorMessage.innerHTML = errorMessageIcon + message;
}