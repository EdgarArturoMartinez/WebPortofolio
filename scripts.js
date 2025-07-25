// Fetch and display USD/COP exchange rate

function fetchExchangeRate() {
    const infoElem = document.getElementById('exchange-info');
    if (!infoElem) return;
    function showRate(usd, cop) {
        infoElem.innerHTML = `<strong>USD:</strong> $${usd} | <strong>COP:</strong> $${cop.toLocaleString('en-US', {maximumFractionDigits: 2})}`;
    }
    function showUnavailable() {
        infoElem.textContent = 'Exchange rate unavailable.';
    }
    fetch('https://api.exchangerate.host/latest?base=USD&symbols=COP')
        .then(response => response.json())
        .then(data => {
            if (data && data.rates && data.rates.COP) {
                showRate(1, data.rates.COP);
            } else {
                // fallback to open.er-api.com
                fetch('https://open.er-api.com/v6/latest/USD')
                    .then(resp => resp.json())
                    .then(fallbackData => {
                        if (fallbackData && fallbackData.rates && fallbackData.rates.COP) {
                            showRate(1, fallbackData.rates.COP);
                        } else {
                            showUnavailable();
                        }
                    })
                    .catch(showUnavailable);
            }
        })
        .catch(() => {
            // fallback to open.er-api.com
            fetch('https://open.er-api.com/v6/latest/USD')
                .then(resp => resp.json())
                .then(fallbackData => {
                    if (fallbackData && fallbackData.rates && fallbackData.rates.COP) {
                        showRate(1, fallbackData.rates.COP);
                    } else {
                        showUnavailable();
                    }
                })
                .catch(showUnavailable);
        });
}
fetchExchangeRate();
// Show thank you message on feedback form submit
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('.feedback-section form');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const msg = document.createElement('div');
            msg.textContent = 'Thanks for being in contact, I will respond as soon as possible.';
            msg.style.background = '#e0e7ff';
            msg.style.color = '#1e293b';
            msg.style.padding = '1em';
            msg.style.marginTop = '1em';
            msg.style.borderRadius = '8px';
            msg.style.textAlign = 'center';
            form.parentNode.replaceChild(msg, form);
        });
    }
});

// Show current datetime in #current-datetime and IP in #current-ip
function updateDateTime() {
    const dtElem = document.getElementById('current-datetime');
    if (dtElem) {
        const now = new Date();
        dtElem.textContent = now.toLocaleString();
    }
}
setInterval(updateDateTime, 1000);
updateDateTime();

// Fetch and show IP address
function fetchIP() {
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            const ipElem = document.getElementById('current-ip');
            if (ipElem) {
                ipElem.textContent = data.ip;
            }
        });
}
fetchIP();

// Set location in #location-info with country and city
function setLocation() {
    const locElem = document.getElementById('location-info');
    if (!locElem) return;
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            // Always show lat/lon first
            locElem.textContent = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`;
            // Use OpenStreetMap Nominatim for reverse geocoding
            fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`)
                .then(response => response.json())
                .then(data => {
                    const city = data.address.city || data.address.town || data.address.village || '';
                    const country = data.address.country || '';
                    if (city || country) {
                        locElem.textContent = `Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)} | ${city}, ${country}`;
                    }
                })
                .catch(() => {
                    // Already showing lat/lon
                });
        }, function() {
            locElem.textContent = 'Location access denied.';
        });
    } else {
        locElem.textContent = 'Geolocation not supported.';
    }
}
setLocation();

// Log browser info to console
function logBrowserInfo() {
    console.log('Browser Info:', navigator.userAgent);
}
logBrowserInfo();