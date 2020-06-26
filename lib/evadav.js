var fs = require('fs');
const axios = require('axios');
var bodyParser = require('body-parser');

const wait = require('util').promisify(setTimeout)
var sec = 1000
var min = 60*sec;
var hour = 60*min;

var binom = require('./binom');
var rules = require('./rules');


// =============== =============== =============== =============== 
// EVADAV

//      API KEYS
const evadav_api_key = '9B8_e6ZFrG9RU1i17aW25s7LhR6tKvSS'
const evadav_url_base = 'https://evadav.com/api/v1.1'
const headers = {headers: {'X-Api-Key': evadav_api_key}}


function url (action, hash_or_id, limit=0) {
  switch (action) {
    case 'ping':
    return `${evadav_url_base}/api/ping`; break;

    case 'audienceAll':
    return `${evadav_url_base}/advertiser/audiences/all`; break;

    case 'audienceGet':
    return `${evadav_url_base}/advertiser/audiences/get?id=${hash_or_id}`; break;

    case 'audienceUpdate':
    return `${evadav_url_base}/advertiser/audiences/update?id=${hash_or_id}`; break;

    case 'audienceCreate':
    return `${evadav_url_base}/advertiser/audiences/create`; break;

    case 'campaignsAll':
    return `${evadav_url_base}/advertiser/campaigns/all?limit=${limit}`; break;

    case 'campaignsGet':
    return `${evadav_url_base}/advertiser/campaigns/get?hash=${hash_or_id}`; break;

    case 'campaignsStop':
    return `${evadav_url_base}/advertiser/campaigns/stop?hash=${hash_or_id}`; break;

    case 'campaignsStart':
    return `${evadav_url_base}/advertiser/campaigns/activate?hash=${hash_or_id}`; break;

    case 'campaignsCreate': // POST
    return `${evadav_url_base}/advertiser/campaigns/create`; break;

    case 'campaignsUpdate': // POST
    return `${evadav_url_base}/advertiser/campaigns/update?hash=${hash_or_id}`; break;

  }
};

async function request (action, data, id, campaign_card) {

  switch (action) {
    case 'campaignsGet':
      await wait(sec)
      return await axios.get(url(action, id), headers)
      .then(res => {return res.data.data.campaign})
      .catch(err => console.log(err.response))
    break;
    case 'campaignsAll':
      await wait(sec)
      var postData = {campaignIds: data}
      return await axios.post(url(action), postData, headers)
      .then(res => {return res.data.data.campaigns})
      .catch(err => console.log(err.response))
    break;
    case 'campaignsStop':
      await wait(sec)
      return await axios.post(url(action, id), null, headers)
      .then(res => console.log(res.data.data))
      .catch(err => console.log(err.response.data))
    break;
    case 'campaignsUpdate':
      await wait(sec)
      return await axios.post(url(action, id), data, headers)
      .then(res => console.log('campaignsUpdate | Success'))
      .catch(err => console.log(err.response))
    break;

    case 'audienceAll':
      await wait(sec)
      return await axios.get(url(action), headers)
      .then(res => {return res.data.data})
      .catch(err => console.log(err.response))
    break;

    case 'audienceGet':
      await wait(sec)
      return await axios.get(url(action, id), headers)
      .then(res => {return res})
      .catch(err => console.log(err.response))
    break;

    case 'audienceUpdate':
      await wait(sec)
      var postData = {name: campaign_card.name, sources: data}
      return await axios.post(url(action, id), postData, headers)
      .then(res => {console.log('audienceUpdate | Success'); return res.data})
      .catch(err => console.log(err.response.data))
    break; 
  
    case 'audienceCreate':
      await wait(sec)
      var postData = {name: campaign_card.name, sources: data}
      return await axios.post(url(action), postData, headers)
      .then(res => {return res.data})
      .catch(err => console.log(err.response.data))
    break;
  }

}


// ————  ————  ————  ————  ————  ————  ————  ————  ————




function postData (action, id1, id2) {
  
  switch (action) {
    case 'campaignChangeBudget':
      var postData = {
        settings: {
          budgetLimitTotal: id2,
          budgetLimitDaily: id1,
        }
      }
      break;

    case 'campaignChangeCPC':
      var postData = {
        settings: {
          cpc: id1, 
        }
      }
      break;

    case 'assignAudienceToCampaigns':
      var postData = {
      settings: {
        audiencesType: 'black',
        audiences: [ id1 ],
        }
      }
      break;
  }
  
  return postData;

};



//   Functions | Campaigns

async function campaignGetAndSave (list) {
  return await campaignGetHashList(list).then(async hashes => {
    fs.writeFileSync('log/campaignGet.json', '');

    // получение инфы о кампании и запись
    for (var campaign_hash of hashes) {
      // отправить в выбранную кампанию evadav 
      // обновленные настройки для audiences
      await request('campaignsGet', null, campaign_hash)
      .then(res => {
      fs.writeFileSync('log/campaignGet.json', '\n\r', {flag:'a'});
      fs.writeFileSync('log/campaignGet.json', JSON.stringify(res, null, '\t'), {flag:'a'});
      fs.writeFileSync('log/campaignGet.json', '\n\r', {flag:'a'});
      console.log('File "campaignGet.json" is ready!')
      })

    }    
  })
};


async function campaignGetHashList (blacklist) {
  return await request('campaignsAll', blacklist, null).then(res => 
  // получить список Hash'ей
  res.map((e) => { return e.hash } )).then(hashes => {return hashes})
}


