function validateForm() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    var confirmPassword = document.getElementById("confirm_password").value;
    var errorText = document.getElementById("errorText");
    errorText.innerHTML = "";
    if (password !== confirmPassword) {
        errorText.innerHTML = "Passwords do not match.";
        return false;
    }
    checkExistingUser(username, function(userExists) {
        if (userExists) {
            errorText.innerHTML = "Username already exists.";
        } else {
            document.getElementById("registerForm").submit();
        }
    })
    return false;
}
function checkExistingUser(username, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/check_user', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    var data = JSON.stringify({ "username": username });
    xhr.onload = function() {
        if (xhr.status === 200) {
            var response = JSON.parse(xhr.responseText);
            callback(response.exists);
        } else {
            console.error('Request failed:', xhr.status);
            callback(false);
        }
    };
    xhr.send(data);
}