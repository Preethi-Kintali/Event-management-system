
async function testLogin() {
  const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'a@gmail.com', password: 'testpassword' }) // I don't know the password the user used, maybe I'll try registering a new user first.
  });
  console.log(res.status, await res.text());
}

async function testRegisterAndLogin() {
  const email = `test-${Date.now()}@test.com`;
  const password = "Password123!";
  
  console.log("Registering...", email);
  const regRes = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstName: "Test",
      lastName: "User",
      email,
      password,
      role: "Student Coordinator"
    })
  });
  console.log("Register Res:", regRes.status, await regRes.text());

  console.log("Logging in...", email);
  const logRes = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  console.log("Login Res:", logRes.status, await logRes.text());
}

testRegisterAndLogin().catch(console.error);
