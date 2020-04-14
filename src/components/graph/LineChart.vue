<script>
import { Line, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Line,
  mixins: [reactiveProp],
  mounted: function() {
    this.renderChart(this.chartData, {
      responsive: true,
      maintainAspectRatio: false,
      tooltips: {
        callbacks: {
          label: function(tooltipItem, data) {
            var label = data.labels[tooltipItem.index] || '';
            var value = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] || 0;

            return label + ": ₹" + value; // should have replaced with &#8377;
          },
          title: function() { return null; }
        }
      }
    });
  }
}
</script>
