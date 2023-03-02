import React from 'react'
import { TextField } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import axios from "axios";
import { EditOutlined, EllipsisOutlined, DeleteOutlined, FireTwoTone } from '@ant-design/icons';
import { Card, Button, Modal } from 'antd';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from "moment";


const { Meta } = Card;

const schema = {
    event_id: "",
    title: "",
    description: "",
    color: "blue",
    start: "",
    end: "",
    date: ""
}

const localizer = momentLocalizer(moment)

function DummyCal2() {
    const [value, setValue] = React.useState(new Date());

    //for single event manipulation , handling creation ,updation of event 
    const [state, setState] = React.useState(schema);

    //today's events state, array showing today's event
    const [todayEvent, setTodayEvent] = React.useState([schema])

    //previous events state
    const [prevEvents, setPrevEvents] = React.useState([schema])

    //future events state
    const [futureEvents, setFutureEvents] = React.useState([schema])

    //has all user events
    const [userEvents, setUserEvents] = React.useState([schema])

    //this state handles error
    const [error, setError] = React.useState(null);

    const [events, setEvents] = React.useState([schema])

    //React.useCallback(() => GetCalendarEvents(), [])

    let m = [], n = [], o = [], p = [];

    React.useEffect(() => {
        GetCalendarEvents().then(res => {
            m = res
            m.forEach(element => {
                element.start = new Date(
                    new Date(element.start).getFullYear(),
                    new Date(element.start).getMonth() + 1,
                    new Date(element.start).getDate(),
                    new Date(element.start).getHours(),
                    new Date(element.start).getMinutes(),
                    new Date(element.start).getSeconds())
                element.end = new Date(
                    new Date(element.end).getFullYear(),
                    new Date(element.end).getMonth() + 1,
                    new Date(element.end).getDate(),
                    new Date(element.end).getHours(),
                    new Date(element.end).getMinutes(),
                    new Date(element.end).getSeconds()
                )
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
            setEvents(m)
            setUserEvents(n);
            setFutureEvents(o);
            setPrevEvents(p);
        }
        ).catch(err => console.log(err))


    }, [userEvents])

    const handleChange = (value, name) => {
        setState((prev) => {
            return {
                ...prev,
                [name]: value
            };
        });
    };

    //handle submission of data
    function handleSubmit() {
        sendData("345637", { "calendar": state }).then(res => console.log(res)).catch(err => console.log(err))
    }


    return (
        <>
            <div className='container' style={{ padding: 10 }}>


                <div className="container">
                    <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3" style={{
                        display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center"
                    }}>
                        <div className="row">
                            <p>calendar</p>
                            <StaticDatePickerLandscape value={value} setValue={setValue} events={events} />
                        </div>
                        <div className='container' style={{ background: "pink" }}>
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
                                <div class="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3" style={{
                                    display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center"
                                }}>

                                    <DateTimePicker
                                        label="Starting Date"
                                        value={state.start}
                                        onChange={(e) => handleChange(e._d, "start")}
                                        renderInput={(params) => <TextField {...params} />}
                                    />

                                    <DateTimePicker
                                        label="Ending Date"
                                        value={state.end}
                                        onChange={(e) => handleChange(e._d, "end")}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </div>
                                <Button onClick={handleSubmit}>Confirm</Button>
                            </LocalizationProvider>
                        </div>
                        <div style={{ maxWidth: "50%", maxHeight: 300, overflowY: "scroll" }} className="row">
                            <p>Today's event</p>
                            <TodayEvents userEvents={todayEvent} value={value} />
                        </div>
                    </div>
                </div>


                <p>display event</p>
                <div style={{ display: "flex", gap: 50 }} className="d-flex container">



                    <div style={{ maxWidth: "50%", maxHeight: 200, overflowY: "scroll" }} className="row">
                        <p>ongoing evets</p>
                        <OnGoingTAsk userEvents={userEvents} EmptyHeaderText={"No Ongoing events"} />
                    </div>

                    <div style={{ maxWidth: "50%", maxHeight: 200, overflowY: "scroll" }} className="row">
                        <p>Upcoming Events</p>
                        <OnGoingTAsk userEvents={futureEvents} EmptyHeaderText={"No Upcoming Events"} />
                    </div>

                    <div style={{ maxWidth: "50%", maxHeight: 200, overflowY: "scroll" }} className="row">
                        <p>Previous Events</p>
                        <OnGoingTAsk userEvents={prevEvents} EmptyHeaderText={"No Previous Events"} />
                    </div>



                </div>


            </div>
        </>
    )
}

export function OnGoingTAsk({ userEvents, EmptyHeaderText }) {
    const [state, setState] = React.useState({
        end: "",
        title: "",
        _id: "",
        start: ""
    })
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const showModal = (ele) => {
        setState(ele)
        setIsModalOpen(true);
    };
    const handleOk = () => {
        console.log(state)

        const d = {
            Cid:  state._id,
            data: {
                "calendar.$.start": state.start,
                "calendar.$.end": state.end,
                "calendar.$.title": state.title,
            }
        }
        
        updateData("63ac28cbf8f9aa38a853831b", d).then(res => console.log(res)).catch(err => console.log(err))
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
                        label="start date"
                        value={state.start}
                        onChange={(e) => setState(prev => { return { ...prev, start: e._d } })}
                        renderInput={(params) => <TextField {...params} />}
                    />

                    <DateTimePicker
                        label="end date"
                        value={state.end}
                        onChange={(e) => setState(prev => { return { ...prev, end: e._d } })}
                        renderInput={(params) => <TextField {...params} />}
                    />

                    <TextField
                        label="Title"
                        value={state.title}
                        onChange={(e) => setState(prev => { return { ...prev, title: e.target.value } })}
                        fullWidth
                    />

                </Modal>
                <div style={{ maxWidth: "50%" }} class="">
                    {
                        userEvents.length === 0 ? <h5>{EmptyHeaderText}</h5> : userEvents.map((ele) => {

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

export function TodayEvents({ userEvents }) {
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
                        am[0].end === "" && am[0].start === "" ? <h5>No Events for Today</h5> : am.map(ele => (<p>{ele.title}</p>))
                    }
                </div>
            </div>
        </>
    )
}

export default DummyCal2

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

export async function updateData( Pid, data) {
    try {
        return await axios.put(`http://localhost:4000/projects/arrayUpdateAllCalendar/${Pid}`, data)
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


export function StaticDatePickerLandscape({ value, setValue, events }) {
    return (
        <>
            <div className="container" >
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: 400 }} />
            </div>

        </>
    );
}
