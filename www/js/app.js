// $(document).ready(function() {
  
// ID: 2
// Major: 1
// Message: "10% off on cart total"
// Minor: 1
// ProductDescription: "10% off on cart total"
// ProductName: "SamsungS2"
// UUID: "52414449-5553-4E45-5457-4F524B53434F"

// "http://tech-lp-138.techaspect.com:8090/RestServiceImpl.svc/json/B395B263-C7EF-46E2-B594-5B6297C99578/1/1",

// ID -- id
// UUID -- uuid
// Major -- major
// Minor -- minor
// Message -- message
// ProductDescription -- promotionCode
// ProductName -- owner

// {
//       id: '1',
//       uuid: 'B395B263-C7EF-46E2-B594-5B6297C99578',
//       major: 1,
//       minor: 1,
//       message:"get 50% discount ",
//       promotionCode: "GET-50",
//       owner:"Nike - JUST DO IT"
//     },

 // $.getJSON( "http://elasticsearch.techaspect.com:8090/RestServiceImpl.svc/json", function(data) {
 //      console.log( "success : " );
 //      console.log(data);
 //      var mRegions = JSON.parse(data.JSONDataResult);
 //      console.log(mRegions);
 //      startMonitoringAndRanging();
 //    });
 // });
 // $.getJSON( "http://192.168.2.245:8090/RestServiceImpl.svc/json", function(data) {
 //      console.log( "success : " );
 //      console.log(data);
 //      mRegions = JSON.parse(data.JSONDataResult);
 //      console.log(mRegions);
 //      startMonitoringAndRanging();
 //    });
// Ionic Starter App
// var mRegions =
//   [
//     {
//       id: '1',
//       uuid: 'B395B263-C7EF-46E2-B594-5B6297C99578',
//       major: 1,
//       minor: 1,
//       message:"get 50% discount ",
//       promotionCode: "GET-50",
//       owner:"Nike - JUST DO IT"
//     },
//     {
//       id: '2',
//       uuid: '5AFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF',
//       major: 1,
//       minor: 2,
//       message:"90% off for you",
//       promotionCode: "MEGA-SALE",
//       owner: "ADIDAS"
//     }
//   ];
  // Nearest ranged beacon.
  var mRegions=[];
  var appInBackground;
  var mNearestBeacon = null;
  var $body;  
  var pCode;
  var pOwner;
  var URL;
  var pageUrl;
  var currentBeacon;
  // Create the event
  var newBeaconEvent = new CustomEvent("new-beacon");
  // document.addEventListener('pause', onAppToBackground, false);
  // document.addEventListener('resume', onAppToForeground, false);
  

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('starter', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }

    document.addEventListener('pause', function(){appInBackground=true}, false);
    document.addEventListener('resume', function(){appInBackground=false}, false);

    // start monitraing for the devices.

    
    $.getJSON( "http://elasticsearch.techaspect.com:8090/RestServiceImpl.svc/json", function(data) {
      console.log( "success : " );
      console.log(data);
      var serverData  = JSON.parse(data.JSONDataResult);
      // var serverData  = [{ID: 2,
      //                     Major: 1,
      //                     Message: "10% off on cart total",
      //                     Minor: 1,
      //                     ProductDescription: "10% off on cart total",
      //                     ProductName: "SamsungS2",
      //                     UUID: "52414449-5553-4E45-5457-4F524B53434F"},
      //                     {ID: 1,
      //                     Major: 1,
      //                     Message: "100% off on cart total",
      //                     Minor: 1,
      //                     ProductDescription: "100% off on cart total",
      //                     ProductName: "SamsungS4",
      //                     UUID: "5AFFFFFF-FFFF-FFFF-FFFF-FFFFFFFFFFFF"}];
      for (var i = 0 ; i< serverData.length; i++) {
        var d = serverData[i];
        console.log(d);
        var temp = {
          id:    d.ID.toString(),
          uuid:  d.UUID,
          major: d.Major,
          minor: d.Minor,
          message:   d.Message ,
          promotionCode:   d.ProductDescription,
          owner:   d.ProductName,
          url:      d.imageurl,
          pageUrl: d.pageurl
        };
        mRegions.push(temp);

      };
      console.log(mRegions);
      startMonitoringAndRanging();
    });

    
  });
})


.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

  .state('offer', {
    url: "/offer",
    templateUrl: "template/offer.html",
    controller: 'offerCtrl'
  })
  .state('search', {
    url: "/search",
    templateUrl: "template/search.html",
    controller: 'searchCtrl'
  })
  .state('product', {
    url: "/product",
    templateUrl: "template/product.html",
    controller: 'productCtrl'
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/search');
});

// Serach page controller
app.controller('productCtrl', function($scope, $ionicModal,$state) {
  console.log("in product page");
  $scope.currentBeacon = currentBeacon;
  $scope.promotionCode = pCode||'promotional code.';
  $scope.owner = pOwner;
  $scope.url = URL;


  $scope.openUrl = function(){
    console.log("go to the page " + currentBeacon.pageUrl);
    window.location.href = currentBeacon.pageUrl;
  };

  document.addEventListener("new-beacon", function(e) {
      console.log("id in event trigger : "+ mNearestBeacon ); // Prints "Example of an event"

      $state.go('offer');

    });
});

