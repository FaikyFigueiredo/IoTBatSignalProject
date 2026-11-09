import { wsInit } from "./websocket-handler.js";

/* =========================================
   GRÁFICO DO BATSIGNAL
========================================= */

//Identificar o elemento canvas
const canvas = document.getElementById("batsignal-chart");

//Obter o contexto de desenho
const ctx = canvas.getContext("2d");

//Iniciar conexão com o Socket do backend
wsInit();

// 2. DADOS FICTÍCIOS

// Horário atual
const agora = Date.now();

// Uma hora em milissegundos
const umaHora = 60 * 60 * 1000;

// Intervalos em que o Bat-Sinal esteve ligado
const intervalos = [
    {
        inicio: agora - 22 * umaHora,
        fim: agora - 21.5 * umaHora
    },
    {
        inicio: agora - 18 * umaHora,
        fim: agora - 17 * umaHora
    },
    {
        inicio: agora - 13 * umaHora,
        fim: agora - 12.5 * umaHora
    },
    {
        inicio: agora - 9 * umaHora,
        fim: agora - 8 * umaHora
    },
    {
        inicio: agora - 5 * umaHora,
        fim: agora - 4.5 * umaHora
    },
    {
        inicio: agora - 1.5 * umaHora,
        fim: agora
    }
];


// 3. PLUGIN DE INTERVALOS PREENCHIDOS
const intervalosPlugin = {

    id: "intervalosPreenchidos",

    afterDraw(chart, args, options) {

        const { ctx, chartArea, scales } = chart;

        const eixoX = scales.x;
        const eixoY = scales.y;

        // Limites da área de desenho
        const topo = eixoY.getPixelForValue(1);
        const base = eixoY.getPixelForValue(0);

        // Não desenhar fora da área do gráfico
        ctx.save();

        ctx.beginPath();
        ctx.rect(
            chartArea.left,
            chartArea.top,
            chartArea.right - chartArea.left,
            chartArea.bottom - chartArea.top
        );

        ctx.clip();

        // Percorrer todos os intervalos
        options.intervalos.forEach(intervalo => {

            const inicio = eixoX.getPixelForValue(intervalo.inicio);
            const fim = eixoX.getPixelForValue(intervalo.fim);

            // Desenhar o retângulo
            ctx.fillStyle = "#477DF5";

            ctx.fillRect(
                inicio,
                topo,
                fim - inicio,
                base - topo
            );

        });

        ctx.restore();
    }
};


// 4. CONFIGURAÇÃO DO GRÁFICO

// Período de visualização: últimas 24 horas
const inicioPeriodo = agora - 24 * umaHora;

const configuracao = {

    type: "scatter",

    data: {
        datasets: []
    },

    plugins: [intervalosPlugin],

    options: {

        responsive: true,

        maintainAspectRatio: false,

        animation: false,

        plugins: {

            legend: {
                display: false
            },

            tooltip: {
                enabled: false
            },

            intervalosPreenchidos: {
                intervalos: intervalos
            }
        },

        scales: {

            x: {

                type: "linear",

                min: inicioPeriodo,
                max: agora,

                ticks: {

                    maxTicksLimit: 6,

                    callback: function(valor) {

                        return new Date(valor).toLocaleTimeString(
                            "pt-BR",
                            {
                                hour: "2-digit",
                                minute: "2-digit"
                            }
                        );
                    },

                    color: "#cccccc"
                },

                grid: {
                    color: "rgba(255, 255, 255, 0.10)"
                }
            },

            y: {

                min: 0,
                max: 1,

                ticks: {

                    stepSize: 1,

                    callback: function(valor) {

                        return valor === 1
                            ? "Ligado"
                            : "Desligado";
                    },

                    color: "#cccccc"
                },

                grid: {
                    color: "rgba(255, 255, 255, 0.10)"
                }
            }
        }
    }
};


// 5. CRIAÇÃO DO GRÁFICO
const batsignalChart = new Chart(ctx, configuracao);