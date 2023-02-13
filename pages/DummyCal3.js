import React from 'react'
import { TextField } from "@mui/material";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import axios from "axios";
import { EditOutlined, EllipsisOutlined, DeleteOutlined, FireTwoTone } from '@ant-design/icons';
import { Card, Button, Modal } from 'antd';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Calendar, momentLocalizer , Views } from 'react-big-calendar'
import moment from "moment";


const { Meta } = Card;

const customStyles = {
    height:500,
};

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

function DummyCal3() {
    const [value, setValue] = React.useState(new Date());

    //for single event , handling creation ,updation of event 
    const [state, setState] = React.useState(schema);

    //today's events state
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

    const [isModalOpen, setIsModalOpen] = React.useState(false);

    const showModal = (ele) => {
        setIsModalOpen(true);
    };
    const handleOk = () => {
        setIsModalOpen(false);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    React.useCallback(() => GetCalendarEvents(), [])

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
            setEvents(m);
            setUserEvents(n);
            setFutureEvents(o);
            setPrevEvents(p);
        }
        ).catch(err => {
            console.log(err)
            setError(err)
        })


    }, [GetCalendarEvents])

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

    if (error) return <div>An error occurred: {error.message}</div>;

    return (
        <>
            <div className='container' >
                <div className='container'>
                    {/*this is the modal to create an event */}
                    <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>

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

                    </Modal>
                </div>

                {/* this has both calendar and data display */}
                <div className="d-flex container p-3" style={{ background: "red", gap: 10 , height:"95vh" }}>
                    {/* left side having calendar */}
                    <div style={{ maxWidth: "50%" }} className="row">
                        <p>calendar</p>
                        <StaticDatePickerLandscape value={value} setValue={setValue} events={events} />
                    </div>

                    {/* this is right side ,It will be divided into 2 parts , upper and lower */}
                    <div style={{ maxWidth: "50%", height: "20rem", background: "brown" }} className="row">
                        {/* this is upper part of right side containing Todays event,date and button to display
                        modal for event creation*/}
                        <div className="" style={{minHeight:300}}>
                            <div className="d-flex justify-content-end container" style={{ maxHeight: 40, background: "grey" }}>
                                <p>Todays's evets</p>
                                <button onClick={showModal}>Create event</button>
                            </div>
                            <TodayEvents userEvents={todayEvent} value={value} />
                        </div>
                        {/* this is lower part having */}
                        <div className="d-flex container " style={{ gap: 18, height: "20rem", background: "green" }}>

                            <div style={{  background: "blue", maxHeight: "20rem !important", overflowY: "scroll" }} className="row m-2">
                                <div className="container" style={{ position: "sticky" }}>
                                    <p className='p-2' >Upcoming Events</p>
                                </div>
                                <OnGoingTAsk userEvents={futureEvents} EmptyHeaderText={"No Upcoming Events"} />
                            </div>

                            <div style={{ background: "red" }} className="row m-2">
                                <p>Ongoing event</p>
                                <OnGoingTAsk userEvents={userEvents} EmptyHeaderText={"No Ongoing events"} />

                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export function OnGoingTAsk({ userEvents, EmptyHeaderText }) {
    const [state, setState] = React.useState(schema)
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
                <div style={{ maxWidth: "40%" }} class="">
                    {
                        userEvents.length === 0 ? <h5>{EmptyHeaderText}</h5> : userEvents.map((ele) => {

                            return (
                                <div className="col" style={{ maxWidth: "40%", paddingBottom: 10, marginBottom: 5 }} onClick={() => null}>
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

export default DummyCal3

export function StaticDatePickerLandscape({ value, setValue, events }) {
    function CustomEventWrapper({ children }) {
        return <div>{children}</div>;
      }
    return (
        <>
            <div className="container" >
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    views={[Views.MONTH, Views.WEEK, Views.DAY]}
                    components={{
                        eventWrapper: CustomEventWrapper
                      }}
                    style={ customStyles} />
            </div>

        </>
    );
}


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