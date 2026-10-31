let levels = [];
let currentLevel = 0;
let remainingSeconds = 0;
let totalTimeSeconds = 0;
let timerInterval = null;

// プリセット一覧
const presets = [
    {
        "name": "hyperturbo_min10",
        "levels": [
            {"type":"normal","sb":10,"bb":20,"ante":0,"minutes":3},
            {"type":"normal","sb":20,"bb":40,"ante":0,"minutes":3},
            {"type":"normal","sb":30,"bb":60,"ante":0,"minutes":3},
            {"type":"normal","sb":40,"bb":80,"ante":0,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
            {"type":"normal","sb":100,"bb":200,"ante":200,"minutes":3},
            {"type":"normal","sb":110,"bb":220,"ante":220,"minutes":3},
            {"type":"normal","sb":120,"bb":240,"ante":240,"minutes":3},
            {"type":"normal","sb":130,"bb":260,"ante":260,"minutes":3},
            {"type":"normal","sb":140,"bb":280,"ante":280,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":150,"bb":300,"ante":300,"minutes":3},
            {"type":"normal","sb":160,"bb":320,"ante":320,"minutes":3},
            {"type":"normal","sb":170,"bb":340,"ante":340,"minutes":3},
            {"type":"normal","sb":180,"bb":360,"ante":360,"minutes":3},
            {"type":"normal","sb":190,"bb":380,"ante":380,"minutes":3},
            {"type":"normal","sb":200,"bb":400,"ante":400,"minutes":3},
            {"type":"normal","sb":210,"bb":420,"ante":420,"minutes":3},
            {"type":"normal","sb":220,"bb":440,"ante":440,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":230,"bb":460,"ante":460,"minutes":3},
            {"type":"normal","sb":240,"bb":480,"ante":480,"minutes":3},
            {"type":"normal","sb":250,"bb":500,"ante":500,"minutes":3},
            {"type":"normal","sb":260,"bb":520,"ante":520,"minutes":3},
            {"type":"normal","sb":270,"bb":540,"ante":540,"minutes":3},
            {"type":"normal","sb":280,"bb":560,"ante":560,"minutes":3},
            {"type":"normal","sb":290,"bb":580,"ante":580,"minutes":3},
            {"type":"normal","sb":300,"bb":600,"ante":600,"minutes":3},
            {"type":"normal","sb":310,"bb":620,"ante":620,"minutes":3},
            {"type":"normal","sb":320,"bb":640,"ante":640,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
            {"type":"normal","sb":330,"bb":660,"ante":660,"minutes":3},
            {"type":"normal","sb":340,"bb":680,"ante":680,"minutes":3},
            {"type":"normal","sb":350,"bb":700,"ante":700,"minutes":3},
            {"type":"normal","sb":360,"bb":720,"ante":720,"minutes":3},
            {"type":"normal","sb":370,"bb":740,"ante":740,"minutes":3},
            {"type":"normal","sb":380,"bb":760,"ante":760,"minutes":3},
            {"type":"normal","sb":390,"bb":780,"ante":780,"minutes":3},
            {"type":"normal","sb":400,"bb":800,"ante":800,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":420,"bb":840,"ante":840,"minutes":3},
            {"type":"normal","sb":440,"bb":880,"ante":880,"minutes":3},
            {"type":"normal","sb":450,"bb":900,"ante":900,"minutes":3},
            {"type":"normal","sb":460,"bb":920,"ante":920,"minutes":3},
            {"type":"normal","sb":480,"bb":960,"ante":960,"minutes":3},
            {"type":"normal","sb":500,"bb":1000,"ante":1000,"minutes":3},
            {"type":"normal","sb":520,"bb":1040,"ante":1040,"minutes":3},
            {"type":"normal","sb":540,"bb":1080,"ante":1080,"minutes":3},
            {"type":"normal","sb":560,"bb":1120,"ante":1120,"minutes":3},
            {"type":"normal","sb":580,"bb":1160,"ante":1160,"minutes":3},
            {"type":"normal","sb":600,"bb":1200,"ante":1200,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":620,"bb":1240,"ante":1240,"minutes":3},
            {"type":"normal","sb":640,"bb":1280,"ante":1280,"minutes":3},
            {"type":"normal","sb":660,"bb":1320,"ante":1320,"minutes":3},
            {"type":"normal","sb":680,"bb":1360,"ante":1360,"minutes":3},
            {"type":"normal","sb":700,"bb":1400,"ante":1400,"minutes":3},
            {"type":"normal","sb":720,"bb":1440,"ante":1440,"minutes":3},
            {"type":"normal","sb":740,"bb":1480,"ante":1480,"minutes":3},
            {"type":"normal","sb":760,"bb":1520,"ante":1520,"minutes":3},
            {"type":"normal","sb":780,"bb":1560,"ante":1560,"minutes":3},
            {"type":"normal","sb":800,"bb":1600,"ante":1600,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
            {"type":"normal","sb":820,"bb":1640,"ante":1640,"minutes":3},
            {"type":"normal","sb":840,"bb":1680,"ante":1680,"minutes":3},
            {"type":"normal","sb":860,"bb":1720,"ante":1720,"minutes":3},
            {"type":"normal","sb":880,"bb":1760,"ante":1760,"minutes":3},
            {"type":"normal","sb":900,"bb":1800,"ante":1800,"minutes":3},
            {"type":"normal","sb":920,"bb":1840,"ante":1840,"minutes":3},
            {"type":"normal","sb":940,"bb":1880,"ante":1880,"minutes":3},
            {"type":"normal","sb":960,"bb":1920,"ante":1920,"minutes":3},
            {"type":"normal","sb":980,"bb":1960,"ante":1960,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":1000,"bb":2000,"ante":2000,"minutes":3},
            {"type":"normal","sb":1100,"bb":2200,"ante":2200,"minutes":3},
            {"type":"normal","sb":1200,"bb":2400,"ante":2400,"minutes":3},
            {"type":"normal","sb":1300,"bb":2600,"ante":2600,"minutes":3},
            {"type":"normal","sb":1400,"bb":2800,"ante":2800,"minutes":3},
            {"type":"normal","sb":1500,"bb":3000,"ante":3000,"minutes":3},
            {"type":"normal","sb":1600,"bb":3200,"ante":3200,"minutes":3},
            {"type":"normal","sb":1700,"bb":3400,"ante":3400,"minutes":3},
            {"type":"normal","sb":1800,"bb":3600,"ante":3600,"minutes":3},
            {"type":"normal","sb":1900,"bb":3800,"ante":3800,"minutes":3},
            {"type":"normal","sb":2000,"bb":4000,"ante":4000,"minutes":3},
            {"type":"normal","sb":2100,"bb":4200,"ante":4200,"minutes":3},
            {"type":"normal","sb":2200,"bb":4400,"ante":4400,"minutes":3},
            {"type":"normal","sb":2300,"bb":4600,"ante":4600,"minutes":3},
            {"type":"normal","sb":2400,"bb":4800,"ante":4800,"minutes":3},
            {"type":"normal","sb":2500,"bb":5000,"ante":5000,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":2600,"bb":5200,"ante":5200,"minutes":3},
            {"type":"normal","sb":2700,"bb":5400,"ante":5400,"minutes":3},
            {"type":"normal","sb":2800,"bb":5600,"ante":5600,"minutes":3},
            {"type":"normal","sb":2900,"bb":5800,"ante":5800,"minutes":3},
            {"type":"normal","sb":3000,"bb":6000,"ante":6000,"minutes":3},
            {"type":"normal","sb":3200,"bb":6400,"ante":6400,"minutes":3},
            {"type":"normal","sb":3400,"bb":6800,"ante":6800,"minutes":3},
            {"type":"normal","sb":3600,"bb":7200,"ante":7200,"minutes":3},
            {"type":"normal","sb":3800,"bb":7600,"ante":7600,"minutes":3},
            {"type":"normal","sb":4000,"bb":8000,"ante":8000,"minutes":3},
            {"type":"normal","sb":4200,"bb":8400,"ante":8400,"minutes":3},
            {"type":"normal","sb":4400,"bb":8800,"ante":8800,"minutes":3},
            {"type":"normal","sb":4600,"bb":9200,"ante":9200,"minutes":3},
            {"type":"normal","sb":4800,"bb":9600,"ante":9600,"minutes":3},
            {"type":"normal","sb":5000,"bb":10000,"ante":10000,"minutes":3}
        ]
    },
    {
        "name": "hyperturbo_min50",
        "levels": [
            {"type":"normal","sb":50,"bb":100,"ante":0,"minutes":3},
            {"type":"normal","sb":100,"bb":200,"ante":0,"minutes":3},
            {"type":"normal","sb":150,"bb":300,"ante":0,"minutes":3},
            {"type":"normal","sb":200,"bb":400,"ante":0,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
            {"type":"normal","sb":500,"bb":1000,"ante":1000,"minutes":3},
            {"type":"normal","sb":550,"bb":1100,"ante":1100,"minutes":3},
            {"type":"normal","sb":600,"bb":1200,"ante":1200,"minutes":3},
            {"type":"normal","sb":650,"bb":1300,"ante":1300,"minutes":3},
            {"type":"normal","sb":700,"bb":1400,"ante":1400,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":750,"bb":1500,"ante":1500,"minutes":3},
            {"type":"normal","sb":800,"bb":1600,"ante":1600,"minutes":3},
            {"type":"normal","sb":850,"bb":1700,"ante":1700,"minutes":3},
            {"type":"normal","sb":900,"bb":1800,"ante":1800,"minutes":3},
            {"type":"normal","sb":950,"bb":1900,"ante":1900,"minutes":3},
            {"type":"normal","sb":1000,"bb":2000,"ante":2000,"minutes":3},
            {"type":"normal","sb":1050,"bb":2100,"ante":2100,"minutes":3},
            {"type":"normal","sb":1100,"bb":2200,"ante":2200,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":1150,"bb":2300,"ante":2300,"minutes":3},
            {"type":"normal","sb":1200,"bb":2400,"ante":2400,"minutes":3},
            {"type":"normal","sb":1250,"bb":2500,"ante":2500,"minutes":3},
            {"type":"normal","sb":1300,"bb":2600,"ante":2600,"minutes":3},
            {"type":"normal","sb":1350,"bb":2700,"ante":2700,"minutes":3},
            {"type":"normal","sb":1400,"bb":2800,"ante":2800,"minutes":3},
            {"type":"normal","sb":1450,"bb":2900,"ante":2900,"minutes":3},
            {"type":"normal","sb":1500,"bb":3000,"ante":3000,"minutes":3},
            {"type":"normal","sb":1550,"bb":3100,"ante":3100,"minutes":3},
            {"type":"normal","sb":1600,"bb":3200,"ante":3200,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
            {"type":"normal","sb":1650,"bb":3300,"ante":3300,"minutes":3},
            {"type":"normal","sb":1700,"bb":3400,"ante":3400,"minutes":3},
            {"type":"normal","sb":1750,"bb":3500,"ante":3500,"minutes":3},
            {"type":"normal","sb":1800,"bb":3600,"ante":3600,"minutes":3},
            {"type":"normal","sb":1850,"bb":3700,"ante":3700,"minutes":3},
            {"type":"normal","sb":1900,"bb":3800,"ante":3800,"minutes":3},
            {"type":"normal","sb":1950,"bb":3900,"ante":3900,"minutes":3},
            {"type":"normal","sb":2000,"bb":4000,"ante":4000,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":2100,"bb":4200,"ante":4200,"minutes":3},
            {"type":"normal","sb":2200,"bb":4400,"ante":4400,"minutes":3},
            {"type":"normal","sb":2250,"bb":4500,"ante":4500,"minutes":3},
            {"type":"normal","sb":2300,"bb":4600,"ante":4600,"minutes":3},
            {"type":"normal","sb":2400,"bb":4800,"ante":4800,"minutes":3},
            {"type":"normal","sb":2500,"bb":5000,"ante":5000,"minutes":3},
            {"type":"normal","sb":2600,"bb":5200,"ante":5200,"minutes":3},
            {"type":"normal","sb":2700,"bb":5400,"ante":5400,"minutes":3},
            {"type":"normal","sb":2800,"bb":5600,"ante":5600,"minutes":3},
            {"type":"normal","sb":2900,"bb":5800,"ante":5800,"minutes":3},
            {"type":"normal","sb":3000,"bb":6000,"ante":6000,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":3100,"bb":6200,"ante":6200,"minutes":3},
            {"type":"normal","sb":3200,"bb":6400,"ante":6400,"minutes":3},
            {"type":"normal","sb":3300,"bb":6600,"ante":6600,"minutes":3},
            {"type":"normal","sb":3400,"bb":6800,"ante":6800,"minutes":3},
            {"type":"normal","sb":3500,"bb":7000,"ante":7000,"minutes":3},
            {"type":"normal","sb":3600,"bb":7200,"ante":7200,"minutes":3},
            {"type":"normal","sb":3700,"bb":7400,"ante":7400,"minutes":3},
            {"type":"normal","sb":3800,"bb":7600,"ante":7600,"minutes":3},
            {"type":"normal","sb":3900,"bb":7800,"ante":7800,"minutes":3},
            {"type":"normal","sb":4000,"bb":8000,"ante":8000,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
            {"type":"normal","sb":4100,"bb":8200,"ante":8200,"minutes":3},
            {"type":"normal","sb":4200,"bb":8400,"ante":8400,"minutes":3},
            {"type":"normal","sb":4300,"bb":8600,"ante":8600,"minutes":3},
            {"type":"normal","sb":4400,"bb":8800,"ante":8800,"minutes":3},
            {"type":"normal","sb":4500,"bb":9000,"ante":9000,"minutes":3},
            {"type":"normal","sb":4600,"bb":9200,"ante":9200,"minutes":3},
            {"type":"normal","sb":4700,"bb":9400,"ante":9400,"minutes":3},
            {"type":"normal","sb":4800,"bb":9600,"ante":9600,"minutes":3},
            {"type":"normal","sb":4900,"bb":9800,"ante":9800,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":5000,"bb":10000,"ante":10000,"minutes":3},
            {"type":"normal","sb":5500,"bb":11000,"ante":11000,"minutes":3},
            {"type":"normal","sb":6000,"bb":12000,"ante":12000,"minutes":3},
            {"type":"normal","sb":6500,"bb":13000,"ante":13000,"minutes":3},
            {"type":"normal","sb":7000,"bb":14000,"ante":14000,"minutes":3},
            {"type":"normal","sb":7500,"bb":15000,"ante":15000,"minutes":3},
            {"type":"normal","sb":8000,"bb":16000,"ante":16000,"minutes":3},
            {"type":"normal","sb":8500,"bb":17000,"ante":17000,"minutes":3},
            {"type":"normal","sb":9000,"bb":18000,"ante":18000,"minutes":3},
            {"type":"normal","sb":9500,"bb":19000,"ante":19000,"minutes":3},
            {"type":"normal","sb":10000,"bb":20000,"ante":20000,"minutes":3},
            {"type":"normal","sb":10500,"bb":21000,"ante":21000,"minutes":3},
            {"type":"normal","sb":11000,"bb":22000,"ante":22000,"minutes":3},
            {"type":"normal","sb":11500,"bb":23000,"ante":23000,"minutes":3},
            {"type":"normal","sb":12000,"bb":24000,"ante":24000,"minutes":3},
            {"type":"normal","sb":12500,"bb":25000,"ante":25000,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":13000,"bb":26000,"ante":26000,"minutes":3},
            {"type":"normal","sb":13500,"bb":27000,"ante":27000,"minutes":3},
            {"type":"normal","sb":14000,"bb":28000,"ante":28000,"minutes":3},
            {"type":"normal","sb":14500,"bb":29000,"ante":29000,"minutes":3},
            {"type":"normal","sb":15000,"bb":30000,"ante":30000,"minutes":3},
            {"type":"normal","sb":16000,"bb":32000,"ante":32000,"minutes":3},
            {"type":"normal","sb":17000,"bb":34000,"ante":34000,"minutes":3},
            {"type":"normal","sb":18000,"bb":36000,"ante":36000,"minutes":3},
            {"type":"normal","sb":19000,"bb":38000,"ante":38000,"minutes":3},
            {"type":"normal","sb":20000,"bb":40000,"ante":40000,"minutes":3},
            {"type":"normal","sb":21000,"bb":42000,"ante":42000,"minutes":3},
            {"type":"normal","sb":22000,"bb":44000,"ante":44000,"minutes":3},
            {"type":"normal","sb":23000,"bb":46000,"ante":46000,"minutes":3},
            {"type":"normal","sb":24000,"bb":48000,"ante":48000,"minutes":3},
            {"type":"normal","sb":25000,"bb":50000,"ante":50000,"minutes":3}
        ]
    },
    {
        "name": "hyperturbo_min100",
        "levels": [
            {"type":"normal","sb":100,"bb":200,"ante":0,"minutes":3},
            {"type":"normal","sb":200,"bb":400,"ante":0,"minutes":3},
            {"type":"normal","sb":300,"bb":600,"ante":0,"minutes":3},
            {"type":"normal","sb":400,"bb":800,"ante":0,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
            {"type":"normal","sb":1000,"bb":2000,"ante":2000,"minutes":3},
            {"type":"normal","sb":1100,"bb":2200,"ante":2200,"minutes":3},
            {"type":"normal","sb":1200,"bb":2400,"ante":2400,"minutes":3},
            {"type":"normal","sb":1300,"bb":2600,"ante":2600,"minutes":3},
            {"type":"normal","sb":1400,"bb":2800,"ante":2800,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":1500,"bb":3000,"ante":3000,"minutes":3},
            {"type":"normal","sb":1600,"bb":3200,"ante":3200,"minutes":3},
            {"type":"normal","sb":1700,"bb":3400,"ante":3400,"minutes":3},
            {"type":"normal","sb":1800,"bb":3600,"ante":3600,"minutes":3},
            {"type":"normal","sb":1900,"bb":3800,"ante":3800,"minutes":3},
            {"type":"normal","sb":2000,"bb":4000,"ante":4000,"minutes":3},
            {"type":"normal","sb":2100,"bb":4200,"ante":4200,"minutes":3},
            {"type":"normal","sb":2200,"bb":4400,"ante":4400,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":2300,"bb":4600,"ante":4600,"minutes":3},
            {"type":"normal","sb":2400,"bb":4800,"ante":4800,"minutes":3},
            {"type":"normal","sb":2500,"bb":5000,"ante":5000,"minutes":3},
            {"type":"normal","sb":2600,"bb":5200,"ante":5200,"minutes":3},
            {"type":"normal","sb":2700,"bb":5400,"ante":5400,"minutes":3},
            {"type":"normal","sb":2800,"bb":5600,"ante":5600,"minutes":3},
            {"type":"normal","sb":2900,"bb":5800,"ante":5800,"minutes":3},
            {"type":"normal","sb":3000,"bb":6000,"ante":6000,"minutes":3},
            {"type":"normal","sb":3100,"bb":6200,"ante":6200,"minutes":3},
            {"type":"normal","sb":3200,"bb":6400,"ante":6400,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
            {"type":"normal","sb":3300,"bb":6600,"ante":6600,"minutes":3},
            {"type":"normal","sb":3400,"bb":6800,"ante":6800,"minutes":3},
            {"type":"normal","sb":3500,"bb":7000,"ante":7000,"minutes":3},
            {"type":"normal","sb":3600,"bb":7200,"ante":7200,"minutes":3},
            {"type":"normal","sb":3700,"bb":7400,"ante":7400,"minutes":3},
            {"type":"normal","sb":3800,"bb":7600,"ante":7600,"minutes":3},
            {"type":"normal","sb":3900,"bb":7800,"ante":7800,"minutes":3},
            {"type":"normal","sb":4000,"bb":8000,"ante":8000,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":4200,"bb":8400,"ante":8400,"minutes":3},
            {"type":"normal","sb":4400,"bb":8800,"ante":8800,"minutes":3},
            {"type":"normal","sb":4500,"bb":9000,"ante":9000,"minutes":3},
            {"type":"normal","sb":4600,"bb":9200,"ante":9200,"minutes":3},
            {"type":"normal","sb":4800,"bb":9600,"ante":9600,"minutes":3},
            {"type":"normal","sb":5000,"bb":10000,"ante":10000,"minutes":3},
            {"type":"normal","sb":5200,"bb":10400,"ante":10400,"minutes":3},
            {"type":"normal","sb":5400,"bb":10800,"ante":10800,"minutes":3},
            {"type":"normal","sb":5600,"bb":11200,"ante":11200,"minutes":3},
            {"type":"normal","sb":5800,"bb":11600,"ante":11600,"minutes":3},
            {"type":"normal","sb":6000,"bb":12000,"ante":12000,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":6200,"bb":12400,"ante":12400,"minutes":3},
            {"type":"normal","sb":6400,"bb":12800,"ante":12800,"minutes":3},
            {"type":"normal","sb":6600,"bb":13200,"ante":13200,"minutes":3},
            {"type":"normal","sb":6800,"bb":13600,"ante":13600,"minutes":3},
            {"type":"normal","sb":7000,"bb":14000,"ante":14000,"minutes":3},
            {"type":"normal","sb":7200,"bb":14400,"ante":14400,"minutes":3},
            {"type":"normal","sb":7400,"bb":14800,"ante":14800,"minutes":3},
            {"type":"normal","sb":7600,"bb":15200,"ante":15200,"minutes":3},
            {"type":"normal","sb":7800,"bb":15600,"ante":15600,"minutes":3},
            {"type":"normal","sb":8000,"bb":16000,"ante":16000,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
            {"type":"normal","sb":8200,"bb":16400,"ante":16400,"minutes":3},
            {"type":"normal","sb":8400,"bb":16800,"ante":16800,"minutes":3},
            {"type":"normal","sb":8600,"bb":17200,"ante":17200,"minutes":3},
            {"type":"normal","sb":8800,"bb":17600,"ante":17600,"minutes":3},
            {"type":"normal","sb":9000,"bb":18000,"ante":18000,"minutes":3},
            {"type":"normal","sb":9200,"bb":18400,"ante":18400,"minutes":3},
            {"type":"normal","sb":9400,"bb":18800,"ante":18800,"minutes":3},
            {"type":"normal","sb":9600,"bb":19200,"ante":19200,"minutes":3},
            {"type":"normal","sb":9800,"bb":19600,"ante":19600,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":10000,"bb":20000,"ante":20000,"minutes":3},
            {"type":"normal","sb":11000,"bb":22000,"ante":22000,"minutes":3},
            {"type":"normal","sb":12000,"bb":24000,"ante":24000,"minutes":3},
            {"type":"normal","sb":13000,"bb":26000,"ante":26000,"minutes":3},
            {"type":"normal","sb":14000,"bb":28000,"ante":28000,"minutes":3},
            {"type":"normal","sb":15000,"bb":30000,"ante":30000,"minutes":3},
            {"type":"normal","sb":16000,"bb":32000,"ante":32000,"minutes":3},
            {"type":"normal","sb":17000,"bb":34000,"ante":34000,"minutes":3},
            {"type":"normal","sb":18000,"bb":36000,"ante":36000,"minutes":3},
            {"type":"normal","sb":19000,"bb":38000,"ante":38000,"minutes":3},
            {"type":"normal","sb":20000,"bb":40000,"ante":40000,"minutes":3},
            {"type":"normal","sb":21000,"bb":42000,"ante":42000,"minutes":3},
            {"type":"normal","sb":22000,"bb":44000,"ante":44000,"minutes":3},
            {"type":"normal","sb":23000,"bb":46000,"ante":46000,"minutes":3},
            {"type":"normal","sb":24000,"bb":48000,"ante":48000,"minutes":3},
            {"type":"normal","sb":25000,"bb":50000,"ante":50000,"minutes":3},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":26000,"bb":52000,"ante":52000,"minutes":3},
            {"type":"normal","sb":27000,"bb":54000,"ante":54000,"minutes":3},
            {"type":"normal","sb":28000,"bb":56000,"ante":56000,"minutes":3},
            {"type":"normal","sb":29000,"bb":58000,"ante":58000,"minutes":3},
            {"type":"normal","sb":30000,"bb":60000,"ante":60000,"minutes":3},
            {"type":"normal","sb":32000,"bb":64000,"ante":64000,"minutes":3},
            {"type":"normal","sb":34000,"bb":68000,"ante":68000,"minutes":3},
            {"type":"normal","sb":36000,"bb":72000,"ante":72000,"minutes":3},
            {"type":"normal","sb":38000,"bb":76000,"ante":76000,"minutes":3},
            {"type":"normal","sb":40000,"bb":80000,"ante":80000,"minutes":3},
            {"type":"normal","sb":42000,"bb":84000,"ante":84000,"minutes":3},
            {"type":"normal","sb":44000,"bb":88000,"ante":88000,"minutes":3},
            {"type":"normal","sb":46000,"bb":92000,"ante":92000,"minutes":3},
            {"type":"normal","sb":48000,"bb":96000,"ante":96000,"minutes":3},
            {"type":"normal","sb":50000,"bb":100000,"ante":100000,"minutes":3}
        ]
    },
    {
        "name": "turbo_min10",
        "levels": [
            {"type":"normal","sb":10,"bb":20,"ante":0,"minutes":5},
            {"type":"normal","sb":20,"bb":40,"ante":0,"minutes":5},
            {"type":"normal","sb":30,"bb":60,"ante":0,"minutes":5},
            {"type":"normal","sb":40,"bb":80,"ante":0,"minutes":5},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
            {"type":"normal","sb":100,"bb":200,"ante":200,"minutes":5},
            {"type":"normal","sb":110,"bb":220,"ante":220,"minutes":5},
            {"type":"normal","sb":120,"bb":240,"ante":240,"minutes":5},
            {"type":"normal","sb":130,"bb":260,"ante":260,"minutes":5},
            {"type":"normal","sb":140,"bb":280,"ante":280,"minutes":5},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":150,"bb":300,"ante":300,"minutes":5},
            {"type":"normal","sb":160,"bb":320,"ante":320,"minutes":5},
            {"type":"normal","sb":170,"bb":340,"ante":340,"minutes":5},
            {"type":"normal","sb":180,"bb":360,"ante":360,"minutes":5},
            {"type":"normal","sb":190,"bb":380,"ante":380,"minutes":5},
            {"type":"normal","sb":200,"bb":400,"ante":400,"minutes":5},
            {"type":"normal","sb":210,"bb":420,"ante":420,"minutes":5},
            {"type":"normal","sb":220,"bb":440,"ante":440,"minutes":5},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":230,"bb":460,"ante":460,"minutes":5},
            {"type":"normal","sb":240,"bb":480,"ante":480,"minutes":5},
            {"type":"normal","sb":250,"bb":500,"ante":500,"minutes":5},
            {"type":"normal","sb":260,"bb":520,"ante":520,"minutes":5},
            {"type":"normal","sb":270,"bb":540,"ante":540,"minutes":5},
            {"type":"normal","sb":280,"bb":560,"ante":560,"minutes":5},
            {"type":"normal","sb":290,"bb":580,"ante":580,"minutes":5},
            {"type":"normal","sb":300,"bb":600,"ante":600,"minutes":5},
            {"type":"normal","sb":310,"bb":620,"ante":620,"minutes":5},
            {"type":"normal","sb":320,"bb":640,"ante":640,"minutes":5},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":15},
            {"type":"normal","sb":330,"bb":660,"ante":660,"minutes":5},
            {"type":"normal","sb":340,"bb":680,"ante":680,"minutes":5},
            {"type":"normal","sb":350,"bb":700,"ante":700,"minutes":5},
            {"type":"normal","sb":360,"bb":720,"ante":720,"minutes":5},
            {"type":"normal","sb":370,"bb":740,"ante":740,"minutes":5},
            {"type":"normal","sb":380,"bb":760,"ante":760,"minutes":5},
            {"type":"normal","sb":390,"bb":780,"ante":780,"minutes":5},
            {"type":"normal","sb":400,"bb":800,"ante":800,"minutes":5},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":420,"bb":840,"ante":840,"minutes":5},
            {"type":"normal","sb":440,"bb":880,"ante":880,"minutes":5},
            {"type":"normal","sb":450,"bb":900,"ante":900,"minutes":5},
            {"type":"normal","sb":460,"bb":920,"ante":920,"minutes":5},
            {"type":"normal","sb":480,"bb":960,"ante":960,"minutes":5},
            {"type":"normal","sb":500,"bb":1000,"ante":1000,"minutes":5},
            {"type":"normal","sb":520,"bb":1040,"ante":1040,"minutes":5},
            {"type":"normal","sb":540,"bb":1080,"ante":1080,"minutes":5},
            {"type":"normal","sb":560,"bb":1120,"ante":1120,"minutes":5},
            {"type":"normal","sb":580,"bb":1160,"ante":1160,"minutes":5},
            {"type":"normal","sb":600,"bb":1200,"ante":1200,"minutes":5},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":620,"bb":1240,"ante":1240,"minutes":5},
            {"type":"normal","sb":640,"bb":1280,"ante":1280,"minutes":5},
            {"type":"normal","sb":660,"bb":1320,"ante":1320,"minutes":5},
            {"type":"normal","sb":680,"bb":1360,"ante":1360,"minutes":5},
            {"type":"normal","sb":700,"bb":1400,"ante":1400,"minutes":5},
            {"type":"normal","sb":720,"bb":1440,"ante":1440,"minutes":5},
            {"type":"normal","sb":740,"bb":1480,"ante":1480,"minutes":5},
            {"type":"normal","sb":760,"bb":1520,"ante":1520,"minutes":5},
            {"type":"normal","sb":780,"bb":1560,"ante":1560,"minutes":5},
            {"type":"normal","sb":800,"bb":1600,"ante":1600,"minutes":5},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":820,"bb":1640,"ante":1640,"minutes":5},
            {"type":"normal","sb":840,"bb":1680,"ante":1680,"minutes":5},
            {"type":"normal","sb":860,"bb":1720,"ante":1720,"minutes":5},
            {"type":"normal","sb":880,"bb":1760,"ante":1760,"minutes":5},
            {"type":"normal","sb":900,"bb":1800,"ante":1800,"minutes":5},
            {"type":"normal","sb":920,"bb":1840,"ante":1840,"minutes":5},
            {"type":"normal","sb":940,"bb":1880,"ante":1880,"minutes":5},
            {"type":"normal","sb":960,"bb":1920,"ante":1920,"minutes":5},
            {"type":"normal","sb":980,"bb":1960,"ante":1960,"minutes":5},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":1000,"bb":2000,"ante":2000,"minutes":5},
            {"type":"normal","sb":1100,"bb":2200,"ante":2200,"minutes":5},
            {"type":"normal","sb":1200,"bb":2400,"ante":2400,"minutes":5},
            {"type":"normal","sb":1300,"bb":2600,"ante":2600,"minutes":5},
            {"type":"normal","sb":1400,"bb":2800,"ante":2800,"minutes":5},
            {"type":"normal","sb":1500,"bb":3000,"ante":3000,"minutes":5},
            {"type":"normal","sb":1600,"bb":3200,"ante":3200,"minutes":5},
            {"type":"normal","sb":1700,"bb":3400,"ante":3400,"minutes":5},
            {"type":"normal","sb":1800,"bb":3600,"ante":3600,"minutes":5},
            {"type":"normal","sb":1900,"bb":3800,"ante":3800,"minutes":5},
            {"type":"normal","sb":2000,"bb":4000,"ante":4000,"minutes":5},
            {"type":"normal","sb":2100,"bb":4200,"ante":4200,"minutes":5},
            {"type":"normal","sb":2200,"bb":4400,"ante":4400,"minutes":5},
            {"type":"normal","sb":2300,"bb":4600,"ante":4600,"minutes":5},
            {"type":"normal","sb":2400,"bb":4800,"ante":4800,"minutes":5},
            {"type":"normal","sb":2500,"bb":5000,"ante":5000,"minutes":5},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":15},
            {"type":"normal","sb":2600,"bb":5200,"ante":5200,"minutes":5},
            {"type":"normal","sb":2700,"bb":5400,"ante":5400,"minutes":5},
            {"type":"normal","sb":2800,"bb":5600,"ante":5600,"minutes":5},
            {"type":"normal","sb":2900,"bb":5800,"ante":5800,"minutes":5},
            {"type":"normal","sb":3000,"bb":6000,"ante":6000,"minutes":5},
            {"type":"normal","sb":3200,"bb":6400,"ante":6400,"minutes":5},
            {"type":"normal","sb":3400,"bb":6800,"ante":6800,"minutes":5},
            {"type":"normal","sb":3600,"bb":7200,"ante":7200,"minutes":5},
            {"type":"normal","sb":3800,"bb":7600,"ante":7600,"minutes":5},
            {"type":"normal","sb":4000,"bb":8000,"ante":8000,"minutes":5},
            {"type":"normal","sb":4200,"bb":8400,"ante":8400,"minutes":5},
            {"type":"normal","sb":4400,"bb":8800,"ante":8800,"minutes":5},
            {"type":"normal","sb":4600,"bb":9200,"ante":9200,"minutes":5},
            {"type":"normal","sb":4800,"bb":9600,"ante":9600,"minutes":5},
            {"type":"normal","sb":5000,"bb":10000,"ante":10000,"minutes":5}
        ]
    },
    {
        "name": "turbo_min50",
        "levels": [
            {"type":"normal","sb":50,"bb":100,"ante":0,"minutes":5},
            {"type":"normal","sb":100,"bb":200,"ante":0,"minutes":5},
            {"type":"normal","sb":150,"bb":300,"ante":0,"minutes":5},
            {"type":"normal","sb":200,"bb":400,"ante":0,"minutes":5},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
            {"type":"normal","sb":500,"bb":1000,"ante":1000,"minutes":5},
            {"type":"normal","sb":550,"bb":1100,"ante":1100,"minutes":5},
            {"type":"normal","sb":600,"bb":1200,"ante":1200,"minutes":5},
            {"type":"normal","sb":650,"bb":1300,"ante":1300,"minutes":5},
            {"type":"normal","sb":700,"bb":1400,"ante":1400,"minutes":5},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":750,"bb":1500,"ante":1500,"minutes":5},
            {"type":"normal","sb":800,"bb":1600,"ante":1600,"minutes":5},
            {"type":"normal","sb":850,"bb":1700,"ante":1700,"minutes":5},
            {"type":"normal","sb":900,"bb":1800,"ante":1800,"minutes":5},
            {"type":"normal","sb":950,"bb":1900,"ante":1900,"minutes":5},
            {"type":"normal","sb":1000,"bb":2000,"ante":2000,"minutes":5},
            {"type":"normal","sb":1050,"bb":2100,"ante":2100,"minutes":5},
            {"type":"normal","sb":1100,"bb":2200,"ante":2200,"minutes":5},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":1150,"bb":2300,"ante":2300,"minutes":5},
            {"type":"normal","sb":1200,"bb":2400,"ante":2400,"minutes":5},
            {"type":"normal","sb":1250,"bb":2500,"ante":2500,"minutes":5},
            {"type":"normal","sb":1300,"bb":2600,"ante":2600,"minutes":5},
            {"type":"normal","sb":1350,"bb":2700,"ante":2700,"minutes":5},
            {"type":"normal","sb":1400,"bb":2800,"ante":2800,"minutes":5},
            {"type":"normal","sb":1450,"bb":2900,"ante":2900,"minutes":5},
            {"type":"normal","sb":1500,"bb":3000,"ante":3000,"minutes":5},
            {"type":"normal","sb":1550,"bb":3100,"ante":3100,"minutes":5},
            {"type":"normal","sb":1600,"bb":3200,"ante":3200,"minutes":5},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":15},
            {"type":"normal","sb":1650,"bb":3300,"ante":3300,"minutes":5},
            {"type":"normal","sb":1700,"bb":3400,"ante":3400,"minutes":5},
            {"type":"normal","sb":1750,"bb":3500,"ante":3500,"minutes":5},
            {"type":"normal","sb":1800,"bb":3600,"ante":3600,"minutes":5},
            {"type":"normal","sb":1850,"bb":3700,"ante":3700,"minutes":5},
            {"type":"normal","sb":1900,"bb":3800,"ante":3800,"minutes":5},
            {"type":"normal","sb":1950,"bb":3900,"ante":3900,"minutes":5},
            {"type":"normal","sb":2000,"bb":4000,"ante":4000,"minutes":5},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":2100,"bb":4200,"ante":4200,"minutes":5},
            {"type":"normal","sb":2200,"bb":4400,"ante":4400,"minutes":5},
            {"type":"normal","sb":2250,"bb":4500,"ante":4500,"minutes":5},
            {"type":"normal","sb":2300,"bb":4600,"ante":4600,"minutes":5},
            {"type":"normal","sb":2400,"bb":4800,"ante":4800,"minutes":5},
            {"type":"normal","sb":2500,"bb":5000,"ante":5000,"minutes":5},
            {"type":"normal","sb":2600,"bb":5200,"ante":5200,"minutes":5},
            {"type":"normal","sb":2700,"bb":5400,"ante":5400,"minutes":5},
            {"type":"normal","sb":2800,"bb":5600,"ante":5600,"minutes":5},
            {"type":"normal","sb":2900,"bb":5800,"ante":5800,"minutes":5},
            {"type":"normal","sb":3000,"bb":6000,"ante":6000,"minutes":5},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":3100,"bb":6200,"ante":6200,"minutes":5},
            {"type":"normal","sb":3200,"bb":6400,"ante":6400,"minutes":5},
            {"type":"normal","sb":3300,"bb":6600,"ante":6600,"minutes":5},
            {"type":"normal","sb":3400,"bb":6800,"ante":6800,"minutes":5},
            {"type":"normal","sb":3500,"bb":7000,"ante":7000,"minutes":5},
            {"type":"normal","sb":3600,"bb":7200,"ante":7200,"minutes":5},
            {"type":"normal","sb":3700,"bb":7400,"ante":7400,"minutes":5},
            {"type":"normal","sb":3800,"bb":7600,"ante":7600,"minutes":5},
            {"type":"normal","sb":3900,"bb":7800,"ante":7800,"minutes":5},
            {"type":"normal","sb":4000,"bb":8000,"ante":8000,"minutes":5},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":4100,"bb":8200,"ante":8200,"minutes":5},
            {"type":"normal","sb":4200,"bb":8400,"ante":8400,"minutes":5},
            {"type":"normal","sb":4300,"bb":8600,"ante":8600,"minutes":5},
            {"type":"normal","sb":4400,"bb":8800,"ante":8800,"minutes":5},
            {"type":"normal","sb":4500,"bb":9000,"ante":9000,"minutes":5},
            {"type":"normal","sb":4600,"bb":9200,"ante":9200,"minutes":5},
            {"type":"normal","sb":4700,"bb":9400,"ante":9400,"minutes":5},
            {"type":"normal","sb":4800,"bb":9600,"ante":9600,"minutes":5},
            {"type":"normal","sb":4900,"bb":9800,"ante":9800,"minutes":5},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":5000,"bb":10000,"ante":10000,"minutes":5},
            {"type":"normal","sb":5500,"bb":11000,"ante":11000,"minutes":5},
            {"type":"normal","sb":6000,"bb":12000,"ante":12000,"minutes":5},
            {"type":"normal","sb":6500,"bb":13000,"ante":13000,"minutes":5},
            {"type":"normal","sb":7000,"bb":14000,"ante":14000,"minutes":5},
            {"type":"normal","sb":7500,"bb":15000,"ante":15000,"minutes":5},
            {"type":"normal","sb":8000,"bb":16000,"ante":16000,"minutes":5},
            {"type":"normal","sb":8500,"bb":17000,"ante":17000,"minutes":5},
            {"type":"normal","sb":9000,"bb":18000,"ante":18000,"minutes":5},
            {"type":"normal","sb":9500,"bb":19000,"ante":19000,"minutes":5},
            {"type":"normal","sb":10000,"bb":20000,"ante":20000,"minutes":5},
            {"type":"normal","sb":10500,"bb":21000,"ante":21000,"minutes":5},
            {"type":"normal","sb":11000,"bb":22000,"ante":22000,"minutes":5},
            {"type":"normal","sb":11500,"bb":23000,"ante":23000,"minutes":5},
            {"type":"normal","sb":12000,"bb":24000,"ante":24000,"minutes":5},
            {"type":"normal","sb":12500,"bb":25000,"ante":25000,"minutes":5},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":15},
            {"type":"normal","sb":13000,"bb":26000,"ante":26000,"minutes":5},
            {"type":"normal","sb":13500,"bb":27000,"ante":27000,"minutes":5},
            {"type":"normal","sb":14000,"bb":28000,"ante":28000,"minutes":5},
            {"type":"normal","sb":14500,"bb":29000,"ante":29000,"minutes":5},
            {"type":"normal","sb":15000,"bb":30000,"ante":30000,"minutes":5},
            {"type":"normal","sb":16000,"bb":32000,"ante":32000,"minutes":5},
            {"type":"normal","sb":17000,"bb":34000,"ante":34000,"minutes":5},
            {"type":"normal","sb":18000,"bb":36000,"ante":36000,"minutes":5},
            {"type":"normal","sb":19000,"bb":38000,"ante":38000,"minutes":5},
            {"type":"normal","sb":20000,"bb":40000,"ante":40000,"minutes":5},
            {"type":"normal","sb":21000,"bb":42000,"ante":42000,"minutes":5},
            {"type":"normal","sb":22000,"bb":44000,"ante":44000,"minutes":5},
            {"type":"normal","sb":23000,"bb":46000,"ante":46000,"minutes":5},
            {"type":"normal","sb":24000,"bb":48000,"ante":48000,"minutes":5},
            {"type":"normal","sb":25000,"bb":50000,"ante":50000,"minutes":5}
        ]
    },
    {
    "name": "turbo_min100",
    "levels": [
        {"type":"normal","sb":100,"bb":200,"ante":0,"minutes":5},
        {"type":"normal","sb":200,"bb":400,"ante":0,"minutes":5},
        {"type":"normal","sb":300,"bb":600,"ante":0,"minutes":5},
        {"type":"normal","sb":400,"bb":800,"ante":0,"minutes":5},
        {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
        {"type":"normal","sb":1000,"bb":2000,"ante":2000,"minutes":5},
        {"type":"normal","sb":1100,"bb":2200,"ante":2200,"minutes":5},
        {"type":"normal","sb":1200,"bb":2400,"ante":2400,"minutes":5},
        {"type":"normal","sb":1300,"bb":2600,"ante":2600,"minutes":5},
        {"type":"normal","sb":1400,"bb":2800,"ante":2800,"minutes":5},
        {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
        {"type":"normal","sb":1500,"bb":3000,"ante":3000,"minutes":5},
        {"type":"normal","sb":1600,"bb":3200,"ante":3200,"minutes":5},
        {"type":"normal","sb":1700,"bb":3400,"ante":3400,"minutes":5},
        {"type":"normal","sb":1800,"bb":3600,"ante":3600,"minutes":5},
        {"type":"normal","sb":1900,"bb":3800,"ante":3800,"minutes":5},
        {"type":"normal","sb":2000,"bb":4000,"ante":4000,"minutes":5},
        {"type":"normal","sb":2100,"bb":4200,"ante":4200,"minutes":5},
        {"type":"normal","sb":2200,"bb":4400,"ante":4400,"minutes":5},
        {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
        {"type":"normal","sb":2300,"bb":4600,"ante":4600,"minutes":5},
        {"type":"normal","sb":2400,"bb":4800,"ante":4800,"minutes":5},
        {"type":"normal","sb":2500,"bb":5000,"ante":5000,"minutes":5},
        {"type":"normal","sb":2600,"bb":5200,"ante":5200,"minutes":5},
        {"type":"normal","sb":2700,"bb":5400,"ante":5400,"minutes":5},
        {"type":"normal","sb":2800,"bb":5600,"ante":5600,"minutes":5},
        {"type":"normal","sb":2900,"bb":5800,"ante":5800,"minutes":5},
        {"type":"normal","sb":3000,"bb":6000,"ante":6000,"minutes":5},
        {"type":"normal","sb":3100,"bb":6200,"ante":6200,"minutes":5},
        {"type":"normal","sb":3200,"bb":6400,"ante":6400,"minutes":5},
        {"type":"break","sb":0,"bb":0,"ante":0,"minutes":15},
        {"type":"normal","sb":3300,"bb":6600,"ante":6600,"minutes":5},
        {"type":"normal","sb":3400,"bb":6800,"ante":6800,"minutes":5},
        {"type":"normal","sb":3500,"bb":7000,"ante":7000,"minutes":5},
        {"type":"normal","sb":3600,"bb":7200,"ante":7200,"minutes":5},
        {"type":"normal","sb":3700,"bb":7400,"ante":7400,"minutes":5},
        {"type":"normal","sb":3800,"bb":7600,"ante":7600,"minutes":5},
        {"type":"normal","sb":3900,"bb":7800,"ante":7800,"minutes":5},
        {"type":"normal","sb":4000,"bb":8000,"ante":8000,"minutes":5},
        {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
        {"type":"normal","sb":4200,"bb":8400,"ante":8400,"minutes":5},
        {"type":"normal","sb":4400,"bb":8800,"ante":8800,"minutes":5},
        {"type":"normal","sb":4500,"bb":9000,"ante":9000,"minutes":5},
        {"type":"normal","sb":4600,"bb":9200,"ante":9200,"minutes":5},
        {"type":"normal","sb":4800,"bb":9600,"ante":9600,"minutes":5},
        {"type":"normal","sb":5000,"bb":10000,"ante":10000,"minutes":5},
        {"type":"normal","sb":5200,"bb":10400,"ante":10400,"minutes":5},
        {"type":"normal","sb":5400,"bb":10800,"ante":10800,"minutes":5},
        {"type":"normal","sb":5600,"bb":11200,"ante":11200,"minutes":5},
        {"type":"normal","sb":5800,"bb":11600,"ante":11600,"minutes":5},
        {"type":"normal","sb":6000,"bb":12000,"ante":12000,"minutes":5},
        {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
        {"type":"normal","sb":6200,"bb":12400,"ante":12400,"minutes":5},
        {"type":"normal","sb":6400,"bb":12800,"ante":12800,"minutes":5},
        {"type":"normal","sb":6600,"bb":13200,"ante":13200,"minutes":5},
        {"type":"normal","sb":6800,"bb":13600,"ante":13600,"minutes":5},
        {"type":"normal","sb":7000,"bb":14000,"ante":14000,"minutes":5},
        {"type":"normal","sb":7200,"bb":14400,"ante":14400,"minutes":5},
        {"type":"normal","sb":7400,"bb":14800,"ante":14800,"minutes":5},
        {"type":"normal","sb":7600,"bb":15200,"ante":15200,"minutes":5},
        {"type":"normal","sb":7800,"bb":15600,"ante":15600,"minutes":5},
        {"type":"normal","sb":8000,"bb":16000,"ante":16000,"minutes":5},
        {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
        {"type":"normal","sb":8200,"bb":16400,"ante":16400,"minutes":5},
        {"type":"normal","sb":8400,"bb":16800,"ante":16800,"minutes":5},
        {"type":"normal","sb":8600,"bb":17200,"ante":17200,"minutes":5},
        {"type":"normal","sb":8800,"bb":17600,"ante":17600,"minutes":5},
        {"type":"normal","sb":9000,"bb":18000,"ante":18000,"minutes":5},
        {"type":"normal","sb":9200,"bb":18400,"ante":18400,"minutes":5},
        {"type":"normal","sb":9400,"bb":18800,"ante":18800,"minutes":5},
        {"type":"normal","sb":9600,"bb":19200,"ante":19200,"minutes":5},
        {"type":"normal","sb":9800,"bb":19600,"ante":19600,"minutes":5},
        {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
        {"type":"normal","sb":10000,"bb":20000,"ante":20000,"minutes":5},
        {"type":"normal","sb":11000,"bb":22000,"ante":22000,"minutes":5},
        {"type":"normal","sb":12000,"bb":24000,"ante":24000,"minutes":5},
        {"type":"normal","sb":13000,"bb":26000,"ante":26000,"minutes":5},
        {"type":"normal","sb":14000,"bb":28000,"ante":28000,"minutes":5},
        {"type":"normal","sb":15000,"bb":30000,"ante":30000,"minutes":5},
        {"type":"normal","sb":16000,"bb":32000,"ante":32000,"minutes":5},
        {"type":"normal","sb":17000,"bb":34000,"ante":34000,"minutes":5},
        {"type":"normal","sb":18000,"bb":36000,"ante":36000,"minutes":5},
        {"type":"normal","sb":19000,"bb":38000,"ante":38000,"minutes":5},
        {"type":"normal","sb":20000,"bb":40000,"ante":40000,"minutes":5},
        {"type":"normal","sb":21000,"bb":42000,"ante":42000,"minutes":5},
        {"type":"normal","sb":22000,"bb":44000,"ante":44000,"minutes":5},
        {"type":"normal","sb":23000,"bb":46000,"ante":46000,"minutes":5},
        {"type":"normal","sb":24000,"bb":48000,"ante":48000,"minutes":5},
        {"type":"normal","sb":25000,"bb":50000,"ante":50000,"minutes":5},
        {"type":"break","sb":0,"bb":0,"ante":0,"minutes":15},
        {"type":"normal","sb":26000,"bb":52000,"ante":52000,"minutes":5},
        {"type":"normal","sb":27000,"bb":54000,"ante":54000,"minutes":5},
        {"type":"normal","sb":28000,"bb":56000,"ante":56000,"minutes":5},
        {"type":"normal","sb":29000,"bb":58000,"ante":58000,"minutes":5},
        {"type":"normal","sb":30000,"bb":60000,"ante":60000,"minutes":5},
        {"type":"normal","sb":32000,"bb":64000,"ante":64000,"minutes":5},
        {"type":"normal","sb":34000,"bb":68000,"ante":68000,"minutes":5},
        {"type":"normal","sb":36000,"bb":72000,"ante":72000,"minutes":5},
        {"type":"normal","sb":38000,"bb":76000,"ante":76000,"minutes":5},
        {"type":"normal","sb":40000,"bb":80000,"ante":80000,"minutes":5},
        {"type":"normal","sb":42000,"bb":84000,"ante":84000,"minutes":5},
        {"type":"normal","sb":44000,"bb":88000,"ante":88000,"minutes":5},
        {"type":"normal","sb":46000,"bb":92000,"ante":92000,"minutes":5},
        {"type":"normal","sb":48000,"bb":96000,"ante":96000,"minutes":5},
        {"type":"normal","sb":50000,"bb":100000,"ante":100000,"minutes":5}
    ]
    },
    {
        "name":"standard_min10",
        "levels": [
            {"type":"normal","sb":10,"bb":20,"ante":0,"minutes":15},
            {"type":"normal","sb":20,"bb":40,"ante":0,"minutes":15},
            {"type":"normal","sb":30,"bb":60,"ante":0,"minutes":15},
            {"type":"normal","sb":40,"bb":80,"ante":0,"minutes":15},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
            {"type":"normal","sb":100,"bb":200,"ante":200,"minutes":15},
            {"type":"normal","sb":110,"bb":220,"ante":220,"minutes":15},
            {"type":"normal","sb":120,"bb":240,"ante":240,"minutes":15},
            {"type":"normal","sb":130,"bb":260,"ante":260,"minutes":15},
            {"type":"normal","sb":140,"bb":280,"ante":280,"minutes":15},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":150,"bb":300,"ante":300,"minutes":15},
            {"type":"normal","sb":160,"bb":320,"ante":320,"minutes":15},
            {"type":"normal","sb":170,"bb":340,"ante":340,"minutes":15},
            {"type":"normal","sb":180,"bb":360,"ante":360,"minutes":15},
            {"type":"normal","sb":190,"bb":380,"ante":380,"minutes":15},
            {"type":"normal","sb":200,"bb":400,"ante":400,"minutes":15},
            {"type":"normal","sb":210,"bb":420,"ante":420,"minutes":15},
            {"type":"normal","sb":220,"bb":440,"ante":440,"minutes":15},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":230,"bb":460,"ante":460,"minutes":15},
            {"type":"normal","sb":240,"bb":480,"ante":480,"minutes":15},
            {"type":"normal","sb":250,"bb":500,"ante":500,"minutes":15},
            {"type":"normal","sb":260,"bb":520,"ante":520,"minutes":15},
            {"type":"normal","sb":270,"bb":540,"ante":540,"minutes":15},
            {"type":"normal","sb":280,"bb":560,"ante":560,"minutes":15},
            {"type":"normal","sb":290,"bb":580,"ante":580,"minutes":15},
            {"type":"normal","sb":300,"bb":600,"ante":600,"minutes":15},
            {"type":"normal","sb":310,"bb":620,"ante":620,"minutes":15},
            {"type":"normal","sb":320,"bb":640,"ante":640,"minutes":15},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
            {"type":"normal","sb":330,"bb":660,"ante":660,"minutes":15},
            {"type":"normal","sb":340,"bb":680,"ante":680,"minutes":15},
            {"type":"normal","sb":350,"bb":700,"ante":700,"minutes":15},
            {"type":"normal","sb":360,"bb":720,"ante":720,"minutes":15},
            {"type":"normal","sb":370,"bb":740,"ante":740,"minutes":15},
            {"type":"normal","sb":380,"bb":760,"ante":760,"minutes":15},
            {"type":"normal","sb":390,"bb":780,"ante":780,"minutes":15},
            {"type":"normal","sb":400,"bb":800,"ante":800,"minutes":15},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":420,"bb":840,"ante":840,"minutes":15},
            {"type":"normal","sb":440,"bb":880,"ante":880,"minutes":15},
            {"type":"normal","sb":450,"bb":900,"ante":900,"minutes":15},
            {"type":"normal","sb":460,"bb":920,"ante":920,"minutes":15},
            {"type":"normal","sb":480,"bb":960,"ante":960,"minutes":15},
            {"type":"normal","sb":500,"bb":1000,"ante":1000,"minutes":15},
            {"type":"normal","sb":520,"bb":1040,"ante":1040,"minutes":15},
            {"type":"normal","sb":540,"bb":1080,"ante":1080,"minutes":15},
            {"type":"normal","sb":560,"bb":1120,"ante":1120,"minutes":15},
            {"type":"normal","sb":580,"bb":1160,"ante":1160,"minutes":15},
            {"type":"normal","sb":600,"bb":1200,"ante":1200,"minutes":15},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":620,"bb":1240,"ante":1240,"minutes":15},
            {"type":"normal","sb":640,"bb":1280,"ante":1280,"minutes":15},
            {"type":"normal","sb":660,"bb":1320,"ante":1320,"minutes":15},
            {"type":"normal","sb":680,"bb":1360,"ante":1360,"minutes":15},
            {"type":"normal","sb":700,"bb":1400,"ante":1400,"minutes":15},
            {"type":"normal","sb":720,"bb":1440,"ante":1440,"minutes":15},
            {"type":"normal","sb":740,"bb":1480,"ante":1480,"minutes":15},
            {"type":"normal","sb":760,"bb":1520,"ante":1520,"minutes":15},
            {"type":"normal","sb":780,"bb":1560,"ante":1560,"minutes":15},
            {"type":"normal","sb":800,"bb":1600,"ante":1600,"minutes":15},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
            {"type":"normal","sb":820,"bb":1640,"ante":1640,"minutes":15},
            {"type":"normal","sb":840,"bb":1680,"ante":1680,"minutes":15},
            {"type":"normal","sb":860,"bb":1720,"ante":1720,"minutes":15},
            {"type":"normal","sb":880,"bb":1760,"ante":1760,"minutes":15},
            {"type":"normal","sb":900,"bb":1800,"ante":1800,"minutes":15},
            {"type":"normal","sb":920,"bb":1840,"ante":1840,"minutes":15},
            {"type":"normal","sb":940,"bb":1880,"ante":1880,"minutes":15},
            {"type":"normal","sb":960,"bb":1920,"ante":1920,"minutes":15},
            {"type":"normal","sb":980,"bb":1960,"ante":1960,"minutes":15},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":1000,"bb":2000,"ante":2000,"minutes":15},
            {"type":"normal","sb":1100,"bb":2200,"ante":2200,"minutes":15},
            {"type":"normal","sb":1200,"bb":2400,"ante":2400,"minutes":15},
            {"type":"normal","sb":1300,"bb":2600,"ante":2600,"minutes":15},
            {"type":"normal","sb":1400,"bb":2800,"ante":2800,"minutes":15},
            {"type":"normal","sb":1500,"bb":3000,"ante":3000,"minutes":15},
            {"type":"normal","sb":1600,"bb":3200,"ante":3200,"minutes":15},
            {"type":"normal","sb":1700,"bb":3400,"ante":3400,"minutes":15},
            {"type":"normal","sb":1800,"bb":3600,"ante":3600,"minutes":15},
            {"type":"normal","sb":1900,"bb":3800,"ante":3800,"minutes":15},
            {"type":"normal","sb":2000,"bb":4000,"ante":4000,"minutes":15},
            {"type":"normal","sb":2100,"bb":4200,"ante":4200,"minutes":15},
            {"type":"normal","sb":2200,"bb":4400,"ante":4400,"minutes":15},
            {"type":"normal","sb":2300,"bb":4600,"ante":4600,"minutes":15},
            {"type":"normal","sb":2400,"bb":4800,"ante":4800,"minutes":15},
            {"type":"normal","sb":2500,"bb":5000,"ante":5000,"minutes":15},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":2600,"bb":5200,"ante":5200,"minutes":15},
            {"type":"normal","sb":2700,"bb":5400,"ante":5400,"minutes":15},
            {"type":"normal","sb":2800,"bb":5600,"ante":5600,"minutes":15},
            {"type":"normal","sb":2900,"bb":5800,"ante":5800,"minutes":15},
            {"type":"normal","sb":3000,"bb":6000,"ante":6000,"minutes":15},
            {"type":"normal","sb":3200,"bb":6400,"ante":6400,"minutes":15},
            {"type":"normal","sb":3400,"bb":6800,"ante":6800,"minutes":15},
            {"type":"normal","sb":3600,"bb":7200,"ante":7200,"minutes":15},
            {"type":"normal","sb":3800,"bb":7600,"ante":7600,"minutes":15},
            {"type":"normal","sb":4000,"bb":8000,"ante":8000,"minutes":15},
            {"type":"normal","sb":4200,"bb":8400,"ante":8400,"minutes":15},
            {"type":"normal","sb":4400,"bb":8800,"ante":8800,"minutes":15},
            {"type":"normal","sb":4600,"bb":9200,"ante":9200,"minutes":15},
            {"type":"normal","sb":4800,"bb":9600,"ante":9600,"minutes":15},
            {"type":"normal","sb":5000,"bb":10000,"ante":10000,"minutes":15}
        ]
    },
    {
        "name": "standard_min50",
        "levels": [
            {"type":"normal","sb":50,"bb":100,"ante":0,"minutes":15},
            {"type":"normal","sb":100,"bb":200,"ante":0,"minutes":15},
            {"type":"normal","sb":150,"bb":300,"ante":0,"minutes":15},
            {"type":"normal","sb":200,"bb":400,"ante":0,"minutes":15},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
            {"type":"normal","sb":500,"bb":1000,"ante":1000,"minutes":15},
            {"type":"normal","sb":550,"bb":1100,"ante":1100,"minutes":15},
            {"type":"normal","sb":600,"bb":1200,"ante":1200,"minutes":15},
            {"type":"normal","sb":650,"bb":1300,"ante":1300,"minutes":15},
            {"type":"normal","sb":700,"bb":1400,"ante":1400,"minutes":15},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":750,"bb":1500,"ante":1500,"minutes":15},
            {"type":"normal","sb":800,"bb":1600,"ante":1600,"minutes":15},
            {"type":"normal","sb":850,"bb":1700,"ante":1700,"minutes":15},
            {"type":"normal","sb":900,"bb":1800,"ante":1800,"minutes":15},
            {"type":"normal","sb":950,"bb":1900,"ante":1900,"minutes":15},
            {"type":"normal","sb":1000,"bb":2000,"ante":2000,"minutes":15},
            {"type":"normal","sb":1050,"bb":2100,"ante":2100,"minutes":15},
            {"type":"normal","sb":1100,"bb":2200,"ante":2200,"minutes":15},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":1150,"bb":2300,"ante":2300,"minutes":15},
            {"type":"normal","sb":1200,"bb":2400,"ante":2400,"minutes":15},
            {"type":"normal","sb":1250,"bb":2500,"ante":2500,"minutes":15},
            {"type":"normal","sb":1300,"bb":2600,"ante":2600,"minutes":15},
            {"type":"normal","sb":1350,"bb":2700,"ante":2700,"minutes":15},
            {"type":"normal","sb":1400,"bb":2800,"ante":2800,"minutes":15},
            {"type":"normal","sb":1450,"bb":2900,"ante":2900,"minutes":15},
            {"type":"normal","sb":1500,"bb":3000,"ante":3000,"minutes":15},
            {"type":"normal","sb":1550,"bb":3100,"ante":3100,"minutes":15},
            {"type":"normal","sb":1600,"bb":3200,"ante":3200,"minutes":15},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
            {"type":"normal","sb":1650,"bb":3300,"ante":3300,"minutes":15},
            {"type":"normal","sb":1700,"bb":3400,"ante":3400,"minutes":15},
            {"type":"normal","sb":1750,"bb":3500,"ante":3500,"minutes":15},
            {"type":"normal","sb":1800,"bb":3600,"ante":3600,"minutes":15},
            {"type":"normal","sb":1850,"bb":3700,"ante":3700,"minutes":15},
            {"type":"normal","sb":1900,"bb":3800,"ante":3800,"minutes":15},
            {"type":"normal","sb":1950,"bb":3900,"ante":3900,"minutes":15},
            {"type":"normal","sb":2000,"bb":4000,"ante":4000,"minutes":15},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":2100,"bb":4200,"ante":4200,"minutes":15},
            {"type":"normal","sb":2200,"bb":4400,"ante":4400,"minutes":15},
            {"type":"normal","sb":2250,"bb":4500,"ante":4500,"minutes":15},
            {"type":"normal","sb":2300,"bb":4600,"ante":4600,"minutes":15},
            {"type":"normal","sb":2400,"bb":4800,"ante":4800,"minutes":15},
            {"type":"normal","sb":2500,"bb":5000,"ante":5000,"minutes":15},
            {"type":"normal","sb":2600,"bb":5200,"ante":5200,"minutes":15},
            {"type":"normal","sb":2700,"bb":5400,"ante":5400,"minutes":15},
            {"type":"normal","sb":2800,"bb":5600,"ante":5600,"minutes":15},
            {"type":"normal","sb":2900,"bb":5800,"ante":5800,"minutes":15},
            {"type":"normal","sb":3000,"bb":6000,"ante":6000,"minutes":15},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":3100,"bb":6200,"ante":6200,"minutes":15},
            {"type":"normal","sb":3200,"bb":6400,"ante":6400,"minutes":15},
            {"type":"normal","sb":3300,"bb":6600,"ante":6600,"minutes":15},
            {"type":"normal","sb":3400,"bb":6800,"ante":6800,"minutes":15},
            {"type":"normal","sb":3500,"bb":7000,"ante":7000,"minutes":15},
            {"type":"normal","sb":3600,"bb":7200,"ante":7200,"minutes":15},
            {"type":"normal","sb":3700,"bb":7400,"ante":7400,"minutes":15},
            {"type":"normal","sb":3800,"bb":7600,"ante":7600,"minutes":15},
            {"type":"normal","sb":3900,"bb":7800,"ante":7800,"minutes":15},
            {"type":"normal","sb":4000,"bb":8000,"ante":8000,"minutes":15},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
            {"type":"normal","sb":4100,"bb":8200,"ante":8200,"minutes":15},
            {"type":"normal","sb":4200,"bb":8400,"ante":8400,"minutes":15},
            {"type":"normal","sb":4300,"bb":8600,"ante":8600,"minutes":15},
            {"type":"normal","sb":4400,"bb":8800,"ante":8800,"minutes":15},
            {"type":"normal","sb":4500,"bb":9000,"ante":9000,"minutes":15},
            {"type":"normal","sb":4600,"bb":9200,"ante":9200,"minutes":15},
            {"type":"normal","sb":4700,"bb":9400,"ante":9400,"minutes":15},
            {"type":"normal","sb":4800,"bb":9600,"ante":9600,"minutes":15},
            {"type":"normal","sb":4900,"bb":9800,"ante":9800,"minutes":15},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":5000,"bb":10000,"ante":10000,"minutes":15},
            {"type":"normal","sb":5500,"bb":11000,"ante":11000,"minutes":15},
            {"type":"normal","sb":6000,"bb":12000,"ante":12000,"minutes":15},
            {"type":"normal","sb":6500,"bb":13000,"ante":13000,"minutes":15},
            {"type":"normal","sb":7000,"bb":14000,"ante":14000,"minutes":15},
            {"type":"normal","sb":7500,"bb":15000,"ante":15000,"minutes":15},
            {"type":"normal","sb":8000,"bb":16000,"ante":16000,"minutes":15},
            {"type":"normal","sb":8500,"bb":17000,"ante":17000,"minutes":15},
            {"type":"normal","sb":9000,"bb":18000,"ante":18000,"minutes":15},
            {"type":"normal","sb":9500,"bb":19000,"ante":19000,"minutes":15},
            {"type":"normal","sb":10000,"bb":20000,"ante":20000,"minutes":15},
            {"type":"normal","sb":10500,"bb":21000,"ante":21000,"minutes":15},
            {"type":"normal","sb":11000,"bb":22000,"ante":22000,"minutes":15},
            {"type":"normal","sb":11500,"bb":23000,"ante":23000,"minutes":15},
            {"type":"normal","sb":12000,"bb":24000,"ante":24000,"minutes":15},
            {"type":"normal","sb":12500,"bb":25000,"ante":25000,"minutes":15},
            {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
            {"type":"normal","sb":13000,"bb":26000,"ante":26000,"minutes":15},
            {"type":"normal","sb":13500,"bb":27000,"ante":27000,"minutes":15},
            {"type":"normal","sb":14000,"bb":28000,"ante":28000,"minutes":15},
            {"type":"normal","sb":14500,"bb":29000,"ante":29000,"minutes":15},
            {"type":"normal","sb":15000,"bb":30000,"ante":30000,"minutes":15},
            {"type":"normal","sb":16000,"bb":32000,"ante":32000,"minutes":15},
            {"type":"normal","sb":17000,"bb":34000,"ante":34000,"minutes":15},
            {"type":"normal","sb":18000,"bb":36000,"ante":36000,"minutes":15},
            {"type":"normal","sb":19000,"bb":38000,"ante":38000,"minutes":15},
            {"type":"normal","sb":20000,"bb":40000,"ante":40000,"minutes":15},
            {"type":"normal","sb":21000,"bb":42000,"ante":42000,"minutes":15},
            {"type":"normal","sb":22000,"bb":44000,"ante":44000,"minutes":15},
            {"type":"normal","sb":23000,"bb":46000,"ante":46000,"minutes":15},
            {"type":"normal","sb":24000,"bb":48000,"ante":48000,"minutes":15},
            {"type":"normal","sb":25000,"bb":50000,"ante":50000,"minutes":15}
        ]
    },
    {
    "name": "standard_min100",
    "levels": [
        {"type":"normal","sb":100,"bb":200,"ante":0,"minutes":15},
        {"type":"normal","sb":200,"bb":400,"ante":0,"minutes":15},
        {"type":"normal","sb":300,"bb":600,"ante":0,"minutes":15},
        {"type":"normal","sb":400,"bb":800,"ante":0,"minutes":15},
        {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
        {"type":"normal","sb":1000,"bb":2000,"ante":2000,"minutes":15},
        {"type":"normal","sb":1100,"bb":2200,"ante":2200,"minutes":15},
        {"type":"normal","sb":1200,"bb":2400,"ante":2400,"minutes":15},
        {"type":"normal","sb":1300,"bb":2600,"ante":2600,"minutes":15},
        {"type":"normal","sb":1400,"bb":2800,"ante":2800,"minutes":15},
        {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
        {"type":"normal","sb":1500,"bb":3000,"ante":3000,"minutes":15},
        {"type":"normal","sb":1600,"bb":3200,"ante":3200,"minutes":15},
        {"type":"normal","sb":1700,"bb":3400,"ante":3400,"minutes":15},
        {"type":"normal","sb":1800,"bb":3600,"ante":3600,"minutes":15},
        {"type":"normal","sb":1900,"bb":3800,"ante":3800,"minutes":15},
        {"type":"normal","sb":2000,"bb":4000,"ante":4000,"minutes":15},
        {"type":"normal","sb":2100,"bb":4200,"ante":4200,"minutes":15},
        {"type":"normal","sb":2200,"bb":4400,"ante":4400,"minutes":15},
        {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
        {"type":"normal","sb":2300,"bb":4600,"ante":4600,"minutes":15},
        {"type":"normal","sb":2400,"bb":4800,"ante":4800,"minutes":15},
        {"type":"normal","sb":2500,"bb":5000,"ante":5000,"minutes":15},
        {"type":"normal","sb":2600,"bb":5200,"ante":5200,"minutes":15},
        {"type":"normal","sb":2700,"bb":5400,"ante":5400,"minutes":15},
        {"type":"normal","sb":2800,"bb":5600,"ante":5600,"minutes":15},
        {"type":"normal","sb":2900,"bb":5800,"ante":5800,"minutes":15},
        {"type":"normal","sb":3000,"bb":6000,"ante":6000,"minutes":15},
        {"type":"normal","sb":3100,"bb":6200,"ante":6200,"minutes":15},
        {"type":"normal","sb":3200,"bb":6400,"ante":6400,"minutes":15},
        {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
        {"type":"normal","sb":3300,"bb":6600,"ante":6600,"minutes":15},
        {"type":"normal","sb":3400,"bb":6800,"ante":6800,"minutes":15},
        {"type":"normal","sb":3500,"bb":7000,"ante":7000,"minutes":15},
        {"type":"normal","sb":3600,"bb":7200,"ante":7200,"minutes":15},
        {"type":"normal","sb":3700,"bb":7400,"ante":7400,"minutes":15},
        {"type":"normal","sb":3800,"bb":7600,"ante":7600,"minutes":15},
        {"type":"normal","sb":3900,"bb":7800,"ante":7800,"minutes":15},
        {"type":"normal","sb":4000,"bb":8000,"ante":8000,"minutes":15},
        {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
        {"type":"normal","sb":4200,"bb":8400,"ante":8400,"minutes":15},
        {"type":"normal","sb":4400,"bb":8800,"ante":8800,"minutes":15},
        {"type":"normal","sb":4500,"bb":9000,"ante":9000,"minutes":15},
        {"type":"normal","sb":4600,"bb":9200,"ante":9200,"minutes":15},
        {"type":"normal","sb":4800,"bb":9600,"ante":9600,"minutes":15},
        {"type":"normal","sb":5000,"bb":10000,"ante":10000,"minutes":15},
        {"type":"normal","sb":5200,"bb":10400,"ante":10400,"minutes":15},
        {"type":"normal","sb":5400,"bb":10800,"ante":10800,"minutes":15},
        {"type":"normal","sb":5600,"bb":11200,"ante":11200,"minutes":15},
        {"type":"normal","sb":5800,"bb":11600,"ante":11600,"minutes":15},
        {"type":"normal","sb":6000,"bb":12000,"ante":12000,"minutes":15},
        {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
        {"type":"normal","sb":6200,"bb":12400,"ante":12400,"minutes":15},
        {"type":"normal","sb":6400,"bb":12800,"ante":12800,"minutes":15},
        {"type":"normal","sb":6600,"bb":13200,"ante":13200,"minutes":15},
        {"type":"normal","sb":6800,"bb":13600,"ante":13600,"minutes":15},
        {"type":"normal","sb":7000,"bb":14000,"ante":14000,"minutes":15},
        {"type":"normal","sb":7200,"bb":14400,"ante":14400,"minutes":15},
        {"type":"normal","sb":7400,"bb":14800,"ante":14800,"minutes":15},
        {"type":"normal","sb":7600,"bb":15200,"ante":15200,"minutes":15},
        {"type":"normal","sb":7800,"bb":15600,"ante":15600,"minutes":15},
        {"type":"normal","sb":8000,"bb":16000,"ante":16000,"minutes":15},
        {"type":"break","sb":0,"bb":0,"ante":0,"minutes":5},
        {"type":"normal","sb":8200,"bb":16400,"ante":16400,"minutes":15},
        {"type":"normal","sb":8400,"bb":16800,"ante":16800,"minutes":15},
        {"type":"normal","sb":8600,"bb":17200,"ante":17200,"minutes":15},
        {"type":"normal","sb":8800,"bb":17600,"ante":17600,"minutes":15},
        {"type":"normal","sb":9000,"bb":18000,"ante":18000,"minutes":15},
        {"type":"normal","sb":9200,"bb":18400,"ante":18400,"minutes":15},
        {"type":"normal","sb":9400,"bb":18800,"ante":18800,"minutes":15},
        {"type":"normal","sb":9600,"bb":19200,"ante":19200,"minutes":15},
        {"type":"normal","sb":9800,"bb":19600,"ante":19600,"minutes":15},
        {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
        {"type":"normal","sb":10000,"bb":20000,"ante":20000,"minutes":15},
        {"type":"normal","sb":11000,"bb":22000,"ante":22000,"minutes":15},
        {"type":"normal","sb":12000,"bb":24000,"ante":24000,"minutes":15},
        {"type":"normal","sb":13000,"bb":26000,"ante":26000,"minutes":15},
        {"type":"normal","sb":14000,"bb":28000,"ante":28000,"minutes":15},
        {"type":"normal","sb":15000,"bb":30000,"ante":30000,"minutes":15},
        {"type":"normal","sb":16000,"bb":32000,"ante":32000,"minutes":15},
        {"type":"normal","sb":17000,"bb":34000,"ante":34000,"minutes":15},
        {"type":"normal","sb":18000,"bb":36000,"ante":36000,"minutes":15},
        {"type":"normal","sb":19000,"bb":38000,"ante":38000,"minutes":15},
        {"type":"normal","sb":20000,"bb":40000,"ante":40000,"minutes":15},
        {"type":"normal","sb":21000,"bb":42000,"ante":42000,"minutes":15},
        {"type":"normal","sb":22000,"bb":44000,"ante":44000,"minutes":15},
        {"type":"normal","sb":23000,"bb":46000,"ante":46000,"minutes":15},
        {"type":"normal","sb":24000,"bb":48000,"ante":48000,"minutes":15},
        {"type":"normal","sb":25000,"bb":50000,"ante":50000,"minutes":15},
        {"type":"break","sb":0,"bb":0,"ante":0,"minutes":10},
        {"type":"normal","sb":26000,"bb":52000,"ante":52000,"minutes":15},
        {"type":"normal","sb":27000,"bb":54000,"ante":54000,"minutes":15},
        {"type":"normal","sb":28000,"bb":56000,"ante":56000,"minutes":15},
        {"type":"normal","sb":29000,"bb":58000,"ante":58000,"minutes":15},
        {"type":"normal","sb":30000,"bb":60000,"ante":60000,"minutes":15},
        {"type":"normal","sb":32000,"bb":64000,"ante":64000,"minutes":15},
        {"type":"normal","sb":34000,"bb":68000,"ante":68000,"minutes":15},
        {"type":"normal","sb":36000,"bb":72000,"ante":72000,"minutes":15},
        {"type":"normal","sb":38000,"bb":76000,"ante":76000,"minutes":15},
        {"type":"normal","sb":40000,"bb":80000,"ante":80000,"minutes":15},
        {"type":"normal","sb":42000,"bb":84000,"ante":84000,"minutes":15},
        {"type":"normal","sb":44000,"bb":88000,"ante":88000,"minutes":15},
        {"type":"normal","sb":46000,"bb":92000,"ante":92000,"minutes":15},
        {"type":"normal","sb":48000,"bb":96000,"ante":96000,"minutes":15},
        {"type":"normal","sb":50000,"bb":100000,"ante":100000,"minutes":15}
    ]
    }
];

const bgs = [
    { title: "Deep Purple", key: "purple" },
    { title: "Neon Pink", key: "neon" },
    { title: "Ocean Blue", key: "ocean" },
    { title: "Sunset Orange", key: "sunset" },
    { title: "Emerald Green", key: "emerald" },
    { title: "Fire Red", key: "fire" },
    { title: "Cyber Blue", key: "cyber" },
    { title: "Gold Shine", key: "gold" },
    { title: "Ice Blue", key: "ice" },
    { title: "Dark Mode", key: "dark" }
];

currentBGIndex = 0;

$(function () {

    // レベル追加
    $("#add-level").on("click", function () {
        $("#blind-list").append(`
            <div class="blind-row">
                <select class="level-type">
                    <option value="normal">normal</option>
                    <option value="break">break</option>
                </select>

                <input type="number" class="level-min" value="15">

                <input type="number" class="sb" value="0">
                <input type="number" class="bb" value="0">
                <input type="number" class="ante" value="0">
            </div>
        `);
    });

    // スタート
    $("#start").on("click", function () {

        levels = [];

        const title = $("#tournament-name").val();
        $("#tournament-title").text(title || "Poker Tournament");
        $(".fx-glitch").attr("data-text", title || "Poker Tournament");

        $(".blind-row").each(function () {
            const type = $(this).find(".level-type").val();
            const minutes = parseInt($(this).find(".level-min").val(), 10);
            const sb = $(this).find(".sb").val();
            const bb = $(this).find(".bb").val();
            const ante = $(this).find(".ante").val();

            levels.push({ type, minutes, sb, bb, ante });
        });

        currentLevel = 0;
        remainingSeconds = levels[0].minutes * 60;

        $("#setup-screen").hide();
        $("#timer-screen").show();
        $("html, body").scrollTop(0);
        updateDisplay();
        $("#pause").text("Start");
        $("#pause").addClass("primary-btn");
    });

    // 一時停止
    $("#pause").on("click", function () {
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
            $("#paused-label").addClass("is-visible");
            $(this).text("Resume");
            $(this).addClass("primary-btn");
        } else {
            const setup = document.getElementById("se-setup");
            setup.play().catch(e => console.log("se-setup play blocked", e));
            startTimer();
            $("#paused-label").removeClass("is-visible");
            $(this).removeClass("primary-btn");
            $(this).text("Pause");
        }
    });

    // 次のレベルへ
    $("#next-level").on("click", function () {
        nextLevel();
    });

    function startTimer() {
        timerInterval = setInterval(function () {
            remainingSeconds--;
            totalTimeSeconds++;
            updateTotalTime();

            if (remainingSeconds <= 0) {
                nextLevel();
            }

            updateDisplay();
        }, 1000);
    }

    function getRealLevelNumber(index) {
        let count = 0;
        for (let i = 0; i <= index; i++) {
            if (levels[i].type !== "break") {
                count++;
            }
        }
        return count;
    }

    function nextLevel() {
        currentLevel++;
        if (currentLevel >= levels.length) {
            $("#timer").css("color", "#fff");
            $("#timer").text("00:00");
            alert("Tournament finished");
            clearInterval(timerInterval);
            return;
        }

        if (levels[currentLevel].type === "break") {
            playSE("se-break");
        } else {
            playSE("se-levelup");
        }

        remainingSeconds = levels[currentLevel].minutes * 60;
        updateDisplay();
        updateChipStats()
    }

    function updateDisplay() {
        const level = levels[currentLevel];

        if (level.type === "break") {
            $("#level-title").text("");
        } else {
            const realLevel = getRealLevelNumber(currentLevel);
            $("#level-title").text(`Level ${realLevel}`);
        }

        if (level.type === "break") {
            $("#blind-display").text("BREAK");
            $("#timer").css("color", "#35fb5d");
            $("#timer-screen").addClass("break-bg");
        } else {
            $("#blind-display").text(`${level.sb} / ${level.bb} (${level.ante})`);
            $("#timer").css("color", "#fff");
            $("#timer-screen").removeClass("break-bg");
        }

        const min = Math.floor(remainingSeconds / 60);
        const sec = ("0" + (remainingSeconds % 60)).slice(-2);
        $("#timer").text(`${min}:${sec}`);

        const next = levels[currentLevel + 1];
        if (!next) {
            $("#next-level-display").text("Next: --");
        } else if (next.type === "break") {
            $("#next-level-display").text("Next: BREAK");
        } else {
            $("#next-level-display").text(`Next: ${next.sb} / ${next.bb} (${next.ante})`);
        }

        if(remainingSeconds == 60 && level.type !== "break"){
            playSE("se-warn");
        }

        if (remainingSeconds <= 180) {
            $("#timer").css("color", "#ff2020");
        }

        updateNextBreakTime();
    }

    $(document).on("click", ".plus, .minus", function () {
        const target = $(this).data("target");
        const span = $("#" + target);
        let value = parseInt(span.text(), 10);

        if ($(this).hasClass("plus")) {
            value++;
            if(target === "players-left"){
                let buyins = parseInt($("#buyin-count").text(), 10);
                buyins++;
                $("#buyin-count").text(buyins);
            }   
        } else {
            value = Math.max(0, value - 1);
        }

        span.text(value);
        updateChipStats();
    });

    function updateChipStats() {
        const players = parseInt($("#players-left").text(), 10);
        const buyins = parseInt($("#buyin-count").text(), 10);
        const buyinValue = parseInt($("#buyin-value").val(), 10);

        const total = buyins * buyinValue;
        const avg = players > 0 ? (total / players).toFixed(1) : 0;

        const currentBB = parseInt(levels[currentLevel].bb, 10);
        const totalBB = currentBB > 0 ? (total / currentBB).toFixed(1) : 0;
        const avgBB = currentBB > 0 ? (avg / currentBB).toFixed(1) : 0;

        // 表示
        $("#total-chips").text(`${total.toLocaleString()} (${totalBB} BB)`);
        $("#avg-stack").text(`${avg.toLocaleString()} (${avgBB} BB)`);

    }

    $("#buyin-value").on("input", updateChipStats);

    function updateTotalTime() {
        const min = Math.floor(totalTimeSeconds / 60);
        const sec = ("0" + (totalTimeSeconds % 60)).slice(-2);
        $("#total-time").text(`${min}:${sec}`);
    }

    function updateNextBreakTime() {
        let secondsUntilBreak = 0;

        // 現在レベルの残り時間を足す
        secondsUntilBreak += remainingSeconds;

        // 現在レベルの次から break を探す
        for (let i = currentLevel + 1; i < levels.length; i++) {
            if (levels[i].type === "break") {
                break; // break レベルに到達したら終了
            }
            secondsUntilBreak += levels[i].minutes * 60;
        }

        // break が存在しない場合
        const nextBreakLevel = levels.find(l => l.type === "break");
        if (!nextBreakLevel) {
            $("#next-break").text("--");
            return;
        }

        // 時間表示に変換
        const min = Math.floor(secondsUntilBreak / 60);
        const sec = ("0" + (secondsUntilBreak % 60)).slice(-2);

        $("#next-break").text(`${min}:${sec}`);
    }

    // モーダル開く
    $("#open-preset").on("click", function () {
        $("#preset-modal").css("display", "flex");
    });

    $("#set-bg").on("click",function(){
        $("#bgset-modal").css("display","flex");
    })

    // モーダル閉じる
    $("#close-preset").on("click", function () {
        $("#preset-modal").hide();
    });

    $("#close-bg").on("click",function(){
        $("#bgset-modal").hide();
    })

    presets.forEach((preset, index) => {
        $("#preset-select").append(`
            <option value="${index}">${preset.name}</option>
        `);
    });

    bgs.forEach((bg, index) => {
        $("#bg-select").append(`
            <option value="${index}">${bg.title}</option>
        `);
    });

    // プリセット選択時の処理
    $("#apply-preset").on("click", function () {
        const index = $("#preset-select").val();
        const preset = presets[index];

        // 既存のレベル行をクリア
        $("#blind-list").empty();

        // プリセットのレベルを追加
        preset.levels.forEach(lv => {
            $("#blind-list").append(`
                <div class="blind-row">
                    <select class="level-type">
                        <option value="normal" ${lv.type === "normal" ? "selected" : ""}>normal</option>
                        <option value="break" ${lv.type === "break" ? "selected" : ""}>break</option>
                    </select>

                    <input type="number" class="level-min" value="${lv.minutes}">
                    <input type="number" class="sb" value="${lv.sb}">
                    <input type="number" class="bb" value="${lv.bb}">
                    <input type="number" class="ante" value="${lv.ante}">
                </div>
            `);
        });

        // モーダル閉じる
        $("#preset-modal").hide();

        $("#tournament-name").val(`${preset.name} - preset`);
    });

    $("#apply-bg").on("click", function () {
        const index = $("#bg-select").val();
        const bg = bgs[index];

        // すべての背景クラスを削除
        $("#timer-screen")
            .removeClass("bg-purple bg-neon bg-ocean bg-sunset bg-emerald bg-fire bg-cyber bg-gold bg-ice bg-dark")
            .addClass("bg-" + bg.key);

        $("#bgset-modal").hide();
    });

    $("#back-to-setup").on("click", function () {
        // タイマー停止
        if (timerInterval) {
            clearInterval(timerInterval);
            timerInterval = null;
        }

        // タイマー画面を隠す
        $("#timer-screen").hide();
        $("#paused-label").removeClass("is-visible");

        // 設定画面を表示
        $("#setup-screen").show();
    });

    function playSE(id) {
        const audio = document.getElementById(id);
        if (audio) {
            audio.currentTime = 0;
            audio.play();
        }
    }
});