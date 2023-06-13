var isInteger = function (x) {
    return x % 1 === 0;
};

app.filter('leadingzeros', function() {
	return function(input) {
        if(input === null) {
            input = 0;
        }
   		if (input >= 0 && input < 10 && isInteger(input)) { 
          	input = '0' + input;
      	}

      	return input;
    }
});

app.filter('cut', function () {
    return function (value, wordwise, max, tail) {
        if (!value) return '';

        max = parseInt(max, 10);
        if (!max) return value;
        if (value.length <= max) return value;

        value = value.substr(0, max);
        if (wordwise) {
            var lastspace = value.lastIndexOf(' ');
            if (lastspace != -1) {
              //Also remove . and , so its gives a cleaner result.
              if (value.charAt(lastspace-1) == '.' || value.charAt(lastspace-1) == ',') {
                lastspace = lastspace - 1;
              }
              value = value.substr(0, lastspace);
            }
        }

        return value + (tail || ' …');
    };
});

app.filter("daterange", function() {
    return function(items, fromCalendar, toCalendar, key1, key2) {
        if(fromCalendar && toCalendar) {
            console.log(fromCalendar, toCalendar, key1, key2);

            var result = [];

            toCalendar.setHours("23", "59", "59", "00");            
            fromCalendar = fromCalendar.getTime();
            toCalendar = toCalendar.getTime();

            for (var i=0; i<items.length; i++) {
                var fromDate = items[i][key1] * 1000,
                    toDate = items[i][key2] * 1000;

                if(fromDate <= toCalendar && fromCalendar <= toDate) {
                    result.push(items[i]);
                }
            }            
            return result;
        } else {
            return items;
        }
    };
});

app.filter('replaceunderscore',function() {
    return function(input) {
        input.replace('_', ' ');
    }
});

// app.filter('commaseperated',function() {
//     return function(input) {
//         if(!input) {
//             return input;
//         }

//         input = input.toString();
//         var lastThree = input.substring(input.length-3),
//             otherNumbers = input.substring(0, input.length-3);

//         if(otherNumbers != '')
//             lastThree = ',' + lastThree;

//         if(envMnt == 'norlanka') {
//             return otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + lastThree;
//         } else {
//             return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;    
//         }        
//     }
// });

app.filter('commaseperated',function() {
    return function(input) {
        if(!input) {
            return input;
        } else if (input < 0 && input.toString().length <= 4) {
            return input;
        }

        input = input.toString();

        var decimalValue = '';
        if (input.indexOf('.') >= 0) {
            var inputArray = input.split('.');
            input = inputArray[0];
            decimalValue = '.' + inputArray[1];
        }
        var lastThree = input.substring(input.length-3),
            otherNumbers = input.substring(0, input.length-3);

        if(otherNumbers != '')
            lastThree = ',' + lastThree;

        if(envMnt == 'norlanka') {
            return otherNumbers.replace(/\B(?=(\d{3})+(?!\d))/g, ",") + lastThree + decimalValue;
        } else {
            return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree + decimalValue;    
        }        
    }
});

app.filter('formatTimer', function() {
    return function(input) {
        function z(n) {
            return ( n<10 ? '0' : '') + n;
        }
        var seconds = input % 60;
        var calMinuts = Math.floor(input / 60);
        var minutes = calMinuts%60;
        var hours = Math.floor(calMinuts / 60);
        return (z(hours) +':'+z(minutes)+':'+z(seconds));
    };   
});

app.filter("isArray", function() {
    return function(input) {
        console.log('--------',angular.isArray(input));
        return angular.isArray(input);
    };
});

app.filter('joinBy', function () {
    return function (input,delimiter) {
        return (input || []).join(delimiter || ',');
    };
});    

app.filter('notavailable',function() {
    return function(input) {
        return input ? input : 'N/A';
    }
});  

app.filter('nullabletozero',function() {
    return function(input) {
        return input ? input : 0;
    }
});  

