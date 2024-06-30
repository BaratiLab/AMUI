import Highcharts from 'highcharts';
import highcharts3d from 'highcharts/highcharts-3d';
import HighchartsReact from 'highcharts-react-official';

highcharts3d(Highcharts)

const data = []
for (let i = 0; i < 10; i++) {
  for (let j = 0; j < 10; j++) {
    data.push([i/ 10, j/ 10, (i * j)/100])
  }
}

console.log(data)

const options = {
  chart: {
      margin: 100,
      type: 'scatter3d',
      animation: false,
      options3d: {
          enabled: true,
          alpha: 10,
          beta: 30,
          depth: 250,
          viewDistance: 5,
          fitToPlot: false,
          frame: {
              bottom: { size: 1, color: 'rgba(0,0,0,0.02)' },
              back: { size: 1, color: 'rgba(0,0,0,0.04)' },
              side: { size: 1, color: 'rgba(0,0,0,0.06)' }
          }
      }
  },
  title: {
      text: 'Draggable box'
  },
  subtitle: {
      text: 'Click and drag the plot area to rotate in space'
  },
  plotOptions: {
      scatter3d: {
          width: 10,
          height: 10,
          depth: 10
      }
  },
  yAxis: {
      min: 0,
      max: 1,
      title: null
  },
  xAxis: {
      min: 0,
      max: 1,
      gridLineWidth: 1
  },
  zAxis: {
      min: 0,
      max: 100,
      showFirstLabel: false
  },
  legend: {
      enabled: false
  },
  series: [{
      name: 'Data',
      colorByPoint: true,
      accessibility: {
          exposeAsGroupOnly: true
      },
      type: 'scatter3d',
      data: data
  }]
};

const HighchartsScatterPlot = () => {
  function addMouseAndTouch (chart) {
      function dragStart(eStart) {
          eStart = chart.pointer.normalize(eStart);

          const posX = eStart.chartX,
              posY = eStart.chartY,
              alpha = chart.options.chart.options3d.alpha,
              beta = chart.options.chart.options3d.beta,
              sensitivity = 5,  // lower is more sensitive
              handlers = [];

          function drag(e) {
              // Get e.chartX and e.chartY
              e = chart.pointer.normalize(e);

              chart.update({
                  chart: {
                      options3d: {
                          alpha: alpha + (e.chartY - posY) / sensitivity,
                          beta: beta + (posX - e.chartX) / sensitivity
                      }
                  }
              }, undefined, undefined, false);
          }

          function unbindAll() {
              handlers.forEach(function (unbind) {
                  if (unbind) {
                      unbind();
                  }
              });
              handlers.length = 0;
          }

          handlers.push(Highcharts.addEvent(document, 'mousemove', drag));
          handlers.push(Highcharts.addEvent(document, 'touchmove', drag));


          handlers.push(Highcharts.addEvent(document, 'mouseup', unbindAll));
          handlers.push(Highcharts.addEvent(document, 'touchend', unbindAll));
      }
      Highcharts.addEvent(chart.container, 'mousedown', dragStart);
      Highcharts.addEvent(chart.container, 'touchstart', dragStart);
  };
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={options}
      callback={addMouseAndTouch}
    />
  );
};

export default HighchartsScatterPlot;

