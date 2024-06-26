import { useState } from "react";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log(email, password);
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign up</h3>

      <label>Email:</label>
      <input
        type="email"
        onChange={(e) => setEmail((e.target.value = { email }))}
      />

      <label>Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword((e.target.value = { password }))}
      />
      <button>Submit</button>
    </form>
  );
};

export default Signup;
