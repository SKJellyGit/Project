app.controller('ArchiveController', [
	'$scope', '$timeout', '$routeParams', '$location', 'utilityService', 'ServerUtilityService', 'ArchiveService', 
	function ($scope, $timeout, $routeParams, $location, utilityService, serverUtilityService, archiveService) {
        
        $scope.archive = archiveService.buildArchiveObject();

        var getArchiveList = function() {
            serverUtilityService.getWebService(archiveService.getUrl('archive'))
                .then(function(data) {
                    $scope.archive.list = data.data.field_Detail;
                });
        };
        getArchiveList();

        var getHtmlOld = function() {
            return '<div style="color:#FF0000; ">' + 
                '<span class="md-avatar" style="width:130px; height:130px; ">' +
                '<img src="images/account-avtar.png" alt="">' +
                '</span></div><p>Binit</p>';
        };

        $scope.goBack = function () {
            $location.url('dashboard/account-settings');
        };

        var getHtml = function() {
            return '<div style="background:#fff; padding:24px; max-width:1170px; margin:0 auto; overflow:auto; box-shadow: 0px 1px 3px rgba(0,0,0,0.23);">' +
                '<form class="ui form">' + 
                    '<div>' + 
                        '<div>' + 
                           '<div>' + 
                                '<div style="clear: both;">' + 
                                    '<span style="width:130px; height:130px;margin-right:15px;float: left;">' + 
                                        '<img src="' + $scope.user.profilePic + '" alt="">' + 
                                    '</span>' + 
                                    '<div style="float:left;">' + 
                                        '<h3>{{user.fullname}}</h3>' + 
                                        '<p ng-hide="$index == 0" ng-repeat="x in user.displayDetail">{{x}}</p>' + 
                                    '</div>' + 
                                '</div>' +

                                '<div ng-repeat="segment in archive.list" style="clear: both;">' + 
                                    '<p style="margin-top: 20px;font-size:16px;font-weight: 600;clear: both;display:inline-block;">{{segment.name}}</p>' + 
                                    '<div style="margin-bottom: 20px;">' + 
                                        '<div style="float:left;width:50%;" ng-repeat="item in segment.emp_visible_profile_field">' + 
                                            '<div>' + 
                                                '<div style="float:left;width: 50%;margin-bottom: 10px;font-size: 14px;font-weight: 400;color: #7b8994;">{{item.name}}</div> ' + 
                                                '<div style="float:left;width: 50%;margin-bottom: 10px;display: block !important;font-size: 14px;font-weight: 400;" ng-hide="item.child_details.length"> {{item.value ? item.value: \'\'}} </div>' + 
                                            '</div>' + 
                                            '<div  style="clear: both;" ng-repeat="child in item.child_details">' + 
                                                '<div style="float: left;width: 50%;font-size: 14px;font-weight: 400;color: #7b8994;margin-bottom: 10px;padding-left: 15px;">{{child.name}}</div>' + 
                                                '<div style="float: left;width: 50%;font-size: 14px;font-weight: 400;margin-bottom: 10px;"> {{child.value ? child.value: \'-\'}} </div>' + 
                                            '</div>' +                                    
                                        '</div>' + 
                                    '</div>' + 
                                '</div>' + 
                            '</div>' + 
                        '</div>' + 
                    '</div>' + 
                '</form>' +  
            '</div>';
        };

        $scope.content = {
            html: getHtml()
        };

        $scope.generatePDF = function() {
            var url = archiveService.getUrl('pdf'),
                payload = {
                    html: $('#archive').html()
                };

            serverUtilityService.postWebService(url, payload)
                .then(function(data) {
                    console.log(data);
                });
        };

        angular.element(document).ready(function () {
            $timeout(function() {
//                var form = $('.form'),
//                    cache_width = form.width(),
//                    a4 = [];
//                    //a4  =[ 595.28,  841.89];  // for a4 size paper width and height
//
//                $('#create_pdf').on('click',function(){
//                    $('body').scrollTop(0);
//                    createPDF();
//                });
//                //create pdf
//                function createPDF(){
//                    getCanvas().then(function(canvas) {
//                        console.log(canvas);
//                        console.log(canvas.width, canvas.height);
//
//                        a4 = [];
//                        a4.push(canvas.width);
//                        a4.push(canvas.height);
//
//                        var img = canvas.toDataURL("image/png"),
//                            doc = new jsPDF({
//                                unit:'px'/*, 
//                                format:'a4'*/
//                            });
//
//                        doc.addImage(img, 'JPEG', 5, 5);
//                        doc.save('techumber-html-to-pdf.pdf');
//                        form.width(cache_width);
//                    });
//                }
//
//                // create canvas object
//                function getCanvas(){
//                    form.width((a4[0]*1.33333)).css('max-width','none');
//                    console.log(form);
//
//                    return html2canvas(form, {
//                        imageTimeout:2000,
//                        removeContainer:true
//                    }); 
//                }

                $('#create_pdf').click(function () {
                    html2canvas(document.getElementById('archive'), {
                        onrendered: function (canvas) {
                            var data = canvas.toDataURL();
                            //console.log(data);
                            print(data);
                            //var docDefinition = { content: [{ image: data, width: 500, }] };
                            //pdfMake.createPdf(docDefiniftion).download("Profile_Details.pdf");
                        }
                    });
                });
            }, 1000);
        });
	}
]);