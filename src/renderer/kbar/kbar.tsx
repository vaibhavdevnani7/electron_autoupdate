import { useState } from 'react';
import '../App.css';
import './kbar.css';
import { Results } from './results';
import { kbarhandler } from './kbarhandler';
export const Kbar = () => {
    const [enteredText, setEnteredText] = useState("");
    
    const keyUpHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
        kbarhandler(event, enteredText);
    };

    return (
        <div className="container">
            <div className="searchbar">
                <input autoFocus type="text" id="search" onKeyUp={keyUpHandler} value={enteredText} onChange={(e) => setEnteredText(e.target.value)}/>
            </div>
            {/* <Results inputtext = {enteredtext}/> */}
        </div>
    );
};