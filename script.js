let bmiChart = null;

// Unit Switch Functionality
document.querySelectorAll('.unit-switch').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.unit-switch').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        
        document.getElementById('metric-inputs').classList.toggle('d-none', this.dataset.unit !== 'metric');
        document.getElementById('imperial-inputs').classList.toggle('d-none', this.dataset.unit === 'metric');
        document.querySelector('.result-card').classList.remove('show');
    });
});

// BMI Calculation Function
function calculateBMI() {
    let bmi;
    const isMetric = document.querySelector('.unit-switch.active').dataset.unit === 'metric';

    if(isMetric) {
        const height = parseFloat(document.getElementById('metric-height').value) / 100;
        const weight = parseFloat(document.getElementById('metric-weight').value);
        if(height <= 0 || weight <= 0) return showError();
        bmi = weight / (height * height);
    } else {
        const feet = parseFloat(document.getElementById('imperial-feet').value);
        const inches = parseFloat(document.getElementById('imperial-inches').value);
        const weight = parseFloat(document.getElementById('imperial-weight').value);
        if(feet <= 0 || inches < 0 || weight <= 0) return showError();
        const totalInches = feet * 12 + inches;
        bmi = (weight * 703) / (totalInches * totalInches);
    }

    if(isNaN(bmi)) return showError();
    displayResult(bmi);
}

// Display Results
function displayResult(bmi) {
    const bmiValue = document.getElementById('bmi-value');
    const categoryElement = document.getElementById('bmi-category');
    const progressBar = document.getElementById('bmi-progress');
    const resultCard = document.querySelector('.result-card');
    
    bmiValue.textContent = bmi.toFixed(1);
    
    const categories = [
        { name: 'Underweight', max: 18.5, color: '#3498db' },
        { name: 'Healthy Weight', max: 24.9, color: '#2ecc71' },
        { name: 'Overweight', max: 29.9, color: '#f1c40f' },
        { name: 'Obesity', max: Infinity, color: '#e74c3c' }
    ];

    const currentCategory = categories.find(c => bmi < c.max);
    
    categoryElement.textContent = currentCategory.name;
    categoryElement.style.color = currentCategory.color;
    progressBar.style.backgroundColor = currentCategory.color;
    progressBar.style.width = `${Math.min((bmi / 40) * 100, 100)}%`;
    
    updateChart(currentCategory.name);
    resultCard.classList.add('show');
}

// Pie Chart Functionality
function updateChart(currentCategory) {
    const ctx = document.getElementById('bmiChart').getContext('2d');
    if (bmiChart) bmiChart.destroy();

    bmiChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: ['Underweight', 'Healthy Weight', 'Overweight', 'Obesity'],
            datasets: [{
                data: [18.5, 6.4, 5, 10],
                backgroundColor: [
                    '#3498db80',
                    '#2ecc7180',
                    '#f1c40f80',
                    '#e74c3c80'
                ],
                borderColor: [
                    '#3498db',
                    '#2ecc71',
                    '#f1c40f',
                    '#e74c3c'
                ],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: { enabled: false }
            },
            animation: { duration: 1000 }
        }
    });

    // Highlight current category
    const activeIndex = ['Underweight', 'Healthy Weight', 'Overweight', 'Obesity']
                        .indexOf(currentCategory);
    bmiChart.data.datasets[0].backgroundColor[activeIndex] = 
    bmiChart.data.datasets[0].borderColor[activeIndex];
    bmiChart.update();
}

function showError() {
    alert('Please enter valid numerical values');
}