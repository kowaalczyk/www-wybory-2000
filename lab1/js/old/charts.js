let ctx = 'TEST';

const calculateBackgroundColor = rgb => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 0.2)`;
const calculateBorderColor = rgb => `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, 1)`;


let testChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: labels,
        datasets: [{
            label: 'Liczba głosów',
            data: votes,
            backgroundColor: colors.map(calculateBackgroundColor),
            borderColor: colors.map(calculateBorderColor),
            borderWidth: 1
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }
});

testChart.update();
