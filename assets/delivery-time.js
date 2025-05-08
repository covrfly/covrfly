console.log("delivery-time.js cargado"); // Para verificar que se carga el script

const processingDays = { min: 1, max: 3 }; 
const standardDelivery = { min: 3, max: 7 }; 
const expressDelivery = { min: 1, max: 2 }; 
const cutoffHourWeekday = 16; 
const cutoffHourSaturday = 13; 

function calculateTimeLeft() {
    const now = new Date();
    let cutoff = new Date();
    const dayOfWeek = now.getDay();

    if (dayOfWeek === 0) {
        cutoff.setDate(now.getDate() + 1);
        cutoff.setHours(cutoffHourWeekday, 0, 0, 0);
    } else if (dayOfWeek === 6) {
        cutoff.setHours(cutoffHourSaturday, 0, 0, 0);
        if (now > cutoff) {
            cutoff.setDate(now.getDate() + 2);
            cutoff.setHours(cutoffHourWeekday, 0, 0, 0);
        }
    } else {
        cutoff.setHours(cutoffHourWeekday, 0, 0, 0);
        if (now > cutoff) {
            cutoff.setDate(now.getDate() + 1);
        }
    }

    const timeDiff = cutoff - now;
    const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);

    return { hours, minutes };
}

function calculateDeliveryDays(type) {
    const today = new Date();
    const dayOfWeek = today.getDay();
    let minDays = processingDays.min + type.min;
    let maxDays = processingDays.max + type.max;

    // Si es sábado tarde o domingo, añadimos 2 días
    if ((dayOfWeek === 6 && today.getHours() >= cutoffHourSaturday) || dayOfWeek === 0) {
        minDays += 2;
        maxDays += 2;
    }

    const minDeliveryDate = new Date(today);
    minDeliveryDate.setDate(today.getDate() + minDays);

    const maxDeliveryDate = new Date(today);
    maxDeliveryDate.setDate(today.getDate() + maxDays);

    const options = { weekday: 'short', day: 'numeric', month: 'short' };

    return {
        minDate: minDeliveryDate.toLocaleDateString('es-MX', options),
        maxDate: maxDeliveryDate.toLocaleDateString('es-MX', options),
    };
}

function updateTime() {
    const timeLeft = calculateTimeLeft();
    const timeLeftElement = document.getElementById('time-left');

    if (timeLeftElement) {
        timeLeftElement.innerHTML = `<strong>${timeLeft.hours} hrs ${timeLeft.minutes} min</strong>`;
    }
}

const standardDates = calculateDeliveryDays(standardDelivery);
const expressDates = calculateDeliveryDays(expressDelivery);

document.addEventListener("DOMContentLoaded", function () {
    const deliveryStandard = document.getElementById('delivery-standard');
    const deliveryExpress = document.getElementById('delivery-express');

    if (deliveryStandard) {
        deliveryStandard.innerHTML = `${standardDates.minDate} - ${standardDates.maxDate}`;
    }
    if (deliveryExpress) {
        deliveryExpress.innerHTML = `${expressDates.minDate} - ${expressDates.maxDate}`;
    }

    updateTime();
    setInterval(updateTime, 1000);
});