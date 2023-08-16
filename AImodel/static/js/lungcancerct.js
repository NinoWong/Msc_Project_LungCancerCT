/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
angular.module('main', [])
  .controller('HomeController', ['$scope', '$http', function($scope, $http) {
    $scope.prediction = null;
    $scope.score = null;  // Add this line
    $scope.thumbnailDataUrl = null;

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
          var predictedScore = response.data.score;  // Get the predicted score
          console.log("Predicted Label:", predictedLabel);

          $scope.prediction = predictedLabel;
          $scope.score = predictedScore;  // Update the score
        })
        .catch(function(error) {
          console.log(error);
        });
    };

    document.getElementById('upload-input').addEventListener('change', function(event) {
      var file = event.target.files[0];
      var reader = new FileReader();
      reader.onload = function() {
        var image = new Image();
        image.onload = function() {
          var canvas = document.createElement('canvas');
          var ctx = canvas.getContext('2d');

          // Calculate new width and height to resize the image
          var maxWidth = 200; // Adjust this value as needed
          var maxHeight = 200; // Adjust this value as needed
          var width = image.width;
          var height = image.height;
          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          // Resize the image
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(image, 0, 0, width, height);

          // Get the resized data URL and update the scope variable
          var resizedDataUrl = canvas.toDataURL(file.type);
          document.getElementById('thumbnail').src = resizedDataUrl;
          $scope.$apply(function() {
            $scope.thumbnailDataUrl = resizedDataUrl;
          });
        };
        image.src = reader.result;
      };
      reader.readAsDataURL(file);
    });
  }]);
