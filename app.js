const apiKey = 'cf4e9df67e3b26331fa5247d368360ca';
const dadosHistoricos = [18, 19, 20, 21, 22, 21, 23, 24, 26, 25, 27, 28, 27, 29, 30, 31, 30, 32, 33, 31];
const dias = dadosHistoricos.map((_, i) => i + 1); 

async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) {
        alert("Por favor, insira uma cidade.");
        return;
    }
    
    document.getElementById('confirmButton').innerText = "Carregando...";
    document.getElementById('confirmButton').disabled = true;

    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json(); 

        if (data.main) {
            const temp = data.main.temp;
            const weather = data.weather[0].description;

            document.getElementById('city').innerText = `Cidade: ${city}`;
            document.getElementById('temp').innerText = `Temperatura: ${temp}°C`;
            document.getElementById('weather').innerText = `Clima: ${weather}`;

            const tendencia = await preverTendencia(dias, dadosHistoricos, dias.length + 1);
            document.getElementById('tendencia').innerText = `A temperatura irá: ${tendencia > temp ? 'aumentar nos próximos dias' : 'cair nos próximos dias'}`;

            document.querySelector('.weather-info').classList.add('show');
        } else {
            document.getElementById('city').innerText = `Cidade não encontrada`;
            document.getElementById('temp').innerText = `Temperatura: --`;
            document.getElementById('weather').innerText = `Clima: --`;
            document.getElementById('tendencia').innerText = `A temperatura irá: --`;
            console.error('Dados não encontrados ou chave de API inválida.');
        }
    } catch (error) {
        console.error('Erro ao obter dados: ', error);
        alert("Erro ao obter os dados do clima. Tente novamente mais tarde.");
    } finally {
        document.getElementById('confirmButton').innerText = "Confirmar";
        document.getElementById('confirmButton').disabled = false;
    }
}



async function treinarModelo(dadosX, dadosY) {
    tf.setBackend('cpu');

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 1, inputShape: [1] }));
    model.compile({ optimizer: 'sgd', loss: 'meanSquaredError' });

    const xs = tf.tensor2d(dadosX, [dadosX.length, 1]);
    const ys = tf.tensor2d(dadosY, [dadosY.length, 1]);

    await model.fit(xs, ys, { epochs: 200 }); 
    return model;
}

async function preverTendencia(dias, temperaturas, proximoDia) {
    try {
        const model = await treinarModelo(dias, temperaturas);
        const previsao = model.predict(tf.tensor2d([proximoDia], [1, 1]));
        return previsao.dataSync()[0];
    } catch (error) {
        console.error("Erro ao prever tendência de temperatura:", error);
        return null;
    }
}

document.getElementById("confirmButton").addEventListener("click", getWeather);
document.getElementById("cityInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        getWeather();
    }
});
