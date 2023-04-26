import { useUser, useAlert } from '../context/AppContext';
import { FormControl, TextField, MenuItem, Typography, Button, Box } from '@mui/material';
import FormBox from '../components/FormBox';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { postNewGroup } from '../lib/api';

export default function CreateGroup() {
  const { register, handleSubmit } = useForm();
  const { userId } = useUser();
  const { setAlert } = useAlert();
  const navigate = useNavigate();

  async function OnSubmit(group) {
    group.userId = userId;
    try {
      await postNewGroup(group);
      setAlert('GroupSaved');
      navigate('/');
    } catch (err) {
      setAlert('ErrorOccurred', err);
    }
  }

  return (
    <div>
      <FormBox my={4} sx={{ flexGrow: 1 }}>
        <form onSubmit={handleSubmit(OnSubmit)}>
          <FormControl direction="column" fullWidth >
            <Typography variant="h4">Create New Group</Typography>
            <TextField
              required
              label="Group Name"
              {...register("groupName")}
              sx={{ marginY: 3 }}
            />
            <TextField
              required
              type="number"
              label="Exercise Frequency per Interval"
              inputProps={{ min: 1 }}
              {...register("frequencyReq")}
            />
            <TextField
              required
              select
              label="Exercise Interval"
              defaultValue="Weekly"
              sx={{ marginY: 3 }}
              {...register("intervalReq")}
            >
              <MenuItem key="weekly" value="Weekly">
                Weekly
              </MenuItem>
              <MenuItem key="monthly" value="monthly">
                Monthly
              </MenuItem>
            </TextField>
            <TextField
              required
              type="number"
              label="Exercise Duration in Minutes"
              inputProps={{ min: 1 }}
              {...register("durationReq")}
            />
            <TextField
              type="number"
              label="Bet Amount"
              inputProps={{ min: 0 }}
              sx={{ marginTop: 3 }}
              {...register("betAmount")}
            />
            <TextField
              type="number"
              label="Number of Free Passes per Year"
              inputProps={{ min: 0 }}
              sx={{ marginY: 3 }}
              {...register("passQty")}
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
