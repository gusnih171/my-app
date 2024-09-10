//Import
import './App.css';
import React from "react";
import Background from './Background';
import Player from "./Player";
import Trademark from './Trademark';

const App = () => {
  // Return
  return (
    <div className="App"> 
     <Player /> 
     <Background />
     <Trademark />
    </div>
  );
}
// Export
export default App;
