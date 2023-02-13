import React from 'react'
import { TextField, DialogActions } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import axios from "axios";
import { EditOutlined, EllipsisOutlined, SettingOutlined, DeleteOutlined, FireTwoTone } from '@ant-design/icons';
import { Avatar, Card, Button, Modal, Input, Divider } from 'antd';
const { Meta } = Card;
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { Scheduler } from "@aldabil/react-scheduler";


const color = {
    "high": "red",
    "medium": "yellow",
    "low": "orange"
}

function DummyCal() {
    const [value, setValue] = React.useState(new Date());

    //for single event , handling creation ,updation of event 
    const [state, setState] = React.useState({
        event_id: "",
        title: "",
        description: "",
        color: "blue",
        start: "",
        end: "",
        date: ""
    });


    //today's events state
    const [todayEvent, setTodayEvent] = React.useState([{
        event_id: "",
        title: "",
        description: "",
        color: "blue",
        start: "",
        end: "",
        date: "",
        _id: ""
    }])

    //previous events state
    const[prevEvents , setPrevEvents] = React.useState([{
        event_id: "",
        title: "",
        description: "",
        color: "blue",
        start: "",
        end: "",
        date: "",
        _id: ""
    }])

    //future events state
    const [futureEvents, setFutureEvents] = React.useState([{
        event_id: "",
        title: "",
        description: "",
        color: "blue",
        start: "",
        end: "",
        date: "",
        _id: ""
    }])

    //has all user events
    const [userEvents, setUserEvents] = React.useState([{
        event_id: "",
        title: "",
        description: "",
        color: "blue",
        start: "",
        end: "",
        date: ""
    }])

    //this state handles error
    const [error, setError] = React.useState(null);

    React.useCallback(() => GetCalendarEvents(), [])

    let m = [], n = [], o = [] ,p=[];

    React.useEffect(() => {
        GetCalendarEvents().then(res => {
            m = res
            m.forEach(element => {
                element.start = new Date(element.start)
                element.end = new Date(element.end)
                if (element.end >= new Date() && element.start <= new Date()) { n.push(element) }
                if (element.end >= new Date() && element.start > new Date()) { o.push(element) }
                if (element.end <= new Date() && element.start <= new Date()) { p.push(element) }
                if (
                    element.end.getDate() === new Date().getDate() && element.end.getMonth() + 1 === new Date().getMonth() + 1 &&
                    element.end.getFullYear() === new Date().getFullYear()
                ) {
                    setTodayEvent([element]);
                }

            });
            setUserEvents(n);
            setFutureEvents(o);
            setPrevEvents(p);
        }
        ).catch(err => console.log(err))


    }, [GetCalendarEvents])

    const handleChange = (value, name) => {
        setState((prev) => {
            return {
                ...prev,
                [name]: value
            };
        });
    };


    function handleSubmit() {
        sendData("345637", { "calendar": state }).then(res => console.log(res)).catch(err => console.log(err))
    }


    return (
        <>
            <div className='container'>
                <p>Creating Event</p>
                <LocalizationProvider dateAdapter={AdapterMoment}>
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
                    <Button onClick={handleSubmit}>Confirm</Button>
                </LocalizationProvider>
            </div>


            <p>display event</p>
            <div style={{ display: "flex", gap: 50 }} className="d-flex container">

                <div style={{ maxWidth: "50%" }} className="row">
                    <p>calendar</p>
                    <StaticDatePickerLandscape value={value} setValue={setValue} />
                </div>

                <div style={{ maxWidth: "50%" }} className="row">
                    <p>ongoing evets</p>
                    <OnGoingTAsk userEvents={userEvents} />
                </div>

                <div style={{ maxWidth: "50%" }} className="row">
                    <p>Upcoming Events</p>
                    <OnGoingTAsk userEvents={futureEvents} />
                </div>

                <div style={{ maxWidth: "50%" }} className="row">
                    <p>Previous Events</p>
                    <OnGoingTAsk userEvents={prevEvents} />
                </div>

                <div style={{ maxWidth: "50%" }} className="row">
                    <p>Today's event</p>
                    <TodayEvents userEvents={todayEvent} value={value} />
                </div>

            </div>

            <Scheduler style={{width:500}} />

        </>
    )
}

