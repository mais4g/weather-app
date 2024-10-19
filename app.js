const apiKey = 'cf4e9df67e3b26331fa5247d368360ca';

function getWeather(){
const city = document.getElementById('cityInput').value;
const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric&lang=pt`;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    if (data.main) {
      const temp = data.main.temp;  // Temperatura
      const weather = data.weather[0].description;  // Condição climática
      
      // Atualizar a interface com os dados
      document.getElementById('city').innerText = `Cidade: ${city}`;
      document.getElementById('temp').innerText = `Temperatura: ${temp}°C`;
      document.getElementById('weather').innerText = `Clima: ${weather}`;
    } else {
        document.getElementById('city').innerText = `Cidade não encontrada`;
        document.getElementById('temp').innerText = `Temperatura: --`;
        document.getElementById('weather').innerText = `Clima: --`;
      console.error('Dados não encontrados ou chave de API inválida.');
    }
  })
  .catch(error => console.error('Erro ao obter dados: ', error));
}

cityInput.addEventListener("keypress", function(event){
    if (event.key === "Enter"){
        getWeather();
    }
});