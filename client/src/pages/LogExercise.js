import React from 'react';
import { FormControl, TextField, Autocomplete, Typography, Button, Box } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers-pro';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import parse from 'autosuggest-highlight/parse';
import match from 'autosuggest-highlight/match';
import FormBox from '../lib/FormBox';
import { useForm, Controller } from "react-hook-form";

// onChange={(newValue) => setValue(newValue)}

export default function LogExercise() {
  const { register, handleSubmit } = useForm();
  const onSubmit = data => console.log(data);

  return (
    <FormBox my={4} sx={{ flexGrow: 1 }}>
      <FormControl direction="column"
        justifyContent="center"
        alignItems="center"
        fullWidth
        onSubmit={handleSubmit(onSubmit)}>
          <Typography variant="h4">Log Exercise</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs} >
            <DatePicker required defaultValue={dayjs()} sx={{ marginY: 3 }} />
          </LocalizationProvider>
          <TextField
          required
          type="number"
          label="Total Minutes"
          inputProps={{min:0}} />
            <Autocomplete
              id="highlights-demo"
              options={top100Films}
              getOptionLabel={(option) => option.title}
              renderInput={(params) => (
                <TextField {...params} required label="Exercise Type" sx={{ marginY: 3 }} />
              )}
              renderOption={(props, option, { inputValue }) => {
                const matches = match(option.title, inputValue, { insideWords: true });
                const parts = parse(option.title, matches);
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
              <Button sx={{ ml: 2, mt: 2 }} variant="contained">Submit</Button><Button sx={{ml: 2, mt: 2}} variant="outlined">Cancel</Button>
            </Box>
      </FormControl>
    </FormBox>
  )
}

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 }];
