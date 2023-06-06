import BaseGraph from './BaseGraph';

export default function ExerciseInfo() {
  const data = [
    { date: '01/01/2023', type: 'Running', totalMinutes: 45 },
    { date: '01/03/2023', type: 'Yoga', totalMinutes: 60 },
    { date: '01/04/2023', type: 'Lift Weights', totalMinutes: 30 },
    { date: '01/02/2023', type: 'Hiking', totalMinutes: 90 },
    { date: '01/05/2023', type: 'H.I.I.T.', totalMinutes: 45 },
  ];

  return (
    <div >

      <div style={{ width: '40%', margin: '1rem' }}>
        <img src='./graph_example.png' alt="A graph showing total minutes of exercise per day." />
      </div>
    </div>
  )
}
