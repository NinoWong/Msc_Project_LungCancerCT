angular.module('main', [])
  .controller('SearchController', ['$scope', '$http', '$window', '$q', '$location', function($scope, $http, $window, $q, $location) {
    $scope.searchQuery = '';
    $scope.patients = [];
    $scope.searchPerformed = false;

    $scope.searchPatient = function() {
      const apiUrl = 'http://localhost:8081/openmrs-standalone/ws/rest/v1/patient?q=' + $scope.searchQuery + '&limit=10';

      $http.get(apiUrl)
        .then(function(response) {
          const patients = response.data.results;
          if (patients.length > 0) {
            $scope.patients = patients.map(patient => {
              return {
                id: patient.uuid,
                name: patient.display,
                age: 'Unknown',
                birthday: 'Unknown',
                patientDetailsUrl: patient.links[0].uri
              };
            });

            // Fetch additional patient information for each patient
            const fetchPatientInfoPromises = $scope.patients.map(patient => fetchPatientInfo(patient));
            $q.all(fetchPatientInfoPromises)
              .then(patientInfos => {
                patientInfos.forEach((info, index) => {
                  const patient = $scope.patients[index];
                  patient.age = info.age || 'Unknown';
                  patient.birthday = info.birthdate ? info.birthdate.slice(0, 10) : 'Unknown';
                });
                $scope.searchPerformed = true;
              })
              .catch(error => {
                console.log('Error:', error);
                $scope.searchPerformed = true;
              });
          } else {
            $scope.patients = [];
            $scope.searchPerformed = true;
          }
        })
        .catch(function(error) {
          console.log('Error:', error);
          $scope.searchPerformed = true;
        });
    };

    $window.addEventListener('pageshow', function(event) {
      // Clear the search query and table if the page is restored from the cache
      if (event.persisted) {
        $scope.searchQuery = '';
        $scope.patients = [];
        $scope.searchPerformed = false;
      }
    });

    function fetchPatientInfo(patient) {
      return $http.get(patient.patientDetailsUrl)
        .then(function(response) {
          return response.data.person;
        });
    }

    $scope.viewMoreInfo = function(patientId) {
      if (patientId) {
        const queryParams = 'patientId=' + encodeURIComponent(patientId);
        const url = '/openmrs-standalone/coreapps/clinicianfacing/patient.page?' + queryParams;
        $window.open(url, '_blank'); // Open the URL in a new window
      }
    };

    $scope.openPredictionPage = function() {
      $window.open('http://127.0.0.1:5000', '_blank'); // Open the prediction page in a new window
    };
  }]);
