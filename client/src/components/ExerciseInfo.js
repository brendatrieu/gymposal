import EnhancedTable from './BaseTable';
import BaseGraph from './BaseGraph';
import {personalLogHeaders} from '../lib/tables-config';

export default function ExerciseInfo() {
  const data = [
    { date: '01/01/2023', type: 'Running', totalMinutes: 45 },
    { date: '01/03/2023', type: 'Yoga', totalMinutes: 60 },
    { date: '01/04/2023', type: 'Lift Weights', totalMinutes: 30 },
    { date: '01/02/2023', type: 'Hiking', totalMinutes: 90 },
    { date: '01/05/2023', type: 'H.I.I.T.', totalMinutes: 45 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ width: '40%', margin: '1rem' }}>
        <EnhancedTable
          rows={data}
          rowKey={data.date}
          tableName="Exercise Log"
          headers={personalLogHeaders}
        />
      </div>
      <div style={{ width: '40%', margin: '1rem' }}>
        <BaseGraph
          exercises={data}
        />
      </div>
    </div>
  )
}
