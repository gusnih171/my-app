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
    <meta charset="utf-8"></meta>
    <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
     <Player /> 
     <Background />
     <Trademark />
    </div>
  );
}
// Export
export default App;
