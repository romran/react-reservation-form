let date = new Date();
let M = date.getMonth() + 1;
let D = date.getDate();

if (D < 10) {D = "0"+D; }
 
if (M < 10) { M = "0"+M; }
 
const today = date.getFullYear() + '-' + M + '-' + D;
export default today;