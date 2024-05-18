 export function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  }

  export function getAllCookie(){
    var resArr=[];
    var splitArr=document.cookie.split(";");

    for (const i in splitArr) {
       resArr[splitArr[i].split("=")[0].trim()]=splitArr[i].split("=")[1];
    }
    return resArr;
}

export function getCookie(name) {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        if (cookie.startsWith(name + '=')) {
            return decodeURIComponent(cookie.substring(name.length + 1));
        }
    }
    return null;
}

export function deleteAllCookies() {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
    var cookie = cookies[i];
    var eqPos = cookie.indexOf("=");
    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
  }

  console.log('deleting cookies..');
}

// module.exports = {
//     sessionInfo,
//     deleteCookie,
//     getAllCookie,
//     userType
//   };