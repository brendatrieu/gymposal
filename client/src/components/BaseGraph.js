import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
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
  Legend
);

export default function BaseGraph({exercises}) {

  const labels = exercises.map((item) => item.date);
  const log = exercises.map((item) => item.totalMinutes);
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    devicePixelRatio: 2,
    borderJoinStyle: 'bevel',
    plugins: {
      legend: {
        display: false
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
    },
  };


  const data = {
    labels,
    datasets: [
      {
        label: 'Total Minutes',
        data: labels.map((index) => log[labels.indexOf(index)]),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
        tension: 0.1
      },
    ],
  };

  return (
    <>
      {(!exercises.length) &&
        <div style={{position: 'absolute',
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
