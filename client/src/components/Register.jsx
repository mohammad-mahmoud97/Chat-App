import React, { useContext, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { CurrentUser } from '../App';
import {fetchData, validateEmail, checkCheckBox, hash} from '../library';
import NewsFeed from './NewsFeed';
// import { config } from 'dotenv';

export default function Register() {
  
  let birthday_days = [1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3];
  let birthday_months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  let birthday_years = [1980];
  const countryList = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "American Samoa",
    "Andorra",
    "Angola",
    "Anguilla",
    "Antarctica",
    "Antigua and Barbuda",
    "Argentina",
    "Armenia",
    "Aruba",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas (the)",
    "Bahrain",
    "Bangladesh",
    "Barbados",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bermuda",
    "Bhutan",
    "Bolivia (Plurinational State of)",
    "Bonaire, Sint Eustatius and Saba",
    "Bosnia and Herzegovina",
    "Botswana",
    "Bouvet Island",
    "Brazil",
    "British Indian Ocean Territory (the)",
    "Brunei Darussalam",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Cayman Islands (the)",
    "Central African Republic (the)",
    "Chad",
    "Chile",
    "China",
    "Christmas Island",
    "Cocos (Keeling) Islands (the)",
    "Colombia",
    "Comoros (the)",
    "Congo (the Democratic Republic of the)",
    "Congo (the)",
    "Cook Islands (the)",
    "Costa Rica",
    "Croatia",
    "Cuba",
    "Curaçao",
    "Cyprus",
    "Czechia",
    "Côte d'Ivoire",
    "Denmark",
    "Djibouti",
    "Dominica",
    "Dominican Republic (the)",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Equatorial Guinea",
    "Eritrea",
    "Estonia",
    "Eswatini",
    "Ethiopia",
    "Falkland Islands (the) [Malvinas]",
    "Faroe Islands (the)",
    "Fiji",
    "Finland",
    "France",
    "French Guiana",
    "French Polynesia",
    "French Southern Territories (the)",
    "Gabon",
    "Gambia (the)",
    "Georgia",
    "Germany",
    "Ghana",
    "Gibraltar",
    "Greece",
    "Greenland",
    "Grenada",
    "Guadeloupe",
    "Guam",
    "Guatemala",
    "Guernsey",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Heard Island and McDonald Islands",
    "Holy See (the)",
    "Honduras",
    "Hong Kong",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran (Islamic Republic of)",
    "Iraq",
    "Ireland",
    "Isle of Man",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jersey",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kiribati",
    "Korea (the Democratic People's Republic of)",
    "Korea (the Republic of)",
    "Kuwait",
    "Kyrgyzstan",
    "Lao People's Democratic Republic (the)",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Liechtenstein",
    "Lithuania",
    "Luxembourg",
    "Macao",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Maldives",
    "Mali",
    "Malta",
    "Marshall Islands (the)",
    "Martinique",
    "Mauritania",
    "Mauritius",
    "Mayotte",
    "Mexico",
    "Micronesia (Federated States of)",
    "Moldova (the Republic of)",
    "Monaco",
    "Mongolia",
    "Montenegro",
    "Montserrat",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "Namibia",
    "Nauru",
    "Nepal",
    "Netherlands (the)",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger (the)",
    "Nigeria",
    "Niue",
    "Norfolk Island",
    "Northern Mariana Islands (the)",
    "Norway",
    "Oman",
    "Pakistan",
    "Palau",
    "Palestine, State of",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines (the)",
    "Pitcairn",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Republic of North Macedonia",
    "Romania",
    "Russian Federation (the)",
    "Rwanda",
    "Réunion",
    "Saint Barthélemy",
    "Saint Helena, Ascension and Tristan da Cunha",
    "Saint Kitts and Nevis",
    "Saint Lucia",
    "Saint Martin (French part)",
    "Saint Pierre and Miquelon",
    "Saint Vincent and the Grenadines",
    "Samoa",
    "San Marino",
    "Sao Tome and Principe",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Seychelles",
    "Sierra Leone",
    "Singapore",
    "Sint Maarten (Dutch part)",
    "Slovakia",
    "Slovenia",
    "Solomon Islands",
    "Somalia",
    "South Africa",
    "South Georgia and the South Sandwich Islands",
    "South Sudan",
    "Spain",
    "Sri Lanka",
    "Sudan (the)",
    "Suriname",
    "Svalbard and Jan Mayen",
    "Sweden",
    "Switzerland",
    "Syrian Arab Republic",
    "Taiwan",
    "Tajikistan",
    "Tanzania, United Republic of",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Tokelau",
    "Tonga",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Turks and Caicos Islands (the)",
    "Tuvalu",
    "Uganda",
    "Ukraine",
    "United Arab Emirates (the)",
    "United Kingdom of Great Britain and Northern Ireland (the)",
    "United States Minor Outlying Islands (the)",
    "United States of America (the)",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela (Bolivarian Republic of)",
    "Viet Nam",
    "Virgin Islands (British)",
    "Virgin Islands (U.S.)",
    "Wallis and Futuna",
    "Western Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe",
    "Åland Islands"
  ];

  let {currentUser, setCurrentUser} = useContext(CurrentUser);
  const navigate = useNavigate();

  function checkServerResponse(response){
    // response = JSON.parse(response);
    if(response.inserted === true){
      // to NewsFeed
      setCurrentUser(response.insertedId);
      localStorage.setItem("currentUser", JSON.stringify(response.insertedId));
      console.log(response.redirectTo);
      navigate(response.redirectTo);
      return;
    }
    else if(response.inserted === false){
      if(response.authenticated === true){
        // to Login
        navigate(response.redirectTo); 
        return;
      }
      else if (response.authenticated === false){
        // to Register
        navigate(response.redirectTo);                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                
        return;
      }
    }
  }
    
  function account_registration() {
    let firstName = document.getElementById("first").value;
    let lastName = document.getElementById("last").value;
    let userName = document.getElementById("user").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let country = document.getElementById("country").value;
    let sex = document.getElementById("sex").value;
    let day = document.getElementById("day").value;
    let month = document.getElementById("month").value;
    let year = document.getElementById("year").value;
  
    // const passwordHash = hash(password);
    // console.log(passwordHash);
  
    fetchData("http://localhost:5078/register", "GET", "application", `firstName=${firstName}&lastName=${lastName}&userName=${userName}&email=${email}&password=${password}&country=${country}&sex=${sex}&dateOfBirth=${year}-${month}-${day}&coverImage=''&accountImage=https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQVnnwZ_qxZLfyPsjZR2NIZ78jzxSdColIWSUtPvFEPGw&s&friendRequestCounter=${0}`, checkServerResponse);
  }

  useEffect(() => {
    if(JSON.parse(localStorage.getItem("currentUser")))
      navigate("/logout");

    for (let index = 1; index <= 31; index++)
      birthday_days.push(index);

    for (let index = 1; index <= 12; index++)
      birthday_months[index - 1] = index;
    
    for (let index = 1970; index <= new Date().getFullYear(); index++)
      birthday_years[index - 1970] = index;
    
  }, [])

  return (
    <section>
      <div className="register">
            <h2>Chat App</h2>
            <span>Sign Up quickly to reach your beloved ones</span>
            <hr />
            
            <form>
              <div className="form-floating input-field">
                <input type="text" className="form-control" id="first" placeholder="First Name" />
                <label>First Name</label>
              </div>
              
              <div className="form-floating input-field">
                <input type="text" className="form-control" id="last" placeholder="Last Name" />
                <label>Last Name</label>
              </div>

              <div className="form-floating input-field">
                <input type="text" className="form-control" id="user" placeholder="User Name" />
                <label>User Name</label>
              </div>
              
              <div className="form-floating input-field">
                <input type="email" className="form-control" id="email" placeholder="name@example.com" onChange={(e) => validateEmail(e.target.value)}/>
                <label>Email Address</label>
              </div>
              
              <div className="form-floating input-field">
                <input type="password" className="form-control" id="password" placeholder="Password" />
                <label>Password</label>
              </div>
              
              <br />

              <div className='birthday'>
                <p>Birthday:</p>
                <div className="select-area">
                  <select className="form-select form-select-sm box" aria-label="Small select" id='day'>
                    {birthday_days.map((day) => <option>{day}</option>)}
                  </select>

                  <select className="form-select form-select-sm box" aria-label="Small select" id='month'>
                    {birthday_months.map((month) => <option>{month}</option>)}
                  </select>

                  <select className="form-select form-select-sm box" aria-label="Small select" id='year'>
                    {birthday_years.map((year) => <option>{year}</option>)}
                  </select>
                </div>
              </div>

              <div className="sex">
                <p>Sex:</p>
                <div className="select-area">
                  <select className="form-select form-select-sm box" aria-label="Small select" id='sex'>
                    <option>Male</option>
                    <option>Female</option>
                  </select>
                </div>
              </div>

              <div className="country">
                <p>Country:</p>
                <div className="select-area">
                  <select className="form-select form-select-sm box" aria-label="Small select" id='country'>
                    {countryList.map((country) => <option>{country}</option>)}
                  </select>
                </div>
              </div>

              <div className="aggrement">
                <input type="checkbox" onChange={(e) => checkCheckBox(e.target.checked)}/> &nbsp; I agree to Terms, Privacy Policy and Cookies Policy
              </div>

              <button type='button' className='btn btn-primary sign-up-btn' onClick={(e) => account_registration()}>Sign Up</button>
            </form>
          </div>
    </section>
  )
}
