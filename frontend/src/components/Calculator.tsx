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
  const [showHistory, setShowHistory] = useState(false);

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

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const itemDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    if (itemDate.getTime() === today.getTime()) {
      return `Today ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'numeric',
        day: 'numeric',
        year: 'numeric'
      }) + ' ' + date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
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

  if (showHistory) {
    return (
      <div className="calculator-container">
        <div className="history-container">
          <div className="history-header">
            <button
              className="top-bar-icon"
              onClick={() => setShowHistory(false)}
            >
              ����️
            </button>
            <button
              className="top-bar-icon"
              onClick={() => setShowHistory(false)}
            >
              ✕
            </button>
          </div>

          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item">
                <div className="history-expression">{item.expression}</div>
                <div className="history-result">{parseFloat(item.value).toLocaleString()}</div>
                <div className="history-meta">{formatDate(item.created_at)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="calculator-container">
      <div className="phone-container">
        <div className="top-bar">
          <button className="top-bar-icon">↶</button>
          <button
            className="top-bar-icon"
            onClick={() => setShowHistory(true)}
          >
            🗑️
          </button>
          <button className="top-bar-icon">✕</button>
        </div>

        <div className="display-section">
          <div className="expression">
            {expression || ''}
          </div>
          <div className="display">
            {parseFloat(display).toLocaleString() || display}
          </div>
        </div>

        <div className="buttons">
          <button onClick={handleClear} className="button function">C</button>
          <button onClick={() => handleOperator('+')} className="button function">+/-</button>
          <button onClick={() => handleOperator('%')} className="button function">%</button>
          <button onClick={() => handleOperator('/')} className="button operator">÷</button>

          <button onClick={() => handleNumber('1')} className="button number">1</button>
          <button onClick={() => handleNumber('2')} className="button number">2</button>
          <button onClick={() => handleNumber('3')} className="button number">3</button>
          <button onClick={() => handleOperator('*')} className="button operator">×</button>

          <button onClick={() => handleNumber('4')} className="button number">4</button>
          <button onClick={() => handleNumber('5')} className="button number">5</button>
          <button onClick={() => handleNumber('6')} className="button number">6</button>
          <button onClick={() => handleOperator('+')} className="button operator">+</button>

          <button onClick={() => handleNumber('7')} className="button number">7</button>
          <button onClick={() => handleNumber('8')} className="button number">8</button>
          <button onClick={() => handleNumber('9')} className="button number">9</button>
          <button onClick={() => handleOperator('-')} className="button operator">-</button>

          <button onClick={() => handleNumber('.')} className="button number">.</button>
          <button onClick={() => handleNumber('0')} className="button number zero">0</button>
          <button onClick={handleEquals} className="button number">=</button>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
