import { Component, OnInit,AfterViewInit  } from '@angular/core';
import { SinistersService, Sinister } from 'src/app/services/sinisters.service';
import 'chartjs-adapter-date-fns'; // Import the date adapter
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

      const chartConfig: ChartConfiguration = {
        type: 'line',
        data: {
          labels: labels,
          datasets: [
            {
              label: 'Accepted',
              data: acceptedCounts,
              borderColor: 'green',
              backgroundColor: 'rgba(0, 255, 0, 0.2)',
              fill: true,
            },
            {
              label: 'Declined',
              data: declinedCounts,
              borderColor: 'red',
              backgroundColor: 'rgba(255, 0, 0, 0.2)',
              fill: true,
            }
          ],
        },
        options: {
          scales: {
            x: { title: { display: true, text: 'Date' } },
            y: { title: { display: true, text: 'Count' }, beginAtZero: true }
          }
        }
      };

      new Chart('sinisterChart', chartConfig);
    });
  }
}