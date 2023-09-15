
export default function formatTimestampToTime(timestampValue) {
    const timestamp = new Date(timestampValue);
    const time = new Date()
    let formattedTime
    /*console.log("lyouma", time.getDay(), time.getDate(), time.getMonth() )
    console.log("timestamp", timestamp.getDay(), timestamp.getDate(), timestamp.getMonth()) */ 
    if (time.getMonth() === timestamp.getMonth()) {
        if (time.getDate() - timestamp.getDate() >= 7 ) {
            formattedTime = timestamp.toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            })
        }
        else if (time.getDate() - timestamp.getDate() >= 1 ) {
            formattedTime = timestamp.toLocaleString('en-US', {
                weekday:'long',
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            })
        }
        else {
            formattedTime = timestamp.toLocaleString('en-US', {
                hour: 'numeric',
                minute: 'numeric',
                hour12: true,
            })
        }
    }
    else {
        formattedTime = timestamp.toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        });
      
        
    }
    return formattedTime;
    
  }
  
 //TODO list
  // zid fel middlecontent, el data el kol such as receiver_liked w sender_liked, w zid el features taa el reactions 
  // gued fazét el logout ki toufa el token 
  // rakah el engine taa el search
  // rakah el dimensions eli fél login/signup page 

  // gued el emoji system
  // ki yreacti chkoun aal message teek, maash tji fel wost el new messages tetblouka fel react