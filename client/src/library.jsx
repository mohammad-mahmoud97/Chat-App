// function fetchData(url:string, method: string,
//                                   content_type: string, data: any) {
//   let content_type_choosen: string;

//   if(content_type === "json")
//     content_type_choosen = 'application/json';
//   else 
//     content_type_choosen = 'application/x-www-form-urlencoded';

//   fetch(url, {
//     method: method,
//     mode: 'cors',
//     cache: 'no-cache',
//     headers: {
//       'Content-type': content_type_choosen
//     },
//     body: JSON.stringify(data)
//   })
//   .then((response) => {
//     if(!response.ok){
//       throw new Error(`Http error! status ${response.status}`);
//     }
//     return response;
//   })
// }


function fetchData(url, method, content_type, data, callback) {
  
  let content_type_choosen;

  if(content_type === "json")
    content_type_choosen = 'application/json';
  else
    content_type_choosen = 'application/x-www-form-urlencoded';
    
  let xml_http_request = new XMLHttpRequest();
  xml_http_request.onreadystatechange = function (){
    if(this.readyState === 4 && this.status >= 200)
      callback(JSON.parse(this.response));
  }

  if(method === "GET"){
    xml_http_request.open(method, url + "?" + data, true);
    xml_http_request.withCredentials = true;
    // xml_http_request.setRequestHeader('Referer', "http://localhost:5173/");
    xml_http_request.send();
  }
  else if(method === "POST"){
    // xml_http_request.setRequestHeader("Content-type", content_type_choosen);
    xml_http_request.open(method, url, true);
    xml_http_request.withCredentials = true;
    xml_http_request.send(data);
  }
}

function validateEmail (email) {

  let emailValidRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  if(email.match(emailValidRegex) == null){
      // Func((prevState) => ({...prevState, emailValid: false}));
      console.log("bad email")
      return;
  }
  
  console.log("good email")
  // Func((prevState) => ({...prevState, emailValid: true}));
  return;
}


function checkCheckBox(checked){
  if(checked === true){
    console.log("checkbox checked");
    // Func((prevState) => ({...prevState, checkBoxChecked: true}));
    return;
  }
    console.log("checkbox checked not");
      
  // Func((prevState) => ({...prevState, checkBoxChecked: false}));
  return;
}

function hash(string) {
  const utf8 = new TextEncoder().encode(string);
  return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
      .map((bytes) => bytes.toString(16).padStart(2, '0'))
      .join('');
    return hashHex;
  });
}

export {checkCheckBox, validateEmail, fetchData, hash};