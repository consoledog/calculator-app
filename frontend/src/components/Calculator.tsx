import React, { useState, useEffect } from 'react';
import '../styles/calculator.css';

interface HistoryItem {
  id: number;
  expression: string;
  value: string;
  created_at: string;
}

const Calculator: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/history');
      const data = await response.json();
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
    }
  };

  const handleNumber = (num: string) => {
    if (display === '0') {
      setDisplay(num);
      setExpression(num);
    } else {
      setDisplay(display + num);
      setExpression(expression + num);
    }
  };

  const handleOperator = (op: string) => {
    // Convert display symbols to actual operators for calculation
    let actualOp = op;
    if (op === '÷') actualOp = '/';
    if (op === '×') actualOp = '*';

    setDisplay(display + op); // Show symbol in display
    setExpression(expression + actualOp); // Use actual operator in expression
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
  };

  const handleEquals = async () => {
    if (!expression) return;

    try {
      // Convert any remaining display symbols to operators before sending
      const cleanExpression = expression.replace(/÷/g, '/').replace(/×/g, '*');

      const response = await fetch('http://localhost:3000/api/history', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ expression: cleanExpression }),
      });

      if (response.ok) {
        const result = await response.json();
        setDisplay(result.value.toString());
        setExpression('');
        fetchHistory(); // Refresh history
      } else {
        const error = await response.json();
        setDisplay('Error');
        console.error('Calculation error:', error.error);
      }
    } catch (error) {
      setDisplay('Error');
      console.error('Network error:', error);
    }
  };

  return (
    <div className="calculator-container" style={{ display: 'flex', gap: '1rem', padding: '1rem', height: 'calc(100vh - 100px)' }}>
      <div className="calculator" style={{ background: '#333', borderRadius: '8px', padding: '1rem', width: '280px' }}>
        <div className="display">{display}</div>

        <div className="buttons">
          <button onClick={handleClear} className="button clear">C</button>
          <button onClick={() => handleOperator('/')} className="button operator">÷</button>
          <button onClick={() => handleOperator('*')} className="button operator">×</button>
          <button onClick={() => handleOperator('-')} className="button operator">-</button>

          <button onClick={() => handleNumber('7')} className="button">7</button>
          <button onClick={() => handleNumber('8')} className="button">8</button>
          <button onClick={() => handleNumber('9')} className="button">9</button>
          <button onClick={() => handleOperator('+')} className="button operator">+</button>

          <button onClick={() => handleNumber('4')} className="button">4</button>
          <button onClick={() => handleNumber('5')} className="button">5</button>
          <button onClick={() => handleNumber('6')} className="button">6</button>
          <button onClick={handleEquals} className="button equals">=</button>

          <button onClick={() => handleNumber('1')} className="button">1</button>
          <button onClick={() => handleNumber('2')} className="button">2</button>
          <button onClick={() => handleNumber('3')} className="button">3</button>

          <button onClick={() => handleNumber('0')} className="button zero">0</button>
          <button onClick={() => handleNumber('.')} className="button">.</button>
        </div>
      </div>

      <div className="history" style={{ background: '#f5f5f5', borderRadius: '8px', padding: '1rem', flex: '1', maxHeight: '100%', overflowY: 'auto' }}>
        <h3 style={{ margin: '0 0 1rem 0', color: '#333', borderBottom: '2px solid #ddd', paddingBottom: '0.5rem' }}>History</h3>
        <div className="history-list">
          {history.map((item) => (
            <div key={item.id} className="history-item" style={{ background: 'white', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '4px', borderLeft: '3px solid #ff9500' }}>
              <span style={{ fontFamily: 'Courier New, monospace', color: '#333' }}>{item.expression} = {item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calculator;
