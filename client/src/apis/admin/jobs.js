import axios from 'axios';

export async function addJobs({ countryOptions, positionOptions, type }) {
    const res = await axios.post(`${process.env.REACT_APP_SERVER}/admin/jobs`, {
        country: countryOptions,
        position: positionOptions,
        test_type: type
    }, {
        headers: { "Content-Type": "application/json" }
    });

    if (res.status !== 200)
        return res

    else return { success: res.data?.success, msg: res.data?.msg }
}

export async function getAllJobs() {
    const res = await axios.get(`${process.env.REACT_APP_SERVER}/admin/jobs`);
    if (res.status !== 200)
        return res
    else if (res.data.success) {
        return res.data.findJobs
    }
    else return res.data
}

export async function deleteJob(id) {
    const res = await axios.delete(`${process.env.REACT_APP_SERVER}/admin/job/${id}`);
    if (res.status !== 200)
        return res

    else return res.data
}