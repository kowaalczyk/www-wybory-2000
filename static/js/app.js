// setup defaults


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

Chart.defaults.global.defaultFontSize = 12;
Chart.defaults.global.defaultFontColor = '#202020';
Chart.defaults.global.defaultFontFamily = "'Roboto Mono', monospace";

const root = '';
const useHash = false;
// const hash = '#!';

let router = new Navigo(root, useHash);


// data for application


// TODO: Make this equal to summary results
let currentApiResponse = {
    data: {
        filterable: [
            {
                backgroundColor: "rgba(88, 176, 242, 0.2)",
                borderColor: "rgba(88, 176, 242, 1)",
                borderWidth: 1,
                data: [
                    89126,
                    38738,
                    1048910,
                    253264,
                    2761090,
                    9503136,
                    537873,
                    140843,
                    3057168,
                    17211,
                    179783,
                    28942
                ],
                label: "Suma głosów"
            }
        ],
        normal: [
            {
                backgroundColor: "rgba(170, 107, 210, 0.2)",
                borderColor: "rgba(170, 107, 210, 1)",
                borderWidth: 1,
                data: [
                    89126,
                    38738,
                    1048910,
                    253264,
                    2761090,
                    9503136,
                    537873,
                    140843,
                    3057168,
                    17211,
                    179783,
                    28942
                ],
                label: "Suma głosów"
            }
        ],
        percent: [
            {
                backgroundColor: "rgba(30, 159, 62, 0.2)",
                borderColor: "rgba(30, 159, 62, 1)",
                borderWidth: 1,
                data: [
                    0.5,
                    0.22,
                    5.94,
                    1.43,
                    15.64,
                    53.82,
                    3.05,
                    0.8,
                    17.32,
                    0.1,
                    1.02,
                    0.16
                ],
                label: "Procent głosów"
            }
        ]
    },
    scope: {
        href: false,
        location: "",
        name: "Wyniki wyborów",
        type: "Sumaryczne wyniki wyborów w kraju i za granicą"
    },
    subScope: {
        href: false,
        type: "państwo"
    },
    subMenus: {
        submenu1: [],
        submenu2: []
    }
};

let currentVisibleData = {
    scope: currentApiResponse.scope,  // TODO: Function for loading
    chart: {
        data: {
            labels: candidateNameLabels,
            datasets: currentApiResponse.data.filterable
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
};

const chartCanvas = document.getElementById('chart');

let chart = new Chart(
    chartCanvas,
    {
        type: 'bar',
        data: currentVisibleData.chart.data,
        options: currentVisibleData.chart.options
    }
);

let expandables = {
    menu: document.getElementById('menu-content'),
    search: document.getElementById('search-content'),
    submenu1: document.getElementById('menu-subcontent-1'),
    submenu2: document.getElementById('menu-subcontent-2')
};

let optionalMenuItems = [
    document.getElementById('kk-optional-1'),
    document.getElementById('kk-optional-2')
];


// application helpers


const closeExpandables = () => {
    for (let key in expandables) {
        expandables[key].classList.remove('visible');
    }
};

const toggleExpandable = (event, expandableName) => {
    event.preventDefault();
    // make sure everything is closed before opening expandable
    let isActive = expandables[expandableName].classList.contains('visible');
    closeExpandables();
    if (!isActive) {
        expandables[expandableName].classList.add('visible')
    }
};

const setChartScores = (event = false, type = 'percent') => {
    if (event) {
        event.preventDefault();
    }
    // TODO: Remove redundancy (currentVisibleData may not be necessary)
    currentVisibleData.chart.data.datasets = currentApiResponse.data[type];
    chart.data = currentVisibleData.chart.data;
    chart.update();
};

const subMenuItemHtml = (href, text) => {
    return `
        <li>
            <a class="kk-btn kk-list-btn" href="${href}" data-navigo>
                ${text}
            </a>
        </li>
    `
};

const setMenuListItems = () => {
    if (currentApiResponse.scope.href) {
        optionalMenuItems[0].children[0].innerText = `Wybierz: ${currentApiResponse.scope.type}`;
        optionalMenuItems[0].children[0].href = currentApiResponse.scope.href;

        let subMenuHtml = ' ';
        currentApiResponse.subMenus.submenu1
            .map((el) => subMenuHtml += subMenuItemHtml(el.href, el.text));

        expandables.submenu1.innerHTML = subMenuHtml;
        optionalMenuItems[0].classList.add('visible');
    } else {
        optionalMenuItems[0].classList.remove('visible');
    }
    if (currentApiResponse.subScope.href) {
        optionalMenuItems[1].children[0].innerText = `Wybierz: ${currentApiResponse.subScope.type}`;
        optionalMenuItems[1].children[0].href = currentApiResponse.subScope.href;

        let subMenuHtml = ' ';
        currentApiResponse.subMenus.submenu2
            .map((el) => subMenuHtml += subMenuItemHtml(el.href, el.text));

        expandables.submenu2.innerHTML = subMenuHtml;
        optionalMenuItems[1].classList.add('visible');
    } else {
        optionalMenuItems[1].classList.remove('visible');
    }
};

const setScopes = () => {
    currentVisibleData.scope = currentApiResponse.scope;
    currentVisibleData.subScope = currentApiResponse.subScope;

    document.getElementById('result-name')
        .innerText = currentVisibleData.scope.name;
    document.getElementById('result-type')
        .innerText = `${currentVisibleData.scope.type} ${currentVisibleData.scope.location}`;
};

const updateAllData = () => {
    setScopes();
    setChartScores();
    closeExpandables();
    setMenuListItems();
    router.updatePageLinks();
};

// const setChartLayout = event => {
//     // basically assuming 2 legend items fit in one row
//     // and chart height should be same as legend height
//     chartCanvas.height = 12 * chart.legend.legendItems.length;
//     console.log(12 * chart.legend.legendItems.length);
// };


// routes


router.on({
    '/:resource': params => {
        console.log(`GET /api/${params.resource}`);
        fetch(`/api/${params.resource}`)
            .then(res => res.json())
            .then(res => currentApiResponse = res)
            .then(updateAllData);
    },
    '/:resource/:id': params => {
        console.log(`GET /api/${params.resource}/${params.id}`);
        fetch(`/api/${params.resource}/${params.id}`)
            .then(res => res.json())
            .then(res => currentApiResponse = res)
            .then(updateAllData);
    },
    '/': () => {
        console.log(`GET /api/`);
        fetch(`/api/`)
            .then(res => res.json())
            .then(res => currentApiResponse = res)
            .then(updateAllData);
    },
    '/info/about': () => {
        // TODO
    }
}).resolve();


// app main


// filtering scores
document.getElementById('score-percent')
    .addEventListener('click', e => setChartScores(e, 'percent'));
document.getElementById('score-count')
    .addEventListener('click', e => setChartScores(e, 'normal'));
document.getElementById('score-filter')
    .addEventListener('click', e => setChartScores(e, 'filterable'));
// menus opening and closing, content
document.getElementById('search-btn')
    .addEventListener('click', e => toggleExpandable(e, 'search'));
document.getElementById('menu-btn')
    .addEventListener('click', e => toggleExpandable(e, 'menu'));
document.getElementById('kk-optional-1')
    .addEventListener('click', e => toggleExpandable(e, 'submenu1'));
document.getElementById('kk-optional-2')
    .addEventListener('click', e => toggleExpandable(e, 'submenu2'));
// chart responsiveness
// window.addEventListener('resize', e => setChartLayout(e));

// init
updateAllData();
