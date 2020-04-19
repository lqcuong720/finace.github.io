import React from 'react';
import ReactApexChart from 'react-apexcharts';
import './MyFinanceChart.css';
import parseCSV from './parseCSV';
import financeData from './data';


export default class extends React.Component {
  get chart() {
    return this.chartRef.current.chart;
  }

  constructor(props) {
    super(props);

    this.chartRef = React.createRef();
    this.state = {
      series: [],
      options: {
        chart: {
          height: 350,
          type: 'line'
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth',
          width: [2, 2, 2, 0]
        },
        xaxis: {
          tickAmount: 8,
          style: {
            fontSize: '12px',
            fontFamily: 'Helvetica, Arial, sans-serif',
            fontWeight: 400,
            cssClass: 'xaxis-label',
          },
          labels: {
            rotate: -45,
            formatter: val => val && val.toFixed(2)
          },
          title: {
            text: 'expected return',
            offsetX: 0,
            offsetY: 0,
            style: {
              color: '#fff',
              fontSize: '16px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              cssClass: 'apexcharts-xaxis-title',
            },
          },
        },
        yaxis: {
          style: {
            cssClass: 'yaxis-label',
          },
          labels: {
            formatter: val => val && val.toFixed(2)
          },
          title: {
            text: 'stdev',
            offsetX: 0,
            offsetY: 0,
            style: {
              color: '#fff',
              fontSize: '16px',
              fontFamily: 'Helvetica, Arial, sans-serif',
              fontWeight: 600,
              cssClass: 'apexcharts-xaxis-title',
            },
          },
        },
        title: {
          text: 'Finance',
          align: 'left',
          offsetX: 14
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          offsetX: -10,
          labels: {
            colors: '#fff',
            useSeriesColors: false
          },
        },
        tooltip: {
          // shared: true
        },
        markers: {
          size: [0, 0, 0, 6],
        }
      },
    };
  }

  componentDidMount() {
    fetch('/data.csv').then(async (res) => {
      const csvContent = await res.text();
      this.updateChart(csvContent);
    }).catch(() => {
      this.updateChart(financeData);
    });
  }

  updateChart(csvContent) {

    const csv = parseCSV(csvContent);
    console.log(csv);

    // ["w", "mean12", "std12", "mean13", "std13", "mean23", "std23"]
    const rows = csv.slice(1);

    const mean12 = rows.map(row => +row[1]);
    const std12 = rows.map(row => +row[2]);
    const serie12 = mean12.map((m12, index) => [m12, std12[index]]);

    const mean13 = rows.map(row => +row[3]);
    const std13 = rows.map(row => +row[4]);
    const serie13 = mean13.map((m13, index) => [m13, std13[index]]);

    const mean23 = rows.map(row => +row[5]);
    const std23 = rows.map(row => +row[6]);
    const serie23 = mean23.map((m23, index) => [m23, std23[index]]);

    const asserts = [
      [20, 4],
      [22, 5],
      [24, 4]
    ];

    this.chart.updateSeries([
      { name: 'portfilios12', data: serie12 },
      { name: 'portfilios13', data: serie13 },
      { name: 'portfilios23', data: serie23 },
      { name: 'Assets', data: asserts }
    ]);
  }
    
  render() {
    return (
      <div id="chart">
        <ReactApexChart
          ref={this.chartRef}
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={350} />
      </div>
    );
  }
}