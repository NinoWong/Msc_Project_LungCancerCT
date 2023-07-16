/* * This Source Code Form is subject to the terms of the Mozilla Public License,
 * v. 2.0. If a copy of the MPL was not distributed with this file, You can
 * obtain one at http://mozilla.org/MPL/2.0/. OpenMRS is also distributed under
 * the terms of the Healthcare Disclaimer located at http://openmrs.org/license.
 *
 * Copyright (C) OpenMRS Inc. OpenMRS is a registered trademark and the OpenMRS
 * graphic logo is a trademark of OpenMRS Inc.
 */
/*import angular from 'angular'
import Main from './main/main'

export default angular.module('main', [ Main.name ])
*/
angular.module('main', [])
  .controller('PatientController', ['$scope', '$http', function ($scope, $http) {
    $scope.patient = {
      username: '',
      password: ''
    };

    $scope.loggedInPatient = null;

    $scope.login = function () {
      // 构建登录请求的数据
      var loginData = {
        username: $scope.patient.username,
        password: $scope.patient.password
      };

      // 发送登录请求
      $http.post('https://your-openmrs-url/openmrs/ws/rest/v1/session', loginData)
        .then(function (response) {
          // 登录成功
          console.log('Login successful');
          $scope.patient.username = '';
          $scope.patient.password = '';
          $scope.loggedInPatient = {
            name: response.data.user.display,
            username: response.data.user.username,
            email: response.data.user.email
          };
        })
        .catch(function (error) {
          // 登录失败
          console.error('Login failed', error);
          // 清空输入框
          $scope.patient.username = '';
          $scope.patient.password = '';
        });
    };

    $scope.logout = function () {
      // 发送登出请求
      $http.delete('https://your-openmrs-url/openmrs/ws/rest/v1/session')
        .then(function (response) {
          // 登出成功
          console.log('Logout successful');
          $scope.loggedInPatient = null;
        })
        .catch(function (error) {
          // 登出失败
          console.error('Logout failed', error);
        });
    };
  }]);
