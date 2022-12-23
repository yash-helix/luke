import { Container } from "@mui/system";
import React, { useState, useEffect, useRef } from "react";
import { addJobs, getAllJobs, deleteJob } from "../../apis/admin/jobs";
import Multiselect from "multiselect-react-dropdown"
import { FormLabel, TextField, Checkbox, FormGroup, Grid, FormControlLabel, Radio, MenuItem, FormControl, InputLabel, Select, Stack, Button, Typography, TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
const AdminCreatesTest = () => {

    const data3 = [
        { Country: 'India', id: 1 },
        { Country: 'USA', id: 2 },
        { Country: 'UK', id: 3 },
        { Country: 'Russia', id: 4 },
        { Country: 'Nepal', id: 5 },
        { Country: 'Sweden', id: 6 },
        { Country: 'Africa', id: 7 },
    ];

    const positionData = [
        { Position: 'Company Secretary', id: '1' },
        { Position: 'IT Recrutier', id: '2' },
        { Position: 'Web Developer', id: '3' },
        { Position: 'Assistant', id: '4' },
        { Position: 'Typing', id: '5' },
        { Position: 'Typing_MCQs', id: '6' },
    ];

    const testType = {
        "MCQ's": 1,
        "Typing Test": 2,
        "MCQ's + Typing Test": 3,
        "Typing Test + MCQ's": 4,
    }
    const [data, setData] = useState([
        //         {country: 'India', position: 'IT Recruiter', test_type: 2, _id:"63a44c0cb9ec00378822716c"},
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

    const [positionOptions, setPositionOptions] = useState(positionData[0].Position);
    const [type, setType] = useState([{ type: "MCQ's", checked: false }, { type: "Typing Test", checked: false }]);
    const [selectedCountries, setSelectedCountries] = React.useState([]);
    const [newType, setNewType] = useState(null);
    async function submit() {
        const data = await addJobs({ Countries: selectedCountries, positionOptions, testType: testType[newType] })
        const data1 = await getAllJobs();
        setData(data1)
    }
    useEffect(() => {
        console.log(testType[newType])
    }, [newType])


    const handleChange = (country) => {
        // setSelectedCountries(
        //     selectedCountries.map(selected => selected.country === event.target.name ? { ...selected, checked: event.target.checked } : selected)
        // );
        setSelectedCountries(c => [...c, country])
    };

    const handleRemoveChange = (country) => {
        console.log(country);

        setSelectedCountries(country)
    }
    const handleChangeTestType = (e, i) => {
        let data1 = [...type];
        setNewType(t => t === null ? e.target.name :
            e.target.checked ? `${t} + ${e.target.name}` :
                i === 0 ? data1[1].type : data1[0].type
        )

        data1[i].checked = e.target.checked
        setType(data1)
        if (!data1[0].checked && !data1[1].checked) setNewType(null);

    }


    const [options] = useState(data3);

    return (
        <>
            <Container sx={{ width: '100%', mt: 10 }}>

                <Stack sx={{ justifyContent: 'center', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: 'larger', fontWeight: '700' }}>Admin Creates Test</Typography>
                </Stack>
                <Grid container spacing={2}>
                    <Grid item xs={8}>
                        <FormControl sx={{ m: 2 }}>
                            <InputLabel id="demo-simple-select-label">Position</InputLabel>
                            <Select labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Position" value={positionOptions}
                                onChange={(e) => setPositionOptions(e.target.value)}
                            >
                                {positionData.map(position => <MenuItem key={position.id} value={position.Position}>{position.Position}</MenuItem>)}
                            </Select>
                        </FormControl>
                        <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
                            <FormLabel component="legend">Countries</FormLabel>
                            {/*  <FormGroup>
                               {selectedCountries.map(country => <FormControlLabel key={country.country_code}
                                    control={
                                        <Checkbox checked={country.checked} onChange={handleChange} name={country.country} />
                                    }
                                    label={country.country}
                                />)}
                            </FormGroup>*/}

                            <Multiselect options={options}
                                onSelect={handleChange}
                                onRemove={handleRemoveChange}
                                displayValue='Country' />
                        </FormControl>

                    </Grid>
                    <Grid item xs={4}>
                        <FormControl sx={{ m: 2 }}>
                            <FormLabel id="demo-radio-buttons-group-label" sx={{ fontWeight: '700', fontSize: 'larger' }}>Test Type</FormLabel>
                            <FormGroup>
                                {type.map((key, i) => <FormControlLabel value={key.type} key={key.type}
                                    control={
                                        <Checkbox checked={key.checked} onChange={(e) => handleChangeTestType(e, i)} name={key.type} />
                                    }
                                    label={key.type}
                                />)}
                            </FormGroup>
                            <TextField id="standard-basic" label={newType} variant="standard" />
                        </FormControl>
                    </Grid>
                </Grid>
                <Stack>
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
                                    <TableCell align="center">{testType?.[item.test_type]}</TableCell>
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
