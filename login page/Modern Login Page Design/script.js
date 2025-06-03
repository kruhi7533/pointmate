const container = document.getElementById("container");
const registerBtn = document.getElementById("register");
const loginBtn = document.getElementById("login");
const signupForm = document.getElementById("signupForm");
const loginForm = document.getElementById("loginForm");

// Toggle between signup and login forms
registerBtn.addEventListener("click", () => {
  container.classList.add("active");
});

loginBtn.addEventListener("click", () => {
  container.classList.remove("active");
});

// Function to check if user exists
async function checkUserExists(email) {
  try {
    const response = await fetch(`http://localhost:3000/api/check-user/${email}`);
    const data = await response.json();
    return data.exists;
  } catch (error) {
    console.error("Error checking user:", error);
    return false;
  }
}

// Function to redirect to landing page
function redirectToLandingPage() {
  window.location.href = "http://localhost:8080";
}

// Handle signup form submission
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("signupName").value;
  const email = document.getElementById("signupEmail").value.trim().toLowerCase();
  const password = document.getElementById("signupPassword").value;
  const errorDiv = document.getElementById("signupError");

  try {
    // Check if user already exists
    const userExists = await checkUserExists(email);
    if (userExists) {
      errorDiv.textContent = "User already exists. Please login instead.";
      return;
    }

    const response = await fetch("http://localhost:3000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // Store basic user data
      const userData = {
        name: name,
        email: email,
        isAuthenticated: true
      };
      localStorage.setItem("user", JSON.stringify(userData));

      // Create initial profile data
      const profileData = {
        email_login: email,
        name: name,
        email: email,
        college: '',
        studentId: '',
        year: '',
        branch: '',
        semester: '',
        graduationYear: '',
        address: '',
        phone: '',
        aictePoints: 0  // Add default AICTE points
      };

      // Save initial profile
      try {
        await fetch("http://localhost:3000/api/pointmate/profile/update", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(profileData),
        });
      } catch (profileError) {
        console.error("Error creating initial profile:", profileError);
      }

      // Redirect to landing page with user data
      const userDataString = encodeURIComponent(JSON.stringify(userData));
      window.location.href = `http://localhost:8080?user=${userDataString}`;
    } else {
      errorDiv.textContent = data.message || "Signup failed. Please try again.";
    }
  } catch (error) {
    errorDiv.textContent = "An error occurred. Please try again.";
    console.error("Signup error:", error);
  }
});

// Handle login form submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value.trim().toLowerCase();
  const password = document.getElementById("loginPassword").value;
  const errorDiv = document.getElementById("loginError");

  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // First store basic user data
      const userData = {
        name: data.name,
        email: email,
        isAuthenticated: true
      };

      // Fetch profile data immediately
      try {
        const profileResponse = await fetch(`http://localhost:3000/api/pointmate/profile/get?email_login=${email}`);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          if (profileData) {
            // Update userData with complete profile data
            Object.assign(userData, profileData);
          }
        }
      } catch (profileError) {
        console.error("Error fetching profile:", profileError);
      }

      // Store the complete user data in localStorage
      localStorage.setItem("user", JSON.stringify(userData));

      // Redirect to landing page with complete user data
      const userDataString = encodeURIComponent(JSON.stringify(userData));
      window.location.href = `http://localhost:8080?user=${userDataString}`;
    } else {
      errorDiv.textContent = data.message || "Login failed. Please check your credentials.";
    }
  } catch (error) {
    errorDiv.textContent = "An error occurred. Please try again.";
    console.error("Login error:", error);
  }
});
