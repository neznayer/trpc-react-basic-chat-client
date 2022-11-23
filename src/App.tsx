import React, { useState } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.scss";
import { trpc } from "./trpc";
import { httpBatchLink } from "@trpc/client";

const queryClient = new QueryClient();

const AppContent = ({}) => {
  const messages = trpc.getMessages.useQuery();
  const addMessage = trpc.addMessage.useMutation();

  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");

  const onAdd = () => {
    addMessage.mutate(
      {
        message,
        user,
      },
      {
        onSuccess: () =>
          queryClient.invalidateQueries({ queryKey: ["getMessages"] }),
      }
    );
  };
  return (
    <>
      <h1>Last 10 messages:</h1>
      <div className="mt-10">
        <input
          type="text"
          value={user}
          name="user"
          onChange={(e) => setUser(e.target.value)}
          className="p-5 border-2 border-gray-300 rounded-lg w-full"
          placeholder="User"
        />
        <input
          type="text"
          value={message}
          name="message"
          className="p-5 border-2 border-gray-300 rounded-lg w-full"
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Message"
        />
      </div>
      <ul>
        {messages.data?.map((message, i) => (
          <li key={i}>
            <strong>{message.user}: </strong>
            <span>{message.message}</span>
          </li>
        ))}
      </ul>
      <button onClick={onAdd}>Add message</button>
    </>
  );
};

const App = () => {
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [httpBatchLink({ url: "http://localhost:8080/trpc" })],
    })
  );
  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </trpc.Provider>
  );
};
ReactDOM.render(<App />, document.getElementById("app"));
