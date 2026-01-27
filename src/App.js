import { useState } from "react";
import Dashboard from "./Dashboard";
import "./App.css";

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  const login = () => {
    fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "admin@crm.com",
        password: "admin123"
      })
    })
      .then(res => {
        if (res.ok) setLoggedIn(true);
        else alert("Invalid login");
      });
  };

  if (!loggedIn) {
   return (
  <div className="container">
    <h2>Admin Login</h2>
    <button onClick={login}>Login</button>
  </div>
);

  }

  return <Dashboard />;
}

export default App;
