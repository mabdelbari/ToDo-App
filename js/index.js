// Signup page fields and signup button
var userNameInputSign = document.querySelector('#userName');
var userEmailInputSign = document.querySelector('#userEmailSign');
var userPassInputSign = document.querySelector('#userPassSign');
var signUpBtn = document.querySelector('#signUpBtn');
// Login page fields and login button
var userEmailInputLogin = document.querySelector('#userEmailLogin');
var userPassInputLogin = document.querySelector('#userPassLogin');
var loginBtn = document.querySelector('#loginBtn');
// Error Message if field's value is not valid
var errorMessageIcon = `<span class=""><i class="fa-solid fa-circle-exclamation fs-5 align-text-bottom"></i></span> `;
var errorMessage = document.querySelector('#errorMessage');
// home page fields and buttons
var todoInput = document.querySelector('#todoField');
var logoutBtn = document.querySelector('#logoutBtn');
var submitBtn = document.querySelector('#submitBtn');
var searchInput = document.querySelector('#searchInput');
var todoContainer = document.querySelector('#todoContainer');
var deleteBtns;
var editBtns;

var todoIndex;

//Regex for Validation
var userNameRegex = /^[a-z]{2,}(\s?[a-z]{2,})*$/i;
var userEmailRegex = /^[\w\-\.]+@(\w+\-?\w+\.){1,3}[\w-]{2,4}$/i;
// Password must contain at least two uppercase, two lowercase, two digits, two special characters and with no whitespaces
var userPassRegex = /^(?=(?:.*?[0-9]){2})(?=(?:.*?[a-z]){2})(?=(?:.*?[A-Z]){2})(?=(?:.*?[^a-zA-Z0-9]){2})(?!.*\s).{8,30}$/;

// To get the current page url
var currentPage = location.href.substring(location.href.lastIndexOf('/') + 1);

// Check localstorage for existing users.
var users = (localStorage.getItem('todousers')) ? JSON.parse(localStorage.getItem('todousers')) : [];

// Check which page is loaded.
if (currentPage == 'index.html' || currentPage == '') {
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
    // Home Page
    if (checkUserLoggedIn() && localStorage.getItem("todousers") != null) {
        var loggedUserIndex = sessionStorage.getItem('userIndex');
        displayToDos(loggedUserIndex);
        document.querySelector('#loggedUserName').innerHTML = users[loggedUserIndex].userName;
        logoutBtn.addEventListener('click', logout);
        submitBtn.addEventListener('click', submitToDo);
        searchInput.addEventListener('input', searchToDo);

        todoInput.addEventListener('input', function () {
            errorMessage.classList.replace('d-flex', 'd-none');
        })

    } else {
        location.replace('index.html');
    }
}

function submitToDo() {
    if (todoInput.value) {
        if (submitBtn.innerHTML == "Submit") {
            addTodo(todoInput.value);
        } else {
            updateTodo(todoInput.value);
        }

        localStorage.setItem('todousers', JSON.stringify(users));
        displayToDos(loggedUserIndex);
        todoInput.value = '';

    } else {
        showErrorMessage("You need to fill up the field with an activity to do..")
    }
}

function addTodo(newToDo) {
    users[loggedUserIndex].todoList.push(newToDo);
}

function deleteToDo(index) {
    users[loggedUserIndex].todoList.splice(index, 1);
    localStorage.setItem('todousers', JSON.stringify(users));
    displayToDos(loggedUserIndex);
}

function updateTodo(newToDO) {
    users[loggedUserIndex].todoList.splice(todoIndex, 1, newToDO);
    submitBtn.innerHTML = "Submit";
}

function editToDo(index) {
    todoIndex = index;
    todoInput.value = users[loggedUserIndex].todoList[todoIndex];
    submitBtn.innerHTML = "Update";
}

