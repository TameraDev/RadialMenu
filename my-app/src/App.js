import React from 'react';
import { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'antd'
import { RadialMenu } from './RadialMenu.jsx';

class App extends Component {
    constructor(props) {
        super(props);
        this.contextMenuRef = null;
    }
    _onRightClick = mEv => {
        mEv.preventDefault();
        console.log(mEv);
        this.contextMenuRef.show({
            fixedPosition: {x:mEv.pageX,y:mEv.pageY}
        });
    };
    render() {
        return (
            <div className="App" onContextMenu={this._onRightClick}>
                <RadialMenu ref={c => this.contextMenuRef = c} />
                <p>
                Right Click on the React Logo
                </p>
                <img src={logo} className="App-logo" alt="logo" />

            </div >
        );
    }
}

export default App;
