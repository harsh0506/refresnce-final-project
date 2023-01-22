export default function handler(req, res) {
    const body = req.body;
    if (body === undefined || body === null) {
      return res.status(500).json({ msg: 'Name was not found' });
    }
  
    res.status(200).json(body);

    
  }