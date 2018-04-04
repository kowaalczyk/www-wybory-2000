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


// data for application


// TODO: Make this equal to summary results
let currentApiResponse = {
    data: {
        filterable: [
            {
                backgroundColor: "rgba(87, 157, 207, 0.2)",
                borderColor: "rgba(87, 157, 207, 1)",
                borderWidth: 1,
                data: [
                    37,
                    10,
                    116,
                    122,
                    1170,
                    3288,
                    76,
                    160,
                    2245,
                    8,
                    100,
                    18
                ],
                label: "Milanówek"
            },
            {
                backgroundColor: "rgba(179, 12, 147, 0.2)",
                borderColor: "rgba(179, 12, 147, 1)",
                borderWidth: 1,
                data: [
                    7,
                    1,
                    29,
                    54,
                    390,
                    658,
                    11,
                    20,
                    844,
                    3,
                    27,
                    1
                ],
                label: "Podkowa Leśna"
            },
            {
                backgroundColor: "rgba(82, 70, 92, 0.2)",
                borderColor: "rgba(82, 70, 92, 1)",
                borderWidth: 1,
                data: [
                    4,
                    3,
                    351,
                    12,
                    180,
                    761,
                    97,
                    35,
                    206,
                    3,
                    12,
                    2
                ],
                label: "Baranów"
            },
            {
                backgroundColor: "rgba(108, 216, 124, 0.2)",
                borderColor: "rgba(108, 216, 124, 1)",
                borderWidth: 1,
                data: [
                    90,
                    47,
                    542,
                    249,
                    2182,
                    8420,
                    239,
                    207,
                    3454,
                    20,
                    191,
                    25
                ],
                label: "Grodzisk Mazowiecki"
            },
            {
                backgroundColor: "rgba(160, 99, 204, 0.2)",
                borderColor: "rgba(160, 99, 204, 1)",
                borderWidth: 1,
                data: [
                    17,
                    10,
                    168,
                    36,
                    516,
                    1828,
                    79,
                    43,
                    768,
                    3,
                    41,
                    8
                ],
                label: "Jaktorów"
            },
            {
                backgroundColor: "rgba(193, 137, 43, 0.2)",
                borderColor: "rgba(193, 137, 43, 1)",
                borderWidth: 1,
                data: [
                    6,
                    4,
                    253,
                    20,
                    241,
                    960,
                    44,
                    7,
                    310,
                    1,
                    18,
                    1
                ],
                label: "Żabia Wola"
            },
            {
                backgroundColor: "rgba(90, 16, 200, 0.2)",
                borderColor: "rgba(90, 16, 200, 1)",
                borderWidth: 1,
                data: [
                    50,
                    16,
                    197,
                    352,
                    1917,
                    2246,
                    51,
                    131,
                    2437,
                    13,
                    75,
                    8
                ],
                label: "Józefów"
            },
            {
                backgroundColor: "rgba(63, 234, 225, 0.2)",
                borderColor: "rgba(63, 234, 225, 1)",
                borderWidth: 1,
                data: [
                    167,
                    40,
                    549,
                    502,
                    4834,
                    8333,
                    237,
                    313,
                    5808,
                    57,
                    314,
                    38
                ],
                label: "Otwock"
            },
            {
                backgroundColor: "rgba(127, 62, 179, 0.2)",
                borderColor: "rgba(127, 62, 179, 1)",
                borderWidth: 1,
                data: [
                    23,
                    7,
                    317,
                    72,
                    1292,
                    1852,
                    107,
                    96,
                    1086,
                    11,
                    48,
                    10
                ],
                label: "Celestynów"
            },
            {
                backgroundColor: "rgba(246, 3, 115, 0.2)",
                borderColor: "rgba(246, 3, 115, 1)",
                borderWidth: 1,
                data: [
                    43,
                    20,
                    726,
                    110,
                    1932,
                    2518,
                    129,
                    109,
                    1849,
                    18,
                    94,
                    9
                ],
                label: "Karczew"
            },
            {
                backgroundColor: "rgba(7, 45, 54, 0.2)",
                borderColor: "rgba(7, 45, 54, 1)",
                borderWidth: 1,
                data: [
                    19,
                    10,
                    736,
                    30,
                    523,
                    1354,
                    174,
                    49,
                    441,
                    5,
                    28,
                    11
                ],
                label: "Kołbiel"
            },
            {
                backgroundColor: "rgba(33, 32, 139, 0.2)",
                borderColor: "rgba(33, 32, 139, 1)",
                borderWidth: 1,
                data: [
                    3,
                    3,
                    240,
                    16,
                    326,
                    450,
                    80,
                    52,
                    181,
                    6,
                    26,
                    1
                ],
                label: "Osieck"
            },
            {
                backgroundColor: "rgba(85, 198, 230, 0.2)",
                borderColor: "rgba(85, 198, 230, 1)",
                borderWidth: 1,
                data: [
                    8,
                    1,
                    921,
                    14,
                    213,
                    983,
                    184,
                    35,
                    338,
                    7,
                    20,
                    2
                ],
                label: "Sobienie-Jeziory"
            },
            {
                backgroundColor: "rgba(176, 175, 100, 0.2)",
                borderColor: "rgba(176, 175, 100, 1)",
                borderWidth: 1,
                data: [
                    26,
                    4,
                    432,
                    67,
                    686,
                    1071,
                    117,
                    78,
                    930,
                    6,
                    54,
                    8
                ],
                label: "Wiązowna"
            },
            {
                backgroundColor: "rgba(88, 63, 249, 0.2)",
                borderColor: "rgba(88, 63, 249, 1)",
                borderWidth: 1,
                data: [
                    41,
                    24,
                    767,
                    108,
                    1475,
                    5168,
                    261,
                    97,
                    1841,
                    8,
                    114,
                    13
                ],
                label: "Góra Kalwaria"
            },
            {
                backgroundColor: "rgba(186, 52, 21, 0.2)",
                borderColor: "rgba(186, 52, 21, 1)",
                borderWidth: 1,
                data: [
                    72,
                    21,
                    411,
                    181,
                    2135,
                    4369,
                    151,
                    127,
                    2943,
                    14,
                    150,
                    15
                ],
                label: "Konstancin-Jeziorna"
            },
            {
                backgroundColor: "rgba(40, 103, 206, 0.2)",
                borderColor: "rgba(40, 103, 206, 1)",
                borderWidth: 1,
                data: [
                    28,
                    8,
                    422,
                    99,
                    952,
                    1910,
                    115,
                    62,
                    1297,
                    11,
                    45,
                    6
                ],
                label: "Lesznowola"
            },
            {
                backgroundColor: "rgba(178, 1, 200, 0.2)",
                borderColor: "rgba(178, 1, 200, 1)",
                borderWidth: 1,
                data: [
                    95,
                    37,
                    635,
                    479,
                    4078,
                    9948,
                    222,
                    211,
                    6656,
                    37,
                    242,
                    28
                ],
                label: "Piaseczno"
            },
            {
                backgroundColor: "rgba(180, 8, 141, 0.2)",
                borderColor: "rgba(180, 8, 141, 1)",
                borderWidth: 1,
                data: [
                    11,
                    3,
                    272,
                    28,
                    346,
                    1314,
                    113,
                    12,
                    491,
                    1,
                    21,
                    2
                ],
                label: "Prażmów"
            },
            {
                backgroundColor: "rgba(247, 139, 78, 0.2)",
                borderColor: "rgba(247, 139, 78, 1)",
                borderWidth: 1,
                data: [
                    90,
                    33,
                    265,
                    311,
                    2402,
                    4837,
                    148,
                    162,
                    3259,
                    19,
                    139,
                    15
                ],
                label: "Piastów"
            },
            {
                backgroundColor: "rgba(252, 65, 102, 0.2)",
                borderColor: "rgba(252, 65, 102, 1)",
                borderWidth: 1,
                data: [
                    146,
                    71,
                    513,
                    557,
                    4953,
                    12297,
                    325,
                    286,
                    7198,
                    44,
                    384,
                    41
                ],
                label: "Pruszków"
            },
            {
                backgroundColor: "rgba(69, 124, 93, 0.2)",
                borderColor: "rgba(69, 124, 93, 1)",
                borderWidth: 1,
                data: [
                    48,
                    25,
                    234,
                    221,
                    1767,
                    3790,
                    157,
                    104,
                    2736,
                    18,
                    125,
                    13
                ],
                label: "Brwinów"
            },
            {
                backgroundColor: "rgba(107, 240, 159, 0.2)",
                borderColor: "rgba(107, 240, 159, 1)",
                borderWidth: 1,
                data: [
                    26,
                    19,
                    179,
                    167,
                    1355,
                    2291,
                    64,
                    77,
                    2312,
                    6,
                    105,
                    3
                ],
                label: "Michałowice"
            },
            {
                backgroundColor: "rgba(27, 41, 157, 0.2)",
                borderColor: "rgba(27, 41, 157, 1)",
                borderWidth: 1,
                data: [
                    12,
                    5,
                    179,
                    67,
                    921,
                    1145,
                    79,
                    37,
                    826,
                    5,
                    41,
                    1
                ],
                label: "Nadarzyn"
            },
            {
                backgroundColor: "rgba(163, 187, 155, 0.2)",
                borderColor: "rgba(163, 187, 155, 1)",
                borderWidth: 1,
                data: [
                    41,
                    20,
                    416,
                    155,
                    2099,
                    2905,
                    193,
                    129,
                    2526,
                    11,
                    107,
                    12
                ],
                label: "Raszyn"
            }
        ],
        normal: [
            {
                backgroundColor: "rgba(226, 33, 226, 0.2)",
                borderColor: "rgba(226, 33, 226, 1)",
                borderWidth: 1,
                data: [
                    1110,
                    442,
                    9870,
                    4029,
                    38885,
                    84696,
                    3453,
                    2639,
                    52982,
                    335,
                    2521,
                    291
                ],
                label: "Suma głosów"
            }
        ],
        percent: [
            {
                backgroundColor: "rgba(2, 27, 109, 0.2)",
                borderColor: "rgba(2, 27, 109, 1)",
                borderWidth: 1,
                data: [
                    0.55,
                    0.22,
                    4.9,
                    2,
                    19.32,
                    42.08,
                    1.72,
                    1.31,
                    26.33,
                    0.17,
                    1.25,
                    0.14
                ],
                label: "Procent głosów"
            }
        ]
    },
    scope: {
        href: "/listy/okregi",
        location: "WOJ. MAZOWIECKIE",
        name: "Okręg wyborczy #33",
        type: "okręg wyborczy"
    },
    subScope: {
        href: "/listy/gminy",
        type: "gmina"
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

let chart = new Chart(
    document.getElementById('chart'),
    {
        type: 'bar',
        data: currentVisibleData.chart.data,
        options: currentVisibleData.chart.options
    }
);

let expandables = {
    menu: document.getElementById('menu-content'),
    search: document.getElementById('search-content')
};

let optionalMenuItems = [
    document.getElementById('kk-optional-1'),
    document.getElementById('kk-optional-2')
];


// application helpers


const closeExpandables = () => {
    expandables.menu.classList.remove('visible');
    expandables.search.classList.remove('visible');
};

const toggleExpandable = (event, expandableName) => {
    event.preventDefault();
    // make sure everything is closed before opening expandable
    let isActive = expandables[expandableName].classList.contains('visible');
    closeExpandables();
    if(!isActive) {
        expandables[expandableName].classList.add('visible')
    }
};

const setScoresType = (event, type) => {
    event.preventDefault();
    // TODO: Remove redundancy (currentVisibleData may not be necessary)
    currentVisibleData.chart.data.datasets = currentApiResponse.data[type];
    chart.data = currentVisibleData.chart.data;
    chart.update();
};

const setMenuListItems = apiResponse => {
    if (apiResponse.scope.href) {
        optionalMenuItems[0].children[0].innerText = `Wybierz: ${apiResponse.scope.type}`;
        optionalMenuItems[0].children[0].href = apiResponse.scope.href;
        optionalMenuItems[0].classList.add('visible');
    } else {
        optionalMenuItems[0].classList.remove('visible');
    }
    if (apiResponse.subScope.href) {
        optionalMenuItems[1].children[0].innerText = `Wybierz: ${apiResponse.subScope.type}`;
        optionalMenuItems[1].children[0].href = apiResponse.subScope.href;
        optionalMenuItems[1].classList.add('visible');
    } else {
        optionalMenuItems[1].classList.remove('visible');
    }
};


// app main


// filtering scores
document.getElementById('score-percent')
    .addEventListener('click', e => setScoresType(e, 'percent'));
document.getElementById('score-count')
    .addEventListener('click', e => setScoresType(e, 'normal'));
document.getElementById('score-filter')
    .addEventListener('click', e => setScoresType(e, 'filterable'));
// menus opening and closing, content
document.getElementById('search-btn')
    .addEventListener('click', e => toggleExpandable(e, 'search'));
document.getElementById('menu-btn')
    .addEventListener('click', e => toggleExpandable(e, 'menu'));

// TODO: Move to function
document.getElementById('result-name')
    .innerText = currentVisibleData.scope.name;
document.getElementById('result-type')
    .innerText = `${currentVisibleData.scope.type}, ${currentVisibleData.scope.location}`;

// init
chart.update();
setMenuListItems(currentApiResponse);
