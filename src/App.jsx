import Header from "./components/Header";
import Main from "./components/Main";
import { Analytics } from "@vercel/analytics/react";

console.log(import.meta.env.CLAUDE_API_KEY);

function App() {
  return (
    <>
      <Analytics />
      <Header />
      <Main />
    </>
  );
}

export default App;
