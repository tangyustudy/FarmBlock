var countryListArray = ["Afghanistan","Algeria","American Samoan","Andorra","Angola","Anguilla","Antigua and Barbuda","Argentina","Armenia","Aruba","Australia","Austria","Azerbaijan","Bahamas","Bahrein","Bangladesh","Barbados","Belarus","Belgium","Belize","Benin","Bermuda","Bhutan","Bolivia","Bosnia and Herzegovina","Botswana","Brazil","British Virgin Islands","Brunei Darussalam","Bulgaria","Burkina Faso","Burma","Burundi","Cambodia","Cameroon","Canada","Canary islands","Cape Verde","Cayman Islands","Central African Republic","Ceuta and Melilla","Chad","Chile","China","Christmas Island","Coate d'Ivoire","Cocos Islands","Colombia","Comoros","Congo","Cook Islands","Costa Rica","Croatia","Cuba","Cyprus","Czechoslovakia","Dem-Rep of Congo","Denmark","Djibouti","Dominica","Dominican Republic","East Timor","Ecuador","Egypt","El Salvador","Equatorial Guinea","Eritrea","Estonia","Ethiopia","Falkland Islands","Fiji","Finland","France","French Polynesia","Gabon","Gambia","Georgia","Germany","Ghana","Gibraltar","Greece","Grenada","Guadeloupe","Guam","Guatemala","Guinea-Bissau","Guinea","Guyana","Haiti","Hawaii","Honduras","Hong Kong","Hungary","India","Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan","Jordan","Kazakhstan","Kenya","Kiribati","Kuwait","Kyrgyzstan","Laos","Latvia","Lebanon","Lesotho","Liberia","Libyan Arab","Liechtenstein","Lithuania","Macao","Macedonia","Madagascar","Madeira","Malawi","Malay Archipelago","Maldives","Mali","Malta","Mauritania","Mauritius","Mayotte","Mexico","Micronesia","Moldova","Monaco","Mongolia","Montenegro","Montserrat","Morocco","Mozambique","MP","Namibia","Nauru","Nepal","Netherlands Antilles","Netherlands","New Zealand","Nicaragua","Niger","Nigeria","Niue","No-Mariana Islands","Norfolk Island","North Korea","Norway","Oman","Pakistan","Palau Islands","Panama","Papua New Guinea","Paraguay","Peru","Philippines","Pitcairn Islands","Poland","Portugal","Puerto Rico","Qatar","Reunion island","Romania","Russia","Rwanda","Saint Kitts and Nevis","Saint Lucia","Saint Vincent & Grenadines","Saint-Pierre and Miquelon","Samoa Islands","San Marino","Sao Tome & Principe","Saudi Arabia","Serbia","Seychelles","Sierra Leone","Singapore","Slovakia","Slovenia","Solomon Islands","Somalia","South Georgia & Sandwich","South Korea","Spain","Sri Lanka","St. Helena","Sudan","Suriname","Swaziland","Sweden","Syria","Taiwan","Tajikistan","Tanzania","Thailand","Togo","Tokelau Islands","Tonga","Trinidad and Tobago","Tunisia","Turkey","Turkmenistan","Turks and Caicos Islands","Tuvalu","Uganda","Ukraine","United Arab Emirates","United Kingdom","United States","Uruguay","Uzbekistan","Valais & Futuna","Vanuatu","Vatican","Venezuela","Vietnam","Western Sahara","Yemen","Zambia","Zimbabwe","Default"];
var countryIndexArray = [214,7,63,68,18,188,189,120,105,190,65,106,162,191,4,220,192,231,72,193,20,142,219,121,208,19,122,236,218,22,128,2,129,217,130,16,84,131,234,14,3,0,119,149,66,23,50,127,17,77,49,171,88,172,108,107,240,109,26,173,174,216,124,115,175,116,117,110,118,125,133,223,126,58,24,241,69,13,28,176,9,178,161,136,221,8,27,6,206,52,154,184,85,183,53,181,180,87,203,242,155,202,201,200,111,54,199,198,197,222,179,112,113,114,229,29,1,30,211,32,33,186,185,76,104,98,99,100,21,64,90,91,238,92,158,31,210,40,212,55,151,194,93,36,177,213,94,56,41,57,152,75,167,5,48,160,47,226,235,150,39,227,102,204,148,135,25,74,95,138,139,187,170,46,51,97,147,34,78,144,132,86,103,38,123,73,145,70,146,96,81,232,82,10,165,153,164,83,163,79,45,44,141,80,11,205,195,43,60,12,67,59,157,225,237,35,42,89,233,169,61,168,62,134,246];
var locationShortArray = ["TD","MO","MM","EA","BH","PK","GY","DZ","GW","GR","SE","TR","UA","DE","CF","--","CA",
"KM","AO","BW","BJ","MX","BG","CI","GA","RO","DJ","GN","GH","LT","MK","MA","XI","MW",
"RS","WF","NZ","--","SB","PN","MP","MH","VU","TV","TO","TK","WS","PG","PW","CK","CC",
"SM","XW","ID","KI","NR","NU","NF","PF","GB","UG","EH","ZM","AS","FM","AU","CX","AE",
"AD","GE","ES","--","BE","GS","RU","NO","ML","CG","SC","TG","TN","SD","SZ","TZ","XA",
"HU","SK","IE","HR","VA","MD","MC","ME","NL","NG","RW","SH","ST","MR","MU","YT","--",
"PT","SI","MT","AM","AT","CZ","CY","DK","EE","KE","LS","LR","LY","EG","GQ","ER","ET",
"CL","AR","BO","BR","SO","EC","FK","FR","CO","BF","BI","CM","CV","SG","FJ","ZW","RE",
"GU","--","KN","LC","--","TT","BM","--","SL","KR","LK","SA","QA","CN","PH","NP","KP",
"TW","HN","JM","--","US","MS","--","PA","GP","AZ","TH","TJ","SY","--","OM","YE","VN",
"PM","CR","CU","DM","DO","SV","GL","NI","GD","LB","IQ","IR","--","IN","HK","MV","MY",
"VC","AI","AG","AW","BS","BB","BZ","AN","TC","--","LA","KG","KW","KZ","JO","JP","IL",
"PR","TM","HT","--","BA","--","MZ","MG","NA","NE","AF","--","TL","KH","BN","BT","BD",
"GT","LV","FI","--","UY","PY","PL","--","LI","--","BY","SR","VE","KY","PE","VI","UZ",
"MN","TR","CD","GM","IT","--","--","--","00","--","--","--","--","--","--","--","--"];


