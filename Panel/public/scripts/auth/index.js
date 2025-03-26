document.getElementById("loginForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const authSecret = document.getElementById("authSecret").value;

    fetch(`${backendUrl}/account/api/oauth/token`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            grant_type: "password",
            token_type: "eg1",
            username: "epicgames@epicgames.live",
            password: authSecret
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.access_token) {
            console.log("Access Token:", data.access_token);
            localStorage.setItem("access_token", data.access_token);
        } else {
            console.log("Access token not found in the response");
        }
    })
    .catch(error => {
        console.error("Error:", error);
    });
});