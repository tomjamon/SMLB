// TODO : Charging Time remaining every X minutes (Change it in options page) (Bottom page background.js)
// TODO : Describe the 40 80 concept
// TODO : When clic on Chrome App, display : ICO BATTERY CHARGING / 42 % / 3:22 (Hour or minutes)(AutoUpdate)
// TODO : Minify

var text = "Hello";
var notified_low = 0;
var notified_v_low = 0;
var notified_full = 0;
var notified_v_full = 0;

navigator.getBattery().then(function(battery) {
    function updateAllBatteryInfo()
    {
        updateChargeInfo();
        updateLevelInfo();
        updateChargingInfo();
        updateDischargingInfo();
    }
    updateAllBatteryInfo();

    battery.addEventListener('chargingchange', function(){
        updateChargeInfo();
    });
    function updateChargeInfo()
    {
        show((battery.charging ? "Battery is charging" : "Battery isn't charging"));
    }

    battery.addEventListener('levelchange', function(){
        updateLevelInfo();
    });
    function updateLevelInfo()
    {
        if (battery.level <=0.2) {
            if ((!battery.charging)&&(!notified_v_low)) {
                notified_v_low = 1;
                notified_low = 0;
                notified_v_full = 0;
                notified_full = 0;
                show("You really should charging if possible");
            }
        } else if (battery.level <=0.4) {
            if((!battery.charging)&&(!notified_low)) {
                notified_v_low = 0;
                notified_low = 1;
                notified_v_full = 0;
                notified_full = 0;
                show("You should charging if possible");
            }
        } else if (battery.level >= 0.9) {
            if((battery.charging)&&(!notified_v_full)) {
                notified_v_low = 0;
                notified_low = 0;
                notified_v_full = 1;
                notified_full = 0;
                show("You should stop charging if you're not moving");
            }
        } else if (battery.level >= 0.8) {
            if ((battery.charging)&&(!notified_full)) {
                notified_v_low = 0;
                notified_low = 0;
                notified_v_full = 0;
                notified_full = 1;
                show("You can stop charging");
            }
        }
    }

    battery.addEventListener('chargingtimechange', function(){
        updateChargingInfo();
    });
    function updateChargingInfo()
    {
        //show("Battery charging time: "+ battery.chargingTime + " seconds");
    }

    battery.addEventListener('dischargingtimechange', function(){
        updateDischargingInfo();
    });
    function updateDischargingInfo()
    {
        //show("Battery discharging time: " + battery.dischargingTime + " seconds");
    }

});

function show(text) {
    var time = /(..)(:..)/.exec(new Date());
    var hour = time[1] % 12 || 12;
    var period = time[1] < 12 ? 'a.m.' : 'p.m.';
    new Notification(hour + time[2] + ' ' + period, {
        icon: 'md48.png',
        body: text
    });
}

if (!localStorage.isInitialized) {
    localStorage.isActivated = true;
    localStorage.frequency = 1;
    localStorage.isInitialized = true;
}

if (window.Notification) {
    if (JSON.parse(localStorage.isActivated)) {
        show("Notifications Actived");
    }

    var interval = 0;

    setInterval(function() {
        interval++;
        if (
            JSON.parse(localStorage.isActivated) &&
            localStorage.frequency <= interval
        ) {
            //show(text);
            interval = 0;
        }
    }, 60000);

}
