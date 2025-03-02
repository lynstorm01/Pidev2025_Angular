import { Component, OnInit } from '@angular/core';
import { SinistersService } from 'src/app/services/sinisters.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
Chart.register(...registerables);

@Component({
  selector: 'app-sinisterchart',
  templateUrl: './sinisterchart.component.html',
  styleUrls: ['./sinisterchart.component.css']
})
export class SinisterchartComponent implements OnInit {

  constructor(private sinisterService: SinistersService) {}

  ngOnInit(): void {
    this.loadChartData();
  }

  loadChartData(): void {
    this.sinisterService.getStatusCountByDate().subscribe((data) => {
      const labels = Object.keys(data);
      const acceptedCounts = labels.map(date => data[date]['ACCEPTED'] || 0);
      const declinedCounts = labels.map(date => data[date]['DECLINED'] || 0);

      // Calculate totals for Accepted and Declined
      const totalAccepted = acceptedCounts.reduce((sum, count) => sum + count, 0);
      const totalDeclined = declinedCounts.reduce((sum, count) => sum + count, 0);

      // Pie chart configuration
      const chartConfig: ChartConfiguration = {
        type: 'pie', // Change chart type to 'pie'
        data: {
          labels: ['Accepted', 'Declined'], // Labels for the pie chart
          datasets: [{
            label: 'Status Counts',
            data: [totalAccepted, totalDeclined], // Data for the pie chart
            backgroundColor: ['green', 'red'], // Colors for the pie segments
          }]
        },
        options: {
          responsive: true, // Make the chart responsive
          plugins: {
            legend: {
              position: 'top', // Position the legend at the top
            },
            title: {
              display: true,
              text: 'Sinister Status Distribution' // Chart title
            }
          }
        }
      };
      console.log('Data:', data);
console.log('Total Accepted:', totalAccepted);
console.log('Total Declined:', totalDeclined);

      // Create the chart
      new Chart('sinisterChart', chartConfig);
    });
  }
}