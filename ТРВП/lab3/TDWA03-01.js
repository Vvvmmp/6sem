document.addEventListener('DOMContentLoaded', () => {
    const getBtn = document.getElementById('getBtn');
    const postBtn = document.getElementById('postBtn');
    const putBtn = document.getElementById('putBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const resultDiv = document.getElementById('result');

    const opInput = document.getElementById('op');
    const xInput = document.getElementById('x');
    const yInput = document.getElementById('y');

    const API_URL = 'https://localhost:20443/NGINX-test'; 

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

        resultDiv.textContent = `Статус: ${status} ${statusText}\n\nТело ответа:\n${responseBody}`;
    };

    // GET
    getBtn.addEventListener('click', () => {
        fetch(API_URL)
            .then(displayResult)
            .catch(error => resultDiv.textContent = `Ошибка: ${error}`);
    });


    // POST
    postBtn.addEventListener('click', () => {
        const data = {
            op: opInput.value,
            x: parseFloat(xInput.value),
            y: parseFloat(yInput.value)
        };

        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(displayResult)
            .catch(error => resultDiv.textContent = `Ошибка: ${error}`);
    });

    // PUT
    putBtn.addEventListener('click', () => {
        const data = {
            op: opInput.value,
            x: parseFloat(xInput.value),
            y: parseFloat(yInput.value)
        };

        fetch(API_URL, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
            .then(displayResult)
            .catch(error => resultDiv.textContent = `Ошибка: ${error}`);
    });

    // DELETE
    deleteBtn.addEventListener('click', () => {
        fetch(API_URL, { method: 'DELETE' })
            .then(displayResult)
            .catch(error => resultDiv.textContent = `Ошибка: ${error}`);
    });
});