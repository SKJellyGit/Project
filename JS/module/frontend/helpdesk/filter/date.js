app.filter("RaisedDateFilter", function() {
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
            for (var i=0; i<items.length; i++) {
                if(tab == 'due' && items[i].raised_date){
                    var d = parseDate(items[i].raised_date);
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