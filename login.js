// Callback function to handle Google Sign-In response
function handleCredentialResponse(response) {
    console.log("Encoded JWT ID token: " + response.credential);
    // TODO: Send the token to your backend for verification and session creation

    let userEmail = ''; // 이메일 변수 초기화

    // For now, simulate successful login on the client-side
    // Decode JWT token (optional, for demonstration)
    try {
        const base64Url = response.credential.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const userData = JSON.parse(jsonPayload);
        console.log("User data:", userData);
        // You can use userData.name, userData.email, userData.picture etc.
        if (userData.email) {
            userEmail = userData.email; // 이메일 저장
            localStorage.setItem('userEmail', userEmail); // localStorage에 이메일 저장
        }
        
    } catch (e) {
        console.error("Error decoding JWT token:", e);
        // Optionally show an error message to the user
        const loginError = document.getElementById('loginError');
        if(loginError) loginError.textContent = '로그인 처리 중 오류가 발생했습니다.';
        return; // Stop further processing if token decoding fails
    }

    // Assuming successful verification (replace with actual backend verification)
    console.log('Google Sign-In successful');
    sessionStorage.setItem('isLoggedIn', 'true');
    // Redirect to the main page
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', () => {
    // No need for the previous form submission logic
    // Google Sign-In button is rendered automatically by the library
    const loginError = document.getElementById('loginError');
    // You might want to add logic here to handle potential errors during initialization
    // or display messages to the user.
}); 
