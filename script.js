document.addEventListener("DOMContentLoaded", () => {
  const button = document.getElementById("btn");
  if (button) {
    button.addEventListener("click", calculateBMI);
    displayChart();
  }
});

function calculateBMI() {
  const height = parseInt(document.getElementById('height').value);
  const weight = parseInt(document.getElementById('weight').value);
  const result = document.getElementById('output');
  let valid = true;

  if (!height || isNaN(height) || height <= 0) {
    document.getElementById('height_error').textContent = "Please enter valid height";
    valid = false;
  } else {
    document.getElementById('height_error').textContent = "";
  }

  if (!weight || isNaN(weight) || weight <= 0) {
    document.getElementById('weight_error').textContent = "Please enter valid weight";
    valid = false;
  } else {
    document.getElementById('weight_error').textContent = "";
  }

  if (!valid) {
    result.textContent = '';
    return;
  }

  const bmi = (weight / ((height * height) / 10000)).toFixed(2);
  let status = "";

  if (bmi < 18.6) {
    status = "Underweight";
  } else if (bmi >= 18.6 && bmi < 24.9) {
    status = "Normal";
  } else {
    status = "Overweight";
  }

  result.innerText = `${status} : ${bmi}`;

  // Save to PHP + MySQL via AJAX
  // Save to PHP + MySQL via AJAX
const xhr = new XMLHttpRequest();
xhr.open("POST", "save_bmi.php", true);
xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhr.send(`height=${height}&weight=${weight}&bmi=${bmi}`);

  saveToHistory(bmi);
  displayChart();
}

function saveToHistory(bmi) {
  const user = localStorage.getItem("currentUser");
  const key = `bmiHistory_${user}`;
  let history = JSON.parse(localStorage.getItem(key)) || [];

  history.push({
    date: new Date().toLocaleString(),
    value: parseFloat(bmi)
  });

  localStorage.setItem(key, JSON.stringify(history));
}

function displayChart() {
  const user = localStorage.getItem("currentUser");
  const key = `bmiHistory_${user}`;
  const history = JSON.parse(localStorage.getItem(key)) || [];

  const labels = history.map(entry => entry.date);
  const values = history.map(entry => entry.value);
  const ctx = document.getElementById("bmiChart").getContext("2d");

  if (window.myChart) window.myChart.destroy();

  window.myChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [{
        label: "BMI History",
        data: values,
        borderColor: "#fff",
        backgroundColor: "rgba(255,255,255,0.2)",
        borderWidth: 2,
        fill: true,
        tension: 0.3
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: false
        }
      },
      plugins: {
        legend: {
          labels: {
            color: "white"
          }
        }
      }
    }
  });
}

function downloadChart() {
  const canvas = document.getElementById("bmiChart");
  const link = document.createElement("a");
  link.download = "bmi-history-chart.png";
  link.href = canvas.toDataURL();
  link.click();
}

function logout() {
  localStorage.removeItem("loggedIn");
  localStorage.removeItem("currentUser");
  window.location.href = "login.html";
}
