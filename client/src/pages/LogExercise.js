import React from 'react';
import { useState, useEffect } from 'react';
import {useUser, useAlert} from '../context/AppContext';
import { FormControl, TextField, Autocomplete, Typography, Button, Box, CircularProgress } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers-pro';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import FormBox from '../components/FormBox';
import { useForm, Controller } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { fetchExerciseTypes, postNewLog } from '../lib/api';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import dayjsPluginUTC from 'dayjs-plugin-utc';

dayjs.extend(weekOfYear);
dayjs.extend(dayjsPluginUTC);

export default function LogExercise() {
  const { control, register, handleSubmit } = useForm();
  const [ exerciseTypes, setExerciseTypes ] = useState();
  const { user } = useUser();
  const { setAlert } = useAlert();
  const navigate = useNavigate();
  const [ isLoading, setIsLoading ] = useState(true);
  const [ error, setError ] = useState();

  useEffect(() => {
    if (!user) return navigate('/sign-in');
    async function loadTypes() {
      try {
        setIsLoading(true);
        const res = await fetchExerciseTypes();
        setExerciseTypes(res);
      } catch (err) {
        setError(err);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    loadTypes();
  }, [user, navigate]);

  async function OnSubmit(newLog) {
    try {
      newLog.userId = user.userId;
      newLog.date = dayjs(newLog.date).utc();
      newLog.week = dayjs(newLog.date).utc().week();
      newLog.month = dayjs(newLog.date).utc().month() + 1;
      await postNewLog(newLog);
      setAlert({ severity: 'success', message: 'Exercise successfully saved.' });
      navigate('/dashboard');
    } catch (err) {
      setAlert({ severity: 'error', message: 'An unexpected error has occurred.' });
    }
  }

  if (isLoading) return <div style={{ display: 'flex', justifyContent: 'center', margin: '10rem auto' }} ><CircularProgress /></div>;
  if (error) return <div>Error Loading Form: {error.message}</div>;

  return (
    <div>
      <FormBox my={4} sx={{ flexGrow: 1 }}>
        <form onSubmit={handleSubmit(OnSubmit)}>
          <FormControl direction="column" fullWidth >
            <Typography variant="h4">Log Exercise</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs} >
              <Controller
                name="date"
                control={control}
                defaultValue={dayjs().local()}
                render={({ field }) => (
                  <DatePicker
                    {...field}
                    required
                    inputRef={field.ref}
                    defaultValue={dayjs().local()}
                    sx={{ marginY: 3 }}
                  />
                  )
                }
              />
            </LocalizationProvider>
            <TextField
              required
              type="number"
              label="Total Minutes"
              inputProps={{ min: 1 }}
              {...register("totalMinutes")}
            />
            <Autocomplete
              id="highlights-demo"
              options={exerciseTypes}
              getOptionLabel={(option) => option.type}
              renderInput={(params) => (
                <TextField {...params}
                  required
                  label="Exercise Type"
                  sx={{ marginY: 3 }}
                  {...register("type")}
                />
              )}
              renderOption={(props, option, { inputValue }) => {
                const matches = match(option.type, inputValue, { insideWords: true });
                const parts = parse(option.type, matches);
                return (
                  <li {...props}>
                    <div>
                      {parts.map((part, index) => (
                        <span
                          key={index}
                          style={{
                            fontWeight: part.highlight ? 700 : 400,
                          }}
                        >
                          {part.text}
                        </span>
                      ))}
                    </div>
                  </li>
                );
              }}
            />
            <Box display="flex" flexWrap="wrap" justifyContent="flex-end">
              <Button type="submit"
                sx={{ ml: 2, mt: 2 }}
                variant="contained"
              >
                Submit
              </Button>
              <Link to='/dashboard'>
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