function searchToDo() {
    var todoContainerContent = ``;

    for (let i = 0; i < users[loggedUserIndex].todoList.length; i++) {
        if (users[loggedUserIndex].todoList[i].toLowerCase().startsWith(searchInput.value.toLowerCase())) {
            todoContainerContent += `
            <div
                class="bg-white text-black d-flex justify-content-between align-items-center py-2 px-3 border border-1 rounded">
                <p class="m-0">${users[loggedUserIndex].todoList[i]}</p>
                <div class="d-flex column-gap-3">
                    <button class="bg-transparent border-0 text-danger fs-4" data-delete-target-index="${i}"><i
                        class="fa-solid fa-trash-can"></i></button>
                    <button class="bg-transparent border-0 text-success fs-4" data-edit-target-index="${i}"><i
                        class="fa-solid fa-pen-to-square"></i></button>
                </div>
            </div>
            `
        }
    }
    todoContainer.innerHTML = todoContainerContent;

    deleteBtns = Array.from(document.querySelectorAll('#todoContainer button[data-delete-target-index]'));
    editBtns = Array.from(document.querySelectorAll('#todoContainer button[data-edit-target-index]'));
    for (let i = 0; i < deleteBtns.length && i < editBtns.length; i++) {
        deleteBtns[i].addEventListener('click', function () {
            deleteToDo(this.getAttribute('data-delete-target-index'));
        })

        editBtns[i].addEventListener('click', function () {
            editToDo(this.getAttribute('data-edit-target-index'));
        })
    }
}

function displayToDos(userIndex) {
    var todoContainerContent = ``;

    for (let i = 0; i < users[userIndex].todoList.length; i++) {
        todoContainerContent += `
        <div
            class="bg-white text-black d-flex justify-content-between align-items-center py-2 px-3 border border-1 rounded">
            <p class="m-0">${users[loggedUserIndex].todoList[i]}</p>
            <div class="d-flex column-gap-3">
                    <button class="bg-transparent border-0 text-danger fs-4" data-delete-target-index="${i}"><i
                        class="fa-solid fa-trash-can"></i></button>
                    <button class="bg-transparent border-0 text-success fs-4" data-edit-target-index="${i}"><i
                        class="fa-solid fa-pen-to-square"></i></button>
            </div>
        </div>
        `
    }
    todoContainer.innerHTML = todoContainerContent;

    deleteBtns = Array.from(document.querySelectorAll('#todoContainer button[data-delete-target-index]'));
    editBtns = Array.from(document.querySelectorAll('#todoContainer button[data-edit-target-index]'));
    for (let i = 0; i < deleteBtns.length && i < editBtns.length; i++) {
        deleteBtns[i].addEventListener('click', function () {
            deleteToDo(this.getAttribute('data-delete-target-index'));
        })

        editBtns[i].addEventListener('click', function () {
            editToDo(this.getAttribute('data-edit-target-index'));
        })
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
        userPass: userPassInputSign.value,
        todoList: []
    }
    users.push(user);
    localStorage.setItem('todousers', JSON.stringify(users));
    location.replace('index.html');
}

function login() {
    if (checkLoginEmpty()) {
        showErrorMessage("All fields are required.");
    } else {
        if (validateFields(userEmailInputLogin, userEmailRegex)) {
            var accountIndex = checkEmailExists(userEmailInputLogin);

            if (accountIndex) {
                if (users[accountIndex - 1].userPass == userPassInputLogin.value) {
                    sessionStorage.setItem('userIndex', accountIndex - 1);
                    location.replace('home.html');
                } else {
                    showErrorMessage("Incorrect password");
                }
            } else {
                showErrorMessage("Email doesn't exist");
            }
        } else {
            showErrorMessage("Your Email is not valid");
        }

    }
}

function logout() {
    sessionStorage.removeItem('userIndex');
    location.replace('index.html');
}

function checkUserLoggedIn() {
    if (sessionStorage.getItem('userIndex') != null) {
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