export function OnGoingTAsk({ userEvents }) {
    const [state, setState] = React.useState({
        end: "",
        title: "",
        _id: ""
    })
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const showModal = (ele) => {
        setState(ele)
        setIsModalOpen(true);
    };
    const handleOk = () => {
        updateData("end", state.end, "63ac28cbf8f9aa38a853831b", state._id).then(res => console.log(res)).catch(err => console.log(err))
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                    <DateTimePicker
                        label="Date&Time picker"
                        value={state}
                        onChange={(e) => setState(e._d)}
                        renderInput={(params) => <TextField {...params} />}
                    />
                </Modal>
                <div style={{ maxWidth: "50%" }} class="">
                    {
                        userEvents.map((ele) => {

                            return (
                                <div className="col" style={{ maxWidth: "50%", minWidth: "40%" }} onClick={() => null}>
                                    <Card
                                        style={{
                                            width: 300,
                                            backgroundColor: "Pink"
                                        }}

                                        actions={[
                                            <EditOutlined key="edit" onClick={() => showModal(ele)} />,
                                            <DeleteOutlined key={"delete"} onClick={() => deleteObject("63ac28cbf8f9aa38a853831b", ele._id)} />,
                                            <EllipsisOutlined key="ellipsis" />,
                                        ]}
                                    >

                                        <Meta
                                            title={ele.title}
                                        />
                                        <br />
                                        <FireTwoTone twoToneColor="#eb2f96" />
                                    </Card>
                                </div>
                            )
                        })
                    }
                </div>
            </LocalizationProvider>
        </>
    )
}

export function TodayEvents({ userEvents, value }) {
    const [am, setAm] = React.useState([{
        event_id: "",
        title: "",
        description: "",
        color: "blue",
        start: "",
        end: "",
        date: ""
    }])
    React.useEffect(() => setAm(userEvents), [])

    return (
        <>
            <div className="container">
                <h3>{new Date().getDate()}/{new Date().getMonth() + 1}/{new Date().getFullYear()}</h3>
                <div className="row">
                    {
                        am.map(ele => (<p>{ele.title}</p>))
                    }
                </div>
            </div>
        </>
    )
}

export default DummyCal

export async function sendData(id, data) {
    try {
        console.log(await (await axios.put(`http://localhost:4000/projects/arrAdd/${id}`, data)).data[0].calendar)
    } catch (error) {
        console.log(error)
    }
}

export async function GetCalendarEvents(id) {
    const _id = "63ac28cbf8f9aa38a853831b"
    return await (await axios.get(`http://localhost:4000/projects/SingleProject/${_id}`)).data[0].calendar
}

export async function updateData(key, value, Pid, Cid) {
    try {
        return await axios.put(`http://localhost:4000/projects/uAoO/${Pid}`, { key, "_id": Cid, value })
    } catch (error) {
        console.log(error)
    }
}

export async function deleteObject(Pid, Cid) {
    try {
        await axios.put(`http://localhost:4000/projects/proj_delte_Cal/${Pid}`, { "Parentkey": Cid })
        alert("deleted")
    } catch (error) {

    }
}

const isWeekend = (date) => {
    const day = date.day();

    return day === 0 || day === 6;
};

export function StaticDatePickerLandscape({ value, setValue }) {
    return (
        <>
            <div className="container" style={{ maxWidth: "40%" }}>
                <LocalizationProvider dateAdapter={AdapterMoment}>
                    <StaticDatePicker
                        orientation="portrait"
                        openTo="day"
                        value={value}
                        disablePast={true}
                        toolbarTitle={""}
                        onChange={(newValue) => {
                            setValue(newValue._d);
                        }}
                        renderInput={(params) => {
                            console.log(params);

                        }}
                    />
                </LocalizationProvider>
            </div>

        </>
    );
}

function isBetween(date, start, end) {
    return date >= start && date <= end;
}