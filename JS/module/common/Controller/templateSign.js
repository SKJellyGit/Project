app.controller('TemplateSignController', [
    '$scope', '$routeParams', '$q', '$timeout', '$location', 'templateBuilderService', 'utilityService', 'ServerUtilityService',
    function ($scope, $routeParams, $q, $timeout, $location, templateBuilderService, utilityService, serverUtilityService) {
        $scope.signature = {
            full:null,
            short:null
        };
        $scope.docsImages = {}
        $scope.pages ={current: 1, total:1};
        var routFlags = {
            exitId: $routeParams.exit_id,
            certificateId: $routeParams.certificate_template_id,
            template_id: $routeParams.template_id,
            emp_id: $routeParams.emp_id,
            action_id: $routeParams.action_id,
            letter_type: $routeParams.letter_type,
            page: 'sign'
        };        
        $scope.goBack = function (){
            var url = utilityService.getStorageValue('fromUrlToSignature');
            $location.url(url);
        };
        var getCurrentSignature = function() {
            $q.all([
                serverUtilityService.getWebService(templateBuilderService.getUrl('fullSignature') + "/" + utilityService.getStorageValue('loginEmpId')),
                serverUtilityService.getWebService(templateBuilderService.getUrl('shortSignature') + "/" + utilityService.getStorageValue('loginEmpId')),
            ]).then(function (data) {
                $scope.signature.full = data[0].path;
                $scope.signature.short = data[1].path;
                $scope.signature.type = data[1].type;
            });
        };
        getCurrentSignature();        
        $scope.createSignature = function () {
            $scope.signature = {
                full: null,
                short: null
            };
            $location.url('dashboard/signature').search(routFlags);
        };        
        $scope.triggerExitCertificate = function() {
             var url = routFlags.exitId ? templateBuilderService.getUrl('triggerCertificate') + "/" + routFlags.exitId
                        : routFlags.certificateId == 16 
                            ? templateBuilderService.getUrl('signOffer') + "/" + routFlags.emp_id
                            :routFlags.certificateId ==18
                            ? templateBuilderService.getUrl('triggerLndCertificate') + "/" + routFlags.emp_id
                            : templateBuilderService.getUrl('triggerLetter') + "/" + routFlags.emp_id,
                payload = {
                    letter_type : routFlags.letter_type, 
                    template_id : routFlags.template_id,  
                    action_id : routFlags.action_id,
                    coordinates: $scope.coordinateObject,
                    certificate_template_id: routFlags.certificateId
                };

            serverUtilityService.postWebService(url, payload).then(function (data) {
                
                if (data.status == "success") {
                    utilityService.showSimpleToast(data.message);
                    $location.url('/dashboard/alert?action=1');
                }
                else if(data.data.status=='error' && data.data.message.coordinates)
                {
                    utilityService.showSimpleToast(data.data.message.coordinates[0]);
                }
            });
        };

        angular.element(document).ready(function () {
            $timeout(function () {
                /**** FABRIC START *****/
                $scope.coordinateObject = {};
                fabric.Object.prototype.transparentCorners = false;
                fabric.Object.prototype.padding = 5;
                fabric.Object.prototype.transparentCorners = false;
                
                var fabriccanvas = this._canvas = new fabric.Canvas('fabricCanvas');
                fabriccanvas.on({
                    'object:moving': function (e) {
                        $(".deleteBtn").remove();
                        e.target.opacity = 0.5;
                    },
                    'object:modified': function (e) {
                        getObjectRefreshedProperties($scope.pages.current, e.target)
                        addDeleteBtn(e.target.oCoords.mt.x, e.target.oCoords.mt.y, e.target.width);
                        e.target.opacity = 1;
                    },
                    'object:selected': function(e) {
                        addDeleteBtn(e.target.oCoords.mt.x, e.target.oCoords.mt.y, e.target.width);
                    },
                    'mouse:down': function(e) {
                        if (!fabriccanvas.getActiveObject()) {
                            $(".deleteBtn").remove();
                        }
                    },
                    'object:scaling': function(e) {
                        if (fabriccanvas.getActiveObject()) {
                            $(".deleteBtn").remove();
                        }
                    },
                    'object:rotating': function(e) {
                        if (fabriccanvas.getActiveObject()) {
                            $(".deleteBtn").remove();
                        }
                    },
                    'object:skewing': function(e) {

                    }
                });
                function addDeleteBtn(x, y, w) {
                    $(".deleteBtn").remove();
                    var btnLeft = x;
                    var btnTop = y - 25;
                    var widthadjust = w / 2;
                    btnLeft = widthadjust + btnLeft - 10;
                    var deleteBtn = '<div class="deleteBtn" style="position:absolute;top:' + btnTop + 'px;left:' + btnLeft + 'px;cursor:pointer; color:blue;">X</div>';
                    $(".canvas-container").append(deleteBtn);
                }                
                function getObjectProperties(page_no, propertyObject){
                    $scope.coordinateObject[page_no] = angular.isDefined($scope.coordinateObject[page_no]) && $scope.coordinateObject[page_no].length ? $scope.coordinateObject[page_no] : [];
                    $scope.coordinateObject[page_no].push(propertyObject);
                } 
                function getObjectRefreshedProperties(page_no, propertyObject){
                    for(var i=0; i < $scope.coordinateObject[page_no].length; i++){
                        if(propertyObject.custom_id == $scope.coordinateObject[page_no][i]['custom_id']){
                            $scope.coordinateObject[page_no][i]['top'] = propertyObject.top;
                            $scope.coordinateObject[page_no][i]['left'] = propertyObject.left;
                            $scope.coordinateObject[page_no][i]['scaleX'] = propertyObject.scaleX;
                            $scope.coordinateObject[page_no][i]['scaleY'] = propertyObject.scaleY;
                            $scope.coordinateObject[page_no][i]['angle'] = angular.isDefined(propertyObject.angle) ? propertyObject.angle : 0;
                        }
                    }                    
                }                
                function deleteSelectedObjectFromArray (page_no, propertyObject){
                    for(var i=0; i < $scope.coordinateObject[page_no].length; i++){
                        if(propertyObject.custom_id == $scope.coordinateObject[page_no][i]['custom_id']){
                            $scope.coordinateObject[page_no].splice(i, 1);
                            break;
                        }
                    }                    
                }
                $scope.reRenderImages = function (page_no){
                    var allObjects = fabriccanvas.getObjects();
                    if(allObjects.length) {
                        for (var i = 0; i < allObjects.length;) {
                            fabriccanvas.remove(allObjects[i]);
                            i = 0;
                        }
                        $(".deleteBtn").remove() ;
                    }

                    if (angular.isDefined($scope.coordinateObject[page_no]) && $scope.coordinateObject[page_no].length) {
                        for (var i = 0; i < $scope.coordinateObject[page_no].length; i++) {
                            var object = {
                                left: $scope.coordinateObject[page_no][i]['left'],
                                top: $scope.coordinateObject[page_no][i]['top'],
                                angle: $scope.coordinateObject[page_no][i]['angle'],
                                scaleX:  $scope.coordinateObject[page_no][i]['scaleX'],
                                scaleY:  $scope.coordinateObject[page_no][i]['scaleX'],
                                lockRotation: true,
                                lockScalingFlip: true,
                            }
                            
                            fabric.Image.fromURL($scope.coordinateObject[page_no][i]['path'], function (img) {
                                $timeout(function () { 
                                   fabriccanvas.add(img); 
                                }, 1000);
                            }, object);
                        }
                    } else {
                        $scope.coordinateObject[page_no] = [];
                    }
                };                
                $(document).on('click', ".deleteBtn", function () {
                    if (fabriccanvas.getActiveObject()){
                        deleteSelectedObjectFromArray($scope.pages.current, fabriccanvas.getActiveObject());
                        fabriccanvas.remove(fabriccanvas.getActiveObject());
                        $(".deleteBtn").remove();
                    }
                });                
                $scope.imgId = 'img1';
                function handleDragStart(e) {
                    [].forEach.call(images, function (img) {
                        img.classList.remove('img_dragging');
                    });
                    this.classList.add('img_dragging');
                    $scope.imgId = e.target.id;
                }
                function handleDragOver(e) {
                    if (e.preventDefault) {
                        e.preventDefault(); // Necessary. Allows us to drop.
                    }
                    e.dataTransfer.dropEffect = 'copy';
                    return false;
                }
                function handleDragEnter(e) {
                    this.classList.add('over');
                }
                function handleDragLeave(e) {
                    this.classList.remove('over');
                }
                var count = 0;

                function handleDrop(e) {
                    if (e.stopPropagation) {
                        e.stopPropagation(); // stops the browser from redirecting.
                    }
                    var img = document.querySelector('#images img.img_dragging');
                    img = img ? img : document.querySelector('#'+$scope.imgId);
                    count = count + 1;
                    var newImage = new fabric.Image(img, {
                        width: img.width,
                        height: img.height,
                        // Set the center of the new object based on the event coordinates relative
                        // to the canvas container.
                        left: e.layerX,
                        top: e.layerY,
                        custom_id: count,
                        lockRotation :true,
                        lockScalingFlip :true,
                    });
                    fabriccanvas.add(newImage);
                    var obj ={
                       width: img.width,
                       height: img.height,
                       left: e.layerX,
                       top: e.layerY,
                       path:img.getAttribute('src'),
                       angle:0,
                       custom_id: count,
                       scaleX: 1,
                       scaleY: 1
                    }
                    getObjectProperties($scope.pages.current, obj);
                    return false;
                }

                function handleDragEnd(e) {
                    // this/e.target is the source node.
                    [].forEach.call(images, function (img) {
                        img.classList.remove('img_dragging');
                    });
                }

                    // Bind the event listeners for the image elements
                    var images = document.querySelectorAll('#images img');
                    [].forEach.call(images, function (img) {
                        img.addEventListener('dragstart', handleDragStart, false);
                        img.addEventListener('dragend', handleDragEnd, false);
                    });
                    // Bind the event listeners for the canvas
                    var canvasContainer = document.getElementById('canvas-container');
                    canvasContainer.addEventListener('dragenter', handleDragEnter, false);
                    canvasContainer.addEventListener('dragover', handleDragOver, false);
                    canvasContainer.addEventListener('dragleave', handleDragLeave, false);
                    canvasContainer.addEventListener('drop', handleDrop, false);
                    
                    var bgImage, canvasWidth = 794, canvasHeight = 1122;
                    function setCanvasBackgroundImageUrl(url) {
                    if (url && url.length > 0) {
                        fabric.Image.fromURL(url, function (img) {
                            bgImage = img;
                            scaleAndPositionImage();
                        });
                    } else {
                        fabriccanvas.backgroundImage = 0;
                        fabriccanvas.setBackgroundImage('', fabriccanvas.renderAll.bind(fabriccanvas));

                        fabriccanvas.renderAll();
                    }
                }

                function scaleAndPositionImage() {

                    var canvasAspect = canvasWidth / canvasHeight;
                    var imgAspect = bgImage.width / bgImage.height;
                    var left, top, scaleFactor;

                    if (canvasAspect >= imgAspect) {
                        var scaleFactor = canvasWidth / bgImage.width;
                        left = 0;
                        top = -((bgImage.height * scaleFactor) - canvasHeight) / 2;
                    } else {
                        var scaleFactor = canvasHeight / bgImage.height;
                        top = 0;
                        left = -((bgImage.width * scaleFactor) - canvasWidth) / 2;

                    }

                    fabriccanvas.setBackgroundImage(bgImage, fabriccanvas.renderAll.bind(fabriccanvas), {
                        top: top,
                        left: left,
                        originX: 'left',
                        originY: 'top',
                        scaleX: scaleFactor,
                        scaleY: scaleFactor,
                    });
                    fabriccanvas.renderAll();

                }
                //setCanvasBackgroundImageUrl('images/canvaspage.png');
                    
                var setBackgroundImageOnCanvas = function (img) {
                    fabriccanvas.setBackgroundImage(img,
                    fabriccanvas.renderAll.bind(fabriccanvas), {
                        backgroundImageOpacity: 0.5,
                        backgroundImageStretch: false,
                        width:794,
                        height:1122,
                    });
                };
                var getUrl1 = function () {
                    if (routFlags.exitId) {
                        return templateBuilderService.getUrl('getExitCerPdf') + "/" 
                            + routFlags.exitId + "/" + routFlags.certificateId;
                    } else if (routFlags.certificateId == 16) {
                        return templateBuilderService.getUrl('offerToSign') + "/" 
                            + routFlags.emp_id + "/" + routFlags.template_id;
                    } 
                    else if(routFlags.certificateId == 18)
                    {
                        return templateBuilderService.getUrl('getCertificate') + "/" 
                            + routFlags.emp_id + "/" + routFlags.template_id;
                    }
                    else {
                        return templateBuilderService.getUrl('getLetter') + "/" 
                            + routFlags.emp_id + "/" + routFlags.template_id;
                    }
                };
                var getCertificate = function() {
                    var url = getUrl1();
                    serverUtilityService.getWebService(url)
                        .then(function (data) {
                            $scope.docsImages = data.data.images;
                            $scope.pages.total = Object.keys($scope.docsImages).length;
                            setBackgroundImageOnCanvas($scope.docsImages[1]);
                        });
                };
                getCertificate();
                $scope.goToNext = function () {
                    if ($scope.pages.current == $scope.pages.total){
                        return false;
                    }
                    $scope.pages.current = ++$scope.pages.current;
                    setBackgroundImageOnCanvas($scope.docsImages[$scope.pages.current]);
                    $scope.coordinateObject[$scope.pages.current] = angular.isDefined($scope.coordinateObject[$scope.pages.current]) ? $scope.coordinateObject[$scope.pages.current] : [];
                    $scope.reRenderImages($scope.pages.current);
                }
                $scope.goToPrevious = function(){
                    if($scope.pages.current == 1){
                        return false;
                    }
                    $scope.pages.current = --$scope.pages.current;
                    setBackgroundImageOnCanvas($scope.docsImages[$scope.pages.current]);
                    $scope.coordinateObject[$scope.pages.current] = angular.isDefined($scope.coordinateObject[$scope.pages.current]) ? $scope.coordinateObject[$scope.pages.current] : [];
                    $scope.reRenderImages($scope.pages.current);
                }
                $scope.goToPage = function (page_no) {
                    if ($scope.pages.total < parseInt(page_no) || parseInt(page_no) <= 0 || angular.isUndefined(page_no) || $scope.pages.current == parseInt(page_no)) {
                        return false;
                    }
                    $scope.pages.current = parseInt(page_no);
                    setBackgroundImageOnCanvas($scope.docsImages[$scope.pages.current]);
                    $scope.coordinateObject[$scope.pages.current] = angular.isDefined($scope.coordinateObject[$scope.pages.current]) ? $scope.coordinateObject[$scope.pages.current] : [];
                    $scope.reRenderImages($scope.pages.current);
                };
                /**** FABRIC END *****/
            }, 1500);
        });
    }

]);