import { getByTestId } from '@testing-library/dom'
import WordUp from './wordup'
import { html } from './__mocks__/html'

document.body.innerHTML = html

test('is context an array', () => {
  let elements

  elements = WordUp.contextToArray(undefined)
  expect(Array.isArray(elements)).toBe(true)

  elements = WordUp.contextToArray(document.querySelector('#content'))
  expect(Array.isArray(elements)).toBe(true)

  elements = WordUp.contextToArray(document.querySelectorAll('p'))
  expect(Array.isArray(elements)).toBe(true)
})

test('are text nodes wrapped', () => {
  const ctx = document.querySelector('h1')
  const wu = new WordUp(ctx)
  wu.init()

  const container = document.createElement('div')
  container.innerHTML = document.body.innerHTML

  const header = getByTestId(container, 'header')

  expect(header.innerHTML).toEqual(
    '<span class="wu">Hello</span> <span class="wu">World</span>'
  )
})
