document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("salesChart");

  if (!ctx) return;

  new Chart(ctx, {
    type: "line",
    data: {
      labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
      datasets: [{
        label: "Monthly Sales",
        data: [120000, 150000, 170000, 160000, 190000, 220000],
        borderWidth: 2,
        fill: false
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
});
