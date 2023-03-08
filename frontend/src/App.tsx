import React from 'react';
import './App.css';
import massa from './massa-logo.png';
import Counter from './MassaDapp';

const App: React.FC = () => {
    return (
        <div className="App">
            <header className="App-header">
                <img src={massa} className="App-logo" alt="logo" />
                <Counter />
            </header>
        </div>
    );
};

export default App;
