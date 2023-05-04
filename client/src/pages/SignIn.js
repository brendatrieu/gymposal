import { useAlert, useUser } from '../context/AppContext';
import { FormControl, TextField, Typography, Button, Box } from '@mui/material';
import FormBox from '../components/FormBox';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { postAccount } from '../lib/api';

export default function SignIn() {
  const { register, handleSubmit } = useForm();
  const { setAlert } = useAlert();
  const { setUser, tokenKey } = useUser();
  const navigate = useNavigate();

  async function onSubmit(account) {
    const response = await postAccount(account);
    if (!response) return setAlert('InvalidLogin');
    const { user, token } = response;
    localStorage.setItem(tokenKey, token);
    setUser(user);
    navigate('/');
  }

  return (
    <div>
      <FormBox my={4} sx={{ flexGrow: 1, height: '75vh', justifyContent: 'center', display: 'flex', alignItems: 'center' }}>
        <form onSubmit={handleSubmit(onSubmit)} style={{width: '50%'}}>
          <FormControl direction="column" fullWidth >
            <Typography variant="h4">
             Sign In
            </Typography>
            <Typography variant="body2" sx={{paddingTop: 1}}>
              Don't have an account? <Link to='/sign-up'
                style={{ textDecoration: 'none',
                  fontWeight: 700,
                  color: '#add8e6'}}
              >
                Sign up for free
              </Link>
            </Typography>
            <TextField
              required
              label="Username"
              {...register("username")}
              sx={{ marginY: 3 }}
            />
            <TextField
              required
              label="Password"
              type="password"
              {...register("password")}
              sx={{ marginY: 3 }}
            />
            <Box display="flex" flexWrap="wrap" justifyContent="flex-end">
              <Button type="submit"
                sx={{ ml: 2, mt: 2 }}
                variant="contained"
              >
                Submit
              </Button>
              <Link to={"/"}>
                <Button
                  sx={{ ml: 2, mt: 2 }}
                  variant="outlined"
                >
                  Cancel
                </Button>
              </Link>
            </Box>
          </FormControl>
        </form>
      </FormBox>
    </div>
  )
}
