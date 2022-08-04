async function request(url, method, data, DOMs) {
    const bodyData = {};
    if (data) {
        bodyData.body = JSON.stringify(data);
    }

    const msgSend = await fetch(url, {
        method,
        ...bodyData,
    })
    const response = await msgSend.json();

    switch (response.type) {
        case 'msg':
            if (DOMs.notificationsDOM) {
                DOMs.notificationsDOM.textContent = response.msg;
            }
            break;

        case 'redirect':
            location.href = response.href;
            break;

        default:
            break;
    }
}

export { request }