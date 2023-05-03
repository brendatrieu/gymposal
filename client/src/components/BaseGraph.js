import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Typography } from '@mui/material';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

export default function BaseGraph({exercises, legend}) {

  const labels = [];
  const allDatasets = {};

  for (let e = 0; e < exercises.length; e++) {
    const current = exercises[e];
    if (labels.indexOf(current.date) === -1) {
      labels.push(current.date);
    }
    if (!allDatasets[current.firstName]) {
      allDatasets[current.firstName] = [current];
    } else {
      allDatasets[current.firstName].push(current);
    }
  }

  const data = {
    labels,
    datasets: Object.values(allDatasets).map((d) => {
      return {
        label: legend ? d[0].firstName : 'Total Minutes',
        data: labels.map((label) =>
        (!d.filter((entry) => entry.date === label).length) ?
        0 :
        d.filter((entry) => entry.date === label)[0].totalMinutes),
        tension: 0.1
      }
    }),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2,
    plugins: {
      legend: {
        display: legend,
        position: 'bottom'
      },
      title: {
        display: true,
        text: 'Total Minutes per Day',
        color: '#151a26',
        font: {
          size: 23
        },
        align: 'center',
        padding: {
          top: 10,
          bottom: 10
        }
      },
      colors: {
        forceOverride: true
      }
    },
  };

  return (
    <>
      {(!exercises.length) &&
        <div
          style={{position: 'absolute',
            padding: '15%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'black',
            height: '100%',
            width: '100%',
            textAlign: 'center'}}
        >
          <Typography
            variant='h5'
            sx={{ backgroundColor: 'rgba(33,76,103, 0.25)',
              borderRadius: 1,
              padding: '5%' }}
          >
            No exercises for this week yet.
          </Typography>
        </div>}
      <Line
        style={{backgroundColor: 'white',
          borderRadius: 4,
          padding: 10,
          height: '100%'}}
        options={options}
        data={data}
      />
    </>
  )
}
