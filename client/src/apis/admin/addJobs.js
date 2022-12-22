import axios from 'axios';

export default async function addJobs({ countryOptions, positionOptions, type }) {
    const res = await axios.post(`${process.env.REACT_APP_SERVER}/admin/jobs`, {
        country: countryOptions,
        position: positionOptions,
        test_type: type
    }, {
        headers: { "Content-Type": "application/json" }
    });

    if (res.status == 200)
        return res.data

    else return res;
}