import React from 'react';

const calculatorButtons = [
  [
    { value: '7', className: '' },
    { value: '8', className: '' },
    { value: '9', className: '' },
    { value: 'DEL', className: 'operator' },
    { value: 'AC', className: 'all-clear' },
  ],
  [
    { value: '4', className: '' },
    { value: '5', className: '' },
    { value: '6', className: '' },
    { value: '*', className: 'operator' },
    { value: '/', className: 'operator' },
  ],
  [
    { value: '1', className: '' },
    { value: '2', className: '' },
    { value: '3', className: '' },
    { value: '+', className: 'operator' },
    { value: '-', className: 'operator' },
  ],
  [
    { value: '0', className: '' },
    { value: '.', className: '' },
    { value: '(', className: 'operator' },
    { value: ')', className: 'operator' },
    { value: '=', className: 'equals' },
  ],
  [
    { value: 'x', className: 'variable' },
    { value: 'y', className: 'variable' },
    { value: '^', className: 'operator' },
    { value: 'sqrt', className: 'function' },
  ],
  [
    { value: 'sin', className: 'function' },
    { value: 'cos', className: 'function' },
    { value: 'tan', className: 'function' },
    { value: 'log', className: 'function' },
  ],
];

function AlgebraicCalculator({ display, handleKeyPress }) {
  const onButtonClick = (value) => {
    console.log(`Button clicked: ${value}`);
    handleKeyPress(value);
  };

  return (
    <div className="calculator algebraic">
      <div className="display">
        <input id="displayResult" type="text" value={display} readOnly />
      </div>
      <div className="buttons">
        {calculatorButtons.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map(button => (
              <button
                key={button.value}
                className={button.className}
                onClick={() => onButtonClick(button.value)}
              >
                {button.value}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default AlgebraicCalculator;