module.exports = {
	//根据国家缩写，获取国家头像下标， 参数countryCode = NativeManager.getCountryCode()
    getCountryAvatarIndex: function(countryCode){
        // console.log('2222');
    	var i = -1;
        for(var j=0;j<locationShortArray.length;j++){
            if(countryCode == locationShortArray[j]){
                i = j;
                break;
            }
        }
        if(i == -1){
            i = 246;
        }
        // console.log(i+1,'33');    
        return i + 1;
    },
    
    //根据国家缩写，获取国家名字
    getCountryName: function(countryCode){
    	var i = -1;
        for(var j=0;j<locationShortArray.length;j++){
            if(countryCode == locationShortArray[j]){
                i = j;
                break;
            }
        }
        
        var r = -1;
        if(i >= 0){
        	for(let k=0; k<countryIndexArray.length; k++){
        		if(countryIndexArray[k] == i){
        			r = k;
        		}
        	}
        }
        
        if(r >= 0 && r < countryListArray.length && !!countryListArray[r]){
        	return countryListArray[r];
        }else{
            return countryListArray[224];
        }
    },
    
    //获取国家列表
    getCountryNameList: function(){
    	return countryListArray;
    },
    
    //获取国家列表下标对应的国旗ID
    getCountryAvatarIndex2: function(index){
    	return countryIndexArray[index] + 1;
    }
};