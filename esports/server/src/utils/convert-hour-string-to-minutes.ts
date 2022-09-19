export function hour2minute(hour: string){
    const [hours, minutes] = hour.split(':').map(Number);
    const minutesAmount = (hours * 60) + minutes;
    return minutesAmount;
}
