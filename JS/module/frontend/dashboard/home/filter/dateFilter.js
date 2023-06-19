app.filter("DatesFilter", function() {
  	return function(items, fromDate, toDate,tab) {
        if(fromDate && toDate) {
            var parseDate = function(myDate) {
                myDate = myDate.split("/");
                var newDate=myDate[1]+","+myDate[0]+","+myDate[2],
                    dateFormat = new Date(newDate);

                return dateFormat.getTime();
            };

            var df = fromDate.getTime(),
                dt = toDate.getTime(),
                result = [];
                console.log("tab",tab);
            for (var i=0; i<items.length; i++) {
                console.log(d,df,dt);
                if(tab == 'join' && items[i].requested_on){
                    var d = parseDate(items[i].requested_on);
                    if (d >= df && d <= dt)  {
                        result.push(items[i]);
                    }
                }else if(tab == 'attendence' && items[i].date){
                    var d = parseDate(items[i].date);
                    if (d >= df && d <= dt)  {
                        result.push(items[i]);
                    }
                }
                
            }        
            return result;
        } else {
           return items; 
        }        
  	};
});