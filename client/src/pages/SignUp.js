import { useState } from 'react';
import { useAlert, useUser } from '../context/AppContext';
import { FormControl, TextField, Typography, Button, IconButton, Box, InputAdornment } from '@mui/material';
import FormBox from '../components/FormBox';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { postAccount, postNewAccount } from '../lib/api';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

export default function SignUp() {
  const { register, formState: { errors }, handleSubmit } = useForm();
  const { setUser, tokenKey } = useUser();
  const {  setAlert } = useAlert();
  const navigate = useNavigate();
  const [ firstPw, setFirstPw ] = useState();
  const [ isValid, setIsValid ] = useState(true);
  const [ pwVisibile, setPwVisibile ] = useState(false);
  const [ confirmPwVisibile, setConfirmPwVisibile ] = useState(false);

  function validate(e) {
    const typedPw = e.target.value;
    setIsValid(typedPw === firstPw);
  }

  async function onSubmit(account) {
    try {
      if (!isValid) return;
      const response = await postNewAccount(account);
      if (!response) return setAlert({ severity: 'error', message: 'An unexpected error has occurred. Please try again.' });
      const login = await postAccount(account);
      if (!login) return setAlert({ severity: 'error', message: 'An unexpected error has occurred. Please try again.' });
      const { user, token } = login;
      localStorage.setItem(tokenKey, token);
      setUser(user);
      setAlert({ severity: 'success', message: 'Account successfully created.' });
      navigate('/dashboard');
    } catch{
      setAlert({ severity: 'success', message: 'Account successfully created.' });
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
              {...register("firstName", { maxLength: 20 })}
              sx={{ marginY: 3 }}
              error={!!errors.firstName}
              helperText={errors.firstName?.type === 'maxLength' && 'The maximum character limit is 20.'}
            />
            <TextField
              required
              label="Last Name"
              {...register("lastName", { maxLength: 20 })}
              sx={{ marginY: 3 }}
              error={!!errors.lastName}
              helperText={errors.lastName?.type === 'maxLength' && 'The maximum character limit is 20.'}
            />
            <TextField
              required
              label="Email Address"
              {...register("email", { pattern: {value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }})}
              sx={{ marginY: 3 }}
              error={!!errors.email}
              helperText={errors.email?.type === 'pattern' && 'Please enter a valid email.'}
            />
            <TextField
              required
              label="Username"
              {...register("username", { maxLength: 20 })}
              sx={{ marginY: 3 }}
              error={!!errors.username}
              helperText={errors.username?.type === 'maxLength' && 'The maximum character limit is 20.'}
            />
            <span>
              <ul style={{paddingLeft: 0, marginTop: 0}}>Passwords must meet the following criteria:</ul>
                <li>Include between 8-22 characters.</li>
                <li>Include at least one number.</li>
                <li>Include at least one uppercase letter.</li>
                <li>Include at least one lowercase letter.</li>
                <li>Include at least one special character
                  (!, @, #, $, %, ^, &, *, (, or )).</li>
            </span>
            <TextField
              required
              inputProps={{'data-testid': "password"}}
              label="Password"
              type={pwVisibile ? 'text' : 'password'}
              {...register("passwordDraft", { pattern: { value: /(?=.*[!@#$%^&*()])(?=.*\d)(?=.*[A-Z])(?=.*[a-z]).*/ }, onChange: (e) => setFirstPw(e.target.value) })}
              sx={{ marginY: 3 }}
              error={!!errors.passwordDraft}
              helperText={errors.passwordDraft?.type === 'pattern' && 'Your password does not meet all the requirements.'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setPwVisibile(!pwVisibile)}>
                      {pwVisibile ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            <TextField
              required
              label="Confirm Password"
              type={confirmPwVisibile ? 'text' : 'password'}
              {...register("password", {onChange: (e) => validate(e)})}
              sx={{ marginY: 3 }}
              error={!isValid}
              helperText={!isValid && 'Your passwords do not match.'}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setConfirmPwVisibile(!confirmPwVisibile)}>
                      {confirmPwVisibile ? <VisibilityIcon /> : <VisibilityOffIcon /> }
                    </IconButton>
                  </InputAdornment>
                ),
              }}
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
