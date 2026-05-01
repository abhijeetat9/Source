import Greet from "./components/Greet.jsx";
// import Add from "./components/Add.jsx";
import Footer from "./components/Footer.jsx";
import Header from "./components/Header.jsx";
import MainContent from "./components/MainContent.jsx";

function App(){                 //creating a component
  
  return <div>
    <Header/>
    <Greet/>
    {/*<Add></Add>*/}
    <MainContent/>
    
    <Footer/>
  </div>;
}
export default App;