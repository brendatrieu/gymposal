import React from 'react';
import { FormControl, TextField, Autocomplete } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers-pro';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';


// onChange={(newValue) => setValue(newValue)}


export default function LogExercise() {

  return (
    <FormControl>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker defaultValue={dayjs()} />
      </LocalizationProvider>
      <TextField
        required
        type="number"
        id="outline-required"
        label="Total Minutes"
        inputProps={{min:0}} />
    </FormControl>
  )
}
