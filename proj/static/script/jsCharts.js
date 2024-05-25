import { mySeriesColor } from './seriesColors.js'

export function addDataSetsX(chart, label, newData) {
  chart.data.datasets.push( 
    {
      label: label,
      data: newData,
      borderColor: mySeriesColor.get(label),
    }
  );
  chart.update();
}

export function createScatterPlot(canvas, backgroundColor, label, dataSet){
  Chart.defaults.font.family = "poppins, sans-serif";
  Chart.defaults.font.size = 13;
  Chart.defaults.color = 'white';

  const data = {
    datasets: [{
      label: '',
      data: dataSet, // must be in x, y structure: data: [{x: 'value', y: 'value}, {}, {}, ...]
      backgroundColor: backgroundColor
    }],
  }

  const newChart = new Chart(
    canvas,
    {
      type: 'scatter',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'linear',
            position: {
              y: 0
            },
            beginAtZero: false,
            border:{
              color: 'brown'
            }
          },
          y: {
            position:{
              x: 0
            },
            beginAtZero: false,
            border:{
              color: 'brown'
            }
          },
        },
        plugins: {
          title: {
            display: true,
            text: label
          },
          legend: {
            display: false,
          }
        }
      }
    }
  )
}

export function createStackedBar(categories, yrs, vals, canvas, title) {

  //two story stack bar

  Chart.defaults.font.family = "poppins, sans-serif";
  Chart.defaults.font.size = 13;
  Chart.defaults.color = 'white';

  const data = {
    labels: yrs,
    datasets: [ //smallest dataset to largest
      {
        label: categories[1], 
        data:  vals[1],
        backgroundColor: mySeriesColor.get(categories[1]),
        borderWidth: 1
      },
      {
        label: categories[0],
        data: vals[0],
        backgroundColor: mySeriesColor.get(categories[0]),
        borderWidth: 1,
      },
    ]
  }

  const newChart = new Chart(

      canvas,
    {
      type: 'bar',
      data: data,
      options: {
        plugins: {
          title: {
            display: true,
            text: title
          },
        },
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true,
          }
        }
      }
    }
  )
}

export function createTimeSeries(category, yrs, vals, canvas, addSets, addLabels, title) {
  
    Chart.defaults.font.family = "poppins, sans-serif"; //"Times, 'Times New Roman', serif, Georgia";
    Chart.defaults.font.size = 13;
    Chart.defaults.elements.line.tension = 0.4;
    Chart.defaults.color = 'white';
    Chart.defaults.elements.point.radius = 2; //point radius on line

    const newChart = new Chart(
        canvas,
      {
        type: 'line',
        options: {
          maintainAspectRatio: false,
          responsive: true,
          animation: {
            duration: 2000,
          },
          interaction: { 
            mode: 'x', //used for interactions based on x coord
          },
          plugins: {
            customCanvasBackgroundColor: {
              color: 'transparent',
            },
            legend: {
              display: true,
              labels:{
                usePointStyle: true,
              },
              title: {
                display: true,
                text: title,
                font: {
                  weight: 'bold',
                },
                padding: 10,
              }
            },
            tooltip: {
              enabled: true,
              usePointStyle: true, 
              callbacks: {
                // labelColor: function(context) {
                //     return {
                //         //borderColor: 'rgb(0, 0, 255)',
                //         //backgroundColor: 'transparent',
                //         borderWidth: 5,
                //         //borderDash: [2, 2],
                //         //borderRadius: 2,
                //     };
                // },
                labelPointStyle: function(context) {
                  return {
                      pointStyle: 'line',
                  };
                }
              }
            },
            // colors: { 
            //     forceOverride: true // uses default colors for each dataset
            // }
          },
          scales: {
            x: {
              grid: {
                display: true,
                color: 'lightcoral',
                drawTicks: false,
              }
            },
            y: {
              grid: {
                display: false,
                color: 'lightgray',
                drawTicks: false,
              }
            },
          }
        },
        plugins: [ plugin ],
        data: {
          labels: yrs,  
          datasets: [ 
            {
              label: category, //name of dataset 
              data: vals,
              backgroundColor: 'transparent',
              borderColor: mySeriesColor.get(category),
            }
          ],
        }
      }
    );

    //addSets --nested list, addLabels--list, should be of same length (one label for each nested list)
    for (const idx in addSets){
      addDataSetsX(newChart, addLabels[idx], addSets[idx])
    }

};

const plugin = {
    id: 'customCanvasBackgroundColor',
    beforeDraw: (chart, args, options) => {
      const {ctx} = chart;
      ctx.save();
      ctx.globalCompositeOperation = 'destination-over';
      ctx.fillStyle = options.color || '#99ffff';
      ctx.fillRect(0, 0, chart.width, chart.height);
      ctx.restore();
    }
}



