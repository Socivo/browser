angular
    .module('bit')

    .config(function ($stateProvider, $urlRouterProvider, $compileProvider, $sceDelegateProvider, toastrConfig) {
        $compileProvider.imgSrcSanitizationWhitelist(
            /^\s*((https?|ftp|file|blob):|data:image\/|(moz|chrome|ms-browser)-extension)/);

        angular.extend(toastrConfig, {
            closeButton: true,
            progressBar: true,
            showMethod: 'slideDown',
            positionClass: 'toast-bottom-center'
        });

        $urlRouterProvider.otherwise(function ($injector, $location) {
            var $state = $injector.get('$state');

            if (!chrome.extension.getBackgroundPage()) {
                $state.go('privateMode');
                return;
            }

            var userService = $injector.get('userService');
            var cryptoService = $injector.get('cryptoService');

            var key;
            cryptoService.getKey().then(function (theKey) {
                key = theKey;
                return userService.isAuthenticated();
            }).then(function (isAuthenticated) {
                if (isAuthenticated) {
                    if (!key) {
                        $state.go('lock');
                    }
                    else {
                        $state.go('tabs.current');
                    }
                }
                else {
                    $state.go('home');
                }
            });
        });

        $stateProvider
            .state('splash', {
                url: '/splash',
                controller: 'baseController',
                template: require('./global/splash.html'),
                data: { authorize: false },
                params: { animation: null }
            })
            .state('privateMode', {
                url: '/private-mode',
                controller: 'privateModeController',
                template: require('./global/privateMode.html'),
                data: { authorize: false },
                params: { animation: null }
            })
            .state('home', {
                url: '/home',
                controller: 'baseController',
                template: require('./global/home.html'),
                data: { authorize: false },
                params: { animation: null }
            })

            .state('login', {
                url: '/login',
                controller: 'accountsLoginController',
                template: require('./accounts/views/accountsLogin.html'),
                data: { authorize: false },
                params: { animation: null, email: null }
            })
            .state('hint', {
                url: '/hint',
                controller: 'accountsHintController',
                template: require('./accounts/views/accountsHint.html'),
                data: { authorize: false },
                params: { animation: null }
            })
            .state('twoFactor', {
                url: '/two-factor',
                controller: 'accountsLoginTwoFactorController',
                template: require('./accounts/views/accountsLoginTwoFactor.html'),
                data: { authorize: false },
                params: { animation: null, email: null, masterPassword: null, providers: null, provider: null }
            })
            .state('twoFactorMethods', {
                url: '/two-factor-methods',
                controller: 'accountsTwoFactorMethodsController',
                template: require('./accounts/views/accountsTwoFactorMethods.html'),
                data: { authorize: false },
                params: { animation: null, email: null, masterPassword: null, providers: null, provider: null }
            })
            .state('register', {
                url: '/register',
                controller: 'accountsRegisterController',
                template: require('./accounts/views/accountsRegister.html'),
                data: { authorize: false },
                params: { animation: null }
            })

            .state('tabs', {
                url: '/tab',
                abstract: true,
                template: require('./global/tabs.html'),
                data: { authorize: true },
                params: { animation: null }
            })
            .state('tabs.current', {
                url: '/current',
                component: 'current'
            })
            .state('tabs.vault', {
                url: '/vault',
                template: require('./vault/views/vault.html'),
                controller: 'vaultController',
                params: { syncOnLoad: false, searchText: null }
            })
            .state('tabs.settings', {
                url: '/settings',
                template: require('./settings/views/settings.html'),
                controller: 'settingsController'
            })
            .state('tabs.tools', {
                url: '/tools',
                component: 'tools'
            })

            .state('viewFolder', {
                url: '/view-folder?folderId',
                template: require('./vault/views/vaultViewFolder.html'),
                controller: 'vaultViewFolderController',
                data: { authorize: true },
                params: { animation: null, from: 'vault' }
            })
            .state('viewCipher', {
                url: '/view-cipher?cipherId',
                template: require('./vault/views/vaultViewCipher.html'),
                controller: 'vaultViewCipherController',
                data: { authorize: true },
                params: { animation: null, from: 'vault' }
            })
            .state('addCipher', {
                url: '/add-cipher',
                template: require('./vault/views/vaultAddCipher.html'),
                controller: 'vaultAddCipherController',
                data: { authorize: true },
                params: { animation: null, name: null, uri: null, folderId: null, cipher: null, from: 'vault' }
            })
            .state('editCipher', {
                url: '/edit-cipher?cipherId',
                template: require('./vault/views/vaultEditCipher.html'),
                controller: 'vaultEditCipherController',
                data: { authorize: true },
                params: { animation: null, fromView: true, cipher: null, from: 'vault' }
            })
            .state('attachments', {
                url: '/attachments?id',
                template: require('./vault/views/vaultAttachments.html'),
                controller: 'vaultAttachmentsController',
                data: { authorize: true },
                params: { animation: null, fromView: true, from: 'vault' }
            })

            .state('passwordGenerator', {
                url: '/password-generator',
                component: 'passwordGenerator',
                data: { authorize: true },
                params: { animation: null, addState: null, editState: null }
            })
            .state('passwordGeneratorHistory', {
                url: '/history',
                template: require('./tools/views/toolsPasswordGeneratorHistory.html'),
                controller: 'toolsPasswordGeneratorHistoryController',
                data: { authorize: true },
                params: { animation: null, addState: null, editState: null }
            })
            .state('export', {
                url: '/export',
                component: 'export',
                data: { authorize: true },
                params: { animation: null }
            })

            .state('about', {
                url: '/about',
                template: require('./settings/views/settingsAbout.html'),
                controller: 'settingsAboutController',
                data: { authorize: true },
                params: { animation: null }
            })
            .state('credits', {
                url: '/credits',
                template: require('./settings/views/settingsCredits.html'),
                controller: 'settingsCreditsController',
                data: { authorize: true },
                params: { animation: null }
            })
            .state('features', {
                url: '/features',
                template: require('./settings/views/settingsFeatures.html'),
                controller: 'settingsFeaturesController',
                data: { authorize: true },
                params: { animation: null }
            })
            .state('help', {
                url: '/help',
                template: require('./settings/views/settingsHelp.html'),
                controller: 'settingsHelpController',
                data: { authorize: true },
                params: { animation: null }
            })
            .state('sync', {
                url: '/sync',
                template: require('./settings/views/settingsSync.html'),
                controller: 'settingsSyncController',
                data: { authorize: true },
                params: { animation: null }
            })
            .state('premium', {
                url: '/premium',
                template: require('./settings/views/settingsPremium.html'),
                controller: 'settingsPremiumController',
                data: { authorize: true },
                params: { animation: null }
            })

            .state('folders', {
                url: '/folders',
                template: require('./settings/views/settingsFolders.html'),
                controller: 'settingsFoldersController',
                data: { authorize: true },
                params: { animation: null }
            })
            .state('addFolder', {
                url: '/addFolder',
                template: require('./settings/views/settingsAddFolder.html'),
                controller: 'settingsAddFolderController',
                data: { authorize: true },
                params: { animation: null }
            })
            .state('editFolder', {
                url: '/editFolder?folderId',
                template: require('./settings/views/settingsEditFolder.html'),
                controller: 'settingsEditFolderController',
                data: { authorize: true },
                params: { animation: null }
            })
            .state('environment', {
                url: '/environment',
                template: require('./settings/views/settingsEnvironment.html'),
                controller: 'settingsEnvironmentController',
                data: { authorize: false },
                params: { animation: null }
            })
            .state('lock', {
                url: '/lock',
                component: 'lock',
                data: { authorize: true },
                params: { animation: null }
            });
    })
    .run(function ($trace, $transitions, userService, $state, constantsService, stateService) {
        //$trace.enable('TRANSITION');

        stateService.init();

        $transitions.onStart({}, function (trans) {
            const $state = trans.router.stateService;
            const toState = trans.to();

            if ($state.current.name.indexOf('tabs.') > -1 && toState.name.indexOf('tabs.') > -1) {
                stateService.removeState('vault');
                stateService.removeState('viewFolder');
            }

            const userService = trans.injector().get('userService');

            if (!userService) {
                return;
            }

            userService.isAuthenticated().then((isAuthenticated) => {
                if (isAuthenticated) {
                    var obj = {};
                    obj[constantsService.lastActiveKey] = (new Date()).getTime();
                    chrome.storage.local.set(obj, function () { });
                }
                else if (toState.data && toState.data.authorize) {
                    event.preventDefault();
                    chrome.runtime.sendMessage({ command: 'logout' });
                }
            });
        });
    });
