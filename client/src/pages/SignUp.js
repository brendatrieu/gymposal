import { useAlert } from '../context/AppContext';
import { FormControl, TextField, Typography, Button, Box } from '@mui/material';
import FormBox from '../components/FormBox';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { postNewAccount } from '../lib/api';

export default function SignUp() {
  const { register, handleSubmit } = useForm();
  const { setAlert } = useAlert();
  const navigate = useNavigate();

  async function onSubmit(account) {
    try {
      let response = await postNewAccount(account);
      if (response.ok) {
        navigate('/');
      setAlert('AccountSaved');
      }
    } catch (err) {
      console.error(err);
      setAlert('ErrorOccurred', err);
    }
  }

  return (
    <div>
      <FormBox my={4} sx={{ flexGrow: 1 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl direction="column" fullWidth >
            <Typography variant="h4">
             Create New Account
            </Typography>
            <TextField
              required
              label="First Name"
              {...register("firstName")}
              sx={{ marginY: 3 }}
            />
            <TextField
              required
              label="Last Name"
              {...register("lastName")}
              sx={{ marginY: 3 }}
            />
            <TextField
              required
              label="Email Address"
              {...register("email")}
              sx={{ marginY: 3 }}
            />
            <TextField
              required
              label="Username"
              {...register("username")}
              sx={{ marginY: 3 }}
            />
            <TextField
              required
              label="Password"
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
