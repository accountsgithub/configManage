import axios from 'axios'
// import Config from './config';
// import CurrentLanguage from '@/lang/cn.json';

// let lang = Config.LANGUAGE || navigator.browserLanguage || navigator.language;

export default {
  install (Vue) {
    axios.get('./static/lang/cn.json').then((data) => {
      Vue.prototype.$Lang = data
    })
    // axios.ajax(Config.BASE_URL + '/lang/' + lang + '.json', 'get').then((response) => {
    // Vue.prototype.Lang = response.language;
    // }).catch((err) => {
    // console.log(err);
    // });
  }
}
