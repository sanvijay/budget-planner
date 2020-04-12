<script>
import { Doughnut, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Doughnut,
  mixins: [reactiveProp],
  mounted: function() {
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var label = data.labels[tooltipItem.index] || '';
            var value = data.datasets[0].data[tooltipItem.index] || 0;

            var total = data.datasets[0].data.reduce(function(total, num) { return total + num; });

            var percent = ((value / total) * 100).toFixed(2);

            return label + ": ₹" + value + " (" + percent + "%)"; // should have replaced with &#8377;
          }
        }
      }
    });
  }
}
</script>
