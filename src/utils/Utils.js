// https://stackoverflow.com/questions/6312993/javascript-seconds-to-time-string-with-format-hhmmss/6313008#6313008
export function toHHMMSS (sec_num) {
    let hours   = Math.floor(sec_num / 3600);
    let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    return hours+':'+minutes+':'+seconds;
}

// https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
// returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
export function intersects(a,b,c,d,p,q,r,s) {
    let det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
        return false;
    } else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
}

export function rads(degrees)
{
    return degrees * (Math.PI/180);
}

export function degrees(rads)
{
    return rads / Math.PI * 180;
}

