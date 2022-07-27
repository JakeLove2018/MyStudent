// 向后端存储数据 url 接口地址  param 请求参数
// ajax
function saveData(url, param) {
  var result = null;
  var xhr = null;
  if (window.XMLHttpRequest) {
      xhr = new XMLHttpRequest();
  } else {
      xhr = new ActiveXObject('Microsoft.XMLHTTP');
  }
  if (typeof param == 'string') {
      xhr.open('GET', url + '?' + param, false);
  } else if (typeof param == 'object'){
      var str = "";
      for (var prop in param) {
          str += prop + '=' + param[prop] + '&';
      }
      xhr.open('GET', url + '?' + str, false);
  } else {
      xhr.open('GET', url + '?' + param.toString(), false);
  }
  xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
          if (xhr.status == 200) {
              result = JSON.parse(xhr.responseText);
          } else {
              result = {
                  status: xhr.status,
                  msg: xhr.status + '服务器错误'
              }
          }
      }
  }
  xhr.send();
  return result;
}