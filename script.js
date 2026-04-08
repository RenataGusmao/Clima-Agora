function buscarClima() {
    const cidade = document.getElementById("cidade").value.trim();

    if (cidade === "") {
        alert("Digite o nome de uma cidade.");
        return;
    }

    const urlCidade = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json&countryCode=BR`;

    fetch(urlCidade)
        .then(response => response.json())
        .then(dadosCidade => {
            if (!dadosCidade.results || dadosCidade.results.length === 0) {
                alert("Cidade não encontrada.");
                return;
            }

            const local = dadosCidade.results[0];
            const latitude = local.latitude;
            const longitude = local.longitude;
            const nomeCidade = local.name;
            const estado = local.admin1;

            const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,wind_direction_10m&timezone=auto`;

            fetch(urlClima)
                .then(response => response.json())
                .then(dadosClima => {
                    const clima = dadosClima.current;

                    document.getElementById("nomeCidade").innerText = `${nomeCidade} - ${estado}`;
                    document.getElementById("temperatura").innerText = clima.temperature_2m + " °C";
                    document.getElementById("descricao").innerText = "Clima atualizado em tempo real";
                    document.getElementById("tempExtra").innerText = clima.temperature_2m + " °C";
                    document.getElementById("ventoExtra").innerText = clima.wind_speed_10m + " km/h";
                    document.getElementById("direcaoExtra").innerText = clima.wind_direction_10m + "°";
                    document.getElementById("horarioClima").innerText = clima.time.split("T")[1];
                })
                .catch(error => {
                    console.log(error);
                    alert("Erro ao buscar os dados do clima.");
                });
        })
        .catch(error => {
            console.log(error);
            alert("Erro ao buscar a cidade.");
        });
}

function usarLocalizacao() {
    if (!navigator.geolocation) {
        alert("Geolocalização não suportada.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const urlClima = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,wind_speed_10m,wind_direction_10m&timezone=auto`;

            fetch(urlClima)
                .then(response => response.json())
                .then(dadosClima => {
                    const clima = dadosClima.current;

                    document.getElementById("nomeCidade").innerText = "Sua localização";
                    document.getElementById("temperatura").innerText = clima.temperature_2m + " °C";
                    document.getElementById("descricao").innerText = "Clima da sua localização atual";
                    document.getElementById("tempExtra").innerText = clima.temperature_2m + " °C";
                    document.getElementById("ventoExtra").innerText = clima.wind_speed_10m + " km/h";
                    document.getElementById("direcaoExtra").innerText = clima.wind_direction_10m + "°";
                    document.getElementById("horarioClima").innerText = clima.time.split("T")[1];
                })
                .catch(error => {
                    console.log(error);
                    alert("Erro ao buscar os dados do clima.");
                });
        },
        function(error) {
            console.log(error);

            if (error.code === 1) {
                alert("Permissão de localização negada.");
            } else if (error.code === 2) {
                alert("Localização indisponível no momento.");
            } else if (error.code === 3) {
                alert("Tempo de espera excedido para obter a localização.");
            } else {
                alert("Não foi possível obter sua localização.");
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    );
}

document.getElementById("cidade").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        buscarClima();
    }
});

if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("./service-worker.js")
            .then(() => {
                console.log("Service Worker registrado com sucesso.");
            })
            .catch(error => {
                console.log("Erro ao registrar o Service Worker:", error);
            });
    });
}