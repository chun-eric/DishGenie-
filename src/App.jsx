import Header from "./components/Header";
import Main from "./components/Main";

console.log(import.meta.env.CLAUDE_API_KEY);

function App() {
  return (
    <>
      <Header />
      <Main />
    </>
  );
}

export default App;
