function buscarClima(){

    const url = "https://api.open-meteo.com/v1/forecast?latitude=-8.05&longitude=-34.9&current_weather=true";

    fetch(url)
    .then(response => response.json())
    .then(dados => {

        const clima = dados.current_weather;

        document.getElementById("nomeCidade").innerText = "Recife";

        document.getElementById("temperatura").innerText = clima.temperature + " °C";

        document.getElementById("descricao").innerText = "Velocidade do vento: " + clima.windspeed + " km/h";

        document.getElementById("umidade").innerText = "Direção do vento: " + clima.winddirection;

        document.getElementById("tempExtra").innerText = clima.temperature + " °C";

        document.getElementById("ventoExtra").innerText = clima.windspeed + " km/h";
        
        document.getElementById("direcaoExtra").innerText = clima.winddirection;

    })
    .catch(error => {
        alert("Erro ao buscar dados da API");
        console.log(error);
    });

}

document.getElementById("cidade").addEventListener("keypress", function(event){
    if(event.key === "Enter"){
        buscarClima();
    }
});