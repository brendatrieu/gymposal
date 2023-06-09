import OverviewInfo from '../components/OverviewInfo';
import ExerciseInfo from '../components/ExerciseInfo';
import GroupsInfo from '../components/GroupsInfo';
import { useAlert, useUser } from '../context/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { postAccount } from '../lib/api';
import { FlexTypographyMedium } from '../components/FlexTypography';

export default function Home() {
  const { setAlert } = useAlert();
  const { user, setUser, tokenKey } = useUser();
  const navigate = useNavigate();

  async function demoAccount() {
    const account = { username: 'ronweasley', password: 'Password1!' }
    const response = await postAccount(account);
    if (!response) return setAlert({ severity: 'error', message: 'An unexpected error has occurred.' });
    const { user, token } = response;
    localStorage.setItem(tokenKey, token);
    setUser(user);
    navigate('/dashboard');
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
     <section style={{ backgroundColor: 'rgba(251, 251, 251, 0.1)', padding: '24px' }}>
      <FlexTypographyMedium align="center" >
        <strong>
          Ready to give it a try? <br />
          {user ?
             (<>
             Head to the <Link to='/dashboard'
                style={{
                  textDecoration: 'none',
                  fontWeight: 700,
                  color: '#60D3EA'
                }}
              >
                dashboard </Link> to get started.
             </>) :
            (<>
            <Link to='/sign-up'
              style={{
                textDecoration: 'none',
                fontWeight: 700,
                color: '#60D3EA'
              }}
            >
              Sign up </Link> for free or <br />
              preview the app using a <Link onClick={demoAccount}
              style={{
                textDecoration: 'none',
                fontWeight: 700,
                color: '#60D3EA'
              }}
            >
              guest account.
            </Link>
               </>)
          }
        </strong>
      </FlexTypographyMedium>
    </section>
  </div>
 )
}
