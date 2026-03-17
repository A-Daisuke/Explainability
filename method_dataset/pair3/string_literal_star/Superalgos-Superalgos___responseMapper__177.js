    function _responseMapper(responseItem, propertiesToReturn) {
        return properties == '*' || propertiesToReturn === undefined ? {
            id: responseItem.id,
            name: responseItem.name,
            balance: Number(responseItem.balance),
            updatedAt: Date.parse(responseItem.updated_at)
        } : propertiesToReturn.reduce((accumulator,key) => {
            if(key == 'balance') {
                accumulator[key] = Number(responseItem[structure[key]])
            }
            else if(key == 'updateAt') {
                accumulator[key] = Date.parse(responseItem[structure[key]])
            }
            else {
                accumulator[key] = responseItem[structure[key]]
            }
            return accumulator
        }, {})
    }