// offer page controller 
app.controller('offerCtrl', function($scope, $ionicModal, $state) {
  
// show offer 
  $scope.showOffer = function(){
    $scope.currentBeacon = getBeaconInfo(mNearestBeacon);

    // $.ajax({
    //   dataType: "json",
    //   url: "http://172.16.0.162:8090/RestServiceImpl.svc/json/B395B263-C7EF-46E2-B594-5B6297C99578/1/1",
    //   // data: data,
    //   success: function(data){
    //     console.log(data);
    //   }
    // });
    $scope.openUrl = function(){
      currentBeacon = $scope.currentBeacon;
      pCode = $scope.currentBeacon.promotionCode;
      pOwner =$scope.currentBeacon.owner;
      URL = $scope.currentBeacon.url;
      // $state.go('product');
      console.log("go to the page " + currentBeacon.pageUrl);
    window.location.href = currentBeacon.pageUrl;
    }

    // check for app in background or not the show the notification.
    if (appInBackground) {
   
      console.log("show notification");
      cordova.plugins.notification.local.schedule({
          id: $scope.currentBeacon.id,
          text: $scope.currentBeacon.message ,
          icon: '/img/icon.png'
          // sound: null,
          // data: { test: "50% + 50% off." }
      });
    }
  }
$scope.showOffer();
// event lisener on the offer page for the detection of the new beacon
  document.addEventListener("new-beacon", function(e) {
    console.log("id in event trigger : "+ mNearestBeacon ); // Prints "Example of an event"
    $scope.showOffer();
  });
});

// Serach page controller
app.controller('searchCtrl', function($scope, $ionicModal,$state) {
  console.log("in search page");
  document.addEventListener("new-beacon", function(e) {
      console.log("id in event trigger : "+ mNearestBeacon ); // Prints "Example of an event"

      $state.go('offer');

    });
});

function getBeaconInfo(bId){
  for (var i = 0; i < mRegions.length; i++) {
    var b = mRegions[i]
    if (bId == b.id) {
      return b;
    }
  };
  return false;
}


// Start monitoring for the devices 
function startMonitoringAndRanging()
  {


    
    function onDidDetermineStateForRegion(result)
    {
      // console.log("displayed state of region "+JSON.stringify(result));
      // saveRegionEvent(result.state, result.region.identifier);
      // // updateNearestBeacon(result.beacons);
      // displayRecentRegionEvent();
    }

    function onDidRangeBeaconsInRegion(result)
    {
      // console.log("Beacon in region"+JSON.stringify(result));
      console.log("Beacon in region part 2: "+JSON.stringify(result.beacons));
      if (result.beacons.length) {
        updateNearestBeacon(result.beacons);
      };
    }

    function onError(errorMessage)
    {
      console.log('Monitoring beacons did fail: ' + errorMessage);
    }

    // Request permission from user to access location info.
    cordova.plugins.locationManager.requestAlwaysAuthorization();

    // Create delegate object that holds beacon callback functions.
    var delegate = new cordova.plugins.locationManager.Delegate();
    cordova.plugins.locationManager.setDelegate(delegate);

    // Set delegate functions.
    delegate.didDetermineStateForRegion = onDidDetermineStateForRegion;
    delegate.didRangeBeaconsInRegion = onDidRangeBeaconsInRegion;

    // Start monitoring and ranging beacons.
    startMonitoringAndRangingRegions(mRegions, onError);
}
function startMonitoringAndRangingRegions(regions, errorCallback)
  {
    // Start monitoring and ranging regions.
    for (var i in regions)
    {
      startMonitoringAndRangingRegion(regions[i], errorCallback);
    }
  }

function startMonitoringAndRangingRegion(region, errorCallback)
{
  // Create a region object.
  var beaconRegion = new cordova.plugins.locationManager.BeaconRegion(
    region.id,
    region.uuid,
    region.major,
    region.minor);

  // Start ranging.
  cordova.plugins.locationManager.startRangingBeaconsInRegion(beaconRegion)
    .fail(errorCallback)
    .done();

  // Start monitoring.
  cordova.plugins.locationManager.startMonitoringForRegion(beaconRegion)
    .fail(errorCallback)
    .done();
}
function updateNearestBeacon(beacons)
  {
    var b=beacons[0];
    var beaconId = getBeconId(b);
    console.log(JSON.stringify(beacons));
    if (!mNearestBeacon)
    {
      mNearestBeacon = beaconId;
      // Dispatch/Trigger/Fire the event
      document.dispatchEvent(newBeaconEvent);
    }
    else
    {
      if (beaconId != mNearestBeacon){
        mNearestBeacon = beaconId;
        
        // Dispatch/Trigger/Fire the event
        document.dispatchEvent(newBeaconEvent);
        console.log(beaconId +" Beacon ID same as "+ mNearestBeacon);
      }
    }
  }
  function getBeconId(b){
    for (var i = 0 ; i < mRegions.length ; i++) {
      var uuid = mRegions[i].uuid ,
          minor = mRegions[i].minor,
          major = mRegions[i].major;      
      if (  b.uuid.toUpperCase()     ==  uuid 
            && b.minor  ==  minor 
            && b.major  ==  major ) 
      {
        return mRegions[i].id;
      };
    };
  }
