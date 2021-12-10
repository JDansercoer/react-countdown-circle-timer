import React from 'react'
import { Text } from 'react-native'
import renderer from 'react-test-renderer'
import { render, act } from '@testing-library/react-native'

import { TimeWrapper } from '../src/components'

Math.random = () => 0.124578

const fixture = {
  duration: 10,
  animatedElapsedTime: { addListener: jest.fn(), removeListener: jest.fn() },
  renderAriaTime: ({ remainingTime }) => remainingTime,
  animatedColor: {},
  children: ({ remainingTime }) => <Text>{remainingTime}</Text>,
}

describe('snapshot tests', () => {
  it('renders when children is function', () => {
    const tree = renderer.create(<TimeWrapper {...fixture} />).toJSON()

    expect(tree).toMatchSnapshot()
  })

  it('renders when children is component', () => {
    const TestComponent = ({ remainingTime }) => <Text>{remainingTime}</Text>
    const tree = renderer
      .create(
        <TimeWrapper {...fixture}>
          <TestComponent />
        </TimeWrapper>
      )
      .toJSON()

    expect(tree).toMatchSnapshot()
  })
})

describe('behaviour tests', () => {
  it('should pass the new remaining time to the children when new value is provided by the listener', () => {
    let listener
    const animatedElapsedTime = {
      removeListener: jest.fn(),
      addListener: (cb) => {
        listener = cb
      },
    }
    const { getByText } = render(
      <TimeWrapper
        {...fixture}
        animatedElapsedTime={animatedElapsedTime}
        renderAriaTime={undefined}
      >
        {({ remainingTime, elapsedTime }) => (
          <>
            <Text>Remaining time - {remainingTime}</Text>
            <Text>Elapsed time - {elapsedTime}</Text>
          </>
        )}
      </TimeWrapper>
    )

    act(() => {
      listener({ value: 4823 })
    })

    expect(getByText('Remaining time - 6')).toBeTruthy()
    expect(getByText('Elapsed time - 4.823')).toBeTruthy()
  })
})