app.filter('makePositive', function() {
    return function(num) { return Math.abs(num); }
});

app.filter('stringDate', function() {
    return function(num) { 
        if(angular.isDefined(num) && num){
            return new Date(num*1000).getDate() +"/"+ parseInt(new Date(num*1000).getMonth() +1) +"/"+new Date(num*1000).getFullYear();
        }else{
                return 'N/A';
        }
    };
});
app.filter('scheduleDate', function() {
    return function(num) { 
        if(angular.isDefined(num)){
            var date = new Date(num * 1000);
// Hours part from the timestamp
            var hours = date.getHours();
// Minutes part from the timestamp
            var minutes = "0" + date.getMinutes();
// Seconds part from the timestamp
            var seconds = "0" + date.getSeconds();

// Will display time in 10:30:23 format
            var formattedTime = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
        return new Date(num*1000).getDate() +"/"+ parseInt(new Date(num*1000).getMonth() +1) +"/"+new Date(num*1000).getFullYear()+" "+formattedTime;
    }else{
            return 'N/A';
    }
        };
});

app.filter('feedbackDate', function () {
    return function (num) {
        var seconds = Math.floor((new Date().getTime() - num) / 1000);
        var hrs = Math.floor(seconds / 3600);
        var mins = Math.floor(seconds / 60);
        if(hrs < 1) {
           return mins + " Minutes ago"; 
        } else if (hrs < 24) {
            return hrs + " Hours ago";
        } else {
            return new Date(num).getDate() + "/" + parseInt(new Date(num).getMonth() + 1) + "/" + new Date(num).getFullYear();
        }

    };
});
app.filter('historyDate', function () {
    return function (num) {
        var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September",
            "October", "November", "December"];
        return new Date(num*1000).getDate() + " " + months[new Date(num * 1000).getMonth()] + " " + new Date(num*1000).getFullYear();
    };
});

app.filter("StatusFilter", function() {
    return function(items, status) {
        if(status && status != null) {
            var result = [];
            for (var i=0; i<items.length; i++) {
                if (items[i].status == status)  {
                    result.push(items[i]);
                }                
            }        
            return result;
        } else {
            return items; 
        }        
    };
});

app.filter('ordinal', function() {
    return function(number){
        if(isNaN(number) || number < 1) {
            return number;
        } else {
            var lastDigit = number % 10;
            if(lastDigit === 1) {
                return number + 'st'
            } else if(lastDigit === 2) {
                return number + 'nd'
            } else if (lastDigit === 3) {
                return number + 'rd'
            } else if (lastDigit > 3) {
                return number + 'th'
            }
        }
    }
});

app.filter('actionRequestListFilter', function() {
    return function(items, requestType, requestListMapping) {
        if (!requestType) {
          return items;
        }

        var array = requestListMapping[requestType];
        return items.filter(function(element) {
            return array.indexOf(element.type) >= 0;
        });
    };
});

app.filter('dash',function() {
    return function(input) {
        return input ? input : ''; //'-'
    }
});

app.filter('makePositive', function() {
    return function(num) { return Math.abs(num); }
});

app.filter('zerotonullable',function() {
    return function(input) {
        return input == 0 ? null : input;
    }
});
app.filter('numbers', function() {
    'use strict';
    return function(value, fractionSize) {
        var tempVal = parseFloat(value, 10);
        if(tempVal != 'NaN' && (tempVal % 1 === 0)) {
            return parseInt(tempVal, 10);
        }
        var tempFractionSize = parseInt(fractionSize, 10);
        return (angular.isDefined(fractionSize) && tempVal != 'NaN' && tempFractionSize != 'NaN')
            ? tempVal.toFixed(tempFractionSize)
            : value;
    };
});

