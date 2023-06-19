app.filter('memberSearch',function () {
    return function (input,searchParam,paramValue) {
        return input.filter(function (member) {
            return member[searchParam]===paramValue
        })
    }
})