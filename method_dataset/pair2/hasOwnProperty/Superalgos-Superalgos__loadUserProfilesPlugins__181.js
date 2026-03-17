        async function loadUserProfilesPlugins() {
            /*
            User Profiles are plugins of the Governance System. Besides the info they carry, we also 
            need to get the blockchain account for each one in order to later calculate their ranking.
            */
            let pluginFileNames = await SA.projects.communityPlugins.utilities.plugins.getPluginFileNames(
                'Governance',
                'User-Profiles'
            )

            for (let i = 0; i < pluginFileNames.length; i++) {
                let pluginFileName = pluginFileNames[i]

                let pluginFileContent = await SA.projects.communityPlugins.utilities.plugins.getPluginFileContent(
                    'Governance',
                    'User-Profiles',
                    pluginFileName
                )
                let userProfilePlugin = JSON.parse(pluginFileContent)
                /*
                Here we will turn the saved plugin into an in-memory node structure with parent nodes and reference parents.
                */
                let userProfile = SA.projects.communityPlugins.utilities.nodes.fromSavedPluginToInMemoryStructure(
                    userProfilePlugin
                )

                if (userProfile === undefined) {
                    SA.logger.warn('User Profile Plugin could not be loaded into memory: ' + userProfilePlugin.name)
                    continue
                }   

                /* If we have a ranking from earlier loads, temporary restore until blockchain balances will have reloaded */
                let tempBalanceObject = tempBalanceRanking.get(userProfile.id)
                if (tempBalanceObject !== undefined) {
                    if (tempBalanceObject.hasOwnProperty('ranking')) { 
                        userProfile.ranking = tempBalanceObject.ranking
                    }
                    if (tempBalanceObject.hasOwnProperty('balance')) { 
                        userProfile.balance = tempBalanceObject.balance
                    }
                } 
                SA.projects.network.globals.memory.maps.USER_PROFILES_BY_ID.set(userProfile.id, userProfile)
            }
        }
