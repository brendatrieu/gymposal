import OverviewInfo from '../components/OverviewInfo';
import ExerciseInfo from '../components/ExerciseInfo';
import GroupsInfo from '../components/GroupsInfo';

export default function About() {

 return (
  <div>
    <section>
      <OverviewInfo />
    </section>
    <section>
      <ExerciseInfo />
    </section>
    <section>
      <GroupsInfo />
    </section>
  </div>
 )
}
