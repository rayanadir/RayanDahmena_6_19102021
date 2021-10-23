fetch('photographers.json').then(res => {
    return res.json();
}).then(data => {
    console.log(data.photographers);
    console.log(data.media);
})