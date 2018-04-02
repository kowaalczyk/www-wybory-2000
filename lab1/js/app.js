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
            }]
        },
        chartOptions: {
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
                    }
                }],
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
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
            this.expendables = {
                menu: false,
                filter: false,
                search: false
            }
        },
        toggleExpandable(event, expandableName) {
            event.preventDefault();
            const prevState = this.expandables[expandableName];
            if(!prevState) {
                this.closeExpandables();
            }
            this.expandables[expandableName] = !prevState;
        },
    }
});
