        function initializePickersSet(logicOperand, comparisonOperand, algebraOperand) {
            const ALGEBRA_SEPARATION = PICKER_HEIGHT
            const COMPARISON_SEPARATION = ALGEBRA_SEPARATION * 2
            const LOGIC_SEPARATION = COMPARISON_SEPARATION * 2

            let properties
            let parent
            let current
            let yOffset = (logicOperand.index - 1) * LOGIC_SEPARATION + (comparisonOperand.index - 0.5) * COMPARISON_SEPARATION + (algebraOperand.index - 0.5) * ALGEBRA_SEPARATION

            if (algebraOperand.index === 0) {
                comparisonOperand.algebra.picker = newPicker()
                let picker = comparisonOperand.algebra.picker
                picker.name = 'Algebra'
                picker.container.connectToParent(thisObject.container)
                picker.container.frame.position.x = 0 - picker.container.frame.width / 2 + picker.container.frame.width * 2.5
                picker.container.frame.position.y = 0 - picker.container.frame.height / 2 + yOffset
                current = ['...', 'Plus', 'Minus', 'Times', 'Divided by']
                picker.initialize(current, current)
                switch (comparisonOperand.algebra.operator) {
                    case '+': {
                        picker.setSelected(undefined, undefined, undefined, 1)
                        break
                    }
                    case '-': {
                        picker.setSelected(undefined, undefined, undefined, 2)
                        break
                    }
                    case '*': {
                        picker.setSelected(undefined, undefined, undefined, 3)
                        break
                    }
                    case '/': {
                        picker.setSelected(undefined, undefined, undefined, 4)
                        break
                    }
                }
                picker.visible = true
                let structureBranch = {
                    logicOperand: logicOperand,
                    comparisonOperand: comparisonOperand,
                    algebraOperand: algebraOperand,
                    pickerName: 'Algebra'
                }
                picker.eventSuscriptionId = picker.container.eventHandler.listenToEvent('onParentChanged', onParentChanged, structureBranch)
            }

            if (comparisonOperand.index === 0 && algebraOperand.index === 1) {
                logicOperand.comparison.picker = newPicker()
                let picker = logicOperand.comparison.picker
                picker.name = 'Comparison'
                picker.container.connectToParent(thisObject.container)
                picker.container.frame.position.x = 0 - picker.container.frame.width / 2 + picker.container.frame.width * 2.5
                picker.container.frame.position.y = 0 - picker.container.frame.height / 2 + yOffset
                let optionsList = ['Greater Than', 'Less Than', 'Greater or Equal Than', 'Less or Equal Than', 'Equal To']
                picker.initialize(optionsList)
                switch (logicOperand.comparison.operator) {
                    case '>': {
                        picker.setSelected(undefined, undefined, undefined, 0)
                        break
                    }
                    case '<': {
                        picker.setSelected(undefined, undefined, undefined, 1)
                        break
                    }
                    case '>=': {
                        picker.setSelected(undefined, undefined, undefined, 2)
                        break
                    }
                    case '<=': {
                        picker.setSelected(undefined, undefined, undefined, 3)
                        break
                    }
                    case '===': {
                        picker.setSelected(undefined, undefined, undefined, 4)
                        break
                    }
                }
                picker.visible = true
                let structureBranch = {
                    logicOperand: logicOperand,
                    comparisonOperand: comparisonOperand,
                    algebraOperand: algebraOperand,
                    pickerName: 'Comparison'
                }
                picker.eventSuscriptionId = picker.container.eventHandler.listenToEvent('onParentChanged', onParentChanged, structureBranch)
            }

            if (comparisonOperand.index === 1 && algebraOperand.index === 1 && logicOperand.index <= 1) {
                logicOperand.picker = newPicker()
                let picker = logicOperand.picker
                picker.name = 'Logic'
                picker.container.connectToParent(thisObject.container)
                picker.container.frame.position.x = 0 - picker.container.frame.width / 2 + picker.container.frame.width * 2.5
                picker.container.frame.position.y = 0 - picker.container.frame.height / 2 + yOffset
                let optionsList = ['...', 'OR']
                picker.initialize(optionsList)
                if (logicOperand.operator === '||') {
                    picker.setSelected(undefined, undefined, undefined, 1)
                }
                picker.visible = true
                let structureBranch = {
                    logicOperand: logicOperand,
                    comparisonOperand: comparisonOperand,
                    algebraOperand: algebraOperand,
                    pickerName: 'Logic'
                }
                picker.eventSuscriptionId = picker.container.eventHandler.listenToEvent('onParentChanged', onParentChanged, structureBranch)
            }

            let visible = true
            if (algebraOperand.index === 1 && comparisonOperand.algebra.picker.getSelected() === '...') { visible = false }
            if (logicOperand.comparison.picker !== undefined && comparisonOperand.index === 1 && logicOperand.comparison.picker.getSelected() === 'Equal To') { visible = false }

            algebraOperand.whenPicker = newPicker()
            algebraOperand.whenPicker.name = 'When'
            algebraOperand.whenPicker.container.connectToParent(thisObject.container)
            algebraOperand.whenPicker.container.frame.position.x = 0 - algebraOperand.whenPicker.container.frame.width / 2 - algebraOperand.whenPicker.container.frame.width * 0.5
            algebraOperand.whenPicker.container.frame.position.y = 0 - algebraOperand.whenPicker.container.frame.height / 2 + yOffset
            current = ['Current', '1 Previous', '2 Previous', '3 Previous', '4 Previous', '5 Previous']
            algebraOperand.whenPicker.initialize(current, current)
            algebraOperand.whenPicker.visible = visible

            algebraOperand.dataMinePicker = newPicker()
            algebraOperand.dataMinePicker.name = 'Data Mine'
            algebraOperand.dataMinePicker.container.connectToParent(thisObject.container)
            algebraOperand.dataMinePicker.container.frame.position.x = 0 - algebraOperand.dataMinePicker.container.frame.width / 2 - algebraOperand.dataMinePicker.container.frame.width * 2.5
            algebraOperand.dataMinePicker.container.frame.position.y = 0 - algebraOperand.dataMinePicker.container.frame.height / 2 + yOffset
            current = scanResult
            properties = Object.keys(current)
            algebraOperand.dataMinePicker.initialize(properties, current)
            parent = current
            algebraOperand.dataMinePicker.visible = visible

            algebraOperand.botPicker = newPicker()
            algebraOperand.botPicker.name = 'Bot'
            algebraOperand.botPicker.container.connectToParent(thisObject.container)
            algebraOperand.botPicker.container.frame.position.x = 0 - algebraOperand.botPicker.container.frame.width / 2 - algebraOperand.botPicker.container.frame.width * 1.5
            algebraOperand.botPicker.container.frame.position.y = 0 - algebraOperand.botPicker.container.frame.height / 2 + yOffset
            current = parent[properties[0]]
            properties = Object.keys(current)
            algebraOperand.botPicker.initialize(properties, current, parent)
            parent = current
            algebraOperand.botPicker.visible = visible

            algebraOperand.productPicker = newPicker()
            algebraOperand.productPicker.name = 'Product'
            algebraOperand.productPicker.container.connectToParent(thisObject.container)
            algebraOperand.productPicker.container.frame.position.x = 0 - algebraOperand.productPicker.container.frame.width / 2 + algebraOperand.productPicker.container.frame.width * 0.5
            algebraOperand.productPicker.container.frame.position.y = 0 - algebraOperand.productPicker.container.frame.height / 2 + yOffset
            current = parent[properties[0]]
            properties = Object.keys(current)
            algebraOperand.productPicker.initialize(properties, current, parent)
            parent = current
            algebraOperand.productPicker.visible = visible

            let productParent = parent
            let productProperties = properties

            algebraOperand.propertyPicker = newPicker()
            algebraOperand.propertyPicker.name = 'Property'
            algebraOperand.propertyPicker.container.connectToParent(thisObject.container)
            algebraOperand.propertyPicker.container.frame.position.x = 0 - algebraOperand.propertyPicker.container.frame.width / 2 + algebraOperand.propertyPicker.container.frame.width * 1.5
            algebraOperand.propertyPicker.container.frame.position.y = 0 - algebraOperand.propertyPicker.container.frame.height / 2 + yOffset
            current = productParent[productProperties[0]]
            current = current.properties
            properties = Object.keys(current)
            algebraOperand.propertyPicker.initialize(properties, current, productParent, 'properties')
            parent = current
            algebraOperand.propertyPicker.visible = visible

            algebraOperand.valuePicker = newPicker()
            algebraOperand.valuePicker.name = 'Value'
            algebraOperand.valuePicker.container.connectToParent(thisObject.container)
            algebraOperand.valuePicker.container.frame.position.x = 0 - algebraOperand.valuePicker.container.frame.width / 2 + algebraOperand.valuePicker.container.frame.width * 3.5
            algebraOperand.valuePicker.container.frame.position.y = 0 - algebraOperand.valuePicker.container.frame.height / 2 + yOffset + ALGEBRA_SEPARATION
            current = parent[properties[0]]
            properties = current.possibleValues
            algebraOperand.valuePicker.initialize(properties, current, parent, 'possibleValues')
            parent = current
            algebraOperand.valuePicker.visible = false
            if (logicOperand.comparison.picker !== undefined && logicOperand.comparison.picker.getSelected() === 'Equal To') {
                comparisonOperand.algebra.operandA.valuePicker.visible = true
            }

            algebraOperand.timeFramePicker = newPicker()
            algebraOperand.timeFramePicker.name = 'Time Frame'
            algebraOperand.timeFramePicker.container.connectToParent(thisObject.container)
            algebraOperand.timeFramePicker.container.frame.position.x = 0 - algebraOperand.timeFramePicker.container.frame.width / 2 - algebraOperand.timeFramePicker.container.frame.width * 3.0
            algebraOperand.timeFramePicker.container.frame.position.y = 0 - algebraOperand.timeFramePicker.container.frame.height / 2 + yOffset
            algebraOperand.timeFramePicker.container.frame.width = algebraOperand.timeFramePicker.container.frame.width / 2
            current = productParent[productProperties[0]]
            properties = current.validTimeFrames
            algebraOperand.timeFramePicker.initialize(properties, current, productParent, 'validTimeFrames')
            parent = current
            algebraOperand.timeFramePicker.visible = visible

            algebraOperand.botPicker.eventSuscriptionId = algebraOperand.dataMinePicker.container.eventHandler.listenToEvent('onParentChanged', algebraOperand.botPicker.onParentChanged)
            algebraOperand.productPicker.eventSuscriptionId = algebraOperand.botPicker.container.eventHandler.listenToEvent('onParentChanged', algebraOperand.productPicker.onParentChanged)
            algebraOperand.propertyPicker.eventSuscriptionId = algebraOperand.productPicker.container.eventHandler.listenToEvent('onParentChanged', algebraOperand.propertyPicker.onParentChanged)
            algebraOperand.valuePicker.eventSuscriptionId = algebraOperand.propertyPicker.container.eventHandler.listenToEvent('onParentChanged', algebraOperand.valuePicker.onParentChanged)
            algebraOperand.timeFramePicker.eventSuscriptionId = algebraOperand.productPicker.container.eventHandler.listenToEvent('onParentChanged', algebraOperand.timeFramePicker.onParentChanged)
        }
