/** @format */
import React from 'react';
import {Component} from 'react';
import { Icon, Button } from 'antd';
import './RadialMenu.css';

const LV = 10; //LOG_VERBOSITY
const log = console.log.bind(console);

const DEF_RADIUS = 32,
  DEF_SPREAD = 360, // so it divides the whole circle
  DEF_START = 90; // so element 0 will be up

const generateRadialPositions = (count, radius = DEF_RADIUS, spread_angle = DEF_SPREAD, start_angle = DEF_START) => {
  // https://github.com/omulet/react-native-radial-menu/blob/0447ff355bd0786f07b8d62ca7e766eeb23752d4/index.js#L4
  let span = spread_angle < 360 ? 1 : 0;
  let start = (start_angle * Math.PI) / 180;
  let rad = (spread_angle * Math.PI * 2) / 360 / (count - span);
  return [...Array(count)].map((_, i) => {
    return {
      x: -Math.cos(start + rad * i) * radius,
      y: -Math.sin(start + rad * i) * radius,
    };
  });
};

const north = {
  value: 'N',
  label: 'N',
  desc: 'north',
  comp: <Icon className="centeredOnParent " type="up-square" theme="twoTone" />,
  children: [
    {
      value: 'NNE',
      label: 'NNE',
      desc: 'North-NorthEast',
    },
    {
      value: 'NSE',
      label: 'NSE',
      desc: 'North-SouthEast',
    },
    {
      value: 'NNW',
      label: 'NNW',
      desc: 'North-NorthWest',
    },

    {
      value: 'NSW',
      label: 'NSW',
      desc: 'North-SouthWest',
    },
  ],
};
const east = {
  value: 'E',
  label: 'E',
  desc: 'east',
  comp: <Icon className="centeredOnParent" type="right-circle" theme="twoTone" />,
  children: [
    {
      value: 'ENE',
      label: 'ENE',
      desc: 'East-NorthEast',
    },
    {
      value: 'ESE',
      label: 'ESE',
      desc: 'East-SouthEast',
    },
    {
      value: 'ENW',
      label: 'ENW',
      desc: 'East-NorthWest',
    },

    {
      value: 'ESW',
      label: 'ESW',
      desc: 'East-SouthWest',
    },
  ],
};
const south = {
  value: 'S',
  label: 'S',
  desc: 'south',
  comp: <Icon className="centeredOnParent" type="down-square" theme="twoTone" />,
  children: [
    {
      value: 'NNE',
      label: 'NNE',
      desc: 'South-NorthEast',
    },
    {
      value: 'NSE',
      label: 'NSE',
      desc: 'South-SouthEast',
    },
    {
      value: 'NNW',
      label: 'NNW',
      desc: 'South-NorthWest',
    },

    {
      value: 'NSW',
      label: 'NSW',
      desc: 'South-SouthWest',
    },
  ],
};
const west = {
  value: 'W',
  label: 'W',
  desc: 'west',
  comp: <Icon className="centeredOnParent" type="left-circle" theme="twoTone" />,
  children: [
    {
      value: 'WNE',
      label: 'WNE',
      desc: 'West-NorthEast',
      onClick: clickEv => console.log('clicked'),
    },
    {
      value: 'WSE',
      label: 'WSE',
      desc: 'West-SouthEast',
    },
    {
      value: 'WNW',
      label: 'WNW',
      desc: 'West-NorthWest',
    },

    {
      value: 'WSW',
      label: 'WSW',
      desc: 'West-SouthWest',
    },
  ],
};

class RadialMenu extends Component {
  constructor(props) {
    super(props);
    this.state={};
    this.state.fixedPosition = { x: 100, y: 100 };
    this.state.options = [north, east, south, west];
    this.state.visible = false;
  }
  close = (stateUpdate = {}) => {
    stateUpdate.options = [];
    stateUpdate.radialOffset = undefined;
    stateUpdate.visible = false;
    LV > 9 && log('Hiding', stateUpdate);
    this.setState(stateUpdate);
  };
  show = (stateUpdate = {}) => {
    if (!stateUpdate.options) stateUpdate.options = [north, east, south, west]; // will show defaults if not passed any options
    stateUpdate.visible = true;
    LV > 9 && log('Showing', stateUpdate);
    this.setState(stateUpdate);
  };
  _renderOptions = options => {
    let count = options.length;
    let radialPositions = generateRadialPositions(count, undefined, undefined, this.state.radialOffset);
    let optionReactArray = [];
    for (let eachIdx in options) {
      optionReactArray.push(this._renderSingleOption(options[eachIdx], radialPositions[eachIdx], eachIdx));
    }
    LV > 9 && log('Rendering Options', optionReactArray);
    return optionReactArray;
  };
  _renderSingleOption = (optionObject, pos, idx) => {
    return optionObject && (optionObject.value || optionObject.comp) ? (
      <div
        className="radialMenuItemHolder"
        style={{ position: 'absolute', top: pos.y, left: pos.x }}
        onClick={clickEv => {
          if (optionObject.children) {
            //TODO adapt to embed another instance of this Radial Menu and store ref
            // then call this.subMenuRef.show(...
            this.show({ radialOffset: 135, options: optionObject.children });
          } else if (optionObject.onClick) {
            optionObject.onClick(clickEv);
            this.close();
          } else {
            console.log(`clicked option wih no action: ${optionObject.label}`);
            this.close();
          }
        }}
        key={`radialOption_${idx}`}>
        {optionObject.comp ? optionObject.comp : <Button className="centeredOnParent">{optionObject.label}</Button>}
      </div>
    ) : null;
  };
  render() {
    return !this.state.visible ? null : (
      <div
        id="RadialMenu"
        style={{
          position: 'fixed',
          zIndex: 10000,
          top: this.state.fixedPosition.y,
          left: this.state.fixedPosition.x,
        }}>
        <Icon
          style={{ lineHeight: '16px' }}
          className="centeredOnParent"
          onClick={() => this.close()}
          type="close-circle"
          theme="twoTone"
        />
        <div>{this._renderOptions(this.state.options)}</div>
      </div>
    );
  }
}

// RadialMenu.propTypes = {
//   fixedPosition: PropTypes.object,
// };

export { RadialMenu };
