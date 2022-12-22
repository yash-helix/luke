import { Container } from "@mui/system";
import React, { useState, useEffect } from "react";
import { addJobs, getAllJobs, deleteJob } from "../../apis/admin/jobs";

import { FormLabel, RadioGroup, FormControlLabel, Radio, MenuItem, FormControl, InputLabel, Select, Stack, Button, Typography, TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
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

    const [data, setData] = useState([
        //         {
        //             country: 'India', position: 'IT Recruiter', test_type: 2, _id:"63a44c0cb9ec00378822716c"
        // },
        //         { country: 'Spain', position: 'Chartered Accountant', test_type: 3 },
        //         { country: 'Germany', position: 'Company Secretary', test_type: 1 },
        //         { country: 'USA', position: 'IT Recruiter', test_type: 4 },
        //         { country: 'UK', position: 'Web Developer', test_type: 1 },
        //         { country: 'Russia', position: 'Virtual Assistant', test_type: 2 },
    ]);

    useEffect(
        () => {
            (async () => {
                const data = await getAllJobs();
                setData(data)
            })()
        }, []);

    const handleDelete = async (id, _e) => {
        setData(data.filter((v) => v._id !== id));
        const res = await deleteJob(id);
        console.log(res)
    }

    const [countryOptions, setCountryOptions] = useState(positionData[0].Position);
    const [positionOptions, setPositionOptions] = useState(countryData[0].Country);
    const [type, setType] = useState(1);

    async function submit() {
        const data = await addJobs({ countryOptions, positionOptions, type })
        console.log(data)
    }

    return (
        <>
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
                            value={countryOptions}
                        >
                            {/* <MenuItem value='india'>India</MenuItem>
                        <MenuItem value='usa'>Usa</MenuItem>
                        <MenuItem value='spain'>Spain</MenuItem> */}
                            {countryData.map(country => <MenuItem key={country.id} value={country.Country}>{country.Country}</MenuItem>)}
                        </Select>
                    </FormControl>


                    <FormControl sx={{ m: 2 }}>
                        <InputLabel id="demo-simple-select-label">Position</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            label="Position"
                            onChange={(e) => setPositionOptions(e.target.value)}
                            value={positionOptions}
                        >
                            {/* <MenuItem value="Chartered Accountant">Chartered Accountant</MenuItem>
                        <MenuItem value="Company Secretary">Company Secretary</MenuItem>
                        <MenuItem value="IT Recrutier">IT Recrutier</MenuItem> */}
                            {positionData.map(position => <MenuItem key={position.id} value={position.Position}>{position.Position}</MenuItem>)}

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
            <br />
            <Container sx={{ mb: 5 }}>
                <TableContainer>
                    <Table aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell sx={{ fontWeight: '700' }}>Country</TableCell>
                                <TableCell align="center" sx={{ fontWeight: '700' }}>Position</TableCell>
                                <TableCell align="center" sx={{ fontWeight: '700' }}>Test-Type</TableCell>
                                <TableCell align="center" sx={{ fontWeight: '700' }}>Delete</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data?.map((item) => (
                                <TableRow key={item?._id}>
                                    <TableCell>{item?.country}</TableCell>
                                    <TableCell align="center">{item?.position}</TableCell>
                                    <TableCell align="center">{item?.test_type}</TableCell>
                                    <TableCell align="center"><DeleteIcon sx={{ color: 'red', cursor: 'pointer' }} onClick={e => handleDelete(item?._id, e)} /></TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </>
    )


}

export default AdminCreatesTest;
