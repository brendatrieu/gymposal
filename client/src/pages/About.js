import OverviewInfo from '../components/OverviewInfo';
import ExerciseInfo from '../components/ExerciseInfo';
import GroupsInfo from '../components/GroupsInfo';
import { FlexTypography } from '../components/FlexTypography';
import { useAlert, useUser } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { postAccount } from '../lib/api';

export default function About() {
  const { setAlert } = useAlert();
  const { setUser, tokenKey } = useUser();
  const navigate = useNavigate();

  async function demoAccount() {
    const account = { username: 'ronweasley', password: 'Password1!' }
    const response = await postAccount(account);
    if (!response) return setAlert({ severity: 'error', message: 'An unexpected error has occurred.' });
    const { user, token } = response;
    localStorage.setItem(tokenKey, token);
    setUser(user);
    navigate('/');
  }

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
    <section>
      <FlexTypography align="center" mb={3}>
        <strong>
          Ready to give it a try? <br />
           Preview the app using a <Link onClick={demoAccount}
             style={{
               textDecoration: 'none',
               fontWeight: 700,
               color: '#60D3EA'
             }}
           >
            guest account.
          </Link>
        </strong>
      </FlexTypography>
    </section>
  </div>
 )
}
