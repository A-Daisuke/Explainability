export function getTimeDifference(checkin_time, current_time) {
    let date = new Date();
    if(current_time !== undefined){
      date = new Date(current_time);
    }
    let now = date.getTime() + date.getTimezoneOffset() * 60000;
    let millisec = Math.abs(now - (new Date(checkin_time).getTime()));
    let seconds = Math.trunc(((millisec / 1000)) % 60);
    let minutes = Math.trunc(((millisec / (1000 * 60))) % 60);
    let hours = Math.trunc(((millisec / (1000 * 60 * 60))) % 24);
    let days = Math.trunc(((millisec / (1000 * 60 * 60 * 24))) % 365);
    let output = "";
    if(days !== 0){ output += days + "d";}
    if(hours !== 0){ output += hours + "h";}
    if(minutes !== 0){ output += minutes + "m";}
    output += seconds + "s";
    return output;
}
