import React, { useState } from "react";
import ReactDOM from "react-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.scss";
import { trpc } from "./trpc";
import { httpBatchLink } from "@trpc/client";

const AppContent = () => {
  const messages = trpc.getMessages.useQuery();
  return (
    <>
      <h1>Last 10 messages:</h1>
      <ul>
        {messages.data?.map((message, i) => (
          <li key={i}>
            <strong>{message.user}: </strong>
            <span>{message.message}</span>
          </li>
        ))}
      </ul>
    </>
  );
};

const App = () => {
  const [queryClient] = useState(() => new QueryClient());
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
