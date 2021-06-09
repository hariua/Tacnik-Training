function changePassword(event)
    {
       let psd =  document.getElementById("Password").value
       if(event.target.value!=psd)
       {
           document.getElementById('errMsg').hidden=false
           document.getElementById('submitBtn').hidden=true
       }else{
        document.getElementById('errMsg').hidden=true
        document.getElementById('submitBtn').hidden=false
       }
    }