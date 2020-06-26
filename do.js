// (!) Info
// Это просто набор скриптов для выполнения пакетных задач типа смены бюджета, остановки.
// Тут немного, до этого было больше функций на callback-ах, когда только начинал.


// =============== SETTINGS
var fs = require('fs');
var bodyParser = require('body-parser');

const wait = require('util').promisify(setTimeout)
var sec = 1000
var min = 60*sec;
var hour = 60*min;

// =============== ./LIB модули
var rules = require('./lib/rules');
var binom = require('./lib/binom');
var evadav = require('./lib/evadav');


// ---------------------------------------------------
// -----------\-------------|------------/------------
// ------------\------------|-----------/-------------
// -------------\-----------|----------/--------------
// --------------\--------------------/---------------
// ----------------A--C--T--I--O--N--S----------------
// ---------------------------------------------------



// Campaign Settings array  ---=---=---=---=---=---=---=---
var campaign_options = {

  format: 'push',
  status: 'active',
  settings: {
    budgetLimitTotal: 0,
    budgetLimitDaily: 20,
    clicksLimitTotal: 0,
    clicksLimitDaily: 0,
    frequency: 1,
    hourStart: 0,
    hourEnd: 0,
    autoLaunch: true,
    cpc: 0.024, 
    country: {
      KE: 0.024
    },
    device: [
      2
    ],
    browserLang: [],
    subscriptionAge: [],
    connectionType: "1",
    isp: [
        4343,
        4368
    ],    
    audiencesType: 'black',
    audiences: [
    		'22771'
    ],
    schedule: {
      timezone: "utc",
      utcZone: "+03",
      day: {
        0: {
          from: 0,
          to: 24,
          checked: true
        },
        1: {
          from: 0,
          to: 24,
          checked: true
        },
        2: {
          from: 0,
          to: 24,
          checked: true
        },
        3: {
          from: 0,
          to: 24,
          checked: true
        },
        4: {
          from: 0,
          to: 24,
          checked: true
        },
        5: {
          from: 0,
          to: 24,
          checked: true
        },
        6: {
          from: 0,
          to: 24,
          checked: true
        }
      }
    }
  },
};


var campCard = { 
  name: 'Test It 4',
  binom_camp: 62,
  adnet: 'evadav',
  payout : 0.1,
};





// evadav.campaignGetAndSave([350888,350292])




let mx_desk = [357371,357370,357369,357368]
let mx_mob = [
360978,360977,360976,360973,360970,360966,360965
]



evadav.campaignChangeCPC(campCard, mx_mob, 0.017)

// evadav.campaignChangeBudget(campCard, mx_desk, 15, 0)