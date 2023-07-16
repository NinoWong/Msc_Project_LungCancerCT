/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
angular.module('main', [])
  .controller('HomeController', ['$scope', '$http', '$timeout', function($scope, $http, $timeout) {
    $scope.searchQuery = '';
    $scope.searchResult = null;
    $scope.prediction = null;

    $scope.searchPatient = function() {
      // Implement the logic for searching patients here
      $http.get('/search', { params: { query: $scope.searchQuery } })
        .then(function(response) {
          $scope.searchResult = response.data;
        })
        .catch(function(error) {
          console.log(error);
        });
    };

    $scope.predict = function() {
      var fileInput = document.getElementById('upload-input');
      var file = fileInput.files[0];
      var formData = new FormData();
      formData.append('file', file);
    
      $http.post('/predict', formData, {
          headers: { 'Content-Type': undefined }
        })
        .then(function(response) {
          var predictedLabel = response.data.prediction;
          console.log("Predicted Label:", predictedLabel);
          
          $scope.prediction = predictedLabel;
        })
        .catch(function(error) {
          console.log(error);
        });
    };
    
  }]);



