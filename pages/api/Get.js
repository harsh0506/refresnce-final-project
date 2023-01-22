export default function handler(req, res) {
    const data =[
        {
            event_id: 1,
            title: "Event 1",
            start: "Sat Dec 12 2022 09:00:15",
            end: "Sat Dec 12 2022 12:00:15",
            color:"pink"
          },
         
    ]
    
    res.json(data)

    
  }