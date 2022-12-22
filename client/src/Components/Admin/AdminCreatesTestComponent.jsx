import { Container } from "@mui/system";
import { FormLabel, RadioGroup, FormControlLabel, Radio, MenuItem, FormControl, InputLabel, Select, Stack, Button, Typography } from '@mui/material';
import React, { useState } from "react";
import addJobs from "../../apis/admin/addJobs";

const AdminCreatesTest = () => {

    const countryData = [
        { Country: 'India', id: '1' },
        { Country: 'Russia', id: '2' },
        { Country: 'Germany', id: '3' },
        { Country: 'Spain', id: '4' }
    ];

    const positionData = [
        { Position: 'Company Secretary', id: '1' },
        { Position: 'IT Recrutier', id: '2' },
        { Position: 'Web Developer', id: '3' },
        { Position: 'Assistant', id: '4' }
    ];

    const [countryOptions, setCountryOptions] = useState('India');
    const [positionOptions, setPositionOptions] = useState('Company Secretary');
    const [type, setType] = useState(1);

    async function submit() {
        const data = await addJobs({ countryOptions, positionOptions, type })
    }

    return (
        <Container sx={{ width: '50%', mt: 10 }}>

            <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
                <Typography sx={{ fontSize: 'larger', fontWeight: '700' }}>Admin Creates Test</Typography>
            </Stack>

            <Stack>
                <FormControl sx={{ m: 2 }}>
                    <InputLabel id="demo-simple-select-label">Country</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Country"
                        onChange={(e) => setCountryOptions(e.target.value)}
                    >
                        <MenuItem value='india'>India</MenuItem>
                        <MenuItem value='usa'>Usa</MenuItem>
                        <MenuItem value='spain'>Spain</MenuItem>
                    </Select>
                </FormControl>


                <FormControl sx={{ m: 2 }}>
                    <InputLabel id="demo-simple-select-label">Position</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        label="Position"
                        onChange={(e) => setPositionOptions(e.target.value)}
                    >
                        <MenuItem value="Chartered Accountant">Chartered Accountant</MenuItem>
                        <MenuItem value="Company Secretary">Company Secretary</MenuItem>
                        <MenuItem value="IT Recrutier">IT Recrutier</MenuItem>
                    </Select>
                </FormControl>

                <FormControl sx={{ m: 2 }}>
                    <FormLabel id="demo-radio-buttons-group-label" sx={{ fontWeight: '700', fontSize: 'larger' }}>Test Type</FormLabel>
                    <RadioGroup
                        row
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="mcq"
                        name="radio-buttons-group"
                        onChange={(e) => setType(parseInt(e.target.value))}
                    >
                        <FormControlLabel value={1} control={<Radio />} label="MCQ's" />
                        <FormControlLabel value={2} control={<Radio />} label="Typing Test" />
                        <FormControlLabel value={3} control={<Radio />} label="MCQ's + Typing Test" />
                        <FormControlLabel value={4} control={<Radio />} label="Typing Test + MCQ's" />
                    </RadioGroup>
                </FormControl>

                <Stack sx={{ justifyContent: 'center', alignItems: 'center', }}>
                    <Button variant="outlined" onClick={submit}>Submit</Button>
                </Stack>

            </Stack>

        </Container>

    )


}

export default AdminCreatesTest;
