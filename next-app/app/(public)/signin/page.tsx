"use client";

import { useState } from "react";
//import useSearchParams hook for getting query parameters from the URL
import { useSearchParams } from "next/navigation";

//Variables
export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //get the message query parameter from the URL if it exists
  const searchParams = useSearchParams();
  const message = searchParams.get("message");

  return (
    <div>
      {/* render the message if it exists */}
      {message && <p>{message}</p>}
      <p>Enter your details.</p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </div>
  );
}