async function campaignChangeBudget (campaign_card, campaigns_list, budgetDaily, budgetTotal) {
  // сформировать настройки бюджетов
  var post_settings = postData('campaignChangeBudget', budgetDaily, budgetTotal);
  console.log(post_settings)
  
  // получить список хэшей по id-кампаний
  await campaignGetHashList (campaigns_list).then(async hashes => {

    // апдейт всех кампаний по списку
    for (var campaign_hash of hashes) {

      // отправить в выбранную кампанию evadav 
      // обновленные настройки для audiences
      request('campaignsUpdate', post_settings, campaign_hash, campaign_card)  

    }  
  })
};


async function campaignChangeCPC (campaign_card, campaigns_list, CPC) {
  // сформировать настройки бюджетов
  var post_settings = postData('campaignChangeCPC', CPC);
  console.log(post_settings)
  
  // получить список хэшей по id-кампаний
  await campaignGetHashList (campaigns_list).then(async hashes => {

    // апдейт всех кампаний по списку
    for (var campaign_hash of hashes) {

      // отправить в выбранную кампанию evadav 
      // обновленные настройки для audiences
      request('campaignsUpdate', post_settings, campaign_hash, campaign_card)  

    }  
  })
};


//  Functions | Audiences

// Получить ID по name
async function audienceGetId (campaign_card) {
  // setTimeout отсюда
  return await request('audienceAll', null, null).then(res => 
  // получить кампанию по name
  res.filter( (e) => {
  if (e.name == campaign_card.name) {return e.id} })).then(res => {
  // получить id
  return res = res['0']['id']
  }) 
}


// Отправить blacklist в Evadav по campaign id
async function audienceAddSources (evadav_audience_id, blacklist, campaign_card) {
  // получить список сорсов по id кампании, 
  // добавить в него blacklist
  await request('audienceGet', null, evadav_audience_id).then(res => {
  blacklist = blacklist.concat(res.data.data.sources)
  // вычистить от дубликатов
  var makeUnique = new Set(blacklist);
  return blacklist = [...makeUnique]    } ).then(res =>
  // по id добавить сорсы в Audience
  request('audienceUpdate', res, evadav_audience_id, campaign_card))
}

// var data = {
//   sourcesAll: [],
//   sourcesList: ['s1231'],
// }

// Создать новый Audience и вернуть id
async function audienceCreate (data, campaign_card) {
  return await request('audienceCreate', data.list, null, campaign_card)
  
  // return res = ID аудитории
  .then(res => {  if (res.success == true) { return res.data.id }; })
}


// Назначить Audience для списка кампаний
async function audienceAssignToListOfCampaigns(audienceId, campaignHashList, campaign_card) {

  // сформировать новые настройки 'Audiences' для кампании
  var post_settings = postData('assignAudienceToCampaigns', audienceId);
  console.log(post_settings)
  // апдейт всех кампаний по списку
  for (var campaignId of campaignHashList) {

    // отправить в выбранную кампанию evadav 
    // обновленные настройки для audiences
    request('campaignsUpdate', post_settings, campaignId, campaign_card)  


  }
}




// Отправить blacklist в Evadav по campaign id
async function assignAudienceToActiveCampaigns (data, campaign_card, rules_card) {
  var rules = require('./rules');
  
  // ———— 1
  // Создать новый Audience и сохранить id
  var audienceId = await audienceCreate (data, campaign_card);

  // ———— 2
  // Проставить новый Audience во все активные кампании

  // ———— 2.1
  // сформировать запрос в Binom
  rules_card__forCreatives = {
    action: 'cutCreatives',
    group1: 'creatives',
    group2: 1,
    timeframe: 'last14days',
    
    minCtr: null,

  }  

  var binom_settings = rules.binomSettings(campaign_card, rules_card__forCreatives)


  // получить список креативов/кампаний внутри binom_campaign
  await binom.connect(binom_settings).then(binom_data => 
    
  // выбрать только активные (без тегов 'cross')
  rules.checkBinomTags(binom_data, campaign_card)).then(filteredData => {

  // ———— 2.2    
    // получить список id'шек
    var campaignIdList = filteredData.map((id)=> {return id.name});
    return campaignIdList; })
// 
  .then(async (campaignIdList) => {
    console.log('прошли до audienceAssignToListOfCampaigns')

    // получить список Hash по блэклисту
    var hashes = await campaignGetHashList (campaignIdList);

  // ———— 3  
  // проставить Audience для списка кампаний
  await audienceAssignToListOfCampaigns (audienceId, hashes, campaign_card);

  })


};






//   Module Exports   //


module.exports = {
  
  stopCreatives: (async (blacklist) => {
    // получить список Hash'ей по блеклисту
    campaignGetHashList (blacklist).then(res => {
    // остановить каждую кампанию по hash'у
    for (var hash of res) request('campaignsStop', null, hash)
    })
  }),



//  data:
//  - data.all   - все сорсы без binomTags
//  - data.list  - блэклист сорсов из правил

  sendBlacklist: (async (campaign_card, rules_card, data) => {

    // ———— если кампания существует - добавить сорсы в блэк
    try { 
      // получить ID по name
      var evadav_audience_id = await audienceGetId(campaign_card)

      // получить список сорсов по id кампании и слить блеклисты
      audienceAddSources(evadav_audience_id, data.list, campaign_card)
    }
    
    // ———— или создать новую audience и назначить на все кампании
    catch { 
      // если нет audience, то создать новую и назначить на активные кампании
      await assignAudienceToActiveCampaigns(data, campaign_card, rules_card)
      .then(res => console.log('assignAudienceToActiveCampaigns | Success') ) 
    }

  }),

  // Hand Control
  campaignChangeBudget: campaignChangeBudget,
  campaignChangeCPC: campaignChangeCPC,
  campaignGetAndSave: campaignGetAndSave,


}


