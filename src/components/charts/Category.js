import React, { Component } from 'react';
import Chart from 'react-apexcharts';

class Category extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        chart: {
          type: 'bar',
          height: '500',
          width: '100%',
          stacked: true,
          background: '#f4f4f4',
          foreColor: '#333',
          dropShadow: {
            enabled: true,
            color: '#000',
            top: 1,
            left: 3,
            blur: 1,
            opacity: 0.2,
          },
          toolbar: {
            show: false,
          },
        },
        colors: ['#3e517a', '#BBB6DF', '#B396AD'],
        xaxis: {
          align: 'top',
          categories: [],
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: true,
        },
        title: {
          text: 'Products by Categories',
          align: 'center',
          margin: 20,
          offsetY: 10,
          style: {
            fontSize: 20,
          },
        },
        legend: {
          position: 'top',
          horizontalAlign: 'right',
          floating: true,
          offsetY: -15,
          offsetX: 0,
        },
      },
      series: [
        {
          name: 'Primary Categories',
          data: [],
        },
        {
          name: 'Secondary Categories',
          data: [],
        },
      ],
    };
  }

  render() {
    const catCounts = this.props.cat2();
    this.state.options.xaxis.categories = catCounts[0];
    this.state.series[0]['data'] = catCounts[1];
    this.state.series[1]['data'] = catCounts[2];

    return (
      <div className="rhm-single-chart">
        <Chart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height="550"
          width="100%"
        />
      </div>
    );
  }
}

export default Category;
