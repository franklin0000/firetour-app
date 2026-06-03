fetch('https://api.render.com/v1/services', {
    method: 'GET',
    headers: {
        'Authorization': 'Bearer rnd_b2omJxT7dkRAKGf2g74DpmOYOnQ6',
        'Accept': 'application/json'
    }
}).then(res => res.json()).then(data => console.log(JSON.stringify(data))).catch(console.error);