app.filter('stringMonthDate', function () {
    return function (date, delimiter) {
        if(!date) return date;
        delimiter = delimiter ? delimiter : '-'
        var tempDate = date;
        if(angular.isString(date)){
            if(!date.length) return date;
            var delim = date.includes('/') ? '/' : '-';
            var dateArr = date.split(delim);
            if(dateArr.length<3) return tempDate;
            var temp = dateArr[0];
            dateArr[0] = dateArr[1];
            dateArr[1] = temp;
            date = dateArr.join(delim);
        }
        date = new Date(date);
        if(isNaN(date.getDate())){
            return tempDate;
        }
        var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        
        return (date.getDate()<10 ? "0"+date.getDate() : date.getDate()) + delimiter + months[date.getMonth()] + delimiter + date.getFullYear();
    };
});

app.filter('hranotavailable',function() {
    return function(input) {
        return input ? (input == "null" ? 'N/A' : input) : 'N/A';
    }
});

app.filter('commentnotavailable',function() {
    return function(input) {
        return input ? input : 'I do not agree with the ratings/review given to me by my manager. I request a revision.';
    }
});

app.filter('not_available_excluding_zero',function() {
    return function(input) {
        return input || input == 0 ? input : 'N/A';
    }
});

app.filter('convert_to_empty_string',function() {
    return function(input) {
        return input ? input : '';
    }
});

app.filter('ddMMMYY', ['$filter', 
    function($filter) {
        return function(dateString) {
            var delimeter = dateString.indexOf('/') ? '/' : '-',
                dateArray = dateString.split(delimeter),
                dateString = dateArray[1] + '/' + dateArray[0] + '/' + dateArray[2];

            return ($filter('date')(new Date(dateString), 'dd-MMM-yy'));
        }
    }
]);

app.filter('notYetDefined',function() {
    return function(input) {
        return input ? input : '-';
    }
});

app.filter('pipdash',function() {
    return function(input) {
        return input ? input : '-';
    }
});

app.filter('ddMMMYYTime', ['$filter', 
    function($filter) {
        return function(dateString) {
            if (!dateString) {
                return null;
            }
            
            var delimeter = dateString.indexOf('/') ? '/' : '-',
                dateTimeString = dateString.split(' ')[0],
                dateArray = dateTimeString.split(delimeter),
                dateString = dateArray[1] + '/' + dateArray[2] + '/' + dateArray[0];

            return ($filter('date')(new Date(dateString), 'dd-MMM-yy'));
        }
    }
]);

app.filter('dashifnull',function() {
    return function(input) {
        return input ? input : '-';
    }
});

app.filter('timeStampToDate', ['$filter', 
    function($filter) {
        return function(timestamp) {
            return ($filter('date')(new Date(timestamp * 1000), 'dd-MMM-yy'));
        }
    }
]);


app.filter('searchTimezones', ['$filter', 
    function($filter) {
        return function(items,text) {
            return items.filter(function (item) {
                
            })
        }
    }
]);
app.filter('ddMMM', ['$filter', 
    function($filter) {
        return function(timestamp) {
            return ($filter('date')(new Date(timestamp * 1000), 'dd MMM yyyy'));
        }
    }
]);

app.filter('searchOnMultipleFields', function() {
    return function(input, clause, fields) {
        var out = [];
        if (clause && clause.query && clause.query.length > 0) {
            clause.query = String(clause.query).toLowerCase();
            angular.forEach(input, function(cp) {
                for (var i = 0; i < fields.length; i++) {
                    var haystack = String(cp[fields[i]]).toLowerCase();
                    if (haystack.indexOf(clause.query) > -1) {
                        out.push(cp);
                        break;
                    }
                }
            })
        } else {
            angular.forEach(input, function(cp) {
                out.push(cp);
            })
        }
        return out;
    }

});
app.filter('array2string', function() {
    return function(input) {
        return input.join(', ');
    }

});

app.filter('dateFormatddmmyy', function() {
    return function(date) {
      return moment(date).format('DD-MM-YYYY, h:mm:ss');
    };
  });
