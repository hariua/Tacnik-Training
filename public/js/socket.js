const { request } = require("express");

const socket = io.connect()

function statusChange(event)
{
    console.log(event.target.value);
    request.url('/statusChange?status='+event.target.value)
}
