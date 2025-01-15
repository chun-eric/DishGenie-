import Header from "./components/Header";
import Main from "./components/Main";
import { Analytics } from "@vercel/analytics/react";
import Footer from "./components/Footer";

console.log(import.meta.env.CLAUDE_API_KEY);

function App() {
  return (
    <>
      <Analytics />
      <Header />
      <Main />
      <Footer />
    </>
  );
}

export default App;
