app.directive('pdfConversion', function () {
    return {
        link: function (scope, element, attr, ngModelCtrl) {
            $(document).ready(function() {
                var form = $('.form'),
                    cache_width = form.width(),
                    cache_height = form.height(),
                    //a4  =[ 595.28,  841.89];  // for a4 size paper width and height
                    a4 = [1170, 2000];
                 
                console.log(cache_width, cache_height);

                element.on('click',function() {
                    $('body').scrollTop(0);
                    createPDF();
                });
                
                //create pdf
                function createPDF(){
                    getCanvas().then(function(canvas){
                        var img = canvas.toDataURL("image/png"),
                        doc = new jsPDF({
                            unit:'pt', 
                            format:'a4'
                        });  

                        doc.addImage(img, 'JPEG', 15, 40, 1000, 2000);
                        /*if(canvas.height > 365){ 
                            doc.addPage();
                            doc.addImage(img, 0, -365, canvas.width, canvas.height);
                        }*/

                        doc.save('profile.pdf');
                        form.width(cache_width);
                    });
                }
                 
                // create canvas object
                function getCanvas(){
                    form.width((a4[0]*1.33333) -80).css('max-width','none');
                    return html2canvas(form, {
                        imageTimeout:2000,
                        removeContainer:false
                    }); 
                }
            });
        }
    };
});