const socket = io.connect()
let userId = document.getElementById('userId').innerHTML
socket.emit('userRequest', userId)
socket.on('userList', data => {
    $('.activeStatusList').remove()
    $('.breakStatusList').remove()
    $('.busyStatusList').remove()
    $('.inactiveStatusList').remove()
    data.forEach((item, i) => {
        userListDisplay(item)
    })

})
function statusChange(event) {
    let status = event.target.value
    if (status.length > 0) {
        $.ajax({
            url: '/statusChange',
            method: 'post',
            data: {
                Status: status
            },
            success: (Response) => {
                let status = Response.status
                if (status == 'Active') {
                    document.getElementById('Active').hidden = false
                    document.getElementById('Busy').hidden = true
                    document.getElementById('Break').hidden = true
                    document.getElementById('Inactive').hidden = true
                    document.getElementById('statusDefault').hidden = true
                } else if (status == 'Busy') {
                    document.getElementById('Active').hidden = true
                    document.getElementById('Busy').hidden = false
                    document.getElementById('Break').hidden = true
                    document.getElementById('Inactive').hidden = true
                    document.getElementById('statusDefault').hidden = true
                } else if (status == 'Break') {
                    document.getElementById('Active').hidden = true
                    document.getElementById('Busy').hidden = true
                    document.getElementById('Break').hidden = false
                    document.getElementById('Inactive').hidden = true
                    document.getElementById('statusDefault').hidden = true
                } else {
                    document.getElementById('Active').hidden = true
                    document.getElementById('Busy').hidden = true
                    document.getElementById('Break').hidden = true
                    document.getElementById('Inactive').hidden = false
                    document.getElementById('statusDefault').hidden = true
                }
                socket.emit('userRequest', userId)

            }
        })

    }

}
function userListDisplay(item) {
    const div = document.createElement('div')
    div.classList.add(`${item.Status}StatusList`)
    if (item.Status == "Active") {
        div.innerHTML = `<li class="listItem">${item.Name}</li>
        <p class="text-success bg-success pl-2 pr-2 rounded-circle" style="margin-bottom: 0px;">s</p>`
    } else if (item.Status == 'Busy') {
        div.innerHTML = `<li class="listItem">${item.Name}</li>
        <p class="text-primary bg-primary pl-2 pr-2 rounded-circle" style="margin-bottom: 0px;">s</p>`
    } else if (item.Status == 'Break') {
        div.innerHTML = `<li class="listItem">${item.Name}</li>
        <p class="text-warning bg-warning  pl-2 pr-2 rounded-circle" style="margin-bottom: 0px;">s</p>`
    } else {
        div.innerHTML = `<li class="listItem">${item.Name}</li>
        <p class="text-danger bg-danger pl-2 pr-2 rounded-circle" style="margin-bottom: 0px;">s</p>`
    }
    document.querySelector(`.${item.Status}List`).appendChild(div)
}
