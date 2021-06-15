import React, { Component } from 'react';
import Chart from 'react-apexcharts';

class CommercePie extends Component {
  constructor(props) {
    super(props);
    this.state = {
      options: {
        legend: {
          show: true,
          showForSingleSeries: true,
          showForNullSeries: true,
          showForZeroSeries: true,
          position: 'bottom',
          horizontalAlign: 'center',
          floating: false,
          fontSize: '14px',
          fontFamily: 'Helvetica, Arial',
          fontWeight: 200,
          formatter: undefined,
          inverseOrder: false,
          width: undefined,
          height: undefined,
          tooltipHoverFormatter: undefined,
          offsetX: 0,
          offsetY: 0,
          labels: {
            colors: undefined,
            useSeriesColors: false,
          },
        },
        series: [],
        labels: ['Buy & Try', 'Buy only', 'Try only'],
        title: {
          text: 'Products by Edition Type',
          align: 'center',
          margin: 20,
          offsetY: 0,
          style: {
            fontSize: 20,
          },
        },
        colors: ['#3e517a', '#B396AD', '#BBB6DF'],
        plotOptions: {
          pie: {
            customScale: 1,
            offsetX: 0,
            offsetY: 0,
            expandOnClick: true,
            dataLabels: {
              offset: 0,
              minAngleToShowLabel: 10,
            },
            donut: {
              size: '65%',
              background: 'transparent',
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '16px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 600,
                  color: undefined,
                  offsetY: -5,
                },
                value: {
                  show: true,
                  fontSize: '16px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 400,
                  color: undefined,
                  offsetY: 5,
                  formatter: function(val) {
                    return val;
                  },
                },
                total: {
                  show: true,
                  showAlways: false,
                  label: 'Total',
                  fontSize: '16px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 600,
                  color: '#373d3f',
                  formatter: function(w) {
                    return w.globals.seriesTotals.reduce((a, b) => {
                      return a + b;
                    }, 0);
                  },
                },
              },
            },
          },
        },
      },
    };
  }

  render() {
    this.state.options.series = this.props.editions();

    return (
      <div className="rhm-commerce-chart">
        <Chart
          options={this.state.options}
          series={this.state.options.series}
          type="donut"
          height="400"
          width="400"
        />
      </div>
    );
  }
}

export default CommercePie;
