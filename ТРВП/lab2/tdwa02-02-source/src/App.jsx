import { useState } from 'react';
import './App.css';

function App() {
  const [op, setOp] = useState('');
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [result, setResult] = useState('');

  const API_URL = '/api/Save-JSON';

  const displayResult = async (response) => {
    const status = response.status;
    const statusText = response.statusText;
    let responseBody;

    try {
      responseBody = await response.clone().json();
      responseBody = JSON.stringify(responseBody, null, 2);
    } catch (e) {
      responseBody = await response.text();
    }

    setResult(`Статус: ${status} ${statusText}\n\nТело ответа:\n${responseBody}`);
  };

  const handleGet = () => {
    fetch(API_URL).then(displayResult).catch(error => setResult(`Ошибка: ${error}`));
  };

  const handleDelete = () => {
    fetch(API_URL, { method: 'DELETE' }).then(displayResult).catch(error => setResult(`Ошибка: ${error}`));
  };

  const handlePost = () => {
    const data = { op, x: parseFloat(x), y: parseFloat(y) };
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(displayResult).catch(error => setResult(`Ошибка: ${error}`));
  };

  const handlePut = () => {
    const data = { op, x: parseFloat(x), y: parseFloat(y) };
    fetch(API_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(displayResult).catch(error => setResult(`Ошибка: ${error}`));
  };

  return (
    <div className="container-wrapper">
      <h1>TDWA-02-02 (React SPA)</h1>
      <div className="container">
        <div className="card">
          <h2>Просмотр и удаление</h2>
          <button onClick={handleGet}>GET (Получить)</button>
          <button onClick={handleDelete}>DELETE (Удалить)</button>
        </div>

        <div className="card">
          <h2>Создание и обновление (POST/PUT)</h2>
          <div className="form-group">
            <label>Операция (op):</label>
            <input type="text" value={op} onChange={(e) => setOp(e.target.value)} placeholder="add, sub, mul, div" />
          </div>
          <div className="form-group">
            <label>Число X:</label>
            <input type="number" value={x} onChange={(e) => setX(e.target.value)} placeholder="10" />
          </div>
          <div className="form-group">
            <label>Число Y:</label>
            <input type="number" value={y} onChange={(e) => setY(e.target.value)} placeholder="5" />
          </div>
          <button onClick={handlePost}>POST (Создать)</button>
          <button onClick={handlePut}>PUT (Обновить)</button>
        </div>
      </div>

      <div className="result-container">
        <h2>Результат:</h2>
        <pre>{result}</pre>
      </div>
    </div>
  );
}

export default App;