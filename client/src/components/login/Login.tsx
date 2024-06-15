import React, { FormEvent, useState } from "react";
import useLogin from "../../hooks/useLogin";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const login = useLogin();
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login({ email, password });
  };
  return (
    <form onSubmit={handleSubmit}>
      <input
        value={email}
        onChange={(e) => setEmail(e.currentTarget.value)}
        type="text"
      />
      <input
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
        type="text"
      />
      <button type="submit">Log in</button>
    </form>
  );
}
