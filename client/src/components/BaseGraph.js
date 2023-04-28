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

  const options = {
    responsive: true,
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

  const labels = exercises.map((item) => item.date);
  const log = exercises.map((item) => item.totalMinutes);
  const data = {
    labels,
    datasets: [
      {
        label: 'Total Minutes',
        data: labels.map((index) => log[labels.indexOf(index)]),
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      },
    ],
  };

  return <Line
            style={{backgroundColor: 'white',
              borderRadius: 4,
              padding: 10}}
            options={options}
            data={data}
          />;
}
