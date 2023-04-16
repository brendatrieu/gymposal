import React from 'react';
import { useState, useEffect } from 'react';
import { FormControl, TextField, Autocomplete, Typography, Button, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers-pro';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import FormBox from '../components/FormBox';
import { useForm } from "react-hook-form";
import { Link } from 'react-router-dom';
import { fetchExerciseTypes } from '../lib/api';

export default function LogExercise() {
  const { register, handleSubmit } = useForm();
  const onSubmit = data => console.log(data);

  const exerciseTypes=[{type: 'bike'}, {type: 'run'}];

  const [type, setType] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

    useEffect(() => {
    async function loadCatalog() {
      try {
        const type = await fetchExerciseTypes();
        console.log('TYPE', type);
        setType(type);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    }
    setIsLoading(true);
    loadCatalog();
  }, []);
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error Loading Catalog: {error.message}</div>;

  return (
    <div>
      <FormBox my={4} sx={{ flexGrow: 1 }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FormControl direction="column" fullWidth >
            <Typography variant="h4">Log Exercise</Typography>
            <LocalizationProvider dateAdapter={AdapterDayjs} >
              <DatePicker
                required
                defaultValue={dayjs()}
                sx={{ marginY: 3 }}
                {...register("date")}
              />
            </LocalizationProvider>
            <TextField
              required
              type="number"
              label="Total Minutes"
              inputProps={{ min: 0 }}
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
              <Link to="/">
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
