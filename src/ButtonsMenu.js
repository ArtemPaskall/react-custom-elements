import React, { useState, useEffect } from 'react'
import './Style.scss'

export default props => {
  const attributes = props.rootElement.attributes

  const selectorOfElementsToChange = attributes['change-selector'].value
  const attributeToChange = attributes['change-attribute'].value
  const valuesList = attributes['values'].value.split(',')
  const maybeAskedDefaultValue = attributes.default?.value

  const storage = {
    _scopedAttributeNameToStore: `automician.ButtonsMenu.${selectorOfElementsToChange}.${attributeToChange}`,
    getAttributeToChangeValue() {
      return window.localStorage.getItem(this._scopedAttributeNameToStore)
    },
    setAttributeToChangeValue(value) {
      window.localStorage.setItem(this._scopedAttributeNameToStore, value)
    },
  }

  if (!storage.getAttributeToChangeValue()) {
    const elementsToChange = [
      ...document.querySelectorAll(selectorOfElementsToChange),
    ]
    console.log('elementsToChange', elementsToChange)

    const [hostsAttributeSamePrefilledValue] = elementsToChange.reduce(
      (sameValue, host) => {
        const areEqual = (arr1, arr2) =>
          JSON.stringify(arr1) === JSON.stringify(arr2)
        const sameValueWasCompromised = areEqual(sameValue, [])
        if (sameValueWasCompromised) {
          return sameValue
        }
        const hostDefault = host.getAttribute(attributeToChange)
        const sameValueWasSet = sameValue && sameValue.length > 0
        if (!sameValueWasSet) {
          // set sameValue first time!
          return [hostDefault]
        }

        if (sameValueWasSet && areEqual(sameValue, [hostDefault])) {
          // compromised!
          return []
        }

        return [hostDefault]
      },
      null, // default indicator of sameValue, i.e. => sameValueWasNotSet
    )

    const defaultValue =
      hostsAttributeSamePrefilledValue || maybeAskedDefaultValue || valuesList[0]

    storage.setAttributeToChangeValue(defaultValue)
  }

  const defaultValueFromStorage = storage.getAttributeToChangeValue()

  const changeElementsAttribute = value =>
    document.querySelectorAll(selectorOfElementsToChange).forEach(element => {
      if (element.hasAttribute(attributeToChange)) {
        console.log('has attribute: ', attributeToChange)
        element[attributeToChange] = value
      } else {
        console.log('has no attribute: ', attributeToChange)
        element.setAttribute(attributeToChange, value)
      }
    })

  changeElementsAttribute(defaultValueFromStorage)

  const valueFromStorage = storage.getAttributeToChangeValue()
  const [selectedValue, setSelectedValue] = useState(valueFromStorage)
  const state = { selectedValue, setSelectedValue }

  // useEffect(() => {
  //   document.querySelectorAll(selectorOfElementsToChange).forEach(element => {
  //     element.setAttribute(attributeToChange, selectedValue)
  //   })
  // }, [selectedValue])

  function changeAttributeValueHandler(value) {
    changeElementsAttribute(value)

    state.setSelectedValue(value)
    storage.setAttributeToChangeValue(value)
  }

  return (
    <div className="button-hover">
      <div className="current-value">
        <span className="current-value-span">
          {state.selectedValue.toUpperCase()}
        </span>
      </div>
      <div className="values-list">
        {valuesList.map(value => (
          <div
            value
            key={value}
            className="values-list-item"
            onClick={() => changeAttributeValueHandler(value)}
          >
            {value.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  )
}
