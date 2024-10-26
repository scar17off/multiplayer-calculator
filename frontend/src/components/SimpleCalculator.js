import React from 'react';

const calculatorButtons = [
  { value: '+', className: 'operator' },
  { value: '-', className: 'operator' },
  { value: '*', className: 'operator' },
  { value: '/', className: 'operator' },
  { value: '7', className: '' },
  { value: '8', className: '' },
  { value: '9', className: '' },
  { value: '4', className: '' },
  { value: '5', className: '' },
  { value: '6', className: '' },
  { value: '1', className: '' },
  { value: '2', className: '' },
  { value: '3', className: '' },
  { value: '.', className: '' },
  { value: '0', className: '' },
  { value: 'AC', className: 'all-clear' },
  { value: 'C', className: 'clear' },
  { value: '=', className: 'equals' },
];

function Calculator({ display, handleKeyPress }) {
  return (
    <div className="calculator">
      <div className="display">
        <input id="displayResult" type="text" value={display} readOnly />
      </div>
      <div className="buttons">
        <div className="row">
          {calculatorButtons.slice(0, 4).map(button => (
            <button key={button.value} className={button.className} onClick={() => handleKeyPress(button.value)}>
              {button.value}
            </button>
          ))}
        </div>
        <div className="row" style={{height: '60px'}}>
          {calculatorButtons.slice(4, 7).map(button => (
            <button key={button.value} className={button.className} onClick={() => handleKeyPress(button.value)}>
              {button.value}
            </button>
          ))}
          <button className="equals" onClick={() => handleKeyPress('=')}>=</button>
        </div>
        <div className="row">
          {calculatorButtons.slice(7, 10).map(button => (
            <button key={button.value} className={button.className} onClick={() => handleKeyPress(button.value)}>
              {button.value}
            </button>
          ))}
        </div>
        <div className="row">
          {calculatorButtons.slice(10, 13).map(button => (
            <button key={button.value} className={button.className} onClick={() => handleKeyPress(button.value)}>
              {button.value}
            </button>
          ))}
        </div>
        <div className="row">
          {calculatorButtons.slice(13, 16).map(button => (
            <button key={button.value} className={button.className} onClick={() => handleKeyPress(button.value)}>
              {button.value}
            </button>
          ))}
          <button className="clear" onClick={() => handleKeyPress('C')}>C</button>
        </div>
      </div>
    </div>
  );
}

export default Calculator;
