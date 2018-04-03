// chart utils  TODO: color generation
const calculateBackgroundColor = rgb => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.2)`;
const calculateBorderColor = rgb => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;

const candidateNameLabels = [
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

const exampleApiResponse = {
    scope: {
        name: 'Kraków',
        type: 'gmina',
        location: 'powiat Kraków, woj. Małopolskie',
        href: '/gminy/'
    },
    subScope: {
        type: 'obwód',
        location: 'gmina Kraków, woj. Małopolskie',
        href: false
    },
    data: {
        normal: [{
            label: 'Liczba głosów',
            data: [
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
            ]
        }],
        percent: [{
            label: 'Procent głosów',
            data: [
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
            ]
        }],
        filterable: [{
            label: 'Obwód #1 Kraków',
            data: [
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
            ],
            backgroundColor: calculateBackgroundColor(colors[0]),  // TODO: Generate
            borderColor: calculateBorderColor(colors[0]),  // TODO: Generate
            borderWidth: 1 // TODO: Default
        }, {
            label: 'Obwód #2 Kraków',
            data: [
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
            ],
            backgroundColor: calculateBackgroundColor(colors[1]),  // TODO: Generate
            borderColor: calculateBorderColor(colors[1]),  // TODO: Generate
            borderWidth: 1 // TODO: Default
        }]
    }
};

Chart.defaults.global.defaultFontSize = 12;
Chart.defaults.global.defaultFontColor = '#202020';
Chart.defaults.global.defaultFontFamily = "'Roboto Mono', monospace";

// chart component
Vue.component('main-chart', {
    extends: VueChartJs.Bar,
    mixins: [VueChartJs.mixins.reactiveProp],
    props: ['chartData', 'options'],
    mounted() {
        this.renderChart(this.chartData, this.options);
    }
});

// vuejs app main
let app = new Vue({
    el: '#vue-app',
    data: {
        currentApiResponse: exampleApiResponse,
        currentVisibleData: {
            scope: exampleApiResponse.scope,  // TODO: Function for loading
            chart: {
                data: {
                    labels: candidateNameLabels,
                    datasets: exampleApiResponse.data.filterable
                },
                options: {
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
                    },
                    title: {
                        display: true,
                        position: 'bottom',
                        fontFamily: Chart.defaults.global.defaultFontFamily,
                        fontStyle: 'normal',
                        text: 'Kliknij na legendzie aby filtrować wyniki'
                    }
                }
            }
        },
        expandables: {
            menu: false,
            filter: false,
            search: false
        },
        menuListItems: []
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
        setScoresType(event, type) {
            console.log('setting data as visible: ', type);

            // change datasets for chart
            event.preventDefault();
            let currentData = this.currentVisibleData.chart.data;
            currentData.datasets = this.currentApiResponse.data[type];
            this.currentVisibleData.chart.data = currentData;
            // TODO: Force re-render, currently need to click chart

            // additional tweaks
            switch (type) {
                case 'normal':
                    break;
                case 'percent':
                    break;
                case 'filterable':
                    break;
                default:
                    break;
            }
        }, createMenuList(apiResponse) {
            let ans = [];

            if(apiResponse.scope.href) {
                ans.push({
                    position: ans.length,
                    text: apiResponse.scope.type,
                    link: apiResponse.scope.href
                });
            }
            if(apiResponse.subScope.href) {
                ans.push({
                    position: ans.length,
                    text: apiResponse.subScope.type,
                    link: apiResponse.subScope.href
                });
            }
            return ans;
        }
    },
    mounted() {
        this.menuListItems = this.createMenuList(exampleApiResponse)
    }
});
