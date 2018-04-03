// chart utils
const calculateBackgroundColor = rgb => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.2)`;
const calculateBorderColor = rgb => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;

const labels = [
    'Dariusz Maciej GRABOWSKI',
    'Piotr IKONOWICZ',
    'Jarosław KALINOWSKI',
    'Janusz KORWIN-MIKKE',
    'Marian KRZAKLEWSKI',
    'Aleksander KWAŚNIEWSKI',
    'Andrzej LEPPER',
    'Jan ŁOPUSZAŃSKI',
    'Andrzej Marian OLECHOWSKI',
    'Bogdan PAWŁOWSKI',
    'Lech WAŁĘSA',
    'Tadeusz Adam WILECKI'
];

const colors = [
    [255, 99, 132],
    [54, 162, 235],
    [255, 206, 86],
    [75, 192, 192],
    [153, 102, 255],
    [255, 159, 64],
    [255, 99, 132],
    [54, 162, 235],
    [255, 206, 86],
    [75, 192, 192],
    [153, 102, 255],
    [255, 159, 64]
];

const scores = [
    860,
    411,
    2086,
    5732,
    39563,
    71615,
    1299,
    1932,
    66256,
    135,
    2845,
    250
];

const scoresPercent = [
    0.445632798573975,
    0.212971023504539,
    1.08091862537827,
    2.97019442026282,
    20.5006632674211,
    37.1092940347386,
    0.673112796915807,
    1.00111926377316,
    34.3323798864155,
    0.069953985822659,
    1.47421547900344,
    0.129544418190109
];

Chart.defaults.global.defaultFontColor = '#202020';
Chart.defaults.global.defaultFontFamily = "'Roboto Mono', monospace";

// chart component
Vue.component('main-chart', {
    extends: VueChartJs.Bar,
    mixins: [VueChartJs.mixins.reactiveProp],
    props: ['options'],
    mounted() {
        this.renderChart(this.chartData, this.options);
    }
});

// vuejs app main
let app = new Vue({
    el: '#vue-app',
    data: {
        scope: {
            name: 'Kraków',
            type: 'gmina',
            location: 'powiat Kraków, woj. Małopolskie'
        },
        chartData: {
            labels,
            datasets: [{
                label: 'Liczba głosów',
                data: scores,
                backgroundColor: calculateBackgroundColor(colors[0]),
                borderColor: calculateBorderColor(colors[0]),
                borderWidth: 1
            }, {
                label: 'Liczba głosów 2',
                data: scores,
                backgroundColor: calculateBackgroundColor(colors[1]),
                borderColor: calculateBorderColor(colors[1]),
                borderWidth: 1
            }]
        },
        chartOptions: {
            animation: false,
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: true,
                position: 'bottom'
            },
            scales: {
                xAxes: [{
                    type: 'category',
                    ticks: {
                        autoSkip: false,
                        maxRotation: 90,
                        minRotation: 90,
                    },
                    stacked: true
                }],
                yAxes: [{
                    ticks: {
                        display: false,
                        beginAtZero: true
                    },
                    stacked: true
                }]
            },
            layout: {
                padding: {
                    left: 12,
                    right: 12,
                    top: 12,
                    bottom: 12
                }
            }
        },
        expandables: {
            menu: false,
            filter: false,
            search: false
        }
    },
    methods: {
        closeExpandables() {
            this.expandables = {
                menu: false,
                search: false
            }
        },
        toggleExpandable(event, expandableName) {
            event.preventDefault();
            const prevState = this.expandables[expandableName];
            if(!prevState) {
                // make sure everything is closed before opening expandable
                this.closeExpandables();
            }
            this.expandables[expandableName] = !prevState;
        },
    }
});
