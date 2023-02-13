import React from 'react'
import { Scheduler } from "@aldabil/react-scheduler";
import { TextField, Button, DialogActions } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import axios from "axios"
import { data } from './Data';

/*
the following is custom editor to create the modal
*/
const CustomEditor = ({ scheduler }) => {
    const event = scheduler.edited
    const [state, setState] = React.useState({
        event_id: "",
        title: "",
        description: "",
        color: "blue",
        start: "",
        end: "",
        date: ""
    });

    const [error, setError] = React.useState(null);

    const handleChange = (value, name) => {
        setState((prev) => {
            return {
                ...prev,
                [name]: value
            };
        });
    };

    const handleSubmit = async () => {

        try {
            scheduler.loading(true);

            /**Simulate remote data saving */
            const added_updated_event = (await new Promise((res) => {
                /**
                 * Make sure the event have 4 mandatory fields
                 * event_id: string|number
                 * title: string
                 * start: Date|string
                 * end: Date|string
                 */
                setTimeout(() => {
                    res({
                        event_id: event?.event_id || Math.random(),
                        title: state.title,
                        color: state.color === undefined ? "blue" : state.color,
                        start: state.start,
                        end: state.end,
                        description: state.description,
                    });
                }, 3000);


            }))

            sendData("345637", { "calendar": state }).then(res => console.log(res)).catch(err => console.log(err))

            alert("send data")

            scheduler.onConfirm(added_updated_event, event ? "edit" : "create");
            scheduler.close();
        } finally {
            scheduler.loading(false);
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>

            <div>
                <div style={{ padding: "1rem" }}>
                    <p>Load your custom form/fields</p>
                    <TextField
                        label="Title"
                        value={state.title}
                        onChange={(e) => handleChange(e.target.value, "title")}
                        error={!!error}
                        helperText={!!error && error["title"]}
                        fullWidth
                    />
                    <TextField
                        label="Description"
                        value={state.description}
                        onChange={(e) => handleChange(e.target.value, "description")}
                        fullWidth
                    />

                    <input
                        label="color"
                        type="color"
                        value={state.color}
                        onChange={(e) => handleChange(e.target.value, "color")}
                    />

                    <DateTimePicker
                        label="Date&Time picker"
                        value={state.start}
                        onChange={(e) => handleChange(e._d, "start")}
                        renderInput={(params) => <TextField {...params} />}
                    />

                    <DateTimePicker
                        label="Date&Time picker"
                        value={state.end}
                        onChange={(e) => handleChange(e._d, "end")}
                        renderInput={(params) => <TextField {...params} />}
                    />

                </div>
                <DialogActions>
                    <Button onClick={scheduler.close}>Cancel</Button>
                    <Button onClick={handleSubmit}>Confirm</Button>
                </DialogActions>
            </div>
        </LocalizationProvider>

    );

}



function File2() {
    const [state, setstate] = React.useState([{
        event_id: "",
        title: "",
        start: "",
        end: "",
        disabled: "",
        color: "",
        editable: "",
        draggable: ""
    }])

    let m = []

    React.useEffect(() => {
        GetCalendarEvents().then((res) => {
            m = res
            m.forEach(element => {
                element.start = new Date("2023-01-12 09:10")
                element.end = new Date("2023-01-13 10:00")
            });
            setstate(m)
        }).catch(err => console.log(err))
    }, [])

console.log(m)
    return (
        <>
            <Scheduler
                events={ state}
                customEditor={(scheduler) => <CustomEditor scheduler={scheduler} />}
                draggable={true}
            />
        </>

    )
}

export default File2

export async function sendData(id, data) {
    try {
        return await axios.put(`http://localhost:4000/projects/arrAdd/${id}`, data)
    } catch (error) {

    }
}

export async function GetCalendarEvents(id) {
    const _id = "63ac28cbf8f9aa38a853831b"
    return await (await axios.get(`http://localhost:4000/projects/SingleProject/${_id}`)).data[0].calendar
  }