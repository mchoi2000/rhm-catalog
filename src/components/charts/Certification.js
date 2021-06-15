import React, { Component } from 'react';
import Chart from 'react-apexcharts';

class Levels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        chart: {
          background: '#f4f4f4',
          foreColor: '#333',
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 3,
            left: 3,
            blur: 5,
            opacity: 0.2,
          },
          toolbar: {
            show: false,
          },
        },
        xaxis: {
          categories: [
            '1 - Basic Install',
            '2 - Seamless Upgrades',
            '3 - Full Lifecycle',
            '4 - Deep Insights',
            '5 - Auto Pilot',
          ],
        },
        plotOptions: {
          bar: {
            horizontal: false,
          },
        },
        fill: {
          colors: ['#3e517a'],
        },
        dataLabels: {
          enabled: true,
        },
        title: {
          text: 'Products by Operator Capabilities Level',
          align: 'center',
          margin: 20,
          offsetY: 10,
          style: {
            fontSize: 20,
          },
        },
      },
      series: [
        {
          name: 'Products',
          data: [],
        },
      ],
    };
  }

  render() {
    this.state.series[0]['data'] = this.props.levels();

    return (
      <div className="rhm-single-chart">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height="500"
          width="100%"
        />
      </div>
    );
  }
}

export default Levels